import mongoose from "mongoose";

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  mongoose.set("strictQuery", false);
  mongoose.connect(process.env.FO_DATABASE_URL);
  
  return handler(req, res);
};

export default connectDB;
