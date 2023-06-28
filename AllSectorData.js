const puppeteer = require("puppeteer");
require("dotenv").config();

const AllSectorData = async (req, res) => {
  const sector = req.query.sector;
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    headless: "new",
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();

    await page.goto(
      `https://www.moneycontrol.com/india/stockmarket/sector-classification/marketstatistics/nse/${sector}`
    );
    const title = await page.title();

    const category = await page.evaluate(() => {
      const rows = document.querySelectorAll(".tbldata14 tbody tr");

      const data = [];

      rows.forEach((c, id) => {
        const company_name = c.querySelector(
          "td:nth-child(1) .bl_12 b"
        )?.innerText;

        const link = c.querySelector("td:nth-child(1) .bl_12")?.href;

        console.log(link);

        const industry = c.querySelector("td:nth-child(2) .bl_12")?.innerText;

        const last_price = c.querySelector("td:nth-child(3)")?.innerText;

        const change = c.querySelector("td:nth-child(4)")?.innerText;

        const per_chg = c.querySelector("td:nth-child(5)")?.innerText;

        const mark_cap = c.querySelector("td:nth-child(6)")?.innerText;

        data.push({
          company_name,
          industry,
          last_price,
          change,
          per_chg,
          mark_cap,
          link,
        });
      });

      return data;
    });
    // console.log(title);

    res.status(200).json(category);
    // const cookies = await page.cookies();
    // cookies.forEach(page.deleteCookie);
  } catch (e) {
    res.send("Something went wrong");
  } finally {
    await browser.close();
  }
};

module.exports = {
  AllSectorData,
};
