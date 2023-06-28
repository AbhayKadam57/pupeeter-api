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

    await page.goto("https://groww.in/indices");
    const title = await page.title();

    console.log(title);

    const indicesLogo = await page.$$eval(
      ".valign-wrapper .lazyload-wrapper .companyLogo_companyImage__bT0On",
      (e) => e.map((ele) => ele.src)
    );

    const indicesName = await page.$$eval(
      ".AllIndicesDataTableBodyRow_name__ESNse .valign-wrapper",
      (e) => e.map((e) => e.innerText)
    );

    const indicesLastTraded = await page.$$eval("td:nth-child(2)", (e) =>
      e.map((e) => e.innerText)
    );

    const indicesdayChange = await page.$$eval("td:nth-child(3) .fs14", (e) =>
      e.map((e) => e.innerText.split("(")[0])
    );

    console.log(indicesdayChange);

    const indicesdayChangePer = await page.$$eval(
      "td:nth-child(3) .fs14",
      (e) => e.map((e) => e.innerText.split("(")[1].split(")")[0])
    );

    console.log(indicesdayChangePer);

    const indicesHigh = await page.$$eval("td:nth-child(4)", (e) =>
      e.map((e) => e.innerText)
    );

    const indicesLow = await page.$$eval("td:nth-child(5)", (e) =>
      e.map((e) => e.innerText)
    );

    const indicesOpen = await page.$$eval("td:nth-child(6)", (e) =>
      e.map((e) => e.innerText)
    );

    const indicesPrevClose = await page.$$eval("td:nth-child(7)", (e) =>
      e.map((e) => e.innerText)
    );

    const indian_indices = [];

    for (let i = 0; i < indicesName.length; i++) {
      indian_indices.push({
        logo: indicesLogo[i],
        name: indicesName[i],
        last_price: indicesLastTraded[i],
        day_chg: indicesdayChange[i],
        per_chg: indicesdayChangePer[i],
        high: indicesHigh[i],
        low: indicesLow[i],
        open: indicesOpen[i],
        pre_close: indicesPrevClose[i],
      });
    }

    // const cookies = await page.cookies();
    // cookies.forEach(page.deleteCookie);

    await browser.close();

    res.status(200).json(indian_indices);
  } catch (e) {
    res.send("Something went wrong");
  }
};

module.exports = {
  scrapeLogic,
};
