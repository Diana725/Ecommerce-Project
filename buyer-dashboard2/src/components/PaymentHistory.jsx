import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import StarRatings from "react-star-ratings";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/buyer/payment/history",
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
    const intervalId = setInterval(fetchPayments, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const markAsDelivered = async (paymentId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/order-payments/${paymentId}/deliver`,
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
      const response = await fetch("http://localhost:8000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          order_payment_id: selectedPaymentId, // Updated key to match your controller
          review,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Update the payments state to reflect that the review has been submitted
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === selectedPaymentId
            ? { ...payment, review_submitted: true }
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Status</th>
              <th>Proof of Payment</th>
              <th>Product Name</th>
              <th>Delivery Location</th>
              <th>Delivery Status</th>
              <th>Tracking Number</th>
              <th>Delivery Service</th>
              <th>Actions</th>
              <th>Product Review</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.status}</td>
                <td>{payment.proof_of_payment || "Not provided"}</td>
                <td>{payment.product.name}</td>
                <td>
                  {payment.delivery_location
                    ? payment.delivery_location.location_name
                    : "N/A"}
                </td>
                <td>{payment.delivery_status}</td>
                <td>{payment.tracking_number || "N/A"}</td>
                <td>{payment.delivery_service || "N/A"}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => markAsDelivered(payment.id)}
                    disabled={payment.delivery_status !== "Shipped"}
                  >
                    Mark as Delivered
                  </Button>
                </td>
                <td>
                  {payment.delivery_status === "Delivered" &&
                    !payment.review_submitted && (
                      <Button
                        variant="primary"
                        onClick={() => handleOpenReviewModal(payment.id)}
                        className="ml-2"
                      >
                        Add Review
                      </Button>
                    )}
                  {payment.review_submitted && (
                    <Button variant="secondary" disabled className="ml-2">
                      Review Submitted
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
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
