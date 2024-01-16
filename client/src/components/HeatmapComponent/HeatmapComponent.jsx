import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

const HeatmapComponent = ({ data, selectedCountry, selectedTopic }) => {
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const filteredData = data.filter((item) => {
      const countryMatch = selectedCountry === "" || item.country === selectedCountry;
      const topicMatch = selectedTopic === "" || item.topic === selectedTopic;

      return countryMatch && topicMatch;
    });

    const uniqueCountries = [...new Set(filteredData.map((item) => item.country))];
    const uniqueTopics = [...new Set(filteredData.map((item) => item.topic))];

    const heatmapValues = uniqueCountries.map((country) => {
      const values = uniqueTopics.map((topic) => {
        const matchingData = filteredData.find((item) => item.country === country && item.topic === topic);
        const intensity = matchingData ? matchingData.intensity : 0;
        return intensity;
      });

      return {
        z: [values],
        x: [country],
        y: uniqueTopics,
        type: "heatmap",
        colorscale: "Viridis",
      };
    });

    setHeatmapData(heatmapValues);
  }, [data, selectedCountry, selectedTopic]);

  return (
    <div>
      <h2>Heatmap</h2>
      <Plot data={heatmapData} layout={{ width: 1200, height: 600, title: "Intensity Matrix" }} />
    </div>
  );
};

export default HeatmapComponent;
