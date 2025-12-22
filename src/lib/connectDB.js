import mongoose from "mongoose";

const connection = {};

export default async function connectDB() {
  if (connection?.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db?.connections?.[0]?.readyState;

    console.log("DB connected successfully");
  } catch (error) {
    console.error("Database connection failed", error);
    process.exit(1);
  }
}
