import { createRequestLogger } from "@/lib/logger";

type GithubPublisherConfig = {
  owner: string;
  repo: string;
  token: string;
  branch: string;
  mode: "commit" | "pr";
};

type PublishFile = {
  path: string;
  content: string;
};

type PublishResult = {
  commitSha: string;
  commitUrl: string;
  prUrl?: string;
};

const apiBase = "https://api.github.com";

async function githubRequest<T>(
  url: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "techskillsthatpay-publisher",
      ...options.headers
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

async function getRefSha(config: GithubPublisherConfig, branch: string) {
  const ref = await githubRequest<{ object: { sha: string } }>(
    `${apiBase}/repos/${config.owner}/${config.repo}/git/refs/heads/${branch}`,
    config.token
  );
  return ref.object.sha;
}

async function getCommitTreeSha(config: GithubPublisherConfig, commitSha: string) {
  const commit = await githubRequest<{ tree: { sha: string } }>(
    `${apiBase}/repos/${config.owner}/${config.repo}/git/commits/${commitSha}`,
    config.token
  );
  return commit.tree.sha;
}

async function createBlob(config: GithubPublisherConfig, content: string) {
  const payload = {
    content: Buffer.from(content, "utf-8").toString("base64"),
    encoding: "base64"
  };
  const blob = await githubRequest<{ sha: string }>(
    `${apiBase}/repos/${config.owner}/${config.repo}/git/blobs`,
    config.token,
    { method: "POST", body: JSON.stringify(payload) }
  );
  return blob.sha;
}

async function createTree(
  config: GithubPublisherConfig,
  baseTreeSha: string,
  files: PublishFile[]
) {
  const tree = files.map((file) => ({
    path: file.path,
    mode: "100644",
    type: "blob",
    sha: file.content
  }));
  const payload = { base_tree: baseTreeSha, tree };
  const response = await githubRequest<{ sha: string }>(
    `${apiBase}/repos/${config.owner}/${config.repo}/git/trees`,
    config.token,
    { method: "POST", body: JSON.stringify(payload) }
  );
  return response.sha;
}

async function createCommit(
  config: GithubPublisherConfig,
  message: string,
  treeSha: string,
  parentSha: string
) {
  const payload = { message, tree: treeSha, parents: [parentSha] };
  const response = await githubRequest<{ sha: string }>(
    `${apiBase}/repos/${config.owner}/${config.repo}/git/commits`,
    config.token,
    { method: "POST", body: JSON.stringify(payload) }
  );
  return response.sha;
}

async function updateRef(config: GithubPublisherConfig, branch: string, commitSha: string) {
  const payload = { sha: commitSha, force: false };
  await githubRequest(
    `${apiBase}/repos/${config.owner}/${config.repo}/git/refs/heads/${branch}`,
    config.token,
    { method: "PATCH", body: JSON.stringify(payload) }
  );
}

async function createBranch(config: GithubPublisherConfig, branch: string, baseSha: string) {
  await githubRequest(
    `${apiBase}/repos/${config.owner}/${config.repo}/git/refs`,
    config.token,
    { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }) }
  );
}

async function createPullRequest(
  config: GithubPublisherConfig,
  title: string,
  head: string,
  base: string
) {
  const payload = { title, head, base, body: "Automated publish from admin." };
  const pr = await githubRequest<{ html_url: string }>(
    `${apiBase}/repos/${config.owner}/${config.repo}/pulls`,
    config.token,
    { method: "POST", body: JSON.stringify(payload) }
  );
  return pr.html_url;
}

export async function publishAllViaGithub(
  config: GithubPublisherConfig,
  files: PublishFile[],
  commitMessage: string
): Promise<PublishResult> {
  const logger = createRequestLogger();
  const baseSha = await getRefSha(config, config.branch);
  const baseTreeSha = await getCommitTreeSha(config, baseSha);

  const blobFiles: PublishFile[] = [];
  for (const file of files) {
    const blobSha = await createBlob(config, file.content);
    blobFiles.push({ path: file.path, content: blobSha });
  }

  let targetBranch = config.branch;
  if (config.mode === "pr") {
    const safeSuffix = new Date().toISOString().replace(/[:.]/g, "-");
    targetBranch = `publish/${commitMessage.replace(/\s+/g, "-").toLowerCase()}-${safeSuffix}`;
    await createBranch(config, targetBranch, baseSha);
  }

  const treeSha = await createTree(config, baseTreeSha, blobFiles);
  const commitSha = await createCommit(config, commitMessage, treeSha, baseSha);
  await updateRef(config, targetBranch, commitSha);

  const commitUrl = `https://github.com/${config.owner}/${config.repo}/commit/${commitSha}`;
  if (config.mode === "pr") {
    const prUrl = await createPullRequest(config, commitMessage, targetBranch, config.branch);
    logger.info("GitHub PR created", { prUrl, commitSha });
    return { commitSha, commitUrl, prUrl };
  }

  logger.info("GitHub commit created", { commitUrl, commitSha });
  return { commitSha, commitUrl };
}
