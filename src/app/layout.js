import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MainProvider } from "@/providers/MainProvider";
import AuthProvider from "@/providers/AuthProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotest",
  subsets: ["latin"],
});

export const metadata = {
  title: "EinenAI",
  description:
    "Get summarized and perfectly polished notes - codes, equations, transcripts from a YouTube video - all in one place.",
  icons: "/favicon.jpg",
  keywords: [
    "ai video summarizer",
    "einen",
    "ai",
    "note taker",
    "auto note",
    "einenai",
    "video summary",
    "youtube video summary",
  ],
  robots: "index, follow",
  authors: [{ name: "Shah Samin Yasar" }],
  metadataBase: new URL("https://ssy-ai-video-summarizer.vercel.app"),
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "EinenAI",
    description:
      "Get summarized and perfectly polished notes - codes, equations, transcripts from a YouTube video - all in one place.",
    url: "https://ssy-ai-video-summarizer.vercel.app",
    siteName: "EinenAI",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1280,
        height: 630,
        alt: "EinenAI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EinenAI",
    description:
      "Get summarized and perfectly polished notes - codes, equations, transcripts from a YouTube video - all in one place.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} antialiased selection:text-white selection:bg-indigo-500`}
      >
        <AuthProvider>
          <MainProvider>
            <TanstackQueryProvider>{children}</TanstackQueryProvider>
          </MainProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
