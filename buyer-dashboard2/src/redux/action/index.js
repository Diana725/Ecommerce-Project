// src/redux/cartActions.js
import api from "../../api";

// Action Types
export const GET_CART_ITEMS = "GET_CART_ITEMS";
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART_ITEM = "UPDATE_CART_ITEM";

// Action Creators
export const getCartItems = () => async (dispatch) => {
  try {
    const response = await api.get("/cart");
    dispatch({ type: GET_CART_ITEMS, payload: response.data });
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};

// src/actions/cartActions.js
export const addToCart =
  (product, quantity = 1) =>
  async (dispatch) => {
    try {
      const productId = product.id; // Extract the product id
      console.log("Sending product_id to API: ", productId);

      const response = await api.post("/cart/add", {
        product_id: productId, // Send only the id
        quantity,
      });

      dispatch({
        type: ADD_TO_CART,
        payload: { product, quantity }, // Store the full product object and quantity in Redux state
      });
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );
    }
  };

export const removeFromCart = (productId) => async (dispatch) => {
  try {
    await api.delete(`/cart/remove/${productId}`);
    dispatch({ type: REMOVE_FROM_CART, payload: productId });
  } catch (error) {
    console.error("Error removing from cart:", error);
  }
};

export const updateCartItem = (productId, quantity) => async (dispatch) => {
  try {
    await api.put(`/cart/update/${productId}`, {
      quantity,
    });
    dispatch({ type: UPDATE_CART_ITEM, payload: { productId, quantity } });
  } catch (error) {
    console.error("Error updating cart item:", error);
  }
};
