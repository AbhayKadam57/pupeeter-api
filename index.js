const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/", (req, res) => {
  res.send("Render and puppeetr sever is up and running");
});

app.listen(PORT, () => {
  console.log(`Listening at PORT ${PORT}`);
});
