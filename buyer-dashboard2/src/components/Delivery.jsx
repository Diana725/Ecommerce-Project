import React, { useState, useEffect } from "react";

const DeliveryFeeCalculator = ({ farmerId, onFeeCalculated }) => {
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [error, setError] = useState(null);

  // Effect to fetch coordinates after a debounce period
  useEffect(() => {
    const handler = setTimeout(() => {
      const fetchCoordinates = async () => {
        if (address) {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                address
              )}`
            );
            const data = await response.json();

            if (data.length > 0) {
              const { lat, lon } = data[0];
              setLocation({ lat, lon });
              setError(null);
            } else {
              setError("Location not found");
              setLocation({ lat: null, lon: null });
            }
          } catch (err) {
            setError("Failed to fetch coordinates.");
          }
        }
      };

      fetchCoordinates();
    }, 500); // Debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [address]);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const calculateDeliveryFee = async () => {
    if (!location.lat || !location.lon) {
      setError("Please enter a valid address to get the coordinates.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You need to log in to calculate the delivery fee.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/buyer/calculate-delivery-fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            farmer_id: farmerId,
            buyer_lat: location.lat,
            buyer_lon: location.lon,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Error calculating delivery fee");
        return;
      }

      const data = await response.json();
      setDeliveryFee(data.delivery_fee);
      onFeeCalculated(data.delivery_fee); // Call the callback with the calculated delivery fee
      setError(null);
    } catch (err) {
      setError("Failed to calculate delivery fee.");
    }
  };

  return (
    <div>
      <h5>Calculate Delivery Fee</h5>

      <div className="form-group mx-0">
        <label>Enter your address to calculate delivery fee:</label>
        <input
          type="text"
          className="form-control"
          value={address}
          onChange={handleAddressChange}
        />
      </div>

      <button
        onClick={calculateDeliveryFee}
        className="btn btn-success mt-2"
        disabled={!location.lat || !location.lon || !address}
      >
        Calculate Delivery Fee
      </button>

      {/* {deliveryFee !== null && (
        <div>
          <h4>Delivery Fee: Kshs {deliveryFee}</h4>
        </div>
      )} */}

      {error && (
        <div className="alert alert-danger mt-3">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryFeeCalculator;
