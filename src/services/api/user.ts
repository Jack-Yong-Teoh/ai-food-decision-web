import { sprintf } from "sprintf-js";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const getUser = async (user_id: number) => {
  const res = await http.get(sprintf(ENDPOINT.getUser, user_id));
  return res?.data;
};

export const getUserProfile = async () => {
  const res = await http.get(ENDPOINT.getUserProfile);
  return res?.data;
};

export const updateUserProfile = async (data: any) => {
  const res = await http.put(ENDPOINT.updateUserProfile, data);
  return res?.data;
};
