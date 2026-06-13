"use client";

interface PaymentHeaderProps {
  title: string;
  subtitle: string;
}

const PaymentHeader = ({ title, subtitle }: PaymentHeaderProps) => (
  <div className="payment__header">
    <div className="payment__header-title">{title}</div>
    <div className="payment__header-subtitle">{subtitle}</div>
  </div>
);

export default PaymentHeader;
