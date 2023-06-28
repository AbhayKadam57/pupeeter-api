const puppeteer = require("puppeteer");
require("dotenv").config();

const Get52WeekData = async (req, res) => {
  const filter = req.query.filter;

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

    await page.goto(`https://ticker.finology.in/market/${filter}`);
    const title = await page.title();

    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll("tr");

      const list = [];

      rows.forEach((row) => {
        const companyName = row.querySelector("td:nth-child(2)")?.innerText;

        const currentPrice = row.querySelector("td:nth-child(3)")?.innerText;

        const day_high = row.querySelector("td:nth-child(4)")?.innerText;
        list.push({ companyName, currentPrice, day_high });
      });

      return list;
    });

    await browser.close();

    res.status(200).json(data.splice(2));
  } catch (e) {
    res.send("Something went wrong");
  }
};

module.exports = {
  Get52WeekData,
};
