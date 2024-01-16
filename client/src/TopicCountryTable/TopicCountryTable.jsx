import React, { useEffect, useState } from "react";
import "./TopicCountryTable.css";

const TopicCountryTable = ({ data, selectedTopicOrSector }) => {
  const [tableData, setTableData] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [titles, setTitles] = useState({});
  useEffect(() => {
    let filteredData = data;

    if (selectedTopicOrSector) {
      filteredData = data.filter((item) => (item.topic === selectedTopicOrSector || item.sector === selectedTopicOrSector) && item.country !== "");
    }

    const totalOccurrences = filteredData.length;

    if (selectedTopicOrSector && totalOccurrences === 0) {
      setTableData([]);
      return;
    }

    const countryOccurrences = filteredData.reduce((acc, item) => {
      acc[item.country] = (acc[item.country] || 0) + 1;
      return acc;
    }, {});

    const percentageData = Object.entries(countryOccurrences).map(([country, occurrences]) => ({
      country,
      occurrences,
      percentageShare: (occurrences / totalOccurrences) * 100,
    }));

    const sortedTableData = percentageData.sort((a, b) => b.occurrences - a.occurrences);

    setTableData(sortedTableData);
  }, [data, selectedTopicOrSector]);

  const handleShowTitlesClick = (country) => {
    setSelectedCountry(country);

    const countryTitles = data
      .filter((item) => item.country === country && (item.topic === selectedTopicOrSector || item.sector === selectedTopicOrSector))
      .map((item) => ({ title: item.title, topic: item.topic }));

    setTitles((prevTitles) => ({
      ...prevTitles,
      [country]: countryTitles,
    }));
  };

  const handleHideTitlesClick = (country) => {
    setSelectedCountry(null);

    setTitles((prevTitles) => {
      const newTitles = { ...prevTitles };
      delete newTitles[country];
      return newTitles;
    });
  };

  return (
    <div className="topic-country-table">
      <h2>{selectedTopicOrSector.toUpperCase() || "All Sector Or Topic"} - Country Table</h2>
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Occurrences</th>
            <th>Percentage Share</th>
            <th>Actions</th>
            <th style={{ minWidth: "200px" }}>Titles</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>{row.country}</td>
              <td>{row.occurrences}</td>
              <td>{row.percentageShare.toFixed(2)}%</td>

              <td>
                {selectedCountry === row.country ? (
                  <button onClick={() => handleHideTitlesClick(row.country)}>Hide Titles</button>
                ) : (
                  <button onClick={() => handleShowTitlesClick(row.country)}>Show Titles</button>
                )}
              </td>
              <td style={{ width: "60%" }}>
                {selectedCountry === row.country && titles[row.country] && (
                  <ul>
                    {titles[row.country].map((item, index) => (
                      <li key={index}>
                        {item.title} [Topic: {item.topic}]
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopicCountryTable;
