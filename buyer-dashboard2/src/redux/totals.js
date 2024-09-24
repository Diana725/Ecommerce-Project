// totals.js

import { selectCartItems } from "./selectors"; // Import the selectCartItems selector

export const selectCartTotal = (state) =>
  selectCartItems(state).reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );
// Use selectCartItems to ensure synchronization and default values for price and quantity
