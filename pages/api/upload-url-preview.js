import edgeChromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'
const reachableUrl = require("reachable-url");

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
          title: null,
          description: null,
          image_base64: image_base64,
        };

        return res.json({ status: "ok", metadata: "ok" });
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
      sizeLimit: "4.5mb",
    },
  },
};

export default handler;
