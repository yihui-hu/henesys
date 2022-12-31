import mongoose from "mongoose";

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  // Use new db connection
  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.DATABASE_URL);
  
  return handler(req, res);
};

export default connectDB;
