const puppeteer = require("puppeteer");
require("dotenv").config();

const AllTopstocks = async (req, res) => {
  const category = req.query.category;

  //category list = top-gainers,top-losers,top-volume,52-week-high,52-week-low

  const index = req.query.index;

  //index list = GIDXNIFTY100-large,GIDXNIFTY500,GIDXNIFMDCP100-mid,GIDXNIFSMCP100-small

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

    await page.goto(`https://groww.in/markets/${category}?index=${index}`);
    const title = await page.title();

    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll(
        ".fs14.mtp438RowDiv.cur-po.pos-rel"
      );

      const rowData = [];
      rows.forEach((row) => {
        const companyName = row.querySelector(
          ".fs14.mtp438CompanyName"
        ).textContent;
        const currentPrice = row
          .querySelector(".fw500")
          .innerText.split("\n")[0];
        const per_chg = row.querySelector(".fw500").innerText.split("\n")[1];
        const previousClose = row.querySelector(
          ".tb10Td:nth-child(4)"
        ).textContent;
        const dayHigh = row.querySelector(".tb10Td:nth-child(5)").textContent;

        rowData.push({
          companyName,
          currentPrice,
          per_chg,
          previousClose,
          dayHigh,
        });
      });

      return rowData;
    });
    // const cookies = await page.cookies();
    // cookies.forEach(page.deleteCookie);
    await browser.close();
    res.status(200).json(data);
  } catch (e) {
    res.send("Something went wrong");
  }
};

module.exports = {
  AllTopstocks,
};
