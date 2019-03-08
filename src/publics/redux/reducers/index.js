import { combineReducers } from "redux";

import products from "./products";
import carts from "./carts";
import auth from "./auth";
import profile from "./profile";
import address from "./address";

const appReducer = combineReducers({
  products,
  carts,
  auth,
  profile,
  address
});

export default appReducer;
