"use client";

import { Table } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

import type { PaymentHistoryRecord } from "../types";
import type { ColumnsType } from "antd/es/table";

interface PaymentHistoryProps {
  paymentHistory: PaymentHistoryRecord[];
  loading?: boolean;
}

const PaymentHistory = ({ paymentHistory, loading }: PaymentHistoryProps) => {
  const columns: ColumnsType<PaymentHistoryRecord> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Tokens",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `${amount} tokens`,
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
        loading={loading}
        locale={{ emptyText: "No payment history found." }}
      />
    </div>
  );
};

export default PaymentHistory;
