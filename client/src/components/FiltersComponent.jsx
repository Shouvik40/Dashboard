import React, { useEffect, useState } from "react";
import PieChartComponent from "./PieChartComponent/PieChartComponent";
import BarChartComponent from "./BarChartComponent/BarChartComponent";
import HeatmapComponent from "./HeatmapComponent/HeatmapComponent";
import TopicCountryTable from "../TopicCountryTable/TopicCountryTable";
import StackedBarChartComponent from "./StackedBarChartComponent/StackedBarChartComponent";
import PercentageDistributionChart from "./PercentageDistributionChart/PercentageDistributionChart";
import "./FiltersComponent.css";

const FiltersComponent = ({ data, setData }) => {
  const [uniqueCountries, setUniqueCountries] = useState([]);
  const [uniqueTopics, setUniqueTopics] = useState([]);
  const [uniqueSectors, setUniqueSectors] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedSector, setSelectedSector] = useState("");

  useEffect(() => {
    const extractedCountries = [...new Set(data.map((item) => item.country))];

    const extractedTopics = [...new Set(data.filter((item) => item.country !== "").map((item) => item.topic))];
    const extractedSectors = [...new Set(data.map((item) => item.sector))];
    const sortedCountries = extractedCountries.slice().sort((a, b) => a.localeCompare(b));
    const sortedTopics = extractedTopics.slice().sort((a, b) => a.localeCompare(b));

    setUniqueCountries(sortedCountries);
    setUniqueTopics(sortedTopics);
    setUniqueSectors(extractedSectors);
  }, [data]);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleSectorChange = (event) => {
    setSelectedSector(event.target.value);
  };
  const analyzeData = () => {
    const keyStats = {};

    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        const value = item[key];

        if (!keyStats[key]) {
          keyStats[key] = { total: 0, emptyCount: 0 };
        }

        keyStats[key].total++;

        if (typeof value === "string" && value.trim().length === 0) {
          keyStats[key].emptyCount++;
        }
      });
    });

    console.log("Key Statistics:", keyStats);
  };

  useEffect(() => {
    analyzeData();
  }, [data]);

  return (
    <>
      <div className={`fc_container`}>
        <h2>Filters:</h2>

        <div>
          <h3>Country:</h3>
          <select onChange={handleCountryChange} value={selectedCountry}>
            <option value="">Select Country</option>
            {uniqueCountries
              .filter((country) => country !== "")
              .map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
          </select>
        </div>

        <div>
          <h3>Sector:</h3>
          <select onChange={handleSectorChange} value={selectedSector}>
            <option value="">Select Sector</option>
            {uniqueSectors
              .filter((sector) => sector !== "")
              .map((sector, index) => (
                <option key={index} value={sector}>
                  {sector}
                </option>
              ))}
          </select>
        </div>

        <div>
          <h3>Topic:</h3>
          <select onChange={handleTopicChange} value={selectedTopic}>
            <option value="">Select Topic</option>
            {uniqueTopics
              .filter((topic) => topic !== "")
              .map((topic, index) => (
                <option key={index} value={topic}>
                  {topic}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className={`fc_charts`}>
        <PieChartComponent data={data} selectedCountry={selectedCountry} />
        <PercentageDistributionChart data={data} selectedCountry={selectedCountry} />
        <BarChartComponent data={data} selectedCountry={selectedCountry} selectedTopic={selectedTopic} selectedSector={selectedSector} />
        <StackedBarChartComponent data={data} selectedCountry={selectedCountry} />
        <HeatmapComponent data={data} selectedCountry={selectedCountry} selectedTopic={selectedTopic} />
        <TopicCountryTable data={data} selectedTopicOrSector={selectedTopic || selectedSector} />
      </div>
    </>
  );
};

export default FiltersComponent;
