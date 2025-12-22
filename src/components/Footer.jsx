"use client";
import { useMainContext } from "@/hooks/useMainContext";
import Link from "next/link";

const Footer = () => {
  const { theme } = useMainContext();

  return (
    <div
      className={`${theme} w-full bg-background px-3 pt-10 text-foreground border-t border-accent font-space`}
    >
      <footer className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 items-start justify-center">
        <div className="w-full sm:h-full flex items-center justify-start">
          <Link href={"/"} className="text-4xl font-light text-foreground">
            ΞIИΞИ
          </Link>
        </div>

        <div className="text-sm font-normal text-zinc-500 flex items-start gap-2 flex-col">
          <h4 className="font-semibold block mb-1 text-foreground">
            Useful Links
          </h4>
          <Link href={"https://youtube.com"} target="_blank">
            YouTube
          </Link>
          <Link href={"/"}>AI Summary</Link>
        </div>

        <div className="text-sm font-normal text-zinc-500 flex items-start gap-2 flex-col">
          <h4 className="font-semibold block mb-1 text-foreground">
            Developer Contact
          </h4>
          <Link href={"https://shahsaminyasar.vercel.app"} target="_blank">
            Website
          </Link>
          <Link href={"https://www.youtube.com/shahsaminyasar"} target="_blank">
            YouTube
          </Link>
          <Link
            href={"https://www.instagram.com/shah_samin_yasar"}
            target="_blank"
          >
            Instagram
          </Link>
        </div>

        <div className="text-sm font-normal text-zinc-500 flex items-start gap-2 flex-col">
          <h4 className="font-semibold block mb-1 text-foreground">
            Disclaimer
          </h4>
          <p>
            This site uses AI to provide data which may not always be correct,
            look out for important information.
          </p>
        </div>

        <div className="sm:col-span-2 md:col-span-4 text-xs text-slate-500 flex items-center justify-center font-normal py-2 border-t border-accent">
          <p>
            Copyright 2025 &copy;{" "}
            <Link
              href={"https://shahsaminyasar.vercel.app"}
              target="_blank"
              className="font-semibold"
            >
              Shah Samin Yasar
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};
export default Footer;
