import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const CreateDelivery = () => {
  const [paymentId, setPaymentId] = useState("");
  const [deliveryService, setDeliveryService] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/farmer/delivery",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            payment_id: paymentId,
            delivery_service: deliveryService,
            tracking_number: trackingNumber,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create delivery");
      }

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Create Delivery</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="paymentId">
          <Form.Label>Payment ID</Form.Label>
          <Form.Control
            type="text"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
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
        <Form.Group controlId="trackingNumber">
          <Form.Label>Tracking Number</Form.Label>
          <Form.Control
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Delivery
        </Button>
      </Form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateDelivery;
