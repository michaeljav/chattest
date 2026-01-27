import type { Metadata } from "next";
import "./globals.css";
import ZammadChatWidget from "./ZammadChatWidget";

export const metadata: Metadata = {
  title: "Zammad Chat Demo",
  description: "Next.js page embedding Zammad chat widget",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ZammadChatWidget />
      </body>
    </html>
  );
}
