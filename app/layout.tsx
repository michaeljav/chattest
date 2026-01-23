// app/layout.tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zammad Chat Demo",
  description: "Next.js page embedding Zammad chat widget",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // IMPORTANTE:
  // Usa host SIN protocolo para evitar que el widget arme mal el wss://
  const ZAMMAD_HOSTNAME = "k5.gt.com.do";
  const ZAMMAD_HTTP = `https://${ZAMMAD_HOSTNAME}`;
  const ZAMMAD_WS = `wss://${ZAMMAD_HOSTNAME}/ws`;

  return (
    <html lang="en">
      <body>
        {children}

        {/* 1) Cargar el widget (sin jQuery) */}
        <Script
          src={`${ZAMMAD_HTTP}/assets/chat/chat-no-jquery.min.js`}
          strategy="afterInteractive"
          onLoad={() => {
            // solo para depurar que realmente cargó
            // (esto se ejecuta en el cliente)
            // @ts-ignore
            console.info("[Zammad] widget loaded, typeof ZammadChat:", typeof window?.ZammadChat);
          }}
        />

        {/* 2) Inicializar */}
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

                  console.info('[Zammad] Initializing…');

                  // OJO: forzamos websocketUrl para que NO sea wss://undefined/ws
                  new ZammadChat({
                    chatId: 1,
                    show: true,
                    debug: true,
                    fontSize: '12px',
                    host: '${ZAMMAD_HOSTNAME}',
                    websocketUrl: '${ZAMMAD_WS}'
                  });

                  return;
                }

                if (tries >= 50) {
                  clearInterval(timer);
                  console.error('[Zammad] ZammadChat not available after waiting.');
                }
              }, 100);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
