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
  const total = cartItems.reduce((acc, item) => {
    return acc + item.quantity * parseFloat(item.product?.price || 0);
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
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product?.id || item.product_id}>
                  <td>
                    {item.product ? (
                      <img
                        src={`http://localhost:8000/${item.product.file_path}`}
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

          {/* Total price display */}
          <div className="text-right mb-4">
            <h4>Total Price: Ksh{total.toFixed(2)}</h4>
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

// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   removeCart,
//   incrementQuantity,
//   decrementQuantity,
//   fetchCartItems, // Import the fetchCartItems action
// } from "../redux/action";
// import { selectCartItems, selectCartTotal } from "../redux/selectors"; // Use the memoized selectors

// const Cart = () => {
//   const [loading, setLoading] = useState(true); // State for loading

//   // Use memoized selectors to get cart items and total price
//   const cart = useSelector(selectCartItems);
//   const totalPrice = useSelector(selectCartTotal);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/login"); // Redirect to login if no token
//       return;
//     }

//     // Fetch cart items when component mounts
//     dispatch(fetchCartItems())
//       .then(() => setLoading(false)) // Set loading to false after fetching
//       .catch(() => setLoading(false)); // Set loading to false in case of an error
//   }, [dispatch, navigate]);

//   // Handle removing an item from the cart
//   const handleRemove = (product) => {
//     dispatch(removeCart(product));
//   };

//   // Handle incrementing the quantity of an item
//   const handleIncrement = (product) => {
//     dispatch(incrementQuantity(product));
//   };

//   // Handle decrementing the quantity of an item
//   const handleDecrement = (product) => {
//     dispatch(decrementQuantity(product));
//   };

//   // Handle proceeding to checkout
//   const handleProceedToCheckout = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     navigate("/checkout");
//   };

//   // Render cart items
//   const cartItems = cart.map((product) => (
//     <div className="row mb-4" key={product.id}>
//       <div className="col-md-4">
//         <img
//           src={"http://localhost:8000/" + product.file_path}
//           alt={product.name}
//           height="200px"
//           width="180px"
//         />
//       </div>
//       <div className="col-md-4">
//         <h3>{product.name}</h3>
//         <p className="lead fw-bold">
//           {product.quantity} x ksh{product.price} = ksh
//           {product.quantity * product.price}
//         </p>
//         <div>
//           <button
//             className="btn btn-outline-dark me-2"
//             onClick={() => handleDecrement(product)}
//           >
//             -
//           </button>
//           <button
//             className="btn btn-outline-dark"
//             onClick={() => handleIncrement(product)}
//           >
//             +
//           </button>
//         </div>
//       </div>
//       <div className="col-md-4">
//         <button
//           className="btn btn-outline-dark"
//           onClick={() => handleRemove(product)}
//         >
//           Remove
//         </button>
//       </div>
//     </div>
//   ));

//   return (
//     <div className="container py-5">
//       {loading ? (
//         <p>Loading cart items...</p>
//       ) : (
//         <div className="row">
//           <div className="col-md-12">
//             {cart.length === 0 ? (
//               <h2>Your Cart is Empty</h2>
//             ) : (
//               <>
//                 {/* Display cart items */}
//                 {cartItems}
//                 <div className="row">
//                   <div className="col-md-12 text-end">
//                     <h3>Total: ksh{totalPrice}</h3>
//                     <button
//                       onClick={handleProceedToCheckout}
//                       className="btn btn-dark mb-5"
//                     >
//                       Proceed to Checkout
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//       <hr />
//     </div>
//   );
// };

// export default Cart;
