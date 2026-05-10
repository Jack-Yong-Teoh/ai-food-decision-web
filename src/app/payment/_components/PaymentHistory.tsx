"use client";

import { Table } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

import type { PaymentHistoryRecord } from "../types";
import type { ColumnsType } from "antd/es/table";

interface PaymentHistoryProps {
  paymentHistory: PaymentHistoryRecord[];
}

const PaymentHistory = ({ paymentHistory }: PaymentHistoryProps) => {
  const columns: ColumnsType<PaymentHistoryRecord> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Package",
      dataIndex: "packageName",
      key: "packageName",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Tokens",
      dataIndex: "tokens",
      key: "tokens",
      render: (tokens: number) => `${tokens} tokens`,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span className="payment-history-badge">{status}</span>
      ),
    },
  ];

  return (
    <div className="payment__history">
      <div className="payment__history-title">
        <HistoryOutlined /> Payment History
      </div>
      <Table
        dataSource={paymentHistory}
        columns={columns}
        pagination={false}
        locale={{ emptyText: "No payment history found." }}
      />
    </div>
  );
};

export default PaymentHistory;
