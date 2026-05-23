"use client";

import TokenIcon from "./TokenIcon";

interface PaymentBalanceProps {
  tokenBalance: number;
  loading?: boolean;
}

const PaymentBalance = ({ tokenBalance, loading }: PaymentBalanceProps) => (
  <div className="payment__balance">
    <TokenIcon className="payment__balance-icon" variant="light" />
    <div className="payment__balance-title">Current Balance</div>
    <div className="payment__balance-amount">
      {loading ? "..." : `${tokenBalance} Tokens`}
    </div>
  </div>
);

export default PaymentBalance;
