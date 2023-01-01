import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded_token = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
    const username = decoded_token.username;

    const { lastTimestamp, tags } = req.body;
    const limit = 36;

    const bookmarks = await Bookmark.find({
      username: { $ne: username },
      tags: { $in: tags },
      timestamp: { $lt: lastTimestamp },
    })
      .limit(limit)
      .sort({ timestamp: -1 });

    return res.json({ status: "ok", bookmarks: bookmarks });
  } catch (err) {
    return res.json({ status: "error", error: "Invalid login token." });
  }
};

export default connectDB(handler);
