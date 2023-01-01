import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'
const reachableUrl = require("reachable-url");

const handler = async (req, res) => {
  try {
    let { url } = req.body;

    if (reachableUrl.isReachable(await reachableUrl(url))) {
      const browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      })

      const page = await browser.newPage();
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
