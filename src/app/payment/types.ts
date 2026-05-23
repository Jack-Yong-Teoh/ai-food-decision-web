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
  reference: string;
  type: string;
  amount: number;
  status: string;
}
