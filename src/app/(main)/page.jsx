"use client";
import { WandSparkles } from "lucide-react";
import { redirect } from "next/navigation";

const page = () => {
  const handleSummarize = (e) => {
    e.preventDefault();
    const link = e?.target?.link?.value;
    if (!link) return;

    return redirect(`/youtube-video-summary?link=${encodeURIComponent(link)}`);
  };

  return (
    <section
      className="w-full px-3 bg-linear-to-r min-h-[95vh] pt-[110px] pb-10 flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url(/white-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-4xl font-normal block text-center">
          Welcome to <span className="font-medium">AI Video Summarizer</span>
        </h2>
        <p className="text-sm font-normal w-full max-w-sm text-center block text-slate-500 mb-5">
          Get summarized and perfectly polished notes, transcripts and download
          option on an YouTube video - all in one place.
        </p>
      </div>
      <form
        onSubmit={handleSummarize}
        className="flex flex-row items-center justify-center gap-2 bg-white rounded-full pr-2 pl-3 py-2 w-full max-w-3xl mx-auto shadow-xl shadow-black/5 border border-slate-200"
      >
        <textarea
          name="link"
          placeholder="Youtube Video Link"
          className="w-full py-2 px-3 text-sm font-medium text-slate-800 outline-none resize-none"
          rows={1}
        ></textarea>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-linear-to-r from-indigo-700 via-indigo-500 to-indigo-600 rounded-full px-5 py-2 text-sm font-semibold text-white cursor-pointer active:scale-95 duration-150 transition-all disabled:grayscale-100"
        >
          <span className="block -mt-0.5">Summarize</span>{" "}
          <WandSparkles size={16} />
        </button>
      </form>
    </section>
  );
};
export default page;
