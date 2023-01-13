import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  // res.setHeader("Cache-Control", "s-maxage=1", "stale-while-revalidate");

  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    const lastTimestamp = req.query.lastTimestamp;
    const limit = 36;

    const bookmarks = await Bookmark.find({
      username: decoded.username,
      timestamp: { $lt: lastTimestamp },
    })
      .limit(limit)
      .sort({ timestamp: -1 });

    let new_lastTimestamp = 9999;
    try {
      new_lastTimestamp = bookmarks?.at(bookmarks.length - 1)?.timestamp;
    } catch (err) {
      console.log("Error retrieving new lastTimestamp.");
    }

    return res.json({
      status: "ok",
      bookmarks: bookmarks,
      new_lastTimestamp: new_lastTimestamp,
    });
  } catch (err) {
    return res.json({ status: "error", error: err });
  }
};

export default connectDB(handler);
