import edgeChromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'
const aws = require("aws-sdk");
const reachableUrl = require("reachable-url");

const s3 = new aws.S3({
  accessKeyId: process.env.FO_AWS_ACCESS_KEY,
  secretAccessKey: process.env.FO_AWS_SECRET,
  region: process.env.FO_S3_REGION,
});

const LOCAL_CHROME_EXECUTABLE = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const handler = async (req, res) => {
  try {
    let { url } = req.body;

    if (reachableUrl.isReachable(await reachableUrl(url))) {
      const executablePath = await edgeChromium.executablePath || LOCAL_CHROME_EXECUTABLE

      const browser = await puppeteer.launch({
        executablePath,
        args: edgeChromium.args,
        headless: false,
      })

      const page = await browser.newPage();
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

        let preview_image_url;

        try {
          const { Location } = await s3.upload(params).promise();
          preview_image_url = Location;
        } catch (err) {
          console.log(err);
        }

        let metadata = {
          title: title == undefined ? null : title,
          description: description == undefined ? null : description,
          preview_image_url: preview_image_url == undefined ? null : preview_image_url,
        };

        return res.json({ status: "ok", metadata: metadata });
      } catch (err) {
        return res.json({ status: "error", error: "Error saving url." });
      }
    }

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

export default handler;
