import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/civicDB";
    console.log("URI first 30 chars:", uri.substring(0, 30));
    console.log("URI length:", uri.length);
    await mongoose.connect(uri);
    console.log("MongoDB Connected!");
  } catch (err: any) {
    console.error("MongoDB Error:", err.message);
    // Don't exit - let server run even without DB
  }
};
