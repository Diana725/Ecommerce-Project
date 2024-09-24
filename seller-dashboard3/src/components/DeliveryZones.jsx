import React, { useState, useEffect } from "react";

const DeliveryZones = () => {
  const [zones, setZones] = useState([]);
  const [newZone, setNewZone] = useState({
    zone_name: "",
    min_distance: "",
    max_distance: "",
    delivery_fee: "",
    latitude: null,
    longitude: null,
  });

  // Fetch existing zones from API
  useEffect(() => {
    fetch("http://localhost:8000/api/farmer/delivery-zones", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setZones(data))
      .catch((error) => console.error("Error fetching zones:", error));
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewZone({ ...newZone, [name]: value });
  };

  // Fetch latitude and longitude from Nominatim API
  const fetchLocationCoordinates = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          location
        )}&format=json`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0]; // Get the first result
        setNewZone((prev) => ({ ...prev, latitude: lat, longitude: lon }));
      } else {
        alert("Location not found. Please enter a valid location.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Handle form submission to add a new zone
  const handleSubmit = (e) => {
    e.preventDefault();

    // First, fetch latitude and longitude before posting the data
    fetchLocationCoordinates(newZone.zone_name).then(() => {
      fetch("http://localhost:8000/api/farmer/delivery-zones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newZone),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.id) {
            alert("Delivery zone added successfully!");
            setZones((prevZones) => [...prevZones, data]);
            setNewZone({
              zone_name: "",
              min_distance: "",
              max_distance: "",
              delivery_fee: "",
              latitude: null,
              longitude: null,
            });
          } else {
            alert("Error: Zone could not be added.");
          }
        })
        .catch((error) => console.error("Error adding zone:", error));
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Delivery Zones</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <label>Enter Your Location (e.g., Nairobi County)</label>
          <input
            type="text"
            className="form-control"
            name="zone_name"
            value={newZone.zone_name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Min Distance You Are Willing To Deliver (km)</label>
          <input
            type="number"
            className="form-control"
            name="min_distance"
            value={newZone.min_distance}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Max Distance You Are Willing To Deliver (km)</label>
          <input
            type="number"
            className="form-control"
            name="max_distance"
            value={newZone.max_distance}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Delivery Fee (Kshs)</label>
          <input
            type="number"
            className="form-control"
            name="delivery_fee"
            value={newZone.delivery_fee}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Zone
        </button>
      </form>

      <h3>Existing Delivery Zones</h3>
      <ul className="list-group">
        {zones.map((zone) => (
          <li key={zone.id} className="list-group-item">
            {zone.zone_name} | {zone.min_distance} km - {zone.max_distance} km |
            Fee: Kshs {zone.delivery_fee}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryZones;
