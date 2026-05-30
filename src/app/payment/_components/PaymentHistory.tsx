"use client";

import { Table, Typography } from "antd";
import { HistoryOutlined } from "@ant-design/icons";

import type { PaymentHistoryRecord } from "@/types/payment";
import type { ColumnsType } from "antd/es/table";

interface PaymentHistoryProps {
  paymentHistory: PaymentHistoryRecord[];
  loading?: boolean;
  currentPage: number;
  total: number;
  onPageChange: (pageNumber: number) => void;
}

const PaymentHistory = ({
  paymentHistory,
  loading,
  currentPage,
  total,
  onPageChange,
}: PaymentHistoryProps) => {
  const columns: ColumnsType<PaymentHistoryRecord> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      ellipsis: true,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      ellipsis: true,
      render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      ellipsis: true,
      render: (text: string) =>
        text
          .split(" ")
          .map((word) =>
            word ? `${word[0].toUpperCase()}${word.slice(1)}` : word
          )
          .join(" "),
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
      <div className="payment__history-table">
        <Table
          dataSource={paymentHistory}
          columns={columns}
          pagination={{
            current: currentPage,
            total,
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            onChange: onPageChange,
            showTotal: (totalCount: number, range: [number, number]) =>
              `${range[0]} - ${range[1]} of ${totalCount} items`,
          }}
          loading={loading}
          scroll={{ x: "max-content" }}
          locale={{ emptyText: "No payment history found." }}
        />
      </div>
    </div>
  );
};

export default PaymentHistory;
