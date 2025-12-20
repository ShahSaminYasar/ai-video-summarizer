"use client";
import {
  Captions,
  ChevronDown,
  Copy,
  Download,
  Maximize,
  Minimize,
  RefreshCcw,
  Share2,
  User,
  WandSparkles,
  X,
} from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import Image from "next/image";
import parse from "html-react-parser";
import { decode } from "html-entities";
import { formatCodeBlocks } from "@/lib/formatResponse";
import { toast } from "sonner";
import Link from "next/link";
import MarkdownRenderer from "@/lib/MarkdownRenderer";

const YTSummary = () => {
  const searchParams = useSearchParams();
  const link = searchParams?.get("link");
  const language = searchParams?.get("lang");
  const model = searchParams?.get("model");

  //   States
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("null");
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [transcript, setTranscript] = useState(null);
  const [summary, setSummary] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [metadataFetched, setMetadataFetched] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const [summaryZoomed, setSummaryZoomed] = useState(false);

  useEffect(() => {
    if (!link) return redirect("/");

    const fetchData = async () => {
      await getMetadata();
      await getDescription();
    };

    fetchData();
  }, [link]);

  useEffect(() => {
    if (metadataFetched) {
      summarize(metadata);
    }
  }, [metadataFetched]);

  const getMetadata = async () => {
    try {
      setLoading(true);
      setLoadingMsg("Fetching metadata...");
      const res = await axios.get(
        `https://youtube.com/oembed?url=${link}&format=json`
      );

      setMetadata(res?.data);
    } catch (error) {
      console.error(error);
      return toast.error(
        error?.message || "Unknown error occured while fetching the metadata!"
      );
    }
  };

  const getDescription = async () => {
    try {
      setLoadingMsg("Extracting description...");

      const res = await axios.get(
        `/api/yt-description?link=${encodeURIComponent(link)}`
      );

      if (res?.data?.ok) {
        setMetadata((prev) => ({
          ...prev,
          description: res?.data?.data || "Description not found",
        }));
      }
    } catch (error) {
      console.error(error);
      return toast.error(
        error?.message ||
          "Unknown error occured while fetching the description!"
      );
    } finally {
      setMetadataFetched(true);
    }
  };

  const summarize = async (metadata) => {
    try {
      setLoading(true);

      //   Check for existing
      const checkLocal = JSON.parse(localStorage.getItem("summaries"));

      const targetLocal = checkLocal?.find(
        (s) => s?.video === link && s?.language === language
      );

      if (targetLocal) {
        setSummary(targetLocal?.summary);
        setTranscript(targetLocal?.transcript);
        return toast("Summary revised from earlier");
      } else {
        //   TRANSCRIPT
        setLoadingMsg("Getting transcript...");
        const getTranscript = await axios.get(`/api/transcript?link=${link}`);
        const transcriptData = parse(decode(getTranscript?.data?.text));
        if (getTranscript?.data?.ok) {
          setTranscript(getTranscript?.data?.data);
        } else {
          setTranscript(null);
          return setErrorMsg(
            getTranscript?.data?.message ||
              "Failed to generate transcript, note that the video should contain captions (english) for a successfull summary generation."
          );
        }

        //   SUMMARY
        setLoadingMsg("Generating summary...");
        const getSummary = await axios.post("/api/summary", {
          data: transcriptData,
          ...(metadata?.title && { title: metadata?.title }),
          ...(metadata?.description && { description: metadata?.description }),
          ...(language && { language }),
          ...(model && { model }),
        });
        const summaryData = getSummary?.data?.data;
        if (getSummary?.data?.ok) {
          const localSummaries = JSON.parse(
            localStorage.getItem("summaries") || "[]"
          );
          localSummaries.push({
            video: link,
            transcript: getTranscript?.data?.data,
            summary: summaryData,
            language,
            title: metadata?.title,
            thumbnail: metadata?.thumbnail_url,
            datetime: new Date().toISOString(),
          });
          localStorage.setItem("summaries", JSON.stringify(localSummaries));
          return setSummary(summaryData);
        } else {
          setSummary(null);
          return setErrorMsg(
            "Try changing the model to fix this error\n===========" +
              getSummary?.data?.message ||
              "Failed to generate summary, either the video is too long or there was an issue with the server. Try changing the model."
          );
        }
      }
    } catch (error) {
      console.error(error);
      return setErrorMsg(error?.message || error || "Unknown error occured");
    } finally {
      setLoading(false);
      setLoadingMsg(null);
    }
  };

  return (
    <div className="bg-white min-h-[90vh] text-black px-3 pt-[75px] md:pt-20 pb-3 grid font-space">
      <div className="w-full h-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-0 items-start justify-center">
        {/* Video */}
        <section
          className={`w-full h-full relative md:pr-5 md:pl-2 border-slate-200 md:border-r ${
            summaryZoomed ? "hidden" : "block"
          }`}
        >
          <div className="md:sticky md:top-20">
            <ReactPlayer
              src={link}
              controls={true}
              width={"100%"}
              height={"100%"}
              className="w-full aspect-video rounded-sm overflow-hidden mb-2"
            />

            <div className="w-full flex flex-row flex-wrap justify-start items-center gap-5 mb-2 mt-3">
              {metadata?.author_name && (
                <Link
                  href={metadata?.author_url || "#"}
                  className="px-2 py-1 bg-indigo-600 text-indigo-100 rounded-full flex items-center flex-row gap-1 text-xs"
                  target="_blank"
                >
                  <User size={16} /> {metadata?.author_name}
                </Link>
              )}
              {metadata?.thumbnail_url && (
                <Link
                  href={metadata?.thumbnail_url || "#"}
                  className="text-zinc-500 flex items-center flex-row gap-1 text-xs"
                  target="_blank"
                >
                  <Download size={16} /> Thumbnail
                </Link>
              )}
              <button
                onClick={() => {
                  window.navigator.clipboard.writeText(link);
                }}
                className="text-zinc-500 cursor-pointer transition-all duration-100 active:scale-95 flex items-center flex-row gap-1 text-xs"
              >
                <Copy size={14} /> Copy Link
              </button>
            </div>

            {metadata?.title && (
              <h3 className="block text-xl font-medium text-zinc-900 my-3">
                {metadata?.title}
              </h3>
            )}

            {metadata?.description && (
              <div className="px-4 py-2 rounded-lg bg-zinc-100 text-sm text-zinc-600 relative">
                <div
                  className={`relative ${
                    descOpen
                      ? "max-h-[300px] overflow-y-auto"
                      : "max-h-20 overflow-y-hidden"
                  } transition-all duration-300`}
                >
                  {formatCodeBlocks(metadata?.description)}

                  {!descOpen && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-10"
                      style={{
                        background:
                          "linear-gradient(to top, #f4f4f5 20%, transparent 100%)",
                      }}
                    ></div>
                  )}
                </div>

                <div
                  className={`pt-2 flex justify-end ${
                    descOpen ? "border-t border-zinc-200 mt-2" : ""
                  }`}
                >
                  <button
                    onClick={() => setDescOpen((prev) => !prev)}
                    className={`text-zinc-800 cursor-pointer flex items-center gap-1 text-xs font-medium`}
                  >
                    {descOpen ? "See less" : "See more"}
                    <ChevronDown
                      className={`${
                        descOpen ? "rotate-180" : "rotate-0"
                      } transition-transform`}
                      size={14}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Summary */}
        <section
          className={`w-full max-w-5xl mx-auto h-full relative md:pl-5 md:pr-2 border-slate-200 ${
            summaryZoomed ? "md:col-span-2" : "md:col-span-1"
          }`}
        >
          {/* Tab Nav */}
          <div className="sticky top-14 md:top-16 pt-3 md:pt-4 md:-mt-4 pb-2 bg-white z-20 sm:shadow-none">
            <AnimatePresence>
              {!errorMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full rounded-sm bg-linear-to-r from-indigo-700 via-indigo-500 to-indigo-600 p-2 flex items-center gap-0"
                >
                  <button
                    onClick={() => setActiveTab(0)}
                    className={`w-fit px-3 py-1 rounded-sm text-xs font-medium flex items-center gap-1 cursor-pointer transition-all duration-150 ${
                      activeTab === 0
                        ? "bg-white text-zinc-900"
                        : "bg-transparent text-zinc-100"
                    }`}
                  >
                    <WandSparkles size={13} /> Summary
                  </button>

                  <button
                    onClick={() => setActiveTab(1)}
                    className={`w-fit px-3 py-1 rounded-sm text-xs font-medium flex items-center gap-1 cursor-pointer transition-all duration-150 ${
                      activeTab === 1
                        ? "bg-white text-zinc-900"
                        : "bg-transparent text-zinc-100"
                    }`}
                  >
                    <Captions size={15} /> Transcript
                  </button>

                  <button
                    className={`hidden md:block w-fit ml-auto text-white mr-1 cursor-pointer`}
                    onClick={() => {
                      setSummaryZoomed((prev) => !prev);
                    }}
                  >
                    {summaryZoomed ? (
                      <Minimize size={15} />
                    ) : (
                      <Maximize size={15} />
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="relative w-full rounded-sm shadow-sm bg-linear-to-br from-rose-500 via-rose-700 to-rose-500 text-white/90 text-xs font-medium font-space text-center py-6 px-4 mb-6 flex flex-col items-start gap-3 mx-auto"
              >
                {parse(decode(errorMsg))}

                <button
                  onClick={() => {
                    setErrorMsg(null);
                    summarize();
                  }}
                  className="w-fit px-4 py-2 bg-red-100 cursor-pointer rounded-full flex items-center text-xs font-medium text-red-600"
                >
                  Retry <RefreshCcw size={12} />
                </button>

                <button
                  className="absolute top-3 right-3 cursor-pointer"
                  onClick={() => setErrorMsg(null)}
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          {loading && (
            <div className="w-full p-10 min-h-[200px] flex items-center justify-center flex-col text-xs font-light text-zinc-600 -mt-8 sticky top-20">
              <Image
                src={"/loading.gif"}
                width={400}
                height={500}
                alt="Generating summary..."
                className="w-full max-w-[170px] "
              />
              {loadingMsg || "Processing..."}
            </div>
          )}

          <div className="w-full overflow-x-hidden text-sm -mt-3 px-2">
            {/* Summary */}
            <AnimatePresence>
              {!loading && activeTab === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, type: "keyframes" }}
                >
                  {/* {formatCodeBlocks(summary || "")} */}

                  <MarkdownRenderer>{summary}</MarkdownRenderer>

                  <button
                    onClick={() => {
                      window.navigator.clipboard.writeText(summary);
                      return toast.success("Copied to clipboard");
                    }}
                    className="text-zinc-400 mt-5 cursor-pointer transition-all duration-100 active:scale-95 block w-fit ml-auto"
                  >
                    <Copy size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transcript */}
            <AnimatePresence>
              {!loading && activeTab === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2, type: "keyframes" }}
                  className="mt-3"
                >
                  {transcript?.map((t, i) => (
                    <div
                      key={`transcript_${i}`}
                      className="w-full bg-white hover:bg-zinc-100 mb-2 text-sm font-normal text-zinc-600 rounded-lg overflow-hidden"
                    >
                      <div className="w-full flex items-center flex-row justify-between gap-3 py-2 px-3">
                        <span className="text-indigo-600">
                          {t?.start || t?.offset}
                        </span>

                        <button
                          onClick={() => {
                            window.navigator.clipboard.writeText(t?.text);
                            return toast.success("Copied to clipboard");
                          }}
                          className="text-zinc-500 cursor-pointer transition-all duration-100 active:scale-95"
                        >
                          <Copy size={14} />
                        </button>
                      </div>

                      <div className="px-3 pb-2">{parse(decode(t?.text))}</div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FOR TESTING PURPOSE ONLY */}
          {/* <pre className="bg-black w-full text-white p-2 overflow-auto text-xs">
            {summary}
          </pre> */}
        </section>
      </div>
    </div>
  );
};
export default YTSummary;
