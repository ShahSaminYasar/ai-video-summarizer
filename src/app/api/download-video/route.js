import { NextResponse } from "next/server";
import ytdl from "ytdl-core";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link");

    const info = await ytdl.getInfo(link);

    const videoFormats = ytdl.filterFormats(info?.formats, "video");
    const format = ytdl.chooseFormat(videoFormats, { quality: "highestaudio" });

    const filename = `${info?.videoDetails?.title}.${format?.container}`;

    const responseHeaders = {
      "content-Disposition": `attachment; filename="${filename}"`,
    };

    return NextResponse.json({
      ok: true,
      data: {
        format,
        responseHeaders,
        filename,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      message: error?.message || "Unknown error occured",
    });
  }
}
