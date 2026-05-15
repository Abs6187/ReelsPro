import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./components/Providers";
import Footer from "./components/Footer";
import NavBar from "./components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import Head from 'next/head';



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reels Pro",
  description: "Showcase your creativity! Upload, share, and explore amazing reels on Reels Pro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
      <link
        rel="preload"
        as="video"
        href="https://videos.pexels.com/video-files/19303815/19303815-hd_1920_1080_30fps.mp4"
        type="video/mp4"
        crossOrigin="anonymous"
      />
    </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        <Providers>
        
         <main className=" w-full bg-black  ">
          {/* <Header /> */}
          <NavBar />
          {children}
          <Toaster />
          <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
