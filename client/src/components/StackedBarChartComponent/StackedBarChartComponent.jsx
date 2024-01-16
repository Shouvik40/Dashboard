import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./StackedBarChartComponent.css";

const StackedBarChartComponent = ({ data, selectedCountry }) => {
  const svgRef = useRef();

  useEffect(() => {
    const nonEmptyData = data.filter((item) => item.intensity !== 0);
    const filteredData = selectedCountry ? nonEmptyData.filter((item) => item.country === selectedCountry) : nonEmptyData;

    const sectors = [...new Set(filteredData.map((item) => item.sector))].filter((sector) => sector.trim().length > 0);
    const topics = [...new Set(filteredData.map((item) => item.topic))].filter((topic) => topic.trim().length > 0);

    const stackedChartData = sectors.map((sector) => {
      const entry = { sector };
      topics.forEach((topic) => {
        const matchingData = filteredData.find((item) => item.topic === topic && item.sector === sector);
        entry[topic] = matchingData ? matchingData.intensity : 0;
      });
      return entry;
    });

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 60, left: 40 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    const xScale = d3
      .scaleBand()
      .domain(sectors)
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(stackedChartData, (d) => d3.sum(topics, (topic) => d[topic]))])
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3.scaleOrdinal().domain(topics).range(d3.schemeCategory10);

    const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    svg
      .selectAll("g")
      .data(d3.stack().keys(topics)(stackedChartData))
      .enter()
      .append("g")
      .attr("fill", (d) => colorScale(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.data.sector))
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .on("mouseover", (event, d) => {
        const sectorName = d.data.sector;
        const topicName = d3.select(event.target.parentNode).datum().key;

        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`${topicName}: ${d.data[topicName]}<br/>Sector: ${sectorName}`)
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");

        d3.selectAll(".x-axis-text").classed("highlighted", (textData) => textData === sectorName || textData === topicName);
      })
      .on("mouseout", () => {
        tooltip.transition().duration(500).style("opacity", 0);
        d3.selectAll(".x-axis-text").classed("highlighted", false);
      });

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .selectAll("text")
      .attr("class", "x-axis-text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").attr("transform", `translate(${margin.left}, 0)`).call(d3.axisLeft(yScale));

    const legend = svg
      .selectAll(".legend")
      .data(topics)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend
      .append("rect")
      .attr("x", width - margin.right)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d) => colorScale(d));

    legend
      .append("text")
      .attr("x", width - margin.right + 25)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d) => d);
  }, [data, selectedCountry]);

  return (
    <div>
      <h2>Topics by Sector -{selectedCountry.toUpperCase() || "ALL COUNTRIES"}</h2>
      <svg ref={svgRef} width={1000} height={500}></svg>
    </div>
  );
};

export default StackedBarChartComponent;
