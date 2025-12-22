import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    language: {
      type: String,
    },
    transcript: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const History =
  mongoose.models.History || mongoose.model("History", historySchema);
