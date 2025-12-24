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
      <head>
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#090414" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#090414"></meta>
      </head>
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
