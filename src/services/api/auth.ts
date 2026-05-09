import { sprintf } from "sprintf-js";

import { ProfilePasswordFormValues } from "@/types/auth";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const logIn = async (params: any) => {
  const res = await http.post(ENDPOINT.login, params);
  return res?.data;
};

export const logOut = async () => {
  return await http.post(sprintf(ENDPOINT.logout));
};

export const signUp = async (params: any) => {
  const res = await http.post(ENDPOINT.signUp, params);
  return res?.data;
};

export const updatePassword = async (params: ProfilePasswordFormValues) => {
  const res = await http.put(ENDPOINT.changePassword, params);
  return res?.data;
};
