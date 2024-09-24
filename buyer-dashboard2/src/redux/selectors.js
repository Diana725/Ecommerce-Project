// src/redux/selectors.js
import { createSelector } from "reselect";

export const selectCartItems = (state) => state.cart.items;

export const selectCartCount = createSelector([selectCartItems], (cartItems) =>
  cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
);

// selectors.js
// import { createSelector } from "reselect";

// // Basic selector to get the cart state
// const selectCart = (state) => state.cart || {};

// // Memoized selector to get cart items
// export const selectCartItems = createSelector(
//   [selectCart],
//   (cart) => cart.cartItems || [] // Return cartItems, or an empty array if undefined
// );

// // Memoized selector to calculate the total price
// export const selectCartTotal = createSelector([selectCartItems], (cartItems) =>
//   cartItems.reduce(
//     (total, item) => total + (item.price || 0) * (item.quantity || 1),
//     0
//   )
// );

// // Memoized selector to calculate the total count of items in the cart
// export const selectCartCount = createSelector([selectCartItems], (cartItems) =>
//   cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
// );
