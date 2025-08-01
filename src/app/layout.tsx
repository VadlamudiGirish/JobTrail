import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AuthSessionProvider from "./AuthSessionProvider";
import SWRProvider from "./SWRProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ApplicationTrail",
  description: "Track your job applications easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthSessionProvider>
          <SWRProvider>
            <Header />
            <main className="pt-20 pb-24 px-4 bg-gray-50 min-h-screen">
              {children}
            </main>
            <Footer />
          </SWRProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
