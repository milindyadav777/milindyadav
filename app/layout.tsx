import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "milindyadav — Platform & DevOps Engineer",
  description:
    "Portfolio of Milind Yadav, a platform and DevOps engineer building observable systems, dependable delivery platforms and engineering automation.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/favicon.svg",
    shortcut: (process.env.NEXT_PUBLIC_BASE_PATH ?? "") + "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
