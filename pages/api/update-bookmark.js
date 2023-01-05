import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    const { timestamp, username, title, note, tags } = req.body;

    const bookmark = await Bookmark.findOneAndUpdate(
      { timestamp: timestamp, username: username },
      { title: title, note: note, tags: tags }
    );

    return res.json({ status: "ok", bookmark: bookmark });
  } catch (err) {
    return res.json({
      status: "error",
      error: "Unable to edit bookmark. Please try again later.",
    });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4.5mb",
    },
  },
};

export default connectDB(handler);
