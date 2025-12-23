"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const RedirectFromSeed = () => {
  useEffect(() => {
    return redirect("/");
  });
  return <div>Redirecting...</div>;
};
export default RedirectFromSeed;

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";

// const Seed = () => {
//   const [status, setStatus] = useState("Not started yet");
//   const [data, setData] = useState(null);

//   const initiatedRef = useRef();

//   useEffect(() => {
//     const seed = async () => {
//       try {
//         setStatus("Reading local storage...");
//         const localData = JSON.parse(localStorage.getItem("summaries")) || [];

//         if (localData.length === 0) {
//           setStatus("No local data found to sync.");
//           return;
//         }

//         setStatus(`Found ${localData.length} items. Starting sync...`);

//         // 2. Execute all and wait for completion
//         const results = [];
//         for (let i = 0; i < localData.length; i++) {
//           const item = localData[i];
//           setStatus(`Syncing ${i + 1} of ${localData.length}...`);
//           try {
//             const res = await axios.post("/api/history", {
//               title: item.title,
//               link: item.video,
//               thumbnail: item.thumbnail,
//               language: item.language,
//               transcript: JSON.stringify(item.transcript),
//               summary: item.summary,
//             });
//             results.push({ status: "fulfilled", value: res.data });
//           } catch (err) {
//             results.push({ status: "rejected", reason: err });
//           }
//         }

//         // 3. Summarize results
//         const successCount = results.filter(
//           (r) => r.status === "fulfilled"
//         ).length;
//         const failCount = results.filter((r) => r.status === "rejected").length;

//         setData({
//           total: localData.length,
//           successful: successCount,
//           failed: failCount,
//           details: results.map((r) =>
//             r.status === "rejected" ? r.reason.message : "Success"
//           ),
//         });

//         setStatus(`Process complete. Synced ${successCount} items.`);
//       } catch (error) {
//         console.error("Sync error:", error);
//         setStatus("A critical error occurred.");
//       }
//     };

//     if (initiatedRef?.current) return;
//     initiatedRef.current = true;
//     seed();
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col py-36 items-center justify-center bg-background">
//       <div className="text-center mb-8">
//         <h1 className="text-xl font-bold mb-2 text-white">Database Seeder</h1>
//         <p className="text-sm font-space text-muted-foreground font-medium">
//           Status: <span className="text-blue-400">{status}</span>
//         </p>
//       </div>

//       <pre className="w-full max-w-5xl h-[50vh] mx-auto overflow-auto bg-black text-green-400 text-xs p-6 border border-zinc-800 rounded-lg shadow-xl">
//         {data ? JSON.stringify(data, null, 2) : "// Awaiting data..."}
//       </pre>
//     </div>
//   );
// };

// export default Seed;
