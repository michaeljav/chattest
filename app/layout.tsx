// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zammad Chat Demo",
  description: "Zammad Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const zammadUrl = process.env.NEXT_PUBLIC_ZAMMAD_URL;

  if (!zammadUrl) {
    console.error("❌ NEXT_PUBLIC_ZAMMAD_URL is missing");
  }

  const widgetSrc = zammadUrl
    ? `${zammadUrl.replace(/\/$/, "")}/assets/chat/chat-no-jquery.min.js`
    : "";

  return (
    <html lang="es">
      <body>
        {children}

        {/* 1️⃣ Script del widget */}
        {widgetSrc && (
          <Script src={widgetSrc} strategy="afterInteractive" />
        )}

        {/* 2️⃣ Init */}
        {widgetSrc && (
          <Script id="zammad-init" strategy="afterInteractive">
            {`
              (function () {
                var tries = 0;
                var timer = setInterval(function () {
                  tries++;

                  if (typeof ZammadChat !== 'undefined') {
                    clearInterval(timer);
                    console.log('[Zammad] ready');

                    new ZammadChat({
                      chatId: 1,
                      show: true,
                      debug: true
                    });
                    return;
                  }

                  if (tries > 50) {
                    clearInterval(timer);
                    console.error('[Zammad] ZammadChat not found');
                  }
                }, 100);
              })();
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
