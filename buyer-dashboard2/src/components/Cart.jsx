import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../redux/action/index.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button, Table } from "react-bootstrap"; // Import Bootstrap components

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(getCartItems());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleIncrease = (productId, quantity) => {
    dispatch(updateCartItem(productId, quantity + 1));
  };

  const handleDecrease = (productId, quantity) => {
    if (quantity > 1) {
      dispatch(updateCartItem(productId, quantity - 1));
    }
  };

  const handleCheckout = () => {
    navigate("/checkout"); // Navigate to checkout page
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + item.quantity * parseFloat(item.product?.price || 0);
  }, 0);

  // Calculate total amount in Kgs
  const totalAmountKgs = cartItems.reduce((acc, item) => {
    return acc + item.quantity * parseFloat(item.product?.quantity || 0); // Fetch the 'quantity' column from the product table
  }, 0);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Cart</h2>
      {cartItems.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Amount (Kgs)</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Total Amount (Kgs)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product?.id || item.product_id}>
                  <td>
                    {item.product ? (
                      <img
                        src={`https://www.maizeai.me/${item.product.file_path}`}
                        alt={item.product.name}
                        style={{ width: "100px", height: "100px" }}
                      />
                    ) : (
                      <p>Not available</p>
                    )}
                  </td>
                  <td>
                    {item.product?.name || "Product details not available"}{" "}
                    Maize
                  </td>
                  <td>{item.product?.price}</td>
                  <td>{item.product?.quantity || 0} Kgs</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        handleIncrease(
                          item.product?.id || item.product_id,
                          item.quantity
                        )
                      }
                    >
                      +
                    </Button>{" "}
                    {item.quantity}{" "}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() =>
                        handleDecrease(
                          item.product?.id || item.product_id,
                          item.quantity
                        )
                      }
                    >
                      -
                    </Button>
                  </td>
                  <td>
                    {(
                      item.quantity * parseFloat(item.product?.price || 0)
                    ).toFixed(2)}
                  </td>
                  <td>
                    {(
                      item.quantity * parseFloat(item.product?.quantity || 0)
                    ).toFixed(2)}{" "}
                    Kgs
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() =>
                        handleRemove(item.product?.id || item.product_id)
                      }
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Total price and amount display */}
          <div className="text-right mb-4">
            <h4>Total Price: Ksh {totalPrice.toFixed(2)}</h4>
            <h4>Total Amount: {totalAmountKgs.toFixed(2)} Kgs</h4>
          </div>

          {/* Checkout Button */}
          <div className="text-right">
            <Button variant="success" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      ) : (
        <p>Your cart is empty</p>
      )}
    </div>
  );
};

export default Cart;
