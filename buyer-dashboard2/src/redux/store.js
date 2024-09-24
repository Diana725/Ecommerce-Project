// src/redux/store.js
import {
  legacy_createStore as createStore,
  applyMiddleware,
  combineReducers,
} from "redux";
import { thunk } from "redux-thunk";
// import { composeWithDevTools } from "redux-devtools/extension";
import { composeWithDevTools } from "@redux-devtools/extension";
import cartReducer from "./reducer/handleCart";

const rootReducer = combineReducers({
  cart: cartReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
