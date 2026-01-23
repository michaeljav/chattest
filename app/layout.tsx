import "./globals.css";
import ZammadChatWidget from "./ZammadChatWidget";

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
