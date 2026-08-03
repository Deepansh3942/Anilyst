import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anilyst",
  description: "Track watched anime, browse the catalog, and get recommendations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
