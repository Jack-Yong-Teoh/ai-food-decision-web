"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Col, Flex, message, Row, TableProps, Tooltip, Typography } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  PlusOutlined,
} from "@ant-design/icons";

import { deleteUser, getUsers } from "@/services/api/user";
import { SortEnum } from "@/types/general";
import { UserData, UserTableState } from "@/types/user";

import { SearchInput } from "../_components/input/SearchInput";
import LayoutSection from "../_components/layout/LayoutSection";
import Table from "../_components/table/Table";

const DEBOUNCE_TIME = 300;

const UserManagementPage = () => {
  const router = useRouter();
  const initialRender = useRef<boolean>(true);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserTableState>({
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
    await getUsers({
      filters: [],
      search: searchValue,
      sort: { order_by: "id", sort_order: SortEnum.desc },
      pagination: { limit: 50, page: pageNumber ?? currentPage },
      export: false,
    })
      .then((res) => {
        const { data, count } = res;
        setUsers({ data, count, loading: false });
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
        setUsers({ ...users, loading: true });
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

  const columns: TableProps<UserData>["columns"] = useMemo(
    () => [
      {
        title: "Username",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "First Name",
        dataIndex: "first_name",
        key: "first_name",
      },
      {
        title: "Last Name",
        dataIndex: "last_name",
        key: "last_name",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Active Status",
        dataIndex: "is_active",
        key: "is_active",
        align: "center",
        render: (isActive: boolean) => {
          return isActive ? (
            <span>
              <CheckCircleFilled className="user__table__icon__group__check__icon" />
            </span>
          ) : (
            <CloseCircleFilled className="user__table__icon__group__close__icon" />
          );
        },
      },
      {
        title: "Is Superuser",
        dataIndex: "is_superuser",
        key: "is_superuser",
        align: "center",
        render: (isActive: boolean) => {
          return isActive ? (
            <span>
              <CheckCircleFilled className="user__table__icon__group__check__icon" />
            </span>
          ) : (
            <CloseCircleFilled className="user__table__icon__group__close__icon" />
          );
        },
      },
    ],
    [],
  );

  const onViewUserDetails = (userId: React.Key) => {
    router.push(`/user-management/${userId}`);
  };

  const onDeleteUser = (userId: React.Key) => {
    setUsers({ ...users, loading: true });

    deleteUser(Number(userId))
      .then(() => {
        setTimeout(() => {
          initData();
        }, DEBOUNCE_TIME);
        message.success("Successfully deleted the user");
      })
      .catch((err) => {
        message.error(`Error: ${err.message}`);
      });
  };

  const onClickCreateUser = () => {
    router.push(`/user-management/create-user`);
  };

  return (
    <LayoutSection>
      <div className={'page__header'}>{'User Management'}</div>
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
              <Tooltip title={"Create User"}>
                <Button className="primary__button" onClick={onClickCreateUser}>
                  <PlusOutlined />
                  {"Create"}
                </Button>
              </Tooltip>
            </Flex>
          </Col>
        </Row>

        <Table
          dataSource={users?.data}
          columns={columns}
          loading={users.loading}
          className="user__table"
          actions={[`${"delete"}`]}
          onClickRow={onViewUserDetails}
          onDelete={onDeleteUser}
          pagination={{
            current: currentPage,
            total: users.count,
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

export default UserManagementPage;
