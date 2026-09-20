import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redvision",
  description: "Redvision - AI Video Creation Workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="h-screen w-screen overflow-hidden bg-sparkle-bg text-sparkle-text">
        {children}
      </body>
    </html>
  );
}
