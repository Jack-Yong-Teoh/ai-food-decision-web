export interface Filter {
  field: string;
  operator: OperatorEnum;
  value: string | number | boolean | null;
}

export interface Pagination {
  limit: number;
  page: number;
}

export interface Sort {
  order_by: string;
  sort_order: SortEnum;
}

export interface LazyloadParams {
  filters: Filter[];
  search?: string;
  pagination: Pagination;
  sort: Sort;
  included_fields?: string[];
  excluded_fields?: string[];
  export?: boolean;
}

export interface LazyloadResponseState {
  count?: number;
  loading?: boolean;
}

export enum SortEnum {
  asc = "asc",
  desc = "desc",
}

export enum OperatorEnum {
  is = "is",
  is_not = "is_not",
  exact = "exact",
  equals = "equals",
  not_equals = "not_equals",
  contains = "contains",
  in = "in",
  not_in = "not_in",
  gte = "gte",
  gt = "gt",
  lte = "lte",
  lt = "lt",
}
