import axios from "axios";

export const getFullProfile = (user_id, token) => {
  return {
    type: "GET_FULL_PRORILE",
    payload: axios({
      method: "get",
      url: `http://192.168.0.61:3333/api/v1/profile/${user_id}`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};

export const updateProfile = (body, token) => {
  return {
    type: "UPDATE_PROFILE",
    payload: axios({
      method: "post",
      url: "http://192.168.0.61:3333/api/v1/profile",
      data: body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};
