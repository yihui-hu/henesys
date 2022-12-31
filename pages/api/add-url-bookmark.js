import connectDB from "../../middleware/mongodb";
import Bookmark from "../../models/bookmark.model.js";
const jwt = require("jsonwebtoken");
const reachableUrl = require("reachable-url");
const puppeteer = require("puppeteer");
const aws = require("aws-sdk");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.S3_REGION,
});

const handler = async (req, res) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // create bookmark object with relevant metadata
    let { file, text, url, metadata, note, tags } = req.body;

    if (reachableUrl.isReachable(await reachableUrl(url))) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setUserAgent(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
      );
      await page.goto(url, { waitUntil: "networkidle2" });

      try {
        const image_base64 = await page.screenshot({ encoding: "base64" });
        let title, description;

        try {
          title = await page.$eval(
            "head > meta[property='og:title']",
            (element) => element.content
          );
          description = await page.$eval(
            "head > meta[property='og:description']",
            (element) => element.content
          );
        } catch (err) {
          console.log(err);
        }

        const params = {
          Bucket: "field-observer",
          Key: url + "_" + Date.now(),
          Body: Buffer.from(image_base64, "base64"),
          ContentEncoding: "base64",
          ContentType: "image/jpeg",
          ACL: "public-read",
        };

        let preview_image_url = null;

        try {
          const { Location } = await s3.upload(params).promise();
          preview_image_url = Location;
        } catch (err) {
          console.log(err);
        }

        metadata = {
          title: title == undefined ? null : title,
          description: description == undefined ? null : description,
          preview_image_url:
            preview_image_url == undefined ? null : preview_image_url,
        };
      } catch (err) {
        console.log(err);
        return res.json({ status: "error", error: "Error saving url." });
      }
    }

    const bookmark = {
      username: decoded.username,
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
          sizeLimit: '4mb'
      }
  }
}

export default connectDB(handler);
