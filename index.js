const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const { AllTopstocks } = require("./AllTopstocks");
const { AllSectorData } = require("./AllSectorData");
const { Get52WeekData } = require("./Get52WeekData");
const PORT = process.env.PORT || 3000;
const app = express();

app.get("/allindices", (req, res) => {
  scrapeLogic(res);
});

app.get("/alltopstock", (req, res) => {
  AllTopstocks(req, res);
});

app.get("/", (req, res) => {
  res.send("Render and puppeetr sever is up and running");
});

app.get("/sector-wise-data", (req, res) => {
  AllSectorData(req, res);
});

app.get("/stock-details", (req, res) => {
  Get52WeekData(req, res);
});

app.listen(PORT, () => {
  console.log(`Listening at PORT ${PORT}`);
});
