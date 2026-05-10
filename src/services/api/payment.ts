export interface PaymentData {
  name: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

export const processPayment = async (_data: PaymentData): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Payment processed successfully." });
    }, 1500); // Simulate API latency
  });
};
