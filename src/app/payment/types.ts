export interface Package {
  id: string;
  name: string;
  tokens: number;
  price: number;
  unitPrice: number;
  save?: number;
  isPopular?: boolean;
}

export interface PaymentHistoryRecord {
  key: string;
  date: string;
  packageName: string;
  tokens: number;
  amount: number;
  status: string;
}
