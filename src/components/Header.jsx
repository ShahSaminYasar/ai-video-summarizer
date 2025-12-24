"use client";
import { useMainContext } from "@/hooks/useMainContext";
import {
  ChevronLeftSquare,
  Facebook,
  Github,
  Globe,
  History,
  Instagram,
  LogOut,
  Menu,
  Moon,
  PenBox,
  Sun,
  User,
  UserCircle,
  Youtube,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useMainContext();
  const { data: session } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div
        className={`${theme} w-full ${
          pathname === "/" ? "bg-background/10" : "bg-background"
        } backdrop-blur-2xl px-2 h-[60px] md:h-[70px] fixed top-0 left-0 shadow-2xl shadow-black/5 z-50 flex items-center justify-center border-b-2 border-foreground/5 font-space`}
      >
        <header className="w-full max-w-7xl mx-auto grid grid-cols-4 justify-center items-center px-2">
          {/* BURGER BUTTON */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="cursor-pointer text-primary"
          >
            <Menu size={22} />
          </button>

          {/* LOGO */}
          <Link
            href={"/"}
            className="text-2xl font-light text-foreground col-span-2 w-fit block mx-auto select-none"
          >
            ΞIИΞИ
            {/* <span className="bg-foreground text-background px-2 py-1 rounded-sm">
            AI
          </span> */}
          </Link>

          <div className="flex flex-row items-center justify-end gap-3 text-zinc-600 font-space text-sm font-normal">
            <button
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
              }}
              className="aspect-square bg-transparent rounded-full w-[34px] flex items-center justify-center border-2 border-transparent cursor-pointer text-primary"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {session?.user?.email ? (
              <div className="relative group h-8">
                <button className="cursor-pointer">
                  <Image
                    src={session?.user?.image}
                    alt="User avatar"
                    width={120}
                    height={120}
                    className="aspect-square w-8 object-cover rounded-full"
                  />
                </button>

                <div className="w-56 transition-all duration-300 rounded-lg bg-card p-2 overflow-hidden absolute top-[130%] right-0 text-primary opacity-0 pointer-events-none translate-y-3 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto z-40 shadow-lg">
                  <span className="text-sm font-medium block">
                    {session?.user?.name}
                  </span>
                  <span className="text-xs block font-light wrap-break-word">
                    {session?.user?.email}
                  </span>

                  <button
                    onClick={() => {
                      signOut({ redirect: true, callbackUrl: "/" });
                    }}
                    className="cursor-pointer mt-3 px-3 py-2 text-destructive flex items-center justify-between w-full bg-foreground/5 hover:bg-destructive/5 rounded-sm"
                  >
                    Sign out <LogOut size={17} />
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href={"/signin"}
                className="bg-indigo-500 text-white/80 rounded-full aspect-square p-2"
              >
                <User size={18} />
              </Link>
            )}
          </div>
        </header>
      </div>

      {/* SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="block fixed inset-0 w-full h-full bg-black/30 z-60 backdrop-blur-[2px]"
            ></motion.div>

            <motion.nav
              initial={{
                x: -260,
              }}
              exit={{
                x: -260,
              }}
              animate={{
                x: 0,
              }}
              transition={{
                duration: 0.25,
                type: "keyframes",
              }}
              className={`${theme} fixed top-0 left-0 z-60 w-full max-w-[260px] h-full overflow-y-auto py-5 px-2 bg-sidebar/60 backdrop-blur-2xl font-space text-sm text-sidebar-foreground font-normal shadow-lg shadow-black/10 flex flex-col`}
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="cursor-pointer block w-fit ml-auto text-primary mb-4 mr-1"
              >
                <ChevronLeftSquare size={22} />
              </button>

              <button
                onClick={() => {
                  setSidebarOpen(false);
                  redirect("/");
                }}
                className="flex flex-row items-center gap-2 w-full py-2 hover:bg-primary hover:text-background rounded-lg px-3 cursor-pointer mb-1"
              >
                <PenBox size={17} /> New Summary
              </button>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  redirect("/history");
                }}
                className="flex flex-row items-center gap-2 w-full py-2 hover:bg-primary hover:text-background rounded-lg px-3 cursor-pointer mb-1"
              >
                <History size={17} /> History
              </button>

              <div className="w-full flex flex-row items-center justify-center gap-4 flex-wrap mt-auto text-primary">
                <Link
                  href={"https://github.com/ShahSaminYasar"}
                  target="_blank"
                >
                  <Github size={18} />
                </Link>
                <Link
                  href={"https://shahsaminyasar.vercel.app"}
                  target="_blank"
                >
                  <Globe size={18} />
                </Link>
                <Link
                  href={"https://www.instagram.com/shah_samin_yasar"}
                  target="_blank"
                >
                  <Instagram size={18} />
                </Link>
                <Link
                  href={"https://www.facebook.com/shahsaminyasar"}
                  target="_blank"
                >
                  <Facebook size={18} />
                </Link>
                <Link
                  href={"https://www.youtube.com/shahsaminyasar"}
                  target="_blank"
                >
                  <Youtube size={20} />
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
export default Header;
