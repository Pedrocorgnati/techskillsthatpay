import type { AnchorHTMLAttributes, ReactNode } from "react";

import Link from "next/link";

import AffiliateCTA from "@/components/AffiliateCTA";
import Callout from "@/components/Callout";
import NewsletterBox from "@/components/NewsletterBox";

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { children?: ReactNode };

// Using next-mdx-remote/rsc keeps the App Router server-friendly and avoids bundling MDX into the client.
export const mdxComponents = {
  a: ({ href = "#", children, ...rest }: AnchorProps) => (
    <Link
      href={href}
      {...rest}
      className="text-blue-600 underline underline-offset-4 hover:text-blue-800"
    >
      {children}
    </Link>
  ),
  Callout,
  AffiliateCTA,
  NewsletterBox
};
