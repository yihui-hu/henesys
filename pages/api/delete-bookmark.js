import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  const token = req.headers["x-access-token"];
  const { bookmark } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
    await Bookmark.findOneAndDelete({
      username: decoded.username,
      timestamp: bookmark.timestamp,
    });
    return res.json({ status: "ok", msg: "Successfully deleted bookmark." });
  } catch (err) {
    return res.json({
      status: "error",
      error: "Error deleting bookmark. Please try again later.",
    });
  }
};

export default connectDB(handler);
