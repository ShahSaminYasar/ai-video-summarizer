import { NextResponse } from "next/server";
import { YoutubeTranscript } from "@danielxceron/youtube-transcript";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link");

    // const result = await YoutubeTranscript.fetchTranscript(link);

    const response = await fetch(
      `https://transcriptapi.com/api/v2/youtube/transcript?video_url=${link}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TRANSCRIPT_API_KEY}`,
        },
      }
    );

    const result = await response.json();

    return NextResponse.json({
      ok: true,
      data: result?.transcript,
      text: result?.transcript?.map((t) => t?.text)?.join(" "),
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({
      ok: false,
      message: error?.message || "Unknown Error",
      error,
    });
  }
}
