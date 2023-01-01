import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const handler = async (req, res) => {
  try {
    let { url } = req.body;

    let browser;

    try {
      browser = await puppeteer.launch({
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      });
    } catch (err) {
      return res.json({ status: "error", error: "Unable to launch puppeteer." })
    }

    const page = await browser.newPage();
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
    // );
    await page.goto(url, { waitUntil: "networkidle2" });

    try {
      const image_base64 = await page.screenshot({ encoding: "base64" });

      // let title, description;
      // try {
      //   title = await page.$eval(
      //     "head > meta[property='og:title']",
      //     (element) => element.content
      //   );
      //   description = await page.$eval(
      //     "head > meta[property='og:description']",
      //     (element) => element.content
      //   );
      // } catch (err) {
      //   console.log(err);
      // }

      let metadata = {
        title: "testing",
        description: "testing",
        image_base64: image_base64,
      };

      return res.json({ status: "ok", metadata: metadata });
    } catch (err) {
      return res.json({ status: "error", error: "Error saving url." });
    }
  } catch (err) {
    return res.json({
      status: "error",
      error: "Puppeteer ran into an issue.",
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
