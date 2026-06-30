import type { Metadata } from "next";

import { Providers } from "@/app/providers";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Temple Frontend React",
  description: "React frontend migration foundation for Template API generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
