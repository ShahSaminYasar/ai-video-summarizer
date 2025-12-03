import { NextResponse } from "next/server";
import { YoutubeTranscript } from "@danielxceron/youtube-transcript";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link");

    const result = await YoutubeTranscript.fetchTranscript(link);

    return NextResponse.json({
      ok: true,
      data: result,
      text: result?.map((t) => t?.text)?.join(" "),
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
