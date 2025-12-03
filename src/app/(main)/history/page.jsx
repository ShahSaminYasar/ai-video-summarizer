"use client";
import { Notebook, WandSparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import moment from "moment-timezone";

const History = () => {
  const [summaries, setSummaries] = useState(null);

  useEffect(() => {
    const getSetSummaries = () => {
      const localSummaries =
        JSON.parse(localStorage.getItem("summaries")) || [];

      setSummaries(localSummaries);
    };

    getSetSummaries();
  }, []);

  return (
    <div className="bg-white min-h-[90vh] text-black px-3 pt-[75px] md:pt-20 pb-3 grid font-space">
      <div className="w-full max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-zinc-900 block mb-3">
          History
        </h2>
        {!summaries ? (
          <div className="w-fit py-20 animate-pulse">Loading...</div>
        ) : summaries?.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center text-sm text-slate-500 font-normal gap-3 pt-8">
            <Notebook size={45} />
            <p className="block w-full max-w-sm text-center">
              Looks empty. Add a YouTube video URL to create your first summary.
            </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {summaries?.map((s, i) => (
              <div
                key={`summary_${i}`}
                className="w-full overflow-hidden items-center justify-center bg-slate-100 rounded-2xl relative shadow-sm border-2 border-indigo-600"
              >
                <Image
                  width={300}
                  height={300}
                  alt={s?.title || `summary_${i}`}
                  src={
                    s?.thumbnail ||
                    "https://thelearningprism.org/wp-content/uploads/2021/11/placeholder-wire-image.jpg"
                  }
                  className="w-full z-0 rounded-lg object-cover absolute top-0 left-0 h-full"
                />

                <div className="w-full px-3 py-10 flex flex-col items-center justify-center gap-2 relative z-10 bg-linear-to-br from-blue-800/40 via-indigo-900/70 to-indigo-800/40 backdrop-blur-[5px]">
                  <h4 className="text-sm font-medium col-span-2 text-white block text-left">
                    {s?.title}
                  </h4>

                  <span className="text-xs font-light text-white block mb-1">
                    {moment(s?.datetime || new Date().toISOString()).format(
                      "DD MMM YYYY"
                    )}
                  </span>

                  <Link
                    href={`/youtube-video-summary?link=${s?.video}&lang=${s?.language}`}
                    className="w-fit flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-indigo-100 bg-linear-to-br from-indigo-300 via-indigo-500 to-indigo-200 col-span-2 shadow-lg"
                  >
                    <WandSparkles size={15} /> View Summary
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default History;
