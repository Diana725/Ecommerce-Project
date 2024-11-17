import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Form, Alert } from "react-bootstrap";
import { removeFromCart } from "../redux/action";
import { Modal } from "react-bootstrap";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentProofs, setPaymentProofs] = useState({});
  const [deliveryFees, setDeliveryFees] = useState({});
  const [zones, setZones] = useState({});
  const [locations, setLocations] = useState({});
  const [selectedZone, setSelectedZone] = useState({});
  const [selectedLocation, setSelectedLocation] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [paymentId, setPaymentId] = useState(null);

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

  const validateFields = (item) => {
    let errors = {};

    const paymentProof = paymentProofs[item.product.id];

    if (!paymentProof) {
      errors.paymentProof = "Proof of payment is required";
    } else if (paymentProof.length !== 10) {
      errors.paymentProof = "Proof of payment must be exactly 10 characters.";
    }

    if (!deliveryFees[item.product.id]) {
      errors.deliveryFee = "Delivery fee is required";
    }

    if (!selectedZone[item.product.id]) {
      errors.deliveryZone = "Delivery zone is required";
    }

    if (!selectedLocation[item.product.id]) {
      errors.deliveryLocation = "Delivery location is required";
    }

    return errors;
  };

  const handleCloseModal = () => {
    setShowModal(false);
    if (paymentId) {
      navigate(`/payment-details/${paymentId}`); // Redirect to payment details page using stored payment ID
    }
  };

  const handlePayment = async (item) => {
    // Calculate the total price
    const productPrice = parseFloat(item.productDetails.price) || 0;
    const deliveryFee = Number(deliveryFees[item.product.id]) || 0;
    const totalPrice = parseFloat(
      productPrice * item.quantity + deliveryFee
    ).toFixed(2);

    // Run validation for the current item
    const errors = validateFields(item);

    // If there are validation errors, set the errors in the state and prevent form submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [item.product.id]: errors,
      }));
      return;
    }

    // Clear validation errors if the fields are valid
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [item.product.id]: null,
    }));

    try {
      // Proceed with the payment submission
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
          payment_method: item.product.payment_method,
          proof_of_payment: paymentProofs[item.product.id] || "",
          delivery_fee: deliveryFees[item.product.id] || 0,
          delivery_zone_id: selectedZone[item.product.id] || null,
          delivery_location_id: selectedLocation[item.product.id] || null,
          total_price: totalPrice, // Send the totalPrice to the backend
        }),
      });

      // Check if the response is not successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm payment");
      }

      const result = await response.json();

      if (!result.payment_id) {
        throw new Error("Invalid response: Payment ID is missing");
      }

      // Set modal message, show modal, and store payment ID on success
      setModalMessage(`Payment confirmed for ${item.productDetails.name}`);
      setPaymentId(result.payment_id); // Save the payment ID
      setShowModal(true);

      // Remove the item from cart after successful payment
      dispatch(removeFromCart(item.product.id));

      // After payment is successful, navigate to PaymentDetails page and pass totalPrice
      setTimeout(() => {
        navigate(`/payment-details/${result.payment_id}`, {
          state: { totalPrice }, // Pass totalPrice via state
        });
      }, 2000);
    } catch (err) {
      // Handle any errors during payment submission
      console.error("Payment Error:", err);
      alert(err.message);
      setShowModal(true);
    }
  };

  // Modal handler functions

  useEffect(() => {
    console.log("showModal updated:", showModal);
  }, [showModal]);

  const handleProofChange = (productId, value) => {
    // Update the payment proof state
    setPaymentProofs((prev) => ({
      ...prev,
      [productId]: value,
    }));

    // Clear the validation error related to proof of payment once user starts typing
    setValidationErrors((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        proof: value.length === 10 ? "" : prev[productId]?.proof, // Clear if 10 characters
      },
    }));
  };

  const updateDeliveryFee = (productId, fee) => {
    setDeliveryFees((prev) => ({
      ...prev,
      [productId]: fee,
    }));
  };

  const fetchZones = async (farmerId, productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/buyers/farmers/${farmerId}/delivery-zones`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch delivery zones");
      }
      const data = await response.json();
      setZones((prevZones) => ({
        ...prevZones,
        [productId]: data,
      }));
    } catch (error) {
      console.error("Error fetching delivery zones:", error);
    }
  };

  const fetchLocations = async (zoneId, productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/buyers/delivery-zones/${zoneId}/locations`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch delivery locations");
      }
      const data = await response.json();
      setLocations((prevLocations) => ({
        ...prevLocations,
        [productId]: data,
      }));
    } catch (error) {
      console.error("Error fetching delivery locations:", error);
    }
  };

  const handleZoneSelection = (productId, zoneId) => {
    setSelectedZone((prev) => ({
      ...prev,
      [productId]: zoneId,
    }));

    // Fetch locations based on the selected zone
    fetchLocations(zoneId, productId);

    // Clear validation error related only to the zone
    setValidationErrors((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], zone: "" },
    }));
  };

  const handleLocationSelection = (productId, locationId, fee) => {
    setSelectedLocation((prev) => ({
      ...prev,
      [productId]: locationId,
    }));

    // Update the delivery fee based on the selected location
    updateDeliveryFee(productId, fee);

    // Clear validation error related only to the location
    setValidationErrors((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], location: "" },
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
                  parseFloat(item.productDetails?.price) || 0;
                const deliveryFee = deliveryFees[item.product.id] || 0;
                totalAmount +=
                  Number(item.quantity * item.productDetails.price) +
                  Number(deliveryFee);
              });
              return Number(totalAmount).toFixed(2);
            })()}
          </h4>

          <hr />

          <h4 className="mb-3">Product Details</h4>
          <ul className="list-group">
            {products.map((item, index) => (
              <li key={item.product.id} className="list-group-item">
                <div className="d-flex align-items-center mb-3">
                  <strong className="me-2 fs-3">#{index + 1}</strong>
                  <h5 className="fs-1 fw-bold">{item.productDetails.name}</h5>
                  <img
                    src={`http://localhost:8000/${item.productDetails.file_path}`}
                    alt={item.productDetails.name}
                    style={{
                      width: "200px",
                      height: "150px",
                      marginLeft: "300px",
                      marginTop: "10px",
                    }}
                  />
                </div>

                <p>Price: Ksh {item.productDetails.price * item.quantity}</p>
                <p>Quantity: {item.quantity}</p>

                {/* Delivery Zone Dropdown */}
                <Form.Group>
                  <Form.Label>Select Delivery Zone</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) =>
                      handleZoneSelection(item.product.id, e.target.value)
                    }
                    onClick={() =>
                      fetchZones(item.productDetails.user_id, item.product.id)
                    }
                    isInvalid={!!validationErrors[item.product.id]?.zone}
                  >
                    <option value="">Select a zone</option>
                    {zones[item.product.id]?.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.zone_name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {validationErrors[item.product.id]?.zone}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Delivery Location Dropdown */}
                {locations[item.product.id] && (
                  <Form.Group>
                    <Form.Label>Select Delivery Location</Form.Label>
                    <Form.Control
                      as="select"
                      isInvalid={!!validationErrors[item.product.id]?.location}
                      onChange={(e) =>
                        handleLocationSelection(
                          item.product.id,
                          e.target.value,
                          e.target.selectedOptions[0].dataset.fee
                        )
                      }
                    >
                      <option value="">Select a location</option>
                      {locations[item.product.id]?.map((location) => (
                        <option
                          key={location.id}
                          value={location.id}
                          data-fee={location.delivery_fee}
                        >
                          {location.location_name} - Ksh {location.delivery_fee}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors[item.product.id]?.location}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                {/* Delivery Fee */}
                {deliveryFees[item.product.id] !== undefined && (
                  <p>
                    <strong>Delivery Fee:</strong> Ksh{" "}
                    {deliveryFees[item.product.id]}
                  </p>
                )}

                {/* Total Price */}
                <p>
                  <strong>Total Price:</strong> Ksh{" "}
                  {(() => {
                    const productPrice =
                      parseFloat(item.productDetails.price) || 0;
                    const deliveryFee =
                      Number(deliveryFees[item.product.id]) || 0;
                    return Number(
                      productPrice * item.quantity + deliveryFee
                    ).toFixed(2);
                  })()}
                </p>
                <p>
                  <strong>Payment Method:</strong> {item.product.payment_method}
                </p>
                {/* Payment Proof Input */}
                <Form.Group controlId={`proofOfPayment-${item.product.id}`}>
                  <Form.Label>Upload Payment Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter payment proof"
                    value={paymentProofs[item.product.id] || ""} // Set current input value
                    isInvalid={!!validationErrors[item.product.id]?.proof} // Show error if exists
                    onChange={(e) =>
                      handleProofChange(item.product.id, e.target.value)
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors[item.product.id]?.proof}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirm Payment Button */}
                <Button
                  variant="primary"
                  onClick={() => handlePayment(item)}
                  className="mt-3"
                >
                  Confirm Payment
                </Button>

                {/* Validation Error Message */}
                {validationErrors[item.product.id] &&
                  Object.keys(validationErrors[item.product.id]).length > 0 && (
                    <p className="text-danger mt-2">
                      {Object.values(validationErrors[item.product.id]).map(
                        (error, index) => (
                          <span key={index}>
                            {error}
                            <br />
                          </span>
                        )
                      )}
                    </p>
                  )}
              </li>
            ))}
          </ul>
          <Button
            variant="dark"
            className="mt-3 mb-5 w-100"
            onClick={() => navigate("/cart")} // Use navigate here
          >
            Back to Cart
          </Button>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default Checkout;
