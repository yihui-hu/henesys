import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    const { tags } = req.body;
    const lastTimestamp = req.query.lastTimestamp;
    const limit = 36;

    const bookmarks = await Bookmark.find({
      username: decoded.username,
      tags: { $in: tags },
      timestamp: { $lt: lastTimestamp },
    })
      .limit(limit)
      .sort({ timestamp: -1 });

    const new_lastTimestamp = bookmarks?.at(-1).timestamp;

    return res.json({
      status: "ok",
      bookmarks: bookmarks,
      new_lastTimestamp: new_lastTimestamp,
    });
  } catch (err) {
    return res.json({ status: "ok", bookmarks: [], new_lastTimestamp: 9999 });
  }
};

export default connectDB(handler);
