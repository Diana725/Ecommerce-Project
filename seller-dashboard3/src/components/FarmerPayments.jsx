import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap"; // Import Bootstrap Table and Button

const FarmerPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch payments from the API
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
    // Initial fetch when the component is mounted
    fetchPayments();

    // Set an interval to fetch payments every 10 seconds (10000 ms)
    const intervalId = setInterval(() => {
      fetchPayments();
    }, 10000); // Adjust the interval as needed

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
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

      // After confirmation, trigger immediate fetch to get the latest payment details
      fetchPayments();

      alert("Payment confirmed successfully!");
    } catch (err) {
      console.error("Confirmation Error:", err);
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
            <th>Payment Reference</th>
            <th>Status</th>
            <th>Proof of Payment</th>
            <th>Product Name</th> {/* New column for Product Name */}
            <th>Buyer Name</th> {/* New column for Buyer Name */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.payment_reference}</td>
              <td>{payment.status}</td>
              <td>{payment.proof_of_payment || "No proof uploaded"}</td>
              <td>{payment.product.name}</td> {/* Display product name */}
              <td>{payment.buyer.name}</td> {/* Display buyer's name */}
              <td>
                {payment.status === "Payment Pending" ? (
                  <Button
                    className="btn-success" // Bootstrap class for green button
                    onClick={() => confirmPayment(payment.id)}
                  >
                    Confirm Payment
                  </Button>
                ) : (
                  <Button disabled className="btn-secondary">
                    Payment Confirmed
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default FarmerPayments;
