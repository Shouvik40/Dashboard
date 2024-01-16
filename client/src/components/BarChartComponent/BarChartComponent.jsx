import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import "./BarChartComponent.css";
const BarChartComponent = ({ data }) => {
  const [topicsData, setTopicsData] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    const topicsIntensity = data.reduce((acc, item) => {
      const { topic, intensity } = item;
      if (topic && intensity !== undefined) {
        acc[topic] = (acc[topic] || 0) + intensity;
      }
      return acc;
    }, {});

    const sortedTopicsData = Object.entries(topicsIntensity).map(([topic, intensity]) => ({
      topic,
      intensity,
    }));

    sortedTopicsData.sort((a, b) => b.intensity - a.intensity);

    const top10Topics = sortedTopicsData.slice(0, 10);

    setTopicsData(top10Topics);
  }, [data]);

  useEffect(() => {
    const width = 600;
    const height = 300;

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    const xScale = d3
      .scaleBand()
      .domain(topicsData.map((d) => d.topic))
      .range([margin.left, chartWidth + margin.left])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(topicsData, (d) => d.intensity)])
      .range([chartHeight, margin.top]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g").attr("transform", `translate(0, ${chartHeight})`).call(xAxis).selectAll("text").attr("transform", "rotate(-45)").style("text-anchor", "end");

    svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(yAxis);

    svg
      .selectAll("rect")
      .data(topicsData)
      .join("rect")
      .attr("x", (d) => xScale(d.topic))
      .attr("y", (d) => yScale(d.intensity))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => chartHeight - yScale(d.intensity))
      .attr("fill", "steelblue");
  }, [topicsData]);

  return (
    <div className="chart-container">
      <h2>Top 10 Most Intensive Topics</h2>
      <svg ref={svgRef} className="chart"></svg>
    </div>
  );
};

export default BarChartComponent;
