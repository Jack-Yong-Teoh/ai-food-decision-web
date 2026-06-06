"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Row, TableProps } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import { getLuckyPicks } from "@/services/api/luckyPick";
import { SortEnum } from "@/types/general";
import { LuckyPickData, LuckyPickTableState } from "@/types/luckyPick";
import { handleApiError } from "@/utils/apiHelper/errorHandler";

import { SearchInput } from "../_components/input/SearchInput";
import LayoutSection from "../_components/layout/LayoutSection";
import Table from "../_components/table/Table";

const DEBOUNCE_TIME = 300;
const PAGE_SIZE = 10;

const LuckyPickManagementPage: React.FC = () => {
  const initialRender = useRef<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState<string>("");
  const [luckyPicks, setLuckyPicks] = useState<LuckyPickTableState>({
    loading: true,
    data: [],
    count: 0,
  });

  const fetchLuckyPicks = async (pageNumber = currentPage) => {
    setLuckyPicks((prevState) => ({ ...prevState, loading: true }));

    try {
      const data = await getLuckyPicks({
        filters: [],
        search: searchValue,
        sort: { order_by: "id", sort_order: SortEnum.desc },
        pagination: { limit: PAGE_SIZE, page: pageNumber },
        export: false,
      });

      setLuckyPicks({
        data: data?.data ?? [],
        count: data?.count ?? 0,
        loading: false,
      });
    } catch (error) {
      handleApiError(error, "Error fetching lucky picks.");
      setLuckyPicks({ data: [], count: 0, loading: false });
    }
  };

  useEffect(() => {
    fetchLuckyPicks();
    initialRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      return;
    }

    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      fetchLuckyPicks(1);
    }, DEBOUNCE_TIME);

    return () => {
      clearTimeout(debounceTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const columns: TableProps<LuckyPickData>["columns"] = useMemo(
    () => [
      {
        title: "Option Name",
        dataIndex: "option_name",
        key: "option_name",
        render: (optionName: string | null) => optionName || "-",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (description: string | null) => description || "-",
      },
      {
        title: "Created",
        dataIndex: "created_date",
        key: "created_date",
        render: (createdDate: string | null) =>
          createdDate
            ? new Intl.DateTimeFormat("en-MY", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(createdDate))
            : "-",
      },
      {
        title: "Modified",
        dataIndex: "modified_date",
        key: "modified_date",
        render: (modifiedDate: string | null) =>
          modifiedDate
            ? new Intl.DateTimeFormat("en-MY", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date(modifiedDate))
            : "-",
      },
    ],
    [],
  );

  const handleRefresh = () => {
    fetchLuckyPicks();
  };

  return (
    <LayoutSection>
      <div className="lucky-pick-management">
        <div className="lucky-pick-management__hero">
          <div>
            <div className="lucky-pick-management__hero__title">
              Manage Lucky Pick
            </div>
            <div className="lucky-pick-management__hero__subtitle">
              Review the meals returned by the Lucky Pick API.
            </div>
          </div>
          <div className="lucky-pick-management__hero__summary">
            <span className="lucky-pick-management__hero__summary__value">
              {luckyPicks.count}
            </span>
            <span className="lucky-pick-management__hero__summary__label">
              Total Options
            </span>
          </div>
        </div>

        <div className="lucky-pick-management__toolbar">
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={12} lg={8}>
              <SearchInput
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search lucky pick"
              />
            </Col>
            <Col xs={24} md={12} lg={16}>
              <div className="lucky-pick-management__toolbar__actions">
                <div className="lucky-pick-management__toolbar__meta">
                  {luckyPicks.data.length} visible options
                </div>
                <Button
                  className="secondary__button"
                  icon={<ReloadOutlined />}
                  loading={luckyPicks.loading}
                  onClick={handleRefresh}
                >
                  Refresh
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <Table
          dataSource={luckyPicks.data}
          columns={columns}
          loading={luckyPicks.loading}
          className="lucky-pick-management__table"
          pagination={{
            current: currentPage,
            total: luckyPicks.count,
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            showQuickJumper: true,
            onChange: (pageNumber: number) => {
              setCurrentPage(pageNumber);
              fetchLuckyPicks(pageNumber);
              window.scrollTo({ top: 0, behavior: "smooth" });
            },
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]} - ${range[1]} of ${total} items`,
          }}
        />
      </div>
    </LayoutSection>
  );
};

export default LuckyPickManagementPage;
