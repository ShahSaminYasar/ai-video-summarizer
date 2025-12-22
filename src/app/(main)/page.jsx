"use client";
import { useMainContext } from "@/hooks/useMainContext";
import { Languages, WandSparkles } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";

const Home = () => {
  const { theme } = useMainContext();

  const [lang, setLang] = useState("english");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [link, setLink] = useState("");

  const handleSummarize = (e) => {
    e.preventDefault();
    if (!link || link == "") return;

    return redirect(
      `/youtube-video-summary?link=${encodeURIComponent(
        link
      )}&lang=${lang}&model=${model}`
    );
  };

  return (
    <section
      className="w-full px-3 bg-linear-to-r min-h-[70vh] md:min-h-screen pt-[60px] pb-10 flex flex-col items-center justify-center relative"
      style={{
        backgroundImage:
          theme === "light" ? "url(/white-bg.jpg)" : "url(/dark-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4 text-foreground">
        <motion.h4
          initial={{
            filter: "blur(10px)",
            opacity: 0.5,
          }}
          animate={{
            filter: "blur(0px)",
            opacity: 1,
          }}
          transition={{
            duration: 0.4,
            type: "keyframes",
          }}
          className="text-3xl md:text-4xl font-normal block text-center"
        >
          Notes Lagbe?{" "}
          <span
            className="inline-block w-fit"
            style={{
              background: "url(text-bg.jpg)",
              backgroundSize: "cover",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <h1 className="font-medium">Einen</h1>
          </span>
          AI
        </motion.h4>

        <div className="w-fit max-w-2xl mx-auto flex flex-row flex-wrap gap-x-3 gap-y-2 items-center justify-center text-sm font-normal text-primary text-center mt-2 mb-4">
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, type: "keyframes" }}
          >
            ⚡ Instant video summaries
          </motion.p>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, type: "keyframes", delay: 0.2 }}
          >
            <Image
              width={150}
              height={150}
              alt="Highlighter"
              src={"/highlighter.png"}
              className="w-5 inline-block -mt-1"
            />{" "}
            Smart formatting and highlighting
          </motion.p>
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, type: "keyframes", delay: 0.4 }}
          >
            <Image
              width={150}
              height={150}
              alt="Crayon"
              src={"/idea.png"}
              className="w-5 inline-block -mt-1"
            />{" "}
            Catchy & Memorable
          </motion.p>
        </div>
      </div>
      <form
        onSubmit={handleSummarize}
        className="flex flex-col items-center justify-center gap-2 bg-background/40 backdrop-blur-lg rounded-xl pr-2 pl-3 py-2 w-full max-w-3xl mx-auto shadow-xl shadow-black/5 border border-accent mt-2"
      >
        <input
          name="link"
          placeholder="Youtube Video Link"
          onChange={(e) => setLink(e.target?.value)}
          className="w-full py-2 px-3 text-sm font-medium text-foreground outline-none resize-none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          type="text"
        ></input>

        <div className="w-full flex flex-row md:flex-row justify-between items-center gap-3">
          <div className="w-fit flex items-center gap-3 text-xs font-space font-medium">
            <span className="text-slate-500 block ml-3">
              <Languages size={13} />
            </span>

            <button
              onClick={() => setLang("english")}
              type="button"
              className={`cursor-pointer w-fit rounded-full px-3 py-1 border-2 ${
                lang === "english"
                  ? "bg-indigo-100 border-indigo-600 text-indigo-600"
                  : "bg-slate-100 border-slate-300 text-slate-500"
              }`}
            >
              En
            </button>

            <button
              onClick={() => setLang("bangla")}
              type="button"
              className={`cursor-pointer w-fit rounded-full px-3 py-1 border-2 ${
                lang === "bangla"
                  ? "bg-indigo-100 border-indigo-600 text-indigo-600"
                  : "bg-slate-100 border-slate-300 text-slate-500"
              }`}
            >
              বাং
            </button>
          </div>

          <div className="w-full items-start flex justify-between">
            {/* Model Select */}
            {/* <select
              name="model_select"
              value={model}
              onChange={(e) => {
                setModel(e.target?.value);
              }}
              className="w-fit h-7 block py-1 px-3 rounded-full bg-sky-100 border-2 border-sky-200 text-xs cursor-pointer"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="gemini-2.5-flash-lite">
                Gemini 2.5 Flash Lite
              </option>
            </select> */}

            {/* Submit Button */}
            <div className="relative p-0.5 overflow-hidden rounded-full group ml-auto active:scale-95 duration-150 transition-all">
              {/* The Rotating Border Track */}
              {!link?.length == 0 && (
                <div className="absolute inset-[-1000%] animate-rotate bg-[conic-gradient(from_90deg_at_50%_50%,#2effee_0%,#2e54ff_50%,#2effee_100%)]" />
              )}

              {/* The Actual Button */}
              <button
                type="submit"
                disabled={link?.length == 0}
                className="relative flex items-center justify-center gap-2 bg-indigo-600 rounded-full px-5 py-2 text-sm font-semibold text-white cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="block -mt-0.5">Summarize</span>
                <WandSparkles size={16} />
              </button>
            </div>
          </div>
        </div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-sm font-normal w-full max-w-sm text-center block text-slate-500 mt-4"
      >
        Get summarized and perfectly polished notes - codes, equations,
        transcripts from a YouTube video - all in one place.
      </motion.p>
    </section>
  );
};
export default Home;
