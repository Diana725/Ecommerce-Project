import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import "./PricePrediction.css";

const counties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa-bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Meru",
  "Migori",
  "Mombasa",
  "Muranga",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana-River",
  "Tharaka-Nithi",
  "Trans-Nzoia",
  "Turkana",
  "Uasin-Gishu",
  "Vihiga",
  "Wajir",
  "West-Pokot",
];

const PricePredictions = () => {
  const [county, setCounty] = useState("");
  const [date, setDate] = useState("");
  const [modelChoice, setModelChoice] = useState("");
  const [maizeVariety, setMaizeVariety] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(""); // New phone number state
  const [receiveUpdates, setReceiveUpdates] = useState(false); // New state for updates
  const [countyForMessages, setCountyForMessages] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("predictionHistory")) || [];
    setHistory(savedHistory);

    const fetchPreferences = async () => {
      const token = localStorage.getItem("token");
      const apiUrl = "https://www.maizeai.me/api/predictions/enable";
      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Error fetching preferences.");
        }
        const result = await response.json();
        setIsEnabled(result.prediction.is_enabled); // Assuming the response contains the `is_enabled` field
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, []);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const apiUrl = `https://8942-41-81-83-93.ngrok-free.app/predict?county=${encodeURIComponent(
        county
      )}&date=${encodeURIComponent(date)}&model_choice=${encodeURIComponent(
        modelChoice
      )}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setPrediction(result.prediction);

      const newPrediction = {
        county,
        date,
        modelChoice,
        predictedPrice: result.prediction,
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

  const submitPersonalizedUpdates = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = "https://www.maizeai.me/api/predictions";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          county: countyForMessages,
          is_enabled: isEnabled, // Send the is_enabled status
        }),
      });

      if (!response.ok) {
        throw new Error("Error submitting your preferences.");
      }

      alert("Preferences successfully submitted.");
    } catch (error) {
      console.error("Error submitting preferences:", error);
    }
  };

  const toggleNotifications = async (status) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = "https://www.maizeai.me/api/predictions/enable";
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_enabled: status, // Update the is_enabled status
        }),
      });

      if (!response.ok) {
        throw new Error("Error toggling notifications.");
      }

      // Update local state after successful toggle
      setIsEnabled(status);
      alert(`Notifications have been ${status ? "enabled" : "disabled"}.`);
    } catch (error) {
      console.error("Error toggling notifications:", error);
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
    if (county && date && modelChoice) {
      fetchPrediction();
    } else {
      alert("Please fill in all required fields.");
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
            >
              <option value="">Select</option>
              <option value="Traditional">Traditional Maize</option>
              <option value="White">White Maize</option>
              <option value="Yellow">Yellow Maize</option>
              <option value="URI">URI Maize</option>
            </select>
          </div>

          <div className="form-group">
            <label>County</label>
            <select
              value={county}
              onChange={(e) => setCounty(e.target.value)}
              required
            >
              <option value="">Select County</option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
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

          <div className="form-group">
            <label>Market Type</label>
            <select
              value={modelChoice}
              onChange={(e) => setModelChoice(e.target.value)}
              required
            >
              <option value="">Select</option>
              <option value="wholesale">Wholesale</option>
              <option value="retail">Retail</option>
            </select>
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
                  {item.date} - {item.county} ({item.modelChoice}): Kshs{" "}
                  {item.predictedPrice}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-group">
          <h3>Personalized Updates</h3>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={receiveUpdates}
                onChange={(e) => setReceiveUpdates(e.target.checked)}
                style={{ transform: "scale(1.5)", marginRight: "10px" }}
              />
              Would you like to receive updates?
            </label>
          </div>

          {receiveUpdates && (
            <>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>County (For Messages)</label>
                <select
                  className="form-control"
                  value={countyForMessages}
                  onChange={(e) => setCountyForMessages(e.target.value)}
                  required
                >
                  <option value="">Select County</option>
                  {counties.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => toggleNotifications(e.target.checked)}
                    style={{ transform: "scale(1.5)", marginRight: "10px" }}
                  />
                  Enable Receiving Updates
                </label>
              </div>

              <div className="form-group">
                <button
                  className="btn btn-primary"
                  onClick={submitPersonalizedUpdates}
                  disabled={!phoneNumber || !countyForMessages}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#28a745",
                    borderColor: "#28a745",
                    cursor:
                      phoneNumber && countyForMessages
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  Receive Maize Price Updates
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePredictions;
