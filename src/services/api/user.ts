import { sprintf } from "sprintf-js";

import { LazyloadParams } from "@/types/general";
import { CreateUserParams, UpdateUserFormValues } from "@/types/user";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const getUser = async (user_id: number) => {
  const res = await http.get(sprintf(ENDPOINT.getUser, user_id));
  return res?.data;
};

export const getUsers = async (params: LazyloadParams) => {
  const res = await http.post(ENDPOINT.getUsers, params);
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

export const updateUser = async (
  user_id: number,
  params: UpdateUserFormValues,
) => {
  const res = await http.put(sprintf(ENDPOINT.updateUser, user_id), params);
  return res?.data;
};

export const createUser = async (params: CreateUserParams) => {
  const res = await http.post(ENDPOINT.createUser, params);
  return res?.data;
};

export const deleteUser = async (user_id: number) => {
  return await http.delete(sprintf(ENDPOINT.deleteUser, user_id));
};
