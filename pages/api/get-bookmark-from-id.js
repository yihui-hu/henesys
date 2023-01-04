import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";

const handler = async (req, res) => {
  try {
    const { id } = req.body;

    const bookmark = await Bookmark.findById(id);

    if (bookmark.private) {
      return res.json({
        status: "error",
        error: "This is a private bookmark.",
      });
    }

    console.log(bookmark);

    return res.json({ status: "ok", bookmark: bookmark });
  } catch (err) {
    return res.json({ status: "error", error: "Unable to retrieve bookmark." });
  }
};

export default connectDB(handler);
