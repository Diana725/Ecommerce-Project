import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap"; // Bootstrap styling

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Payment History</h2>

      {payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Payment Reference</th>
              <th>Status</th>
              <th>Proof of Payment</th>
              <th>Product Name</th> {/* New column for product name */}
              <th>Farmer's Name</th> {/* New column for farmer's name */}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.payment_reference}</td>
                <td>{payment.status}</td>
                <td>{payment.proof_of_payment || "Not provided"}</td>
                <td>{payment.product.name}</td> {/* Fetching product name */}
                <td>{payment.farmer.name}</td> {/* Fetching farmer's name */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button variant="outline-dark" onClick={() => navigate("/checkout")}>
        Back to Checkout
      </Button>
    </div>
  );
};

export default PaymentHistory;
