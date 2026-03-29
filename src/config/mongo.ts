import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/civicDB";
    console.log("MongoDB URI starts with:", uri.substring(0, 20));
    await mongoose.connect(uri);
    console.log("MongoDB Connected successfully!");
  } catch (err) {
    console.error("MongoDB Error:", err);
    process.exit(1);
  }
};
