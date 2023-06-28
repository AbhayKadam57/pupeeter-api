const puppeteer = require("puppeteer");

const scrapeLogic = async (res) => {
  try {
    const browser = await puppeteer.launch();
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
