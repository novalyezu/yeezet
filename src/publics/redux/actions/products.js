import axios from "axios";
import { server } from "../../../utils/server";

export const getProducts = param => {
  let url = "";
  if (param === undefined) {
    url = `${server.url}/api/v1/products?page=1&perPage=4`;
  } else {
    url = param;
  }
  return {
    type: "GET_PRODUCTS",
    payload: axios({
      method: "get",
      url: url
    })
  };
};

export const getProduct = param => {
  return {
    type: "GET_PRODUCT",
    payload: axios({
      method: "get",
      url: `${server.url}/api/v1/product/${param}`
    })
  };
};
