export const selectCartCount = (state) =>
  state.cart.cartItems ? state.cart.cartItems.length : 0;
