import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const LOCAL_CHROME_EXECUTABLE =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const handler = async (req, res) => {
  try {
    let { url } = req.body;

    const executablePath =
      (await chromium.executablePath) || LOCAL_CHROME_EXECUTABLE;

    const browser = await puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

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

      let metadata = {
        title: title == undefined ? null : title,
        description: description == undefined ? null : description,
        image_base64: image_base64,
      };

      return res.json({ status: "ok", metadata: metadata });
    } catch (err) {
      return res.json({ status: "error", error: "Error saving url." });
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
