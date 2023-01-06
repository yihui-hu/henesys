import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
import { getPlaiceholder } from "plaiceholder";
const aws = require("aws-sdk");
const jwt = require("jsonwebtoken");

const s3 = new aws.S3({
  accessKeyId: process.env.FO_AWS_ACCESS_KEY,
  secretAccessKey: process.env.FO_AWS_SECRET,
  region: process.env.FO_S3_REGION,
});

const mimeImageTypes = [
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/jpg",
];

const handler = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    let { file, title, note, tags } = req.body;

    const params = {
      Bucket: "field-observer",
      Key: file.fileName + "_" + Date.now(),
      Body: Buffer.from(file.fileBuffer, "base64"),
      ContentEncoding: "base64",
      ContentType: file.fileType,
      ACL: "public-read",
    };

    let file_url;
    try {
      const { Location } = await s3.upload(params).promise();
      file_url = Location;
    } catch (err) {
      return res.json({
        status: "error",
        error: "Issue uploading file. Please try again later",
      });
    }

    let blur64;
    if (mimeImageTypes.includes(file.fileType)) {
      try {
        blur64 = await getPlaiceholder(file_url).then(({ base64 }) => {
          return base64;
        });
      } catch (err) {
        return res.json({
          status: "error",
          error: "Unable to generate blur64 data.",
        });
      }
    }

    const bookmark = {
      username: decoded.username,
      file: file_url,
      text: null,
      url: null,
      metadata: {
        fileName: file.fileName,
        fileType: file.fileType,
        fileSize: file.fileSize,
        blurPreview: blur64 ? blur64 : null,
      },
      title: title != "" ? title : file.fileName,
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
