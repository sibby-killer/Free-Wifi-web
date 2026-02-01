import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Roboto_Mono } from "next/font/google";
import { SessionTimeout } from "@/components/SessionTimeout";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fontMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Free WiFi KE",
  description: "Affordable WiFi hotspot packages in Kenya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#0066FF",
        },
      }}
    >
      <html lang="en">
        <body className={`${fontSans.variable} ${fontMono.variable} antialiased`}>
          <SessionTimeout />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
