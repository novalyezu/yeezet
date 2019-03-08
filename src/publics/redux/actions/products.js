import axios from "axios";

export const getProducts = param => {
  let url = "";
  if (param === undefined) {
    url = "http://192.168.0.61:3333/api/v1/products?page=1&perPage=4";
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
      url: `http://192.168.0.61:3333/api/v1/product/${param}`
    })
  };
};
