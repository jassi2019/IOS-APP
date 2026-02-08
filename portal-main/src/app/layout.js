"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/custom/sidebar";
import { SidebarProvider } from "@/components/custom/sidebar-provider";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en" className="overflow-hidden">
      <title>Taiyari NEET ki | Dashboard</title>
      <link rel="icon" href="/favicon.ico" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Toaster
          richColors
          closeButton
          duration={2000}
          position="top-right"
          visibleToasts={4}
          pauseWhenPageIsHidden
        />
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            {!pathname.includes("auth") &&
              !pathname.includes("privacy") &&
              !pathname.includes("terms") &&
              !pathname.includes("deletion") && <Sidebar />}
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
