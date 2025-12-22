import React from "react";
import { ImageResponse } from "next/og";

import { getLocaleLabel, normalizeLocale, type Locale } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";

type Props = {
  params: { locale: Locale };
};

export async function GET(_request: Request, { params }: Props) {
  const locale = normalizeLocale(params.locale);
  const label = getLocaleLabel(locale);
  const h = React.createElement;

  return new ImageResponse(
    h(
      "div",
      {
        style: {
          fontSize: 72,
          background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
          color: "white",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "80px",
          textAlign: "center"
        }
      },
      h(
        "div",
        {
          style: {
            fontSize: 28,
            textTransform: "uppercase",
            letterSpacing: "0.2em"
          }
        },
        label
      ),
      h(
        "div",
        {
          style: {
            fontSize: 84,
            fontWeight: 700,
            marginTop: 20
          }
        },
        SITE_NAME
      ),
      h(
        "div",
        {
          style: {
            fontSize: 32,
            marginTop: 24,
            maxWidth: 800
          }
        },
        "Evidence-based career skills"
      )
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
