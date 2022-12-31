import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");
const url = require("url");
const path = require("path");

const s3 = new aws.S3({
  accessKeyId: process.env.FO_AWS_ACCESS_KEY,
  secretAccessKey: process.env.FO_AWS_SECRET,
  region: process.env.FO_S3_REGION,
});

const handler = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    const { bookmark } = req.body;

    if (bookmark.metadata && bookmark.metadata.preview_image_url) {
      let filename = decodeURI(
        path.basename(bookmark.metadata.preview_image_url)
      );

      s3.deleteObject(
        { Bucket: "field-observer", Key: filename },
        (err, data) => {
          console.error(err);
          console.log(data);
        }
      );
    }

    if (bookmark.file != null) {
      let filename = decodeURI(path.basename(bookmark.file));

      s3.deleteObject(
        { Bucket: "field-observer", Key: filename },
        (err, data) => {
          console.error(err);
          console.log(data);
        }
      );
    }

    await Bookmark.findOneAndDelete({
      username: decoded.username,
      timestamp: bookmark.timestamp,
    });

    return res.json({ status: "ok", msg: "Successfully deleted bookmark." });
  } catch (err) {
    return res.json({
      status: "error",
      error: "Error deleting bookmark. Please try again later.",
    });
  }
};

export default connectDB(handler);
