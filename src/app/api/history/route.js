import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import { History } from "@/models/history.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { title, link, thumbnail, language, transcript, summary } =
      await req.json();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({
        ok: false,
        message: "Could not authenticate user, please login again",
      });
    }

    await connectDB();

    const result = await History.create({
      title,
      link,
      thumbnail,
      language,
      transcript,
      summary,
      user: session?.user?.id,
    });

    if (result) {
      return NextResponse.json({
        ok: true,
        message: "Successfully added to history",
        data: result,
      });
    } else {
      console.log(result);
      return NextResponse.json({
        ok: false,
        message: "Failed to insert document",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      message: error?.message,
      error,
    });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link");
    const language = searchParams.get("lang");

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          ok: false,
          message: "Authentication failed, please login",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const result = await History.find({
      user: session?.user?.id,
      ...(link ? { link } : {}),
      ...(language ? { language } : {}),
    });

    return NextResponse.json({
      ok: true,
      message: "History fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      message: error?.message,
      error,
    });
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link");

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          ok: false,
          message: "Authentication failed, please login",
        },
        { status: 401 }
      );
    }

    if (!link) {
      return NextResponse.json({
        ok: false,
        message: "Video link is required",
      });
    }

    await connectDB();

    const result = await History.deleteOne({
      link,
      user: session?.user?.id,
    });

    if (result?.deletedCount > 0) {
      return NextResponse.json({
        ok: true,
        message: "Successfully deleted from history",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Failed to delete from history",
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      ok: false,
      message: error?.message,
      error,
    });
  }
}
