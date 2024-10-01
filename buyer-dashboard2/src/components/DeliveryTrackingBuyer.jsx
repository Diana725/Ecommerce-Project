import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // For accessing URL parameters
import { Table, Button } from "react-bootstrap"; // Import Bootstrap components

const DeliveryTrackingBuyer = () => {
  const { paymentId } = useParams(); // Extract paymentId from URL
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/buyer/delivery/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch delivery details");
        }

        const data = await response.json();
        setDelivery(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [paymentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h2 className="my-4">Delivery Tracking</h2>
      {delivery ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tracking Number</th>
              <th>Delivery Status</th>
              <th>Delivery Service</th>
              <th>Delivery Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{delivery.tracking_number}</td>
              <td>{delivery.status}</td>
              <td>{delivery.delivery_service}</td>
              <td>{delivery.delivered_at ? delivery.delivered_at : "N/A"}</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p>No delivery details found.</p>
      )}
    </div>
  );
};

export default DeliveryTrackingBuyer;
