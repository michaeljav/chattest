import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zammad Chat Demo",
  description: "Next.js page embedding Zammad chat widget",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ZAMMAD_HOST = "https://k5.gt.com.do"; // 🔴 FIJO Y EXPLÍCITO

  return (
    <html lang="en">
      <body>
        {children}

        {/* 1️⃣ Script oficial SIN jQuery */}
        <Script
          src={`${ZAMMAD_HOST}/assets/chat/chat-no-jquery.min.js`}
          strategy="afterInteractive"
        />

        {/* 2️⃣ Inicialización correcta */}
        <Script id="zammad-chat-init" strategy="afterInteractive">
          {`
            (function () {
              if (window.__ZAMMAD_CHAT_LOADED__) return;
              window.__ZAMMAD_CHAT_LOADED__ = true;

              var tries = 0;
              var timer = setInterval(function () {
                tries++;

                if (typeof ZammadChat !== 'undefined') {
                  clearInterval(timer);
                  console.info('[Zammad] Initializing chat…');

                  new ZammadChat({
                    host: '${ZAMMAD_HOST}',   // ✅ CLAVE
                    chatId: 1,
                    show: true,
                    debug: true,
                    fontSize: '12px'
                  });

                  return;
                }

                if (tries >= 50) {
                  clearInterval(timer);
                  console.error('[Zammad] ZammadChat not available');
                }
              }, 100);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
