import { LazyloadParams } from "@/types/general";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

// ==================== 请求参数类型 ====================

export interface Filter {
  field: string;
  operator: "equals";
  value: string;
}

export interface Pagination {
  limit: number;
  page: number;
}

export interface Sort {
  order_by: string;
  sort_order: "desc" | "asc";
}

export interface GetFoodsParams {
  filters: Filter[];
  search: string;
  pagination: Pagination;
  sort: Sort;
  included_fields: string[];
  excluded_fields: string[];
  export: boolean;
}

// ==================== 响应数据类型 ====================

export interface FoodItem {
  id: number;
  user_id: number;
  food_name: string;
  food_type: string;
  calories: string;
  description: string;
  ingredients: string;
  image_url: string;
  created_date: string;
  modified_date: string;
}

export interface GetFoodsResponse {
  columns: string[];
  data: FoodItem[];
  count: number;
}

// ==================== 错误响应类型 ====================

export interface ApiErrorResponse {
  message: string;
  result: "error";
}

export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse {
  detail: ValidationErrorDetail[];
}

// ==================== API 函数 ====================

/**
 * 获取食物推荐历史列表
 * POST /api/foods
 */
export const getFoods = async (params: LazyloadParams): Promise<GetFoodsResponse> => {
  const res = await http.post(ENDPOINT.history, params);
  return res?.data;
};

/**
 * 获取单个食物详情
 * GET /api/food/{food_id}
 */
export const getFood = async (foodId: number): Promise<FoodItem> => {
  const res = await http.get(ENDPOINT.getFood.replace("%s", String(foodId)));
  return res?.data;
};
