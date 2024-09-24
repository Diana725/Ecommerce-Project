import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { removeFromCart } from "../redux/action";
import DeliveryFeeCalculator from "./Delivery";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentProofs, setPaymentProofs] = useState({});
  const [deliveryFees, setDeliveryFees] = useState({}); // To store delivery fees for each product

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productDetails = await Promise.all(
          cartItems.map(async (item) => {
            const response = await fetch(
              `http://localhost:8000/api/buyer/products/${item.product.id}`
            );
            if (!response.ok) {
              throw new Error("Failed to fetch product details");
            }
            const productData = await response.json();
            return { ...item, productDetails: productData };
          })
        );
        setProducts(productDetails);
      } catch (err) {
        setError("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [cartItems]);

  const handlePayment = async (item) => {
    try {
      const response = await fetch("http://localhost:8000/api/buyer/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          farmer_id: item.productDetails.user_id,
          product_id: item.product.id,
          payment_reference: "Direct Transfer",
          proof_of_payment: paymentProofs[item.product.id] || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm payment");
      }

      const result = await response.json();
      alert(`Payment confirmed for ${item.productDetails.name}!`);
      dispatch(removeFromCart(item.product.id));
      navigate(`/payment-details/${result.payment_id}`);
    } catch (err) {
      console.error("Payment Error:", err);
      alert(err.message);
    }
  };

  const handleProofChange = (productId, value) => {
    setPaymentProofs((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  // Callback to update delivery fee state
  const updateDeliveryFee = (productId, fee) => {
    setDeliveryFees((prev) => ({
      ...prev,
      [productId]: fee,
    }));
  };

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
          <h2 className="mb-4">Checkout</h2>

          <h4>
            Total Amount: Ksh{" "}
            {(() => {
              let totalAmount = 0;

              products.forEach((item) => {
                const productPrice =
                  parseFloat(item.productDetails?.price) || 0; // Ensure it's a number
                const deliveryFee = deliveryFees[item.product.id] || 0; // Ensure it's a number
                totalAmount +=
                  Number(item.quantity * item.productDetails.price) +
                  Number(deliveryFee); // Sum correctly
              });
              return Number(totalAmount).toFixed(2); // Format to 2 decimal places
            })()}
          </h4>

          {/* Horizontal line for separation */}
          <hr />

          <h4 className="mb-3">Product Details</h4>
          <ul className="list-group">
            {products.map((item) => (
              <li key={item.product.id} className="list-group-item">
                <h5>{item.productDetails.name}</h5>
                <p>Price: Ksh {item.productDetails.price * item.quantity}</p>
                <p>Quantity: {item.quantity}</p>

                <DeliveryFeeCalculator
                  farmerId={item.productDetails.user_id}
                  onFeeCalculated={(fee) =>
                    updateDeliveryFee(item.product.id, fee)
                  } // Pass callback to update delivery fee
                />
                {/* Display the calculated delivery fee */}
                {deliveryFees[item.product.id] !== undefined && (
                  <p>
                    <strong>Delivery Fee:</strong> Ksh{" "}
                    {deliveryFees[item.product.id]}
                  </p>
                )}

                {/* Calculate total price per item (price + delivery fee) */}
                <p>
                  <strong>Total Price:</strong> Ksh{" "}
                  {(() => {
                    const productPrice =
                      parseFloat(item.productDetails.price) || 0; // Ensure it's a number
                    const deliveryFee =
                      Number(deliveryFees[item.product.id]) || 0; // Ensure it's a number
                    return Number(
                      productPrice * item.quantity + deliveryFee
                    ).toFixed(2); // Format to 2 decimal places
                  })()}
                </p>

                <p>
                  <strong>Payment Method:</strong>{" "}
                  {item.productDetails.payment_method}
                </p>

                <Form.Group controlId={`proofOfPayment-${item.product.id}`}>
                  <Form.Label>Upload Payment Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter payment code"
                    onChange={(e) =>
                      handleProofChange(item.product.id, e.target.value)
                    }
                  />
                </Form.Group>
                <br />
                <Button
                  type="button"
                  variant="dark"
                  className="w-100"
                  onClick={() => handlePayment(item)}
                >
                  Confirm Payment
                </Button>
              </li>
            ))}
          </ul>

          <Button
            variant="outline-dark"
            className="mt-3 mb-5 w-100"
            onClick={() => navigate("/")}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
