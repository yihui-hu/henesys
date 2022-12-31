const mongoose = require("mongoose");

const bookmark = new mongoose.Schema(
  {
    username: { type: Object, required: true },
    file: { type: Object },
    text: { type: String },
    url: { type: String },
    metadata: { type: Object },
    note: { type: String },
    tags: { type: Array },
    private: { type: Boolean },
    timestamp: { type: String }
  },
  { collection: "bookmarks" }
)

mongoose.models = {};

const Bookmark = mongoose.model("Bookmark", bookmark);

export default Bookmark