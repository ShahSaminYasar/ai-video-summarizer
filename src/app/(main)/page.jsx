"use client";
import { Languages, WandSparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";

const Home = () => {
  const [lang, setLang] = useState("english");
  const [model, setModel] = useState("gemini-2.5-flash");

  const handleSummarize = (e) => {
    e.preventDefault();
    const link = e?.target?.link?.value;
    if (!link) return;

    return redirect(
      `/youtube-video-summary?link=${encodeURIComponent(
        link
      )}&lang=${lang}&model=${model}`
    );
  };

  return (
    <section
      className="w-full px-3 bg-linear-to-r min-h-[70vh] md:min-h-[95vh] pt-[110px] pb-10 flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url(/white-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-3xl md:text-4xl font-normal block text-center">
          Welcome to <span className="font-medium">AI Video Summarizer</span>
        </h2>
        <p className="text-sm font-normal w-full max-w-sm text-center block text-slate-500 mb-5">
          Get summarized and perfectly polished notes, transcripts and download
          option on an YouTube video - all in one place.
        </p>
      </div>
      <form
        onSubmit={handleSummarize}
        className="flex flex-col items-center justify-center gap-2 bg-white rounded-xl pr-2 pl-3 py-2 w-full max-w-3xl mx-auto shadow-xl shadow-black/5 border border-slate-200 mt-2"
      >
        <input
          name="link"
          placeholder="Youtube Video Link"
          className="w-full py-2 px-3 text-sm font-medium text-slate-800 outline-none resize-none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          type="text"
          required
        ></input>

        <div className="w-full flex flex-row justify-between items-center gap-3">
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

            {/* Model Select */}
            <select
              name="model_select"
              value={model}
              onChange={(e) => {
                setModel(e.target?.value);
              }}
              className="w-fit block py-1 px-3 rounded-full bg-sky-100 border-2 border-sky-200 text-xs cursor-pointer"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
              <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
              <option value="gemini-2.5-flash-lite">
                Gemini 2.5 Flash Lite
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-linear-to-r from-indigo-700 via-indigo-500 to-indigo-600 rounded-full px-5 py-2 text-sm font-semibold text-white cursor-pointer active:scale-95 duration-150 transition-all disabled:grayscale-100"
          >
            <span className="block -mt-0.5">Summarize</span>{" "}
            <WandSparkles size={16} />
          </button>
        </div>
      </form>
    </section>
  );
};
export default Home;
