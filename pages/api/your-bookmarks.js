import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  // res.setHeader("Cache-Control", "s-maxage=1", "stale-while-revalidate");
  let token;
  let decoded;
  try {
    token = req.headers["x-access-token"];
    decoded = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);
  } catch (err) {
    return res.json({ status: "error", error: "Invalid token." });
  }

  let lastTimestamp;
  try {
    lastTimestamp = req.query.lastTimestamp;
  } catch (err) {
    return res.json({
      status: "error",
      error: "Unable to retrieve last timestamp.",
    });
  }

  const limit = 36;

  let bookmarks;
  try {
    bookmarks = await Bookmark.find({
      username: decoded.username,
      timestamp: { $lt: lastTimestamp },
    })
      .limit(limit)
      .sort({ timestamp: -1 });
  } catch (err) {
    return res.json({
      status: "error",
      error: "Unable to retrieve bookmarks.",
    });
  }

  const new_lastTimestamp = bookmarks?.at(bookmarks.length - 1)?.timestamp;

  return res.json({
    status: "ok",
    bookmarks: bookmarks,
    new_lastTimestamp:
      new_lastTimestamp == undefined ? 9999 : new_lastTimestamp,
  });
};

export default connectDB(handler);
