import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  // res.setHeader('Cache-Control', 's-maxage=1', 'stale-while-revalidate');

  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    const { lastTimestamp } = req.body;
    const limit = 36;

    const bookmarks = await Bookmark.find({
      username: { $ne: decoded.username },
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
