import { sprintf } from "sprintf-js";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const logIn = async (params: any) => {
  const res = await http.post(ENDPOINT.login, params);
  return res?.data;
};

export const logOut = async () => {
  return await http.post(sprintf(ENDPOINT.logout));
};
