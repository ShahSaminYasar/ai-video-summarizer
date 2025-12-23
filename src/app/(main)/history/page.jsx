"use client";
import { Notebook, Clock, Youtube, Trash2, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import moment from "moment-timezone";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const History = () => {
  const { status } = useSession();

  // States
  // const [summaries, setSummaries] = useState(null);

  // Effects
  useEffect(() => {
    if (status == "unauthenticated") {
      toast("Please sign in to access this page");
      return redirect(`/signin?callback=${encodeURIComponent("/history")}`);
    }
  }, [status]);

  // Functions
  const getSetSummaries = async () => {
    try {
      const result = await axios.get("/api/history");

      if (!result?.data?.ok) {
        toast.error(result?.data?.message || "Something went wrong");
        return [];
      }

      return result?.data?.data;
    } catch (error) {
      console.error(error);
      return toast.error(error?.message || "Something went wrong");
    }
  };

  const handleDelete = async (link) => {
    try {
      const result = await axios.delete(
        `/api/history?link=${encodeURIComponent(link)}`
      );
      if (!result?.data?.ok) {
        console.log(result?.data);
        return toast(result?.data?.data?.message || "Something went wrong");
      }
      refetch();
    } catch (error) {
      console.error(error);
      return toast.error(
        error?.message || "Failed to delete the item from history"
      );
    }
  };

  // Queries
  const {
    data: summaries,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["history"],
    queryFn: getSetSummaries,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });

  const blurFadeVars = {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-background min-h-screen text-foreground px-4 pt-24 pb-10 font-space">
      <div className="w-full max-w-5xl mx-auto">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={blurFadeVars}
          className="mb-7 border-l-2 border-primary pl-6"
        >
          <h2 className="text-3xl font-medium tracking-tight flex items-center gap-3">
            History
          </h2>
          <p className="text-primary text-sm mt-2 font-normal">
            Past Intelligence & Summaries
          </p>
        </motion.header>

        {/* ERROR */}
        {isError && (
          <div className="w-full max-w-md mx-auto bg-red-600 text-red-50 rounded-lg p-3">
            <pre>{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 w-full bg-primary/10 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isRefetching && summaries && summaries.length === 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={blurFadeVars}
            className="border-2 border-dashed border-primary/20 p-20 flex flex-col items-center justify-center text-center"
          >
            <Notebook size={40} className="text-primary mb-4 opacity-50" />
            <p className="text-lg font-medium">History is empty.</p>
            <Link
              href="/"
              className="mt-4 text-primary text-sm underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Generate new notes
            </Link>
          </motion.div>
        )}

        {/* SUMMARY LIST */}
        <div
          className={`flex flex-col border-t border-primary/10 relative ${
            isRefetching ? "animate-pulse" : ""
          }`}
        >
          <AnimatePresence mode="popLayout">
            {summaries &&
              summaries.map((s, i) => (
                <motion.div
                  key={s?._id || i}
                  variants={blurFadeVars}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  layout
                  className="group flex flex-col md:flex-row md:pl-2 items-center gap-6 py-6 border-b border-primary/10 hover:bg-primary/10 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-44 shrink-0 aspect-video bg-primary/10">
                    {s?.thumbnail ? (
                      <Image
                        fill
                        sizes="500px"
                        alt="Thumbnail"
                        src={s.thumbnail}
                        className="object-cover transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Youtube size={30} />
                      </div>
                    )}
                    <span className="absolute bottom-0 left-0 bg-slate-900 text-indigo-100 text-[10px] px-2 py-0.5 font-medium uppercase">
                      {s?.language || "EN"}
                    </span>
                  </div>

                  {/* Info Area */}
                  <div className="grow">
                    <div className="flex items-center gap-2 text-[10px] text-primary uppercase tracking-widest mb-1">
                      <Clock size={10} className="-mt-px" />
                      {moment
                        .utc(s?.createdAt)
                        .tz(moment.tz.guess())
                        .format("DD MMM, YYYY hh:mma")}
                    </div>
                    <h4 className="text-lg font-medium leading-tight group-hover:text-primary transition-colors">
                      {s?.title || "Untitled"}
                    </h4>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link
                      href={`/youtube-video-summary?link=${encodeURIComponent(
                        s?.link
                      )}&lang=${s?.language}`}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-all"
                    >
                      Open <ArrowUpRight size={14} />
                    </Link>
                    <button
                      onClick={() =>
                        confirm("Delete permanently?") && handleDelete(s?.link)
                      }
                      className="p-2 text-primary hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default History;
