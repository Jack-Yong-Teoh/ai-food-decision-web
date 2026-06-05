import { LazyloadParams } from "@/types/general";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export interface PaymentData {
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export type TransactionType = "payment" | "top_up" | "refund" | "deduct";

export interface CreateTransactionRequest {
  wallet_id: number;
  amount: number;
  transaction_type: TransactionType;
  reference_id?: string | null;
}

export interface CreateTransactionResponse {
  id: number;
}

export interface LazyloadTransactionRecord {
  id?: number | null;
  wallet_id?: number | null;
  amount?: number | null;
  transaction_type?: TransactionType | null;
  reference_id?: string | null;
  created_date?: string | null;
  modified_date?: string | null;
}

export interface LazyloadTransactionResponse {
  columns: string[];
  data: LazyloadTransactionRecord[];
  count: number;
}

export const processPayment = async (_data: PaymentData): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Payment processed successfully." });
    }, 1500); // Simulate API latency
  });
};

export const createTransaction = async (params: CreateTransactionRequest) => {
  const res = await http.post(ENDPOINT.createTransaction, params);
  return res?.data as CreateTransactionResponse;
};

export const lazyloadTransactions = async (params: LazyloadParams) => {
  const res = await http.post(ENDPOINT.lazyloadTransactions, params);
  return res?.data as LazyloadTransactionResponse;
};
