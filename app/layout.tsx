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
  const zammadUrl = process.env.NEXT_PUBLIC_ZAMMAD_URL;

  // ✅ Zammad te dio el snippet con "chat-no-jquery.min.js"
  const widgetSrc =
    process.env.NEXT_PUBLIC_ZAMMAD_CHAT_WIDGET_URL ||
    (zammadUrl
      ? `${zammadUrl.replace(/\/$/, "")}/assets/chat/chat-no-jquery.min.js`
      : "");

  if (!widgetSrc) {
    console.warn(
      "Missing NEXT_PUBLIC_ZAMMAD_URL or NEXT_PUBLIC_ZAMMAD_CHAT_WIDGET_URL in env."
    );
  }

  return (
    <html lang="en">
      <body>
        {children}

        {/* ✅ 1) Script del chat (NO jQuery) */}
        {widgetSrc ? (
          <Script src={widgetSrc} strategy="afterInteractive" />
        ) : null}

        {/* ✅ 2) Inicialización del chat (usa chatId: 1 como dice Zammad) */}
        {widgetSrc ? (
          <Script id="zammad-chat-init" strategy="afterInteractive">
            {`
              (function () {
                if (window.__ZAMMAD_CHAT_LOADED__) return;
                window.__ZAMMAD_CHAT_LOADED__ = true;

                var widgetSrc = ${JSON.stringify(widgetSrc)};
                console.info('[Zammad] widgetSrc:', widgetSrc);
                console.info('[Zammad] typeof ZammadChat (initial):', typeof ZammadChat);

                var tries = 0;
                var timer = setInterval(function () {
                  tries++;

                  if (typeof ZammadChat !== 'undefined') {
                    clearInterval(timer);
                    console.info('[Zammad] typeof ZammadChat (ready):', typeof ZammadChat);
                    try {
                      new ZammadChat({
                        chatId: 1,
                        fontSize: '12px',
                        show: true,
                        debug: true
                      });
                    } catch (err) {
                      console.error('[Zammad] init error:', err);
                    }
                    return;
                  }

                  if (tries >= 50) {
                    clearInterval(timer);
                    console.warn(
                      '[Zammad] ZammadChat is still undefined after waiting. Check widgetSrc:',
                      widgetSrc
                    );
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
