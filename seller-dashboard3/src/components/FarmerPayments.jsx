import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap"; // Import Modal and Form
import { useNavigate } from "react-router-dom";

const FarmerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // State for the modal
  const [selectedPayment, setSelectedPayment] = useState(null); // State for the selected payment
  const [trackingNumber, setTrackingNumber] = useState(""); // State for tracking number
  const [deliveryService, setDeliveryService] = useState(""); // State for delivery service

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/farmer/payments",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch payments");
      }

      const paymentData = await response.json();
      setPayments(paymentData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(); // Initial fetch
    const intervalId = setInterval(fetchPayments, 15000); // Fetch payments every 15 seconds
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  const confirmPayment = async (paymentId) => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/farmer/payment/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ payment_id: paymentId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm payment");
      }

      fetchPayments();
      alert("Payment confirmed successfully!");
    } catch (err) {
      console.error("Confirmation Error:", err);
      alert(err.message);
    }
  };

  const handleShowModal = (payment) => {
    setSelectedPayment(payment); // Set the selected payment for delivery details
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTrackingNumber(""); // Reset tracking number
    setDeliveryService(""); // Reset delivery service
  };

  const handleSubmitDeliveryDetails = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/api/order-payments/${selectedPayment.id}/ship`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            tracking_number: trackingNumber,
            delivery_service: deliveryService,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update delivery status"
        );
      }

      fetchPayments(); // Refresh payments
      handleCloseModal(); // Close the modal
      alert("Delivery status updated successfully!");
    } catch (err) {
      console.error("Update Error:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h2 className="my-4">Payments</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Status(Confirm Buyer's Payment)</th>
            <th>Amount Paid</th>
            <th>Proof of Payment</th>
            <th>Product Name</th>
            <th>Delivery Zone</th>
            <th>Delivery Location</th>
            <th>Action</th>
            <th>Tracking Number</th> {/* New Column */}
            <th>Delivery Service</th> {/* New Column */}
            <th>Delivery Status</th> {/* New Column */}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>
                {payment.status}
                {payment.status === "Payment Pending" && (
                  <Button
                    className="btn-success ms-2"
                    onClick={() => confirmPayment(payment.id)}
                  >
                    Confirm Payment
                  </Button>
                )}
              </td>
              <td>{payment.total_price}</td>
              <td>{payment.proof_of_payment || "No proof uploaded"}</td>
              <td>{payment.product.name} Maize</td>
              <td>{payment.delivery_zone.zone_name}</td>
              <td>{payment.delivery_location.location_name}</td>
              <td>
                <Button
                  className="btn-info"
                  onClick={() => handleShowModal(payment)}
                  disabled={
                    payment.status !== "Payment Confirmed" ||
                    payment.delivery_status === "Shipped" ||
                    payment.delivery_status === "Delivered"
                  } // Disable button until payment is confirmed
                >
                  Update Delivery Details
                </Button>
              </td>
              <td>{payment.tracking_number || "N/A"}</td>{" "}
              {/* Display Tracking Number */}
              <td>{payment.delivery_service || "N/A"}</td>{" "}
              {/* Display Delivery Service */}
              <td>{payment.delivery_status || "Not Shipped"}</td>{" "}
              {/* Display Delivery Status */}
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
      <hr />

      {/* Modal for Delivery Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Delivery Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitDeliveryDetails}>
            <Form.Group controlId="trackingNumber">
              <Form.Label>Tracking Number</Form.Label>
              <Form.Control
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="deliveryService">
              <Form.Label>Delivery Service</Form.Label>
              <Form.Control
                type="text"
                value={deliveryService}
                onChange={(e) => setDeliveryService(e.target.value)}
                required
              />
            </Form.Group>
            <br />
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FarmerPayments;
