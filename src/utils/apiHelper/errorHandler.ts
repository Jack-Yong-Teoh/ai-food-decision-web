"use client";
import { message } from "antd";
import axios from "axios";

type ApiErrorResponse = {
  error: string;
  status?: number;
  message?: string;
};
export const handleApiError = (
  error: unknown,
  defaultMessage = "An error occurred"
) => {
  let errorMessage = defaultMessage;

  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message;

    // // Special handling for 401 errors
    // if (error.response?.status === 401) {
    //   // You might want to trigger logout here
    // }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  message.error(errorMessage);

  // Log to error tracking service in production
  if (process.env.NODE_ENV === "production") {
    console.error("Error:", error);
  }

  return errorMessage;
};
