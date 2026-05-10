"use client";

import TokenIcon from "./TokenIcon";

interface PaymentBalanceProps {
  tokenBalance: number;
}

const PaymentBalance = ({ tokenBalance }: PaymentBalanceProps) => (
  <div className="payment__balance">
    <TokenIcon className="payment__balance-icon" />
    <div className="payment__balance-title">Current Balance</div>
    <div className="payment__balance-amount">{tokenBalance} Tokens</div>
  </div>
);

export default PaymentBalance;
