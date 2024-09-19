import type { Metadata } from "next";
import localFont from "next/font/local";

import "@/styles/globals.css";

import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";

const geistSans = localFont({
  src: "../styles/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../styles/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: `${siteConfig.name}`,
  description: siteConfig.description,
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicons/logo-dark.svg",
        href: "/favicons/logo-dark.svg",
      },
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicons/logo-light.svg",
        href: "/favicons/logo-light.svg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "font-geist-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
