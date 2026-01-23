// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zammad Chat Demo",
  description: "Next.js page embedding Zammad chat widget",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const zammadUrl = (process.env.NEXT_PUBLIC_ZAMMAD_URL || "").replace(/\/$/, "");

  // ✅ Script recomendado por Zammad 6.5.2 (no-jquery)
  const widgetSrc =
    process.env.NEXT_PUBLIC_ZAMMAD_CHAT_WIDGET_URL ||
    (zammadUrl ? `${zammadUrl}/assets/chat/chat-no-jquery.min.js` : "");

  if (!zammadUrl || !widgetSrc) {
    console.warn(
      "Missing NEXT_PUBLIC_ZAMMAD_URL and/or NEXT_PUBLIC_ZAMMAD_CHAT_WIDGET_URL in env."
    );
  }

  return (
    <html lang="en">
      <body>
        {children}

        {/* 1) Script del chat (NO jQuery) */}
        {widgetSrc ? (
          <Script
            id="zammad-chat-widget"
            src={widgetSrc}
            strategy="afterInteractive"
          />
        ) : null}

        {/* 2) Init (FORZAMOS host para evitar wss://undefined/ws) */}
        {widgetSrc && zammadUrl ? (
          <Script id="zammad-chat-init" strategy="afterInteractive">
            {`
              (function () {
                if (window.__ZAMMAD_CHAT_LOADED__) return;
                window.__ZAMMAD_CHAT_LOADED__ = true;

                var zammadUrl = ${JSON.stringify(zammadUrl)};
                var widgetSrc = ${JSON.stringify(widgetSrc)};
                console.info('[Zammad] zammadUrl:', zammadUrl);
                console.info('[Zammad] widgetSrc:', widgetSrc);

                var tries = 0;
                var maxTries = 100; // 10s
                var timer = setInterval(function () {
                  tries++;

                  if (typeof ZammadChat !== 'undefined') {
                    clearInterval(timer);

                    console.info('[Zammad] ZammadChat ready. Initializing...');
                    try {
                      new ZammadChat({
                        chatId: 1,
                        fontSize: '12px',
                        show: true,
                        debug: true,

                        // ✅ CLAVE: evita wss://undefined/ws
                        host: zammadUrl
                      });
                    } catch (err) {
                      console.error('[Zammad] init error:', err);
                    }
                    return;
                  }

                  if (tries >= maxTries) {
                    clearInterval(timer);
                    console.warn('[Zammad] ZammadChat still undefined after waiting.');
                  }
                }, 100);
              })();
            `}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
