"use client";
import { Notebook, WandSparkles, Clock, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import moment from "moment-timezone";

// Mock Summary Data Structure for clarity (assuming it looks like this)
// interface Summary {
//   title: string;
//   video: string;
//   language: string;
//   thumbnail: string;
//   datetime: string; // ISO String
// }

const History = () => {
  // State for summaries, initialized to an array to handle the loading state better visually
  const [summaries, setSummaries] = useState(null);

  useEffect(() => {
    const getSetSummaries = () => {
      // Simulating a delay for a smoother loading transition
      setTimeout(() => {
        const localSummaries =
          JSON.parse(localStorage.getItem("summaries")) || [];
        setSummaries(localSummaries);
      }, 500); // Added a slight delay
    };

    getSetSummaries();
  }, []);

  // --- Utility Component for Placeholder Image ---
  const PlaceholderImage = () => (
    <div className="w-full h-36 bg-gray-200 flex items-center justify-center rounded-t-xl">
      <Youtube size={40} className="text-gray-400" />
    </div>
  );

  return (
    // Main container with light theme background, clean padding, and max width
    <div className="bg-gray-50 min-h-screen text-gray-900 px-4 pt-20 pb-10 font-space">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 mt-3">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Clock size={28} className="text-indigo-200" /> History
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Review your previously generated YouTube video summaries.
          </p>
        </header>

        {/* --- Content Display Area --- */}

        {/* Loading State */}
        {!summaries && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
            {/* Skeleton Loaders (simulating 4 cards) */}
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg transition-all duration-300"
              >
                <div className="w-full h-36 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-indigo-100 rounded-full w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {summaries && summaries.length === 0 && (
          <div className="w-full flex flex-col items-center justify-center text-sm text-gray-500 font-normal gap-4 pt-16 border border-dashed border-gray-300 rounded-xl p-10 bg-white shadow-sm">
            <Notebook size={45} className="text-indigo-500" />
            <p className="block w-full max-w-sm text-center text-base">
              Looks a little empty here.
            </p>
            <p className="text-center max-w-md">
              **Generate your first summary** by adding a YouTube video URL on
              the main page. All completed summaries will appear here.
            </p>
          </div>
        )}

        {/* Summaries Grid */}
        {summaries && summaries.length > 0 && (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {summaries.map((s, i) => (
              <div
                key={`summary_${i}`}
                className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Thumbnail Area */}
                <div className="relative w-full h-36 bg-gray-100">
                  {s?.thumbnail ? (
                    <Image
                      width={400}
                      height={225}
                      alt={s?.title || `summary_${i}`}
                      src={s?.thumbnail}
                      className="w-full h-full object-cover"
                      priority={i < 4} // Prioritize loading for the first few items
                    />
                  ) : (
                    <PlaceholderImage />
                  )}
                  {/* Optional: Language tag if important */}
                  {s?.language && (
                    <span className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500 text-white shadow">
                      {s.language.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-4 flex flex-col justify-between h-[calc(100%-9rem)]">
                  <h4 className="text-base font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[3rem]">
                    {s?.title || "Untitled Summary"}
                  </h4>

                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {moment(s?.datetime || new Date().toISOString()).format(
                        "MMMM Do, YYYY"
                      )}
                    </span>

                    {/* View Summary Button */}
                    <Link
                      href={`/youtube-video-summary?link=${s?.video}&lang=${s?.language}`}
                      className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <WandSparkles size={16} /> View Summary
                    </Link>
                  </div>
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
