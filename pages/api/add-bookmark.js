import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.FO_AWS_ACCESS_KEY,
  secretAccessKey: process.env.FO_AWS_SECRET,
  region: process.env.FO_S3_REGION,
});

const handler = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded_token = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    let { file, text, url, metadata, note, tags } = req.body;

    if (file != null) {
      const params = {
        Bucket: "field-observer",
        Key: file.fileName + "_" + Date.now(),
        Body: Buffer.from(file.fileBuffer, "base64"),
        ContentEncoding: "base64",
        ContentType: file.fileType,
        ACL: "public-read",
      };

      try {
        const { Location } = await s3.upload(params).promise();
        file = Location;
      } catch (err) {
        return res.json({
          status: "error",
          error: "Unable to add bookmark. Please try again later.",
        });
      }
    }

    const bookmark = {
      username: decoded_token.username,
      file: file,
      text: text,
      url: url,
      metadata: metadata,
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
      error: "Unable to add bookmark. Please try again later.",
    });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};

export default connectDB(handler);
