import { LazyloadResponseState } from "./general";

export interface LuckyPickData {
  id: number;
  option_name: string | null;
  description: string | null;
  created_date: string | null;
  modified_date: string | null;
}

export interface LuckyPickLazyloadResponse {
  columns: string[];
  data: LuckyPickData[];
  count: number;
}

export interface LuckyPickTableState extends LazyloadResponseState {
  loading: boolean;
  data: LuckyPickData[];
  count: number;
}

export interface CreateLuckyPickParams {
  option_name: string;
  description: string;
}

export interface UpdateLuckyPickFormValues {
  option_name: string;
  description: string;
}
