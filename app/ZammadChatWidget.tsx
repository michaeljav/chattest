"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ZammadChat?: any;
    __ZAMMAD_CHAT_INIT__?: boolean;
  }
}

export default function ZammadChatWidget() {
  useEffect(() => {
    const ZAMMAD_HOST =
      process.env.NEXT_PUBLIC_ZAMMAD_URL || "https://k5.gt.com.do";
    const SCRIPT_SRC =
      process.env.NEXT_PUBLIC_ZAMMAD_CHAT_WIDGET_URL ||
      `${ZAMMAD_HOST.replace(/\/$/, "")}/assets/chat/chat-no-jquery.min.js`;

    if (!ZAMMAD_HOST || !SCRIPT_SRC) {
      console.warn(
        "[Zammad] Missing NEXT_PUBLIC_ZAMMAD_URL or NEXT_PUBLIC_ZAMMAD_CHAT_WIDGET_URL."
      );
    }

    console.info("[Zammad] widgetSrc:", SCRIPT_SRC);
    console.info("[Zammad] host:", ZAMMAD_HOST);
    console.info(
      "[Zammad] typeof ZammadChat (initial):",
      typeof window.ZammadChat
    );

    const init = () => {
      if (window.__ZAMMAD_CHAT_INIT__) return true;
      if (typeof window.ZammadChat === "undefined") return false;

      try {
        new window.ZammadChat({
          host: ZAMMAD_HOST, // avoids wss://undefined/ws
          chatId: 1,
          show: true,
          debug: true,
          fontSize: "12px",
        });
        window.__ZAMMAD_CHAT_INIT__ = true;
        console.info("[Zammad] init OK");
        return true;
      } catch (err) {
        console.error("[Zammad] init error:", err);
        return false;
      }
    };

    const ensureScript = () => {
      let script = document.querySelector(
        "script[data-zammad-chat='true']"
      ) as HTMLScriptElement | null;

      if (script) {
        if (script.dataset.loaded === "true") {
          init();
        } else {
          script.addEventListener("load", () => {
            script!.dataset.loaded = "true";
            init();
          });
        }
        return;
      }

      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.dataset.zammadChat = "true";

      script.onload = () => {
        script!.dataset.loaded = "true";
        console.info("[Zammad] script loaded:", SCRIPT_SRC);
        init();
      };

      script.onerror = () => {
        console.error("[Zammad] failed to load script:", SCRIPT_SRC);
      };

      document.body.appendChild(script);
    };

    ensureScript();

    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (init()) {
        clearInterval(timer);
      } else if (tries >= 50) {
        clearInterval(timer);
        console.warn(
          "[Zammad] ZammadChat still undefined after waiting. Check widgetSrc:",
          SCRIPT_SRC
        );
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return null;
}
