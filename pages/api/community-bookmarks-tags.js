import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  const token = req.headers["x-access-token"];
  const { lastTimestamp, tags } = req.body;
  const limit = 48;

  try {
    jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
    const bookmarks = await Bookmark.find({
      tags: { $all: tags },
      timestamp: { $lt: lastTimestamp },
    })
      .limit(limit)
      .sort({ timestamp: -1 });
    return res.json({ status: "ok", bookmarks: bookmarks });
  } catch (err) {
    return res.json({ status: "error", error: err });
  }
};

export default connectDB(handler);
