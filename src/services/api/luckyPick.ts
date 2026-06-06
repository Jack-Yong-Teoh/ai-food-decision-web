import { LazyloadParams } from "@/types/general";
import { LuckyPickLazyloadResponse } from "@/types/luckyPick";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const getLuckyPicks = async (
  params: LazyloadParams,
): Promise<LuckyPickLazyloadResponse> => {
  const res = await http.post(ENDPOINT.getLuckyPicks, params);
  return res?.data;
};
