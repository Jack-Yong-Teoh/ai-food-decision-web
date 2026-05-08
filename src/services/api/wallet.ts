import { sprintf } from "sprintf-js";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const getWallet = async (wallet_id: number) => {
  const res = await http.get(sprintf(ENDPOINT.getWallet, wallet_id));
  return res?.data;
};
