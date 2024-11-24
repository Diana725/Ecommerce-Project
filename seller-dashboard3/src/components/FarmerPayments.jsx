import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const FarmerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryService, setDeliveryService] = useState("");

  const fetchPayments = async () => {
    try {
      const response = await fetch(
        "https://www.maizeai.me/api/farmer/payments",
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
    fetchPayments();
    const intervalId = setInterval(fetchPayments, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const confirmPayment = async (paymentId) => {
    try {
      const response = await fetch(
        "https://www.maizeai.me/api/farmer/payment/confirm",
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
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTrackingNumber("");
    setDeliveryService("");
  };

  const handleSubmitDeliveryDetails = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `https://www.maizeai.me/api/order-payments/${selectedPayment.id}/ship`,
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

      fetchPayments();
      handleCloseModal();
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
      <div className="row">
        {payments.map((payment) => (
          <div className="col-md-4 mb-4" key={payment.id}>
            <Card>
              <Card.Img
                variant="top"
                src={`https://www.maizeai.me/${payment.product.file_path}`} // Replace with actual image URL
                alt={payment.product.name}
              />
              <Card.Body>
                <Card.Title>{payment.product.name} Maize</Card.Title>
                <Card.Text>
                  <strong>Price:</strong> ${payment.total_price} <br />
                  <strong>Quantity:</strong> {payment.quantity} <br />
                  <strong>Buyer Phone:</strong> {payment.phone_number} <br />
                  <strong>Delivery Zone:</strong>{" "}
                  {payment.delivery_zone.zone_name} <br />
                  <strong>Delivery Location:</strong>{" "}
                  {payment.delivery_location.location_name} <br />
                  <strong>Proof of Payment:</strong>{" "}
                  {payment.proof_of_payment || "No proof uploaded"}
                </Card.Text>
                {payment.status === "Payment Pending" && (
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={() => confirmPayment(payment.id)}
                  >
                    Confirm Payment
                  </Button>
                )}
                <Button
                  variant="info"
                  onClick={() => handleShowModal(payment)}
                  disabled={
                    payment.status !== "Payment Confirmed" ||
                    payment.delivery_status === "Shipped" ||
                    payment.delivery_status === "Delivered"
                  }
                >
                  Update Delivery Details
                </Button>
                <hr />
                <strong>Tracking Number:</strong>{" "}
                {payment.tracking_number || "N/A"} <br />
                <strong>Delivery Service:</strong>{" "}
                {payment.delivery_service || "N/A"} <br />
                <strong>Delivery Status:</strong>{" "}
                {payment.delivery_status || "Not Shipped"}
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

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
