import { sprintf } from "sprintf-js";

import { LazyloadParams } from "@/types/general";
import {
  CreateLuckyPickParams,
  LuckyPickLazyloadResponse,
  UpdateLuckyPickFormValues,
} from "@/types/luckyPick";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const getLuckyPick = async (lucky_pick_id: number) => {
  const res = await http.get(sprintf(ENDPOINT.getLuckyPick, lucky_pick_id));
  return res?.data;
};

export const getLuckyPicks = async (
  params: LazyloadParams,
): Promise<LuckyPickLazyloadResponse> => {
  const res = await http.post(ENDPOINT.getLuckyPicks, params);
  return res?.data;
};

export const updateLuckyPick = async (
  lucky_pick_id: number,
  params: UpdateLuckyPickFormValues,
) => {
  const res = await http.put(sprintf(ENDPOINT.updateLuckyPick, lucky_pick_id), params);
  return res?.data;
};

export const createLuckyPick = async (params: CreateLuckyPickParams) => {
  const res = await http.post(ENDPOINT.createLuckyPick, params);
  return res?.data;
};

export const deleteLuckyPick = async (lucky_pick_id: number) => {
  return await http.delete(sprintf(ENDPOINT.deleteLuckyPick, lucky_pick_id));
};
