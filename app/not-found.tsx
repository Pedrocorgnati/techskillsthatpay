import Link from "next/link";

import Container from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="py-16 text-center">
      <h1 className="text-4xl font-bold text-text-primary">Page not found</h1>
      <p className="mt-3 text-text-secondary">
        The page you are looking for doesn&apos;t exist. Explore the latest posts instead.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
      >
        Go home
      </Link>
    </Container>
  );
}
