"use client";

import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/custom/sidebar";
import { SidebarProvider } from "@/components/custom/sidebar-provider";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

const geistSans = { variable: "" };
const geistMono = { variable: "" };

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/auth") || pathname.includes("/chapters") || pathname.includes("/classes") || pathname.includes("/subjects") || pathname.includes("/topics");

  return (
    <html lang="en" className={isAdmin ? "overflow-hidden" : ""}>
      <title>{isAdmin ? "Taiyari NEET Ki | Admin" : "Taiyari NEET Ki — Best NEET Preparation App 2026"}</title>
      <link rel="icon" href="/favicon.ico" />
      {!isAdmin && (
        <>
          <meta name="description" content="Taiyari NEET Ki is India's best NEET preparation app. Free study material, 10,000+ MCQs, chapter-wise notes for Physics, Chemistry & Biology. Download now!" />
          <meta name="keywords" content="NEET preparation app, NEET 2026, NEET study material, NEET MCQ, NEET physics, NEET chemistry, NEET biology, best NEET app, free NEET app" />
          <meta property="og:title" content="Taiyari NEET Ki — Best NEET Preparation App" />
          <meta property="og:description" content="India's #1 NEET preparation app with 10,000+ MCQs, detailed notes & progress tracking. Download free!" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://taiyarineetki.com" />
          <link rel="canonical" href="https://taiyarineetki.com" />
        </>
      )}
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
        {isAdmin ? (
          <SidebarProvider>
            <div className="flex h-screen overflow-hidden">
              {!pathname.includes("auth") && <Sidebar />}
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </SidebarProvider>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
