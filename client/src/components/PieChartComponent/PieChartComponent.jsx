import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "./PieChartComponent.css";

const PieComponent = ({ data, selectedCountry }) => {
  const [topicsData, setTopicsData] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    if (selectedCountry) {
      const countryData = data.filter((item) => item.country === selectedCountry);

      const filteredCountryData = countryData.filter((item) => item.topic.trim().length > 0);

      const topicsCount = filteredCountryData.reduce((acc, item) => {
        acc[item.topic] = (acc[item.topic] || 0) + 1;
        return acc;
      }, {});

      const totalTopics = Object.values(topicsCount).reduce((sum, count) => sum + count, 0);
      const topicsPercentage = Object.entries(topicsCount).map(([topic, count]) => ({
        topic,
        percentage: (count / totalTopics) * 100,
      }));

      setTopicsData(topicsPercentage);
    } else {
      const topicsCount = data.reduce((acc, item) => {
        if (item.topic.trim().length > 0) {
          acc[item.topic] = (acc[item.topic] || 0) + 1;
        }
        return acc;
      }, {});

      const totalTopics = Object.values(topicsCount).reduce((sum, count) => sum + count, 0);
      const topicsPercentage = Object.entries(topicsCount).map(([topic, count]) => ({
        topic,
        percentage: (count / totalTopics) * 100,
      }));

      setTopicsData(topicsPercentage);
    }
  }, [data, selectedCountry]);

  useEffect(() => {
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal().range(["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"]);

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    const pie = d3.pie().value((d) => d.percentage);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const pieData = pie(topicsData);

    const tooltip = d3.select("body").append("div").attr("class", "tooltip");

    const paths = svg.selectAll("path").data(pieData);

    paths
      .enter()
      .append("path")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.topic))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px")
      .attr("opacity", 0)
      .on("mouseover", (event, d) => {
        tooltip.transition().duration(200).style("opacity", 0.9);

        const tooltipContent = `<strong>${d.data.topic}</strong><br/>Percentage: ${d.data.percentage.toFixed(2)}%`;

        tooltip
          .html(tooltipContent)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .merge(paths)
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
          return arc(interpolate(t));
        };
      })
      .attr("opacity", 1);

    paths.exit().remove();
  }, [topicsData]);

  return (
    <div className="chart-container">
      <h2>Topics - {selectedCountry.toUpperCase() || "ALL COUNTRIES"}</h2>
      <svg ref={svgRef} className="chart"></svg>
    </div>
  );
};

export default PieComponent;
