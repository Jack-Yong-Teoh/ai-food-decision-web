"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  message,
  Select,
  Space,
  Typography,
} from "antd";
import { AxiosError } from "axios";

import LayoutSection from "@/app/_components/layout/LayoutSection";
import { ROUTES } from "@/constants/routes";
import { createUser } from "@/services/api/user";
import { CreateUserFormValues, CreateUserParams } from "@/types/user";
import useValidator from "@/utils/validator";

const CreateUser = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const validator = useValidator();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnFinish = async (
    values: CreateUserFormValues,
    stickToCurrentPage?: boolean,
  ) => {
    setIsSubmitting(true);
    const { new_password, confirm_password: _, ...rest } = values;
    const params: CreateUserParams = { ...rest, password: new_password };

    createUser(params)
      .then(() => {
        message.success("Successfully created the user");
        form.resetFields();
        if (!stickToCurrentPage) router.push(ROUTES.userManagement);
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          message.error(`${error?.response?.data?.message}`);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleSaveAndAdd = async () => {
    const values = await form.validateFields();
    handleOnFinish(values, true);
  };

  const navigateBack = () => {
    router.push(ROUTES.userManagement);
  };

  return (
    <LayoutSection>
      <div className="create__user">
        <Card
          className="create__user__card"
          title={
            <Typography.Title level={4} className="create__user__card__title">
              Create User
            </Typography.Title>
          }
        >
          <Divider className="create__user__divider" />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleOnFinish}
            initialValues={{
              is_active: true,
              is_superuser: false,
            }}
            className="create__user__form"
          >
            <Form.Item
              name="username"
              label={"Username"}
              rules={[validator.required]}
            >
              <Input
                autoComplete="off"
                onChange={(e) => {
                  form.setFieldsValue({ namespace: e.target.value });
                }}
                placeholder={"Enter username"}
              />
            </Form.Item>

            <Form.Item
              name="first_name"
              label={"First Name"}
              rules={[validator.required]}
            >
              <Input autoComplete="off" placeholder={"Enter first name"} />
            </Form.Item>

            <Form.Item
              name="last_name"
              label={"Last Name"}
              rules={[validator.required]}
            >
              <Input autoComplete="off" placeholder={"Enter last name"} />
            </Form.Item>

            <Form.Item
              name="email"
              label={"Email"}
              rules={[validator.required, validator.email]}
            >
              <Input autoComplete="off" placeholder={"Enter email"} />
            </Form.Item>

            <Form.Item
              name="is_active"
              label={"Active Status"}
              rules={[validator.required]}
            >
              <Select
                options={[
                  {
                    label: (
                      <Space className="user__details__safe__typo">
                        <Typography.Text>{"Active"}</Typography.Text>
                      </Space>
                    ),
                    value: true,
                  },
                  {
                    label: (
                      <Space className="user__details__danger__typo">
                        <Typography.Text>{"Inactive"}</Typography.Text>
                      </Space>
                    ),
                    value: false,
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              name="is_superuser"
              label={"Superuser"}
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

            <Form.Item
              label={"New Password"}
              name="new_password"
              rules={[validator.required, validator.password]}
            >
              <Input.Password
                placeholder={"Enter password"}
                autoComplete="off"
              />
            </Form.Item>

            <Form.Item
              label={"Confirm Password"}
              name="confirm_password"
              rules={[
                validator.required,
                validator.password,
                validator.passwordMatchUpdate,
              ]}
            >
              <Input.Password
                placeholder={"Enter confirm password"}
                autoComplete="off"
              />
            </Form.Item>

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
                  loading={isSubmitting}
                  onClick={() => handleSaveAndAdd()}
                >
                  {"Save and Add Another"}
                </Button>

                <Button
                  className="primary__button"
                  htmlType="submit"
                  disabled={isSubmitting}
                >
                  {"Save"}
                </Button>
              </div>
            </Flex>
          </Form>
        </Card>
      </div>
    </LayoutSection>
  );
};

export default CreateUser;
