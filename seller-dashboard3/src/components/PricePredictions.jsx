import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "./PricePrediction.css";

const PricePredictions = () => {
  const [maizeVariety, setMaizeVariety] = useState("");
  const [marketType, setMarketType] = useState("");
  const [county, setCounty] = useState("");
  const [date, setDate] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("predictionHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://api.example.com/predict-price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maizeVariety, marketType, county, date }),
      });
      const result = await response.json();
      setPrediction(result.predictedPrice);

      const newPrediction = {
        maizeVariety,
        marketType,
        county,
        date,
        predictedPrice: result.predictedPrice,
      };
      const updatedHistory = [...history, newPrediction];
      setHistory(updatedHistory);
      localStorage.setItem("predictionHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error fetching prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: history.map((item) => item.date),
    datasets: [
      {
        label: "Predicted Price (Kshs)",
        data: history.map((item) => item.predictedPrice),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (maizeVariety && marketType && county && date) {
      fetchPrediction();
    }
  };

  return (
    <div>
      <div className="price-prediction-container">
        <h1>Maize Price Prediction</h1>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="form-group">
            <label>Maize Variety</label>
            <select
              value={maizeVariety}
              onChange={(e) => setMaizeVariety(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Traditional">Traditional Maize</option>
              <option value="White">White Maize</option>
              <option value="Yellow">Yellow Maize</option>
              <option value="URI">URI Maize</option>
            </select>
          </div>

          <div className="form-group">
            <label>Market Type</label>
            <select
              value={marketType}
              onChange={(e) => setMarketType(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="Wholesale">Wholesale</option>
              <option value="Retail">Retail</option>
            </select>
          </div>

          <div className="form-group">
            <label>County</label>
            <input
              type="text"
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="predict-btn">
            {loading ? "Loading..." : "Predict Price"}
          </button>
        </form>

        {prediction && (
          <div className="prediction-result">
            <h2>Predicted Price: Kshs {prediction}</h2>
          </div>
        )}

        {history.length > 0 && (
          <div className="prediction-history">
            <h3>Prediction History</h3>
            <Line data={chartData} />

            <ul>
              {history.map((item, index) => (
                <li key={index}>
                  {item.date} - {item.maizeVariety} ({item.marketType},{" "}
                  {item.county}): Kshs {item.predictedPrice}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <br />
      <hr />
    </div>
  );
};

export default PricePredictions;
