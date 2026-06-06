import { ENDPOINT } from "../api-endpoints";
import http from "../http";

// ==================== 请求参数类型 ====================

export interface RecommendParams {
  food_type: string;
  meal_type: string;
  dietary_restriction: string;
  mood: string;
  additional_notes: string;
  token_consumed: number;
}

// ==================== 成功响应类型 (200) ====================

export interface RecommendResponse {
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

// ==================== 错误响应类型 ====================

// 通用错误响应 (400, 401, 403, 404, 409, 500)
export interface ApiErrorResponse {
  message: string;
  result: "error";
}

// 参数校验错误 (422)
export interface ValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse {
  detail: ValidationErrorDetail[];
}

// ==================== 统一错误类型 ====================

export type RecommendError = 
  | ApiErrorResponse 
  | ValidationErrorResponse;

// ==================== API 函数 ====================

/**
 * 生成食物推荐
 * POST /api/food
 */
export const recommend = async (params: RecommendParams): Promise<RecommendResponse> => {
  const res = await http.post(ENDPOINT.recommend, params);
  return res?.data;
};
