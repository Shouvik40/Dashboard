import React, { useState, useEffect } from "react";
import axios from "axios";

// import FiltersComponent from "./components/FiltersComponent";

import PayoutsComponent from "./components/Payouts/PayoutsComponent";
import "./App.css";
function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/insights");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="App">
      <h1 style={{ fontWeight: "bold" }}>Visualization Dashboard</h1>
      {/* <FiltersComponent data={data} setData={setData} /> */}
      <PayoutsComponent />
    </div>
  );
}

export default App;
