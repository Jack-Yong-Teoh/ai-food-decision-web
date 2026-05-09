"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { QuestionCircleOutlined } from "@ant-design/icons";

import LayoutSection from "@/app/_components/layout/LayoutSection";
import { ROUTES } from "@/constants";
import { deleteUser, getUser, updateUser } from "@/services/api/user";
import { UpdateUserFormValues, UserDetailsState } from "@/types/user";
import { formatDate } from "@/utils/helper";
import useValidator from "@/utils/validator";

const UserDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const validator = useValidator();
  const [updateUserForm] = Form.useForm();

  const initialRender = useRef<boolean>(true);
  const [userDetails, setUserDetails] = useState<UserDetailsState>({
    loading: true,
  });
  const [deletePopconfirmOpen, setDeletePopconfirmOpen] =
    useState<boolean>(false);
  const [isSubmitUserLoading, setIsSubmitUserLoading] =
    useState<boolean>(false);

  const initData = async () => {
    try {
      const userDetailsRes = await getUser(Number(id));
      if (userDetailsRes) {
        setUserDetails({ data: userDetailsRes, loading: false });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        message.error(`${error?.response?.data?.message}`);
      }
    }
  };
  useEffect(() => {
    if (initialRender.current) {
      initData();
      initialRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnFinishUpdateUser = async (
    values: UpdateUserFormValues,
    stickToCurrentPage?: boolean,
  ) => {
    if (id) {
      setIsSubmitUserLoading(true);
      updateUser(Number(id), values)
        .then(() => {
          message.success("Successfully updated the user");

          setUserDetails({
            ...userDetails,
            data: {
              id: Number(id),
              ...values,
              modified_date: new Date().toISOString(),
            },
          });
          if (!stickToCurrentPage) router.push(ROUTES.userManagement);
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            message.error(`${error?.response?.data?.message}`);
          }
        })
        .finally(() => {
          setTimeout(() => {
            setIsSubmitUserLoading(false);
          }, 1000);
        });
    }
  };

  const handleSaveAndContinue = async () => {
    const values = await updateUserForm.validateFields();
    handleOnFinishUpdateUser(values, true);
  };

  const onDeleteUser = () => {
    if (userDetails.data) {
      deleteUser(userDetails.data.id)
        .then(() => {
          router.push(ROUTES.userManagement);
          message.success("Successfully deleted the user");
        })
        .catch((error) => {
          if (error instanceof AxiosError)
            message.error(`${error?.response?.data?.message}`);
        });
    }
  };

  const navigateBack = () => {
    router.push(ROUTES.userManagement);
  };

  return (
    <LayoutSection>
      <div className="user__details">
        {!userDetails?.loading ? (
          <Flex vertical gap={"middle"}>
            <Card
              loading={userDetails?.loading}
              className="user__details__card"
            >
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                  <Form
                    form={updateUserForm}
                    onFinish={handleOnFinishUpdateUser}
                    initialValues={{
                      username: userDetails?.data?.username,
                      first_name: userDetails?.data?.first_name,
                      last_name: userDetails?.data?.last_name,
                      is_active: userDetails?.data?.is_active,
                      is_superuser: userDetails?.data?.is_superuser,
                    }}
                  >
                    <Descriptions
                      layout="horizontal"
                      column={2}
                      bordered={true}
                      size="small"
                      className="user__details__descriptions"
                      title={"Details"}
                      extra={
                        <Popconfirm
                          placement="topLeft"
                          zIndex={999}
                          title={"Delete"}
                          description={
                            "Are you sure you want to delete this user?"
                          }
                          open={deletePopconfirmOpen}
                          okText={"Yes"}
                          cancelText={"Cancel"}
                          onConfirm={() => {
                            onDeleteUser();
                            setDeletePopconfirmOpen(false);
                          }}
                          onCancel={() => setDeletePopconfirmOpen(false)}
                          icon={
                            <QuestionCircleOutlined className="user__details__popconfirm__icon__danger" />
                          }
                        >
                          <Button
                            className="user__details__delete__button"
                            color="danger"
                            variant="solid"
                            onClick={() => {
                              setDeletePopconfirmOpen(true);
                            }}
                          >
                            {"Delete"}
                          </Button>
                        </Popconfirm>
                      }
                    >
                      <Descriptions.Item label={"Username"} span={2}>
                        <Form.Item name="username">
                          <Input autoComplete="off" />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label={"First Name"} span={2}>
                        <Form.Item name="first_name">
                          <Input autoComplete="off" />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label={"Last Name"} span={2}>
                        <Form.Item name="last_name">
                          <Input autoComplete="off" />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label={"Active Status"} span={2}>
                        <Form.Item
                          name="is_active"
                          rules={[validator.required]}
                        >
                          <Select
                            options={[
                              {
                                label: (
                                  <Space className="user__details__safe__typo">
                                    <Typography.Text>
                                      {"Active"}
                                    </Typography.Text>
                                  </Space>
                                ),
                                value: true,
                              },
                              {
                                label: (
                                  <Space className="user__details__danger__typo">
                                    <Typography.Text>
                                      {"Inactive"}
                                    </Typography.Text>
                                  </Space>
                                ),
                                value: false,
                              },
                            ]}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label={"Is Superuser"} span={2}>
                        <Form.Item
                          name="is_superuser"
                          rules={[validator.required]}
                        >
                          <Select
                            options={[
                              {
                                label: (
                                  <Space className="user__details__safe__typo">
                                    <Typography.Text>{"Yes"}</Typography.Text>
                                  </Space>
                                ),
                                value: true,
                              },
                              {
                                label: (
                                  <Space className="user__details__danger__typo">
                                    <Typography.Text>{"No"}</Typography.Text>
                                  </Space>
                                ),
                                value: false,
                              },
                            ]}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label={"Modified Date"} span={2}>
                        {formatDate(userDetails?.data?.modified_date || "")}
                      </Descriptions.Item>
                      <Descriptions.Item label={"Created Date"} span={2}>
                        {formatDate(userDetails?.data?.created_date || "")}
                      </Descriptions.Item>
                    </Descriptions>

                    <Flex
                      gap="middle"
                      justify="space-between"
                      className="save__buttons__area__flex"
                    >
                      <div className="save__buttons__area__flex__left">
                        <Button
                          className="secondary__button"
                          onClick={() => {
                            navigateBack();
                          }}
                        >
                          {"Back"}
                        </Button>
                      </div>

                      <div className="save__buttons__area__flex__right">
                        <Button
                          className="secondary__button"
                          loading={isSubmitUserLoading}
                          onClick={() => handleSaveAndContinue()}
                        >
                          {"Save and Continue"}
                        </Button>

                        <Button
                          className="primary__button"
                          htmlType="submit"
                          disabled={isSubmitUserLoading}
                        >
                          {"Save"}
                        </Button>
                      </div>
                    </Flex>
                  </Form>
                </Col>
              </Row>
            </Card>
          </Flex>
        ) : (
          <Skeleton.Node active className="user__details__skeleton" />
        )}
      </div>
    </LayoutSection>
  );
};

export default UserDetails;
