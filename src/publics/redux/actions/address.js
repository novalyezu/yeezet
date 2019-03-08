import axios from "axios";

export const getAddress = (user_id, token) => {
  return {
    type: "GET_ADDRESS",
    payload: axios({
      method: "get",
      url: `http://192.168.0.61:3333/api/v1/address/${user_id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const updateAddress = (id, token, body) => {
  return {
    type: "UPDATE_ADDRESS",
    payload: axios({
      method: "put",
      url: `http://192.168.0.61:3333/api/v1/address/${id}`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const addAddress = (token, body) => {
  return {
    type: "ADD_ADDRESS",
    payload: axios({
      method: "post",
      url: `http://192.168.0.61:3333/api/v1/address`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};
