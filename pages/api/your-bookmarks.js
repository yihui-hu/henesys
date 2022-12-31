import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  const token = req.headers["x-access-token"];
  const { lastTimestamp } = req.body;
  const limit = lastTimestamp == 9999 ? 47 : 48;

  try {
    const decoded = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
    const username = decoded.username;
    const bookmarks = await Bookmark.find({
      username: username,
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
