"use client";

import React, { useEffect, useState } from "react";
import {
  Flex,
  Table as AntdTable,
  TableProps as AntTableProps,
  Tooltip,
} from "antd";
import { Popconfirm } from "antd";
import { ColumnsType, ColumnType } from "antd/es/table";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

type TableRowSelection<T> = AntTableProps<T>["rowSelection"];

interface TableProps<T> extends AntTableProps<T> {
  type?: string; // for future different table UI
  actions?: string[];
  isRowSelection?: boolean;
  handleSelectedKeys?: (val: React.Key[]) => void;
  onClickRow?: (key: React.Key) => void;
  onUpdate?: (key: React.Key) => void;
  onDelete?: (key: React.Key) => void;
  onView?: (key: React.Key) => void;
  onCancelDelete?: (key: React.Key) => void;
}

export const Table = <T extends { id: string | number }>({
  type,
  actions,
  isRowSelection = false,
  rowKey = "id",
  handleSelectedKeys,
  onClickRow = undefined,
  onUpdate = undefined,
  onDelete = undefined,
  onView = undefined,
  columns,
  ...props
}: TableProps<T>) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [antColumns, setAntColumns] = useState<ColumnsType<T> | undefined>(
    columns,
  );
  const [popconfirmVisible, setPopconfirmVisible] = useState<React.Key | null>(
    null,
  );

  useEffect(() => {
    handleActionsColumn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, popconfirmVisible, columns]);

  const handleActionsColumn = () => {
    const actionsColumn: ColumnType<T> | undefined = {
      title: "Action",
      dataIndex: "actions",
      key: "actions",
      align: "center",
      render: (_, record: T) => {
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Flex gap={"large"} justify="center">
              {actions?.includes("update") && (
                <EditOutlined
                  className="table__icon__button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPopconfirmVisible(null); // Close any open popconfirm
                    onUpdate?.(record?.id);
                  }}
                />
              )}
              {actions?.includes("delete") && (
                <Popconfirm
                  placement="topLeft"
                  zIndex={999}
                  title={"Delete"}
                  description={"Are you sure to delete this record?"}
                  open={popconfirmVisible === record.id}
                  okText={"Yes"}
                  cancelText={"Cancel"}
                  onConfirm={() => {
                    onDelete?.(record?.id);
                    setPopconfirmVisible(null);
                  }}
                  onCancel={() => setPopconfirmVisible(null)}
                  icon={
                    <QuestionCircleOutlined className="table__popconfirm__title__icon__danger" />
                  }
                >
                  <DeleteOutlined
                    className="table__icon__button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopconfirmVisible(record.id);
                    }}
                  />
                </Popconfirm>
              )}
              {actions?.includes("view") && (
                <Tooltip title={"View"} placement="leftTop">
                  <EyeOutlined
                    className="table__icon__button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPopconfirmVisible(null); // Close any open popconfirm
                      onView?.(record?.id);
                    }}
                  />
                </Tooltip>
              )}
            </Flex>
          </div>
        );
      },
    };

    if (actions && actions.length > 0) {
      setAntColumns([...(columns || []), actionsColumn]);
    } else {
      setAntColumns(columns);
    }
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    handleSelectedKeys?.(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<T> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      {!type && (
        <AntdTable
          className="table scrollbar-visible"
          {...props}
          rowKey={rowKey}
          columns={antColumns}
          onRow={(record) => ({
            className: onClickRow && "table__on__row",
            onClick: () => {
              const keyFromFunction =
                typeof rowKey === "function" ? rowKey(record) : undefined;
              const keyFromString =
                typeof rowKey === "string"
                  ? record?.[rowKey as keyof typeof record]
                  : undefined;
              const key = keyFromFunction ?? keyFromString ?? record?.id;

              onClickRow?.(key as React.Key);
            },
          })}
          rowSelection={isRowSelection ? rowSelection : undefined}
          scroll={props.scroll ?? { x: true }}
          pagination={{
            ...props.pagination,
            locale: {
              jump_to: "jump to",
              page: "page",
            },
          }}
        />
      )}
    </div>
  );
};

Table.Summary = AntdTable.Summary as typeof AntdTable.Summary;

export default Table as typeof Table & {
  Summary: typeof AntdTable.Summary;
};
