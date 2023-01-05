import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const aws = require("aws-sdk");
const jwt = require("jsonwebtoken");

const s3 = new aws.S3({
  accessKeyId: process.env.FO_AWS_ACCESS_KEY,
  secretAccessKey: process.env.FO_AWS_SECRET,
  region: process.env.FO_S3_REGION,
});

const handler = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    let { url, metadata, title, note, tags } = req.body;

    const params = {
      Bucket: "field-observer",
      Key: url + "_" + Date.now(),
      Body: Buffer.from(metadata.image_base64, "base64"),
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
      ACL: "public-read",
    };

    let preview_image_url;
    try {
      const { Location } = await s3.upload(params).promise();
      preview_image_url = Location;
    } catch (err) {
      console.log(err);
    }

    let new_metadata = {
      title: metadata.title,
      description: metadata.description,
      preview_image_url: preview_image_url == undefined ? null : preview_image_url,
    };

    const bookmark = {
      username: decoded.username,
      file: null,
      text: null,
      url: url,
      metadata: new_metadata,
      title: title != "" ? title : metadata.title ? metadata.title : url,
      note: note,
      tags: tags,
      private: false,
      timestamp: Date.now(),
    };

    await Bookmark.create(bookmark);
    return res.json({ status: "ok", bookmark: bookmark });
  } catch (err) {
    return res.json({
      status: "error",
      error: "Unable to add bookmark. Please try again later."
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
