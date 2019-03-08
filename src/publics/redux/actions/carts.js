import axios from "axios";

export const addToCart = (token, body) => {
  return {
    type: "ADD_TO_CART",
    payload: axios({
      method: "post",
      url: `http://192.168.0.61:3333/api/v1/orders/`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const getCarts = (token, user_id) => {
  return {
    type: "GET_CARTS",
    payload: axios({
      method: "get",
      url: `http://192.168.0.61:3333/api/v1/orders/${user_id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const handleAdd = (id, body) => {
  return {
    type: "ADD_QTY",
    payload: axios({
      method: "patch",
      url: `http://192.168.0.61:3333/api/v1/orders/${id}`,
      data: body
    })
  };
};

export const handleMin = (id, body) => {
  return {
    type: "MIN_QTY",
    payload: axios({
      method: "patch",
      url: `http://192.168.0.61:3333/api/v1/orders/${id}`,
      data: body
    })
  };
};

export const deleteItem = id => {
  return {
    type: "DELETE_ITEM",
    payload: axios({
      method: "delete",
      url: `http://192.168.0.61:3333/api/v1/orders/${id}`
    })
  };
};

export const donePay = id => {
  return {
    type: "DONE_PAY",
    payload: axios({
      method: "post",
      url: `http://192.168.0.61:3333/api/v1/donepay/${id}`
    })
  };
};
