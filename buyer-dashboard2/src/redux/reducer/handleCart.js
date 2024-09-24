// src/redux/cartReducer.js
import {
  GET_CART_ITEMS,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM,
} from "../action/index.js";

const initialState = {
  items: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART_ITEMS:
      return {
        ...state,
        items: action.payload,
      };
    case ADD_TO_CART:
      const existingItem = state.items.find(
        (item) => item.product_id === action.payload.productId
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product_id === action.payload.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        return {
          ...state,
          items: [
            ...state.items,
            {
              product_id: action.payload.productId,
              quantity: action.payload.quantity,
            },
          ],
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        items: state.items.filter((item) => item.product_id !== action.payload),
      };
    case UPDATE_CART_ITEM:
      return {
        ...state,
        items: state.items.map((item) =>
          item.product_id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    default:
      return state;
  }
};

export default cartReducer;
