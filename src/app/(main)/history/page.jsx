"use client";
import {
  Notebook,
  Clock,
  Youtube,
  Trash2,
  ArrowUpRight,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import moment from "moment-timezone";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

const History = () => {
  const { status } = useSession();
  const [deletingId, setDeletingId] = useState(null);
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    if (status == "unauthenticated") {
      toast("Please sign in to access this page");
      return redirect(`/signin?callback=${encodeURIComponent("/history")}`);
    }
  }, [status]);

  const fetchHistory = async ({ pageParam = 1 }) => {
    const result = await axios.get(`/api/history?page=${pageParam}&limit=10`);
    if (!result?.data?.ok) throw new Error(result?.data?.message);
    return result.data.data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["history-infinite"],
    queryFn: fetchHistory,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDelete = async (link, id) => {
    try {
      setDeletingId(id);
      const result = await axios.delete(
        `/api/history?link=${encodeURIComponent(link)}`
      );
      if (!result?.data?.ok) {
        setDeletingId(null);
        return toast(result?.data?.data?.message || "Something went wrong");
      }
      await refetch();
    } catch (error) {
      setDeletingId(null);
      return toast.error(error?.message || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const summaries = data?.pages.flatMap((page) => page.docs) || [];

  const blurFadeVars = {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="bg-background min-h-screen text-foreground px-4 pt-24 pb-10 font-space overflow-x-hidden">
      <AnimatePresence>
        {isRefetching && !isFetchingNextPage && (
          <motion.div
            initial={{ y: -50, x: "-50%", opacity: 0 }}
            animate={{ y: 12, x: "-50%", opacity: 1 }}
            exit={{ y: -50, x: "-50%", opacity: 0 }}
            className="fixed top-0 left-1/2 z-100 flex items-center gap-3 bg-foreground px-3 py-2 rounded-full shadow-2xl shadow-primary/20 border border-primary/50"
          >
            <RefreshCcw className="animate-spin text-background" size={16} />
            <span className="text-background text-xs font-bold uppercase tracking-normal">
              Syncing History
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-5xl mx-auto">
        <motion.header
          initial="hidden"
          animate="visible"
          variants={blurFadeVars}
          className="mb-7 border-l-2 border-primary pl-6"
        >
          <h2 className="text-3xl font-medium tracking-tight flex items-center gap-3 text-foreground">
            History
          </h2>
          <p className="text-primary text-sm mt-2 font-normal">
            Past Intelligence & Summaries
          </p>
        </motion.header>

        {isError && (
          <div className="w-full max-w-md mx-auto bg-red-600/10 border border-red-600 text-red-600 rounded-lg p-3 text-xs mb-6">
            {error.message}
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-24 w-full bg-primary/5 animate-pulse rounded-lg"
              />
            ))}
          </div>
        )}

        {!isLoading && summaries.length === 0 && (
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

        <div className="flex flex-col border-t border-primary/10 relative">
          <AnimatePresence mode="popLayout">
            {summaries.map((s) => (
              <motion.div
                key={s._id}
                variants={blurFadeVars}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className={`group flex flex-col md:flex-row md:pl-2 items-center gap-6 py-6 border-b border-primary/10 hover:bg-primary/5 transition-all ${
                  deletingId === s._id
                    ? "pointer-events-none grayscale opacity-50 animate-pulse"
                    : ""
                }`}
              >
                <div className="relative w-full md:w-44 shrink-0 aspect-video bg-primary/10 overflow-hidden rounded">
                  {s?.thumbnail ? (
                    <Image
                      fill
                      sizes="200px"
                      alt="Thumbnail"
                      src={s.thumbnail}
                      className={`object-cover ${
                        deletingId === s._id ? "grayscale" : ""
                      }`}
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

                <div className="grow">
                  <div className="flex items-center gap-2 text-[10px] text-primary uppercase tracking-widest mb-1">
                    <Clock size={10} />
                    {moment
                      .utc(s?.createdAt)
                      .tz(moment.tz.guess())
                      .format("DD MMM, YYYY hh:mma")}
                  </div>
                  <h4 className="text-lg font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2 text-foreground">
                    {s?.title || "Untitled"}
                  </h4>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <Link
                    href={`/youtube-video-summary?link=${encodeURIComponent(
                      s?.link
                    )}&lang=${s?.language}`}
                    className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest border border-foreground px-4 py-2 hover:bg-foreground hover:text-background transition-all grow md:grow-0 text-foreground"
                  >
                    Open <ArrowUpRight size={14} />
                  </Link>
                  <button
                    onClick={() =>
                      confirm("Delete permanently?") &&
                      handleDelete(s?.link, s._id)
                    }
                    disabled={deletingId}
                    className="p-2 text-primary hover:text-red-500 transition-colors cursor-pointer disabled:grayscale disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div ref={ref} className="w-full py-12 flex justify-center">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-3 text-primary">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Loading older summaries
              </span>
            </div>
          ) : hasNextPage ? (
            <div className="h-1" />
          ) : summaries.length > 0 ? (
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-50">
              End of History
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default History;
