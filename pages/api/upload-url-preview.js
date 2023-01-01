import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

const minimal_args = [
  '--autoplay-policy=user-gesture-required',
  '--disable-background-networking',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-breakpad',
  '--disable-client-side-phishing-detection',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-dev-shm-usage',
  '--disable-domain-reliability',
  '--disable-extensions',
  '--disable-features=AudioServiceOutOfProcess',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-offer-store-unmasked-wallet-cards',
  '--disable-popup-blocking',
  '--disable-print-preview',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',
  '--disable-setuid-sandbox',
  '--disable-speech-api',
  '--disable-sync',
  '--hide-scrollbars',
  '--ignore-gpu-blacklist',
  '--metrics-recording-only',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--no-pings',
  '--no-sandbox',
  '--no-zygote',
  '--password-store=basic',
  '--use-gl=swiftshader',
  '--use-mock-keychain',
];

const handler = async (req, res) => {
  try {
    let { url } = req.body;

    let browser;

    try {
      browser = await puppeteer.launch({
        args: [...minimal_args],
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } catch (err) {
      return res.json({ status: "error", error: "Unable to launch puppeteer." })
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
