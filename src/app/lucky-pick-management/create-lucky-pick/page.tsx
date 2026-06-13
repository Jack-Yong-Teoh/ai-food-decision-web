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
  Typography,
} from "antd";
import { AxiosError } from "axios";

import LayoutSection from "@/app/_components/layout/LayoutSection";
import { ROUTES } from "@/constants/routes";
import { createLuckyPick } from "@/services/api/luckyPick";
import { CreateLuckyPickParams } from "@/types/luckyPick";
import useValidator from "@/utils/validator";

const CreateLuckyPick = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const validator = useValidator();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnFinish = async (
    values: CreateLuckyPickParams,
    stickToCurrentPage?: boolean,
  ) => {
    setIsSubmitting(true);

    createLuckyPick(values)
      .then(() => {
        message.success("Successfully created the lucky pick");
        form.resetFields();
        if (!stickToCurrentPage) router.push(ROUTES.luckyPickManagement);
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
    router.push(ROUTES.luckyPickManagement);
  };

  return (
    <LayoutSection>
      <div className="create__lucky-pick-management">
        <Card
          className="create__lucky-pick-management__card"
          title={
            <Typography.Title level={4} className="create__lucky-pick-management__card__title">
              Create Lucky Pick
            </Typography.Title>
          }
        >
          <Divider className="create__lucky-pick-management__divider" />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleOnFinish}
            className="create__lucky-pick-management__form"
          >
            <Form.Item
              name="option_name"
              label={"Option Name"}
              rules={[validator.required]}
            >
              <Input
                autoComplete="off"
                placeholder={"Enter option name"}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label={"Description"}
              rules={[validator.required]}
            >
              <Input.TextArea
                autoComplete="off"
                placeholder={"Enter description"}
                rows={4}
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

export default CreateLuckyPick;
