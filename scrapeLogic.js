const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  try {
    const browser = await puppeteer.launch({
      args: [
        "--disable-setuid-sandbox",
        "--no-sandbox",
        "--single-process",
        "--no-zygote",
      ],
      executablePath:
        process.env.NODE_ENV === "production"
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    });
    const page = await browser.newPage();

    await page.goto("https://www.youtube.com/");

    const title = await page.title();

    res.send(title);
  } catch (e) {
    res.send("Something went wrong");
  } finally {
    await browser.close();
  }
};

module.exports = {
  scrapeLogic,
};
