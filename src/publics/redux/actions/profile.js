import axios from "axios";
import { server } from "../../../utils/server";

export const getFullProfile = (user_id, token) => {
  return {
    type: "GET_FULL_PRORILE",
    payload: axios({
      method: "get",
      url: `${server.url}/api/v1/profile/${user_id}`,
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
      url: `${server.url}/api/v1/profile`,
      data: body,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };
};
