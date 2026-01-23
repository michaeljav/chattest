"use client";

import Script from "next/script";

export default function ZammadChatWidget() {
  const ZAMMAD_HOSTNAME = "k5.gt.com.do";
  const ZAMMAD_HTTP = `https://${ZAMMAD_HOSTNAME}`;
  const ZAMMAD_WS = `wss://${ZAMMAD_HOSTNAME}/ws`;

  return (
    <>
      <Script
        id="zammad-chat-widget"
        src={`${ZAMMAD_HTTP}/assets/chat/chat-no-jquery.min.js`}
        strategy="afterInteractive"
      />
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
                new ZammadChat({
                  chatId: 1,
                  show: true,
                  debug: true,
                  host: '${ZAMMAD_HOSTNAME}',
                  websocketUrl: '${ZAMMAD_WS}',
                });
                return;
              }

              if (tries >= 100) clearInterval(timer);
            }, 100);
          })();
        `}
      </Script>
    </>
  );
}
