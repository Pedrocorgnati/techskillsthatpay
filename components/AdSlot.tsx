import Script from "next/script";

import { adsenseEnabled, adsensePublisherId } from "@/lib/config";

type Props = {
  slotId?: string;
  className?: string;
};

export default function AdSlot({ slotId, className }: Props) {
  if (!adsenseEnabled || !adsensePublisherId) return null;

  return (
    <>
      <Script
        id="adsbygoogle-loader"
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePublisherId}`}
        crossOrigin="anonymous"
      />
      <ins
        className={`adsbygoogle block ${className ?? ""}`}
        style={{ display: "block" }}
        data-ad-client={adsensePublisherId}
        data-ad-slot={slotId ?? "auto"}
        data-ad-format="auto"
      />
      <Script id={`ads-init-${slotId ?? "auto"}`} strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </>
  );
}
