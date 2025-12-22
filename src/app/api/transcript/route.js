import { NextResponse } from "next/server";
import { YoutubeTranscript } from "@danielxceron/youtube-transcript";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link");

    // const result = await YoutubeTranscript.fetchTranscript(link); //TODO
    // return NextResponse.json({
    //   ok: true,
    //   data: result,
    //   text: result?.map((t) => t?.text)?.join(" "),
    // });

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

    if (result?.transcript?.length > 0) {
      return NextResponse.json({
        ok: true,
        data: result?.transcript,
        text: result?.transcript?.map((t) => t?.text)?.join(" "),
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Failed to get transcript",
      });
    }
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({
      ok: false,
      message: error?.message || "Unknown Error",
      error,
    });
  }
}
