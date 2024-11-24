import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Modal, Form } from "react-bootstrap";
import StarRatings from "react-star-ratings";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [markedAsDelivered, setMarkedAsDelivered] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          "https://www.maizeai.me/api/buyer/payment/history",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payment history");
        }

        const data = await response.json();
        setPayments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();

    const intervalId = setInterval(fetchPayments, 50000);
    return () => clearInterval(intervalId);
  }, []);

  const markAsDelivered = async (paymentId) => {
    try {
      const response = await fetch(
        `https://www.maizeai.me/api/order-payments/${paymentId}/deliver`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update delivery status");
      }

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, delivery_status: "Delivered" }
            : payment
        )
      );
      setMarkedAsDelivered((prev) => [...prev, paymentId]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenReviewModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setRating(0);
    setReview("");
  };

  const handleSubmitReview = async () => {
    try {
      const response = await fetch("https://www.maizeai.me/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          order_payment_id: selectedPaymentId,
          review,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === selectedPaymentId
            ? { ...payment, review_submitted: 1 }
            : payment
        )
      );

      handleCloseReviewModal();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Payment and Delivery History</h2>
      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {payments.map((payment) => (
            <Col key={payment.id}>
              <Card>
                <Card.Img
                  variant="top"
                  src={`https://www.maizeai.me/${payment.product.file_path}`}
                  alt={payment.product.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title>{payment.product.name} Maize</Card.Title>
                  <Card.Text>
                    <strong>Amount Paid:</strong> KES {payment.total_price}
                  </Card.Text>
                  <Card.Text>
                    <strong>Quantity:</strong> {payment.quantity} Kgs
                  </Card.Text>
                  <Card.Text>
                    <strong>Phone Number:</strong>{" "}
                    {payment.phone_number || "N/A"}
                  </Card.Text>
                  <Card.Text>
                    <p>
                      <strong>Status:</strong>{" "}
                      {payment.status === "Payment Pending"
                        ? `Payment Pending (Awaiting Farmer Confirmation)`
                        : payment.status === "Payment Confirmed"
                        ? `Payment Confirmed (Farmer Verified)`
                        : payment.status}
                    </p>
                  </Card.Text>
                  <Card.Text>
                    <strong>Delivery Status:</strong> {payment.delivery_status}
                  </Card.Text>
                  <Card.Text>
                    <strong>Location:</strong>{" "}
                    {payment.delivery_location
                      ? payment.delivery_location.location_name
                      : "N/A"}
                  </Card.Text>
                  <Button
                    variant="success"
                    onClick={() => markAsDelivered(payment.id)}
                    disabled={
                      payment.delivery_status !== "Shipped" ||
                      markedAsDelivered.includes(payment.id)
                    }
                  >
                    {markedAsDelivered.includes(payment.id)
                      ? "Marked As Delivered"
                      : "Mark as Delivered"}
                  </Button>{" "}
                  {payment.delivery_status === "Delivered" &&
                    payment.review_submitted === 0 && (
                      <Button
                        variant="primary"
                        onClick={() => handleOpenReviewModal(payment.id)}
                        className="ml-2"
                      >
                        Add Review
                      </Button>
                    )}
                  {payment.review_submitted === 1 && (
                    <Button variant="secondary" disabled className="ml-2">
                      Review Submitted
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal show={showReviewModal} onHide={handleCloseReviewModal}>
        <Modal.Header closeButton>
          <Modal.Title>Submit a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reviewText">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="ratingStars">
              <Form.Label>Rating</Form.Label>
              <StarRatings
                rating={rating}
                starRatedColor="gold"
                changeRating={setRating}
                numberOfStars={5}
                name="rating"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReviewModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmitReview}>
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentHistory;
