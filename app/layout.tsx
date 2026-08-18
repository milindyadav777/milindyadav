import type { Metadata } from "next";
import "./globals.css";

const themeScript = `
  (function () {
    try {
      var saved = localStorage.getItem("milindyadav-theme");
      var system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var theme = saved === "dark" || saved === "light" ? saved : system;
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (_) {}
  })();
`;

export const metadata: Metadata = {
  title: "milindyadav | Platform & DevOps Engineer",
  description:
    "Milind Yadav is a platform and DevOps engineer with experience in backend systems, CI/CD, Kubernetes, cloud infrastructure and observability.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
