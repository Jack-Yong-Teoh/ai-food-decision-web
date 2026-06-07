"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Col, Flex, message, Row, TableProps, Tooltip, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { deleteLuckyPick, getLuckyPicks } from "@/services/api/luckyPick";
import { SortEnum } from "@/types/general";
import { LuckyPickData, LuckyPickTableState } from "@/types/luckyPick";
import { formatDate } from "@/utils/helper";

import { SearchInput } from "../_components/input/SearchInput";
import LayoutSection from "../_components/layout/LayoutSection";
import Table from "../_components/table/Table";

const DEBOUNCE_TIME = 300;

const LuckyPickManagementPage = () => {
  const router = useRouter();
  const initialRender = useRef<boolean>(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const [luckyPicks, setLuckyPicks] = useState<LuckyPickTableState>({
    loading: true,
    data: [],
    count: 0,
  });
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("current_page")) || 1,
  );
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get("search_value") || "",
  );

  const initData = async (pageNumber?: number) => {
    await getLuckyPicks({
      filters: [],
      search: searchValue,
      sort: { order_by: "id", sort_order: SortEnum.desc },
      pagination: { limit: 50, page: pageNumber ?? currentPage },
      export: false,
    })
      .then((res) => {
        const { data, count } = res;
        setLuckyPicks({ data, count, loading: false });
      })
      .catch((err) => {
        message.error(`Error: ${err.message}`);
      });
  };

  useEffect(() => {
    if (initialRender.current) {
      initData();
      setIsFirstTime(false);
      initialRender.current = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    } else {
      if (!isFirstTime) {
        setLuckyPicks({ ...luckyPicks, loading: true });
        const debounceTimer = setTimeout(() => {
          initData();
          updateUrlParams();
        }, DEBOUNCE_TIME);

        return () => {
          clearTimeout(debounceTimer);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // Update URL params without triggering immediate reload
  const updateUrlParams = () => {
    const params = new URLSearchParams();

    if (searchValue) params.set("search_value", searchValue);
    if (currentPage !== 1) params.set("current_page", currentPage.toString());

    router.push(`?${params.toString()}`);
  };

  const columns: TableProps<LuckyPickData>["columns"] = useMemo(
    () => [
      {
        title: "Option Name",
        dataIndex: "option_name",
        key: "option_name",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        width: "40%",
      },
      {
        title: "Created Date",
        dataIndex: "created_date",
        key: "created_date",
        render: (data: string) => {
          return formatDate(data);
        },
      },
      {
        title: "Modified Date",
        dataIndex: "modified_date",
        key: "modified_date",
        render: (data: string) => {
          return formatDate(data);
        },
      },
    ],
    [],
  );

  const onViewLuckyPickDetails = (luckyPickId: React.Key) => {
    router.push(`/lucky-pick-management/${luckyPickId}`);
  };

  const onDeleteLuckyPick = (luckyPickId: React.Key) => {
    setLuckyPicks({ ...luckyPicks, loading: true });

    deleteLuckyPick(Number(luckyPickId))
      .then(() => {
        setTimeout(() => {
          initData();
        }, DEBOUNCE_TIME);
        message.success("Successfully deleted the lucky pick");
      })
      .catch((err) => {
        message.error(`Error: ${err.message}`);
      });
  };

  const onClickCreateLuckyPick = () => {
    router.push(`/lucky-pick-management/create-lucky-pick`);
  };

  return (
    <LayoutSection>
      <div className={'page__header'}>{'Lucky Pick Management'}</div>
      <Flex vertical gap={"middle"}>
        <Row gutter={[10, 10]}>
          <Col xs={14} sm={16} md={12} lg={12} xl={8} xxl={6}>
            <SearchInput
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={"Search"}
            />
          </Col>
          <Col
            xs={10}
            sm={8}
            md={{ offset: 6, span: 6 }}
            lg={{ offset: 8, span: 4 }}
            xl={{ offset: 13, span: 3 }}
            xxl={{ offset: 14, span: 4 }}
            style={{ display: "block" }}
          >
            <Flex justify="end">
              <Tooltip title={"Create Lucky Pick"}>
                <Button className="primary__button" onClick={onClickCreateLuckyPick}>
                  <PlusOutlined />
                  {"Create"}
                </Button>
              </Tooltip>
            </Flex>
          </Col>
        </Row>

        <Table
          dataSource={luckyPicks?.data}
          columns={columns}
          loading={luckyPicks.loading}
          className="lucky-pick-management__table"
          actions={[`${"delete"}`]}
          onClickRow={onViewLuckyPickDetails}
          onDelete={onDeleteLuckyPick}
          pagination={{
            current: currentPage,
            total: luckyPicks.count,
            pageSize: 50,
            showSizeChanger: false,
            showQuickJumper: true,
            onChange: (pageNumber: number) => {
              setCurrentPage(pageNumber);
              initData(pageNumber);

              window.scrollTo({ top: 0, behavior: "smooth" });
            },
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]} - ${range[1]} ${"of"} ${total} ${"items"}`,
          }}
        />
      </Flex>
    </LayoutSection>
  );
};

export default LuckyPickManagementPage;
