"use client";
import {
  ChevronDown,
  Copy,
  Download,
  Share,
  Share2,
  WandSparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import parse from "html-react-parser";
import { decode } from "html-entities";
import { AnimatePresence, motion } from "motion/react";
import { formatCodeBlocks } from "@/lib/formatResponse";

const Main = () => {
  // States
  const [loading, setLoading] = useState(false);
  const [videoLink, setVideoLink] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [firstDone, setFirstDone] = useState(false);
  const [summary, setSummary] = useState(null);
  const [bufferingMessage, setBufferingMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const formatResponse = (text) => {
    if (!text) return null;

    // Function to process inline formatting within text
    const processInlineFormatting = (line) => {
      const segments = [];
      let currentIndex = 0;
      let boldMatch;

      // Regular expression to match **bold** text
      const boldRegex = /\*\*(.*?)\*\*/g;

      while ((boldMatch = boldRegex.exec(line)) !== null) {
        // Add text before the bold match
        if (boldMatch.index > currentIndex) {
          segments.push(line.slice(currentIndex, boldMatch.index));
        }

        // Add the bold text
        segments.push(
          <strong key={segments.length} className="font-medium text-slate-800">
            {boldMatch[1]}
          </strong>
        );

        // Update current index to after the match
        currentIndex = boldMatch.index + boldMatch[0].length;
      }

      // Add any remaining text after the last match
      if (currentIndex < line.length) {
        segments.push(line.slice(currentIndex));
      }

      return segments.length > 0 ? segments : line;
    };

    // Check if the text contains code blocks first
    if (text.includes("```")) {
      return formatCodeBlocks(text);
    }

    // Split by lines and process each line
    return text.split("\n").map((line, index) => {
      // Handle headers (lines that start with ####)
      if (line.startsWith("#### ")) {
        return (
          <h4
            key={index}
            className="text-lg font-medium text-slate-800 mt-2 -mb-2"
          >
            {processInlineFormatting(line.replace("#### ", ""))}
          </h4>
        );
      }

      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-lg font-semibold text-slate-800 mt-2 -mb-2"
          >
            {processInlineFormatting(line.replace("### ", ""))}
          </h3>
        );
      }

      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="text-lg font-bold text-slate-800 mt-2 -mb-2"
          >
            {processInlineFormatting(line.replace("## ", ""))}
          </h2>
        );
      }

      // Handle bold headers without markdown (like "**5. Create API Routes**")
      if (/^\*\*.*\*\*$/.test(line.trim()) && line.includes("**")) {
        return (
          <h4
            key={index}
            className="text-lg font-semibold text-slate-800 mt-2 -mb-2"
          >
            {processInlineFormatting(line)}
          </h4>
        );
      }

      // Handle bullet points
      if (line.trim().startsWith("* ")) {
        return (
          <li key={index} className="ml-4 list-disc text-slate-700 mb-1">
            {processInlineFormatting(line.replace("* ", ""))}
          </li>
        );
      }

      // Handle numbered lists
      if (/^\d+\.\s/.test(line)) {
        return (
          <li key={index} className="ml-4 list-decimal text-slate-700 mb-1">
            {processInlineFormatting(line.replace(/^\d+\.\s/, ""))}
          </li>
        );
      }

      // Handle inline code within text
      if (line.includes("`") && !line.startsWith("```")) {
        const parts = line.split("`");
        return (
          <p key={index} className="mb-2 text-slate-700">
            {parts.map((part, i) =>
              i % 2 === 0 ? (
                processInlineFormatting(part)
              ) : (
                <code
                  key={i}
                  className="bg-purple-200 px-1 py-0.5 rounded text-purple-700 text-sm font-space"
                >
                  {part}
                </code>
              )
            )}
          </p>
        );
      }

      // Handle horizontal rules
      if (line.trim() === "---") {
        return <hr key={index} className="w-full my-4 border-gray-300" />;
      }

      // Handle regular paragraphs (skip empty lines)
      if (line.trim() === "") {
        return <br key={index} />;
      }

      // Regular text
      return (
        <p key={index} className="mb-2 text-slate-700">
          {processInlineFormatting(line)}
        </p>
      );
    });
  };

  const handleSummarize = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    const link = form.get("link");

    try {
      setLoading(true);

      if (!firstDone) setFirstDone(true);

      setVideoLink(link);

      setBufferingMessage("Getting transcript...");
      const getTranscript = await axios.get(`/api/transcript?link=${link}`);
      const transcriptData = parse(decode(getTranscript?.data?.data));
      if (getTranscript?.data?.ok) {
        setTranscript(transcriptData);
      } else {
        setFirstDone(false);
        setTranscript(null);
        setErrorMessage(
          getTranscript?.data?.message ||
            "Failed to generate transcript, note that the video should contain captions (english) for a successfull summary generation."
        );
        return toast.error(
          getTranscript?.data?.message ||
            "Failed to generate transcript, note that the video should contain captions (english) for a successfull summary generation."
        );
      }

      setBufferingMessage("Generating summary...");
      const getSummary = await axios.post("/api/summary", {
        data: transcriptData,
      });
      const summaryData = getSummary?.data?.data;
      if (getSummary?.data?.ok) {
        const localSummaries = JSON.parse(
          localStorage.getItem("summaries") || "[]"
        );
        localSummaries.push({
          video: videoLink,
          transcript: transcriptData,
          summary: summaryData,
        });
        localStorage.setItem("summaries", JSON.stringify(localSummaries));
        return setSummary(summaryData);
      } else {
        setSummary(null);
        setFirstDone(false);
        setErrorMessage(
          getSummary?.data?.message ||
            "Failed to generate summary, either the video is too long or there was an issue with the server."
        );
        return toast.error(
          getSummary?.data?.message ||
            "Failed to generate summary, either the video is too long or there was an issue with the server."
        );
      }
    } catch (error) {
      console.error(error);
      return toast.error(
        error?.message || "Unknown error occured, please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.get(`/api/download-video?link=${videoLink}`);
      console.log(res);
    } catch (error) {
      console.error(error);
      return toast.error(error?.message || "Unknown error occured");
    }
  };

  return (
    <>
      <section className="w-full px-3 bg-linear-to-r">
        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-4xl font-normal block text-center">
            Welcome to <span className="font-medium">AI Video Summarizer</span>
          </h2>
          <p className="text-sm font-normal w-full max-w-sm text-center block text-slate-500 mb-5">
            Get summarized and perfectly polished notes, transcripts and
            download option on an YouTube video - all in one place.
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
            disabled={loading}
          >
            <span className="block -mt-0.5">Summarize</span>{" "}
            <WandSparkles size={16} />
          </button>
        </form>
      </section>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="relative w-full max-w-md rounded-lg shadow-sm bg-linear-to-br from-rose-500 via-rose-700 to-rose-500 text-white/90 text-xs font-medium font-space text-center py-6 px-4 my-6"
          >
            {errorMessage}

            <button
              className="absolute top-3 right-3 cursor-pointer"
              onClick={() => setErrorMessage(null)}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {firstDone && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full px-2 py-10 fade-in"
          >
            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 font-space">
              {/* Video */}
              <div className="bg-white rounded-lg p-3 shadow-sm shadow-black/5 border border-slate-200 flex flex-col gap-3 w-full h-fit md:sticky md:top-20">
                {videoLink ? (
                  <div>
                    <ReactPlayer
                      src={videoLink}
                      controls={true}
                      width={"100%"}
                      height={"100%"}
                      className="w-full aspect-video rounded-lg"
                    />

                    <div className="w-full flex flex-row justify-center mt-4 items-center flex-wrap gap-3">
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 bg-indigo-600 rounded-full px-5 py-2 text-xs shadow-sm font-semibold text-white cursor-pointer active:scale-95 duration-150 transition-all disabled:grayscale-100"
                        disabled={loading}
                      >
                        <span className="block -mt-0.5">Copy Link</span>{" "}
                        <Share2 size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={handleDownload}
                        className="flex items-center justify-center gap-2 bg-amber-400 rounded-full px-5 py-2 text-xs shadow-sm font-semibold text-white cursor-pointer active:scale-95 duration-150 transition-all disabled:grayscale-100"
                        disabled={loading}
                      >
                        <span className="block -mt-0.5">Download</span>{" "}
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="w-full h-[200px] flex items-center justify-center animate-pulse">
                    Loading...
                  </div>
                ) : (
                  <div className="w-full h-[200px] flex items-center justify-center animate-pulse">
                    No video
                  </div>
                )}
              </div>

              {/* Summary */}
              {loading ? (
                <div className="bg-white rounded-lg p-3 shadow-sm shadow-black/5 border border-slate-200 flex flex-col items-center justify-center gap-3 animate-pulse min-h-[250px]">
                  {bufferingMessage || "Processing..."}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="bg-white rounded-lg p-3 shadow-sm shadow-black/5 border border-slate-200 flex flex-col gap-3">
                    {/* Transcript */}
                    {!loading ? (
                      <ExpandableTextContainer title="Transcript">
                        {transcript}
                      </ExpandableTextContainer>
                    ) : (
                      <div className="w-full h-[200px] flex items-center justify-center animate-pulse">
                        Getting transcript...
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-3 shadow-sm shadow-black/5 border border-slate-200 flex flex-col gap-3">
                    {/* Summary */}
                    {!loading ? (
                      <ExpandableTextContainer
                        title="Summary"
                        opened={true}
                        type={2}
                      >
                        {summary}
                      </ExpandableTextContainer>
                    ) : (
                      <div className="w-full h-[200px] flex items-center justify-center animate-pulse">
                        Generating summary...
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
};

export const ExpandableTextContainer = ({
  children,
  opened,
  title,
  type = 1,
}) => {
  const [open, setOpen] = useState(opened || false);

  const text = children;

  return (
    <div className="rounded-lg border border-slate-200 bg-white overflow-hidden relative">
      <div
        className={`w-full bg-linear-to-r ${
          type === 1
            ? "from-indigo-400 via-indigo-600 to-indigo-500"
            : "from-purple-500 via-pink-500 to-fuchsia-700"
        } flex items-center justify-between gap-3 text-white p-4 transition-all duration-300 cursor-pointer`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <h2 className="text-sm font-medium">{title}</h2>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e?.stopPropagation();
              window.navigator.clipboard.writeText(text);
              return toast("Copied to clipboard", { icon: <Copy size={15} /> });
            }}
            className="cursor-pointer active:scale-95 transition-all duration-150"
          >
            <Copy size={15} />
          </button>

          <button>
            <ChevronDown
              size={15}
              className={`${
                open ? "rotate-180" : "rotate-0"
              } transition-all duration-150 cursor-pointer`}
            />
          </button>
        </div>
      </div>

      <div
        className={`w-full text-sm text-slate-800 font-normal text-justify ${
          open
            ? "max-h-[300px] overflow-y-auto p-3 pt-0"
            : "max-h-0 overscroll-y-none p-0"
        } transition-all duration-400`}
      >
        {formatCodeBlocks(text)}
      </div>
    </div>
  );
};

export default Main;
