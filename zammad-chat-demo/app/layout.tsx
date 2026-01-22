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
  const widgetSrc = process.env.NEXT_PUBLIC_ZAMMAD_CHAT_WIDGET_URL;

  if (!widgetSrc) {
    // En dev te ayuda a detectar env faltante
    console.warn(
      "Missing NEXT_PUBLIC_ZAMMAD_CHAT_WIDGET_URL in .env.local (Zammad chat script URL)."
    );
  }

  return (
    <html lang="en">
      <body>
        {children}

        {/* Zammad Chat requires jQuery (per docs) */}
        <Script
          src="https://code.jquery.com/jquery-3.7.1.min.js"
          strategy="beforeInteractive"
        />

        {/* Zammad Chat Widget */}
        {widgetSrc ? (
          <Script
            id="zammad-chat-widget"
            src={widgetSrc}
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
