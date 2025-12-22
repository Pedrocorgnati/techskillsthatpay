import { ImageResponse } from "next/og";

import { getLocaleLabel, normalizeLocale, type Locale } from "@/lib/i18n";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";

type Props = {
  params: { locale: Locale };
};

export async function GET(request: Request, { params }: Props) {
  const locale = normalizeLocale(params.locale);
  const label = getLocaleLabel(locale);

  return new ImageResponse(
    (
      <div
        style={{
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
        }}
      >
        <div style={{ fontSize: 28, textTransform: "uppercase", letterSpacing: "0.2em" }}>
          {label}
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 20 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 32, marginTop: 24, maxWidth: 800 }}>
          Evidence-based career skills
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
