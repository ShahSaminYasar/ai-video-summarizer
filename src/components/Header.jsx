import { Github, Globe, Instagram, Youtube } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <div className="w-full bg-white/95 backdrop-blur-sm px-2 h-[60px] md:h-[70px] fixed top-0 left-0 shadow-2xl shadow-black/5 z-50 flex items-center justify-center border-b-2 border-slate-900 font-space">
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between px-2">
        <Link
          href={"/"}
          className="text-xl md:text-2xl font-medium text-slate-900"
        >
          <span className="bg-slate-900 text-white px-2 py-1 rounded-sm">
            AI
          </span>{" "}
          <span className="font-bold">Video</span>Summarizer
        </Link>

        <div className="flex flex-row items-center gap-3 text-zinc-600">
          <Link
            href={"https://shahsaminyasar.vercel.app"}
            target="_blank"
            className="block rounded-full aspect-square bg-slate-200 text-slate-500 p-2"
          >
            <Globe size={15} />
          </Link>
          <Link
            href={"https://github.com/ShahSaminYasar"}
            target="_blank"
            className="block rounded-full aspect-square bg-slate-200 text-slate-500 p-2"
          >
            <Github size={15} />
          </Link>
        </div>
      </header>
    </div>
  );
};
export default Header;
