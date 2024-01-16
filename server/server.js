const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Insight = require("./models");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
mongoose.connect("mongodb://localhost:27017/energy_insights", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/api/insights", async (req, res) => {
  try {
    let filters = {};

    if (req.query.endYear) filters.end_year = req.query.endYear;
    if (req.query.topics) filters.topic = { $in: req.query.topics.split(",") };
    if (req.query.sector) filters.sector = req.query.sector;
    if (req.query.region) filters.region = req.query.region;
    if (req.query.pestle) filters.pestle = req.query.pestle;
    if (req.query.source) filters.source = req.query.source;

    const insights = await Insight.find(filters);
    res.json(insights);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/filters", async (req, res) => {
  try {
    const uniqueFilters = {};

    uniqueFilters.endYears = await Insight.distinct("end_year");
    uniqueFilters.topics = await Insight.distinct("topic");
    uniqueFilters.sectors = await Insight.distinct("sector");
    uniqueFilters.regions = await Insight.distinct("region");
    uniqueFilters.pestles = await Insight.distinct("pestle");
    uniqueFilters.sources = await Insight.distinct("source");

    res.json(uniqueFilters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
