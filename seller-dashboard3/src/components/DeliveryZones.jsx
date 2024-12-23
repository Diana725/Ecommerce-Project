import React, { useState, useEffect } from "react";

const DeliveryZones = () => {
  const [zones, setZones] = useState([]);
  const [newZone, setNewZone] = useState({
    zone_name: "",
  });
  const [newLocation, setNewLocation] = useState({
    location_name: "",
    delivery_fee: "",
  });
  const [locationsMap, setLocationsMap] = useState({});
  const [addingLocationZoneId, setAddingLocationZoneId] = useState(null);
  const [addingLocationZoneName, setAddingLocationZoneName] = useState("");

  // Fetch existing zones from API
  useEffect(() => {
    fetch("https://www.maizeai.me/api/delivery-zones", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const zonesWithLocations = data.map((zone) => ({
          ...zone,
          locations: zone.locations || [],
        }));
        setZones(zonesWithLocations);
      })
      .catch((error) => console.error("Error fetching zones:", error));
  }, []);

  const fetchLocations = (zoneId) => {
    fetch(`https://www.maizeai.me/api/delivery-zones/${zoneId}/locations`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLocationsMap((prevMap) => ({
          ...prevMap,
          [zoneId]: data,
        }));
      })
      .catch((error) => console.error("Error fetching locations:", error));
  };

  const handleZoneInputChange = (e) => {
    const { name, value } = e.target;
    setNewZone({ ...newZone, [name]: value });
  };

  const handleLocationInputChange = (e) => {
    const { name, value } = e.target;
    setNewLocation({ ...newLocation, [name]: value });
  };

  const handleZoneSubmit = (e) => {
    e.preventDefault();

    fetch("https://www.maizeai.me/api/delivery-zones", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(newZone),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.id) {
          alert("Delivery zone added successfully!");
          setZones((prevZones) => [...prevZones, data]);
          setNewZone({ zone_name: "" });
        } else {
          alert("Error: Zone could not be added.");
        }
      })
      .catch((error) => console.error("Error adding zone:", error));
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();

    const locationData = {
      ...newLocation,
    };

    if (addingLocationZoneId) {
      fetch(
        `https://www.maizeai.me/api/delivery-zones/${addingLocationZoneId}/locations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(locationData),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.id) {
            alert("Location added successfully!");
            setZones((prevZones) =>
              prevZones.map((zone) =>
                zone.id === addingLocationZoneId
                  ? {
                      ...zone,
                      locations: [...(zone.locations || []), data],
                    }
                  : zone
              )
            );
            setNewLocation({ location_name: "", delivery_fee: "" });
            setAddingLocationZoneId(null);
            setAddingLocationZoneName("");
          } else {
            alert("Error: Location could not be added.");
          }
        })
        .catch((error) => {
          console.error("Error adding location:", error);
          alert("Failed to add location. Please try again.");
        });
    }
  };

  // Function to handle the removal of a delivery zone
  const handleZoneRemove = (zoneId) => {
    if (window.confirm("Are you sure you want to delete this zone?")) {
      fetch(`https://www.maizeai.me/api/delivery-zones/${zoneId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          setZones((prevZones) =>
            prevZones.filter((zone) => zone.id !== zoneId)
          );
          alert("Zone deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting zone:", error);
          alert(
            "Cannot delete this location because it is referenced in the Payment Details Table, add another delivery zone with your updated Location Name"
          );
        });
    }
  };

  // Function to handle the removal of a delivery location
  const handleLocationRemove = (zoneId, locationId) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      fetch(
        `https://www.maizeai.me/api/delivery-zones/${zoneId}/locations/${locationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          // Update state to remove the location
          setLocationsMap((prevMap) => ({
            ...prevMap,
            [zoneId]: prevMap[zoneId].filter(
              (location) => location.id !== locationId
            ),
          }));
          alert("Location deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting location:", error);
          alert(
            "Cannot delete this location because it is referenced in the Payment Details Table, add another delivery zone with your updated Location Name"
          );
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Manage Delivery Zones</h2>

      <form onSubmit={handleZoneSubmit} className="mb-4">
        <div className="form-group mb-3">
          <label>Delivery Zone Name</label>
          <input
            type="text"
            placeholder="eg. Nakuru County"
            className="form-control"
            name="zone_name"
            value={newZone.zone_name}
            onChange={handleZoneInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Zone
        </button>
      </form>

      <h3>Existing Delivery Zones</h3>
      <ul className="list-group mb-4">
        {zones.map((zone) => (
          <li key={zone.id} className="list-group-item">
            <h5>{zone.zone_name}</h5>

            <button
              className="btn btn-sm btn-secondary mb-2"
              onClick={() => {
                if (!locationsMap[zone.id]) {
                  fetchLocations(zone.id);
                }
              }}
            >
              Show Current Delivery Locations
            </button>

            <button
              className="btn btn-sm btn-primary mb-2 ms-2"
              onClick={() => {
                setAddingLocationZoneId(zone.id);
                setAddingLocationZoneName(zone.zone_name);
              }}
            >
              Add Location
            </button>

            <button
              className="btn btn-sm btn-danger mb-2 mx-2"
              onClick={() => handleZoneRemove(zone.id)}
            >
              Remove Zone
            </button>

            {locationsMap[zone.id] && locationsMap[zone.id].length > 0 && (
              <ul className="list-group mt-2">
                {locationsMap[zone.id].map((location) => (
                  <li
                    key={location.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {location.location_name} - Fee: Kshs {location.delivery_fee}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleLocationRemove(zone.id, location.id)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {addingLocationZoneId && (
        <div className="mt-4">
          <h3>Add Location to Zone: {addingLocationZoneName}</h3>
          <form onSubmit={handleLocationSubmit}>
            <div className="form-group mb-3">
              <label>Location Name</label>
              <input
                type="text"
                className="form-control"
                name="location_name"
                value={newLocation.location_name}
                onChange={handleLocationInputChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Delivery Fee</label>
              <input
                type="number"
                className="form-control"
                name="delivery_fee"
                value={newLocation.delivery_fee}
                onChange={handleLocationInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Location
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeliveryZones;
