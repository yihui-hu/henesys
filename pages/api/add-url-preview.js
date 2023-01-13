import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-extra";
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
const reachableUrl = require("reachable-url");
const jwt = require("jsonwebtoken");

puppeteer.use(AdblockerPlugin({blockTrackers: true}))

const handler = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=86400');

  try {
    const token = req.headers["x-access-token"];
    jwt.verify(token, process.env.FO_JWT_SECRET_KEY);

    let { url } = req.body;

    if (!reachableUrl.isReachable(await reachableUrl(url))) {
      return res.json({
        status: "error",
        error: "Unable to reach website. Please try again later.",
      });
    }

    let browser;
    try {
      browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        executablePath: await chromium.executablePath,
        ignoreHTTPSErrors: true,
      });
    } catch (err) {
      return res.json({
        status: "error",
        error: "Unable to load website. Please try again later.",
      });
    }

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
    );
    await page.goto(url, { waitUntil: "domcontentloaded" });

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

      let metadata = {
        title: title == undefined ? null : title,
        description: description == undefined ? null : description,
        image_base64: image_base64,
      };

      browser.close();

      return res.json({ status: "ok", metadata: metadata });
    } catch (err) {
      return res.json({ status: "error", error: "Error saving url." });
    }
  } catch (err) {
    return res.json({
      status: "error",
      error:
        "Unable to retrieve screenshot of website. Please try again later.",
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

export default handler;
