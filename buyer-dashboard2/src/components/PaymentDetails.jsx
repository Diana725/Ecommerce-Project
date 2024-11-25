import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; // For accessing payment_id from URL
import { Button } from "react-bootstrap";

const PaymentDetails = () => {
  const { paymentId } = useParams(); // Get payment_id from URL
  const navigate = useNavigate(); // Initialize useNavigate
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const location = useLocation();
  // const totalPrice = location.state?.totalPrice;

  // Fetch payment details from the backend
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(
          `https://www.maizeai.me/api/buyer/payment/status/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }
        const data = await response.json();
        setPaymentDetails(data);
      } catch (err) {
        setError("Error fetching payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2 className="mb-4">Payment Details</h2>

          {paymentDetails ? (
            <div>
              <h4>
                Payment Status: {paymentDetails.status} Confirmation From Farmer
              </h4>
              <p>Total Price Paid: Ksh {paymentDetails.total_price}</p>
              <p>Total Product Amount: {paymentDetails.quantity} Kgs</p>
              <p>Phone Number: {paymentDetails.phone_number}</p>
              <p>Payment Code: {paymentDetails.proof_of_payment}</p>
              <p>Product Name: {paymentDetails.product_name} Maize</p>

              {/* <p>Farmer's Name: {paymentDetails.farmer_name}</p> */}
              <p>Delivery Zone: {paymentDetails.delivery_zone_name}</p>
              <p>Delivery Location: {paymentDetails.delivery_location_name}</p>
              {/* Additional payment details can be displayed here */}
            </div>
          ) : (
            <p>No payment details found.</p>
          )}
          {/* Track Delivery Button */}
          <Button
            variant="success"
            className="mt-2 w-100"
            onClick={() => {
              // Store totalPrice in localStorage before navigating
              // localStorage.setItem("totalPrice", totalPrice);
              navigate("/payment-history");
            }}
          >
            Track Payment Confirmation and Delivery Details
          </Button>

          {/* Back to Checkout */}
          <Button
            variant="dark"
            className="mt-3 mb-5 w-100"
            onClick={() => navigate("/checkout")} // Use navigate here
          >
            Back to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
