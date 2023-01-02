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

    let { file, note, tags } = req.body;

    const fileName = file.fileName;
    const fileBuffer = file.fileBuffer;
    const fileType = file.fileType;
    const fileSize = file.fileSize;

    const params = {
      Bucket: "field-observer",
      Key: fileName + "_" + Date.now(),
      Body: Buffer.from(fileBuffer, "base64"),
      ContentEncoding: "base64",
      ContentType: fileType,
      ACL: "public-read",
    };

    try {
      const { Location } = await s3.upload(params).promise();
      file = Location;
    } catch (err) {
      return res.json({
        status: "error",
        error: "Issue uploading file. Please try again later",
      });
    }

    const bookmark = {
      username: decoded.username,
      file: file,
      text: null,
      url: null,
      metadata: {
        fileName,
        fileType,
        fileSize,
      },
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
      sizeLimit: "4.5mb",
    },
  },
};

export default connectDB(handler);
