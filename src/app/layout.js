import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotest",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Video Summarizer",
  description:
    "Get polished summaries of YouTube videos along with transcripts, thumbnails and much more.",
  icons: "/favicon.jpg",
  keywords: ["ai video summarizer", "video summary", "youtube video summary"],
  robots: "index, follow",
  authors: [{ name: "Shah Samin Yasar" }],
  metadataBase: new URL("https://ssy-ai-video-summarizer.vercel.app"),
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "AI Video Summarizer",
    description:
      "Get polished summaries of YouTube videos along with transcripts, thumbnails and much more.",
    url: "https://ssy-ai-video-summarizer.vercel.app",
    siteName: "AI Video Summarizer",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1280,
        height: 630,
        alt: "AI Video Summarizer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Video Summarizer",
    description:
      "Get polished summaries of YouTube videos along with transcripts, thumbnails and much more.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
