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
  Skeleton,
} from "antd";
import { AxiosError } from "axios";
import { QuestionCircleOutlined } from "@ant-design/icons";

import LayoutSection from "@/app/_components/layout/LayoutSection";
import { ROUTES } from "@/constants/routes";
import { deleteLuckyPick, getLuckyPick, updateLuckyPick } from "@/services/api/luckyPick";
import { LuckyPickData, UpdateLuckyPickFormValues } from "@/types/luckyPick";
import { formatDate } from "@/utils/helper";
import useValidator from "@/utils/validator";

interface LuckyPickDetailsState {
  loading: boolean;
  data?: LuckyPickData;
}

const LuckyPickDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const validator = useValidator();
  const [updateLuckyPickForm] = Form.useForm();

  const initialRender = useRef<boolean>(true);
  const [luckyPickDetails, setLuckyPickDetails] = useState<LuckyPickDetailsState>({
    loading: true,
  });
  const [deletePopconfirmOpen, setDeletePopconfirmOpen] =
    useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const initData = async () => {
    try {
      const detailsRes = await getLuckyPick(Number(id));
      if (detailsRes) {
        setLuckyPickDetails({ data: detailsRes, loading: false });
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

  const handleOnFinishUpdate = async (
    values: UpdateLuckyPickFormValues,
    stickToCurrentPage?: boolean,
  ) => {
    if (id) {
      setIsSubmitLoading(true);
      updateLuckyPick(Number(id), values)
        .then(() => {
          message.success("Successfully updated the lucky pick");

          setLuckyPickDetails({
            ...luckyPickDetails,
            data: {
              ...luckyPickDetails.data!,
              ...values,
              modified_date: new Date().toISOString(),
            },
          });
          if (!stickToCurrentPage) router.push(ROUTES.luckyPickManagement);
        })
        .catch((error) => {
          if (error instanceof AxiosError) {
            message.error(`${error?.response?.data?.message}`);
          }
        })
        .finally(() => {
          setTimeout(() => {
            setIsSubmitLoading(false);
          }, 1000);
        });
    }
  };

  const handleSaveAndContinue = async () => {
    const values = await updateLuckyPickForm.validateFields();
    handleOnFinishUpdate(values, true);
  };

  const onDeleteAction = () => {
    if (luckyPickDetails.data) {
      deleteLuckyPick(luckyPickDetails.data.id)
        .then(() => {
          router.push(ROUTES.luckyPickManagement);
          message.success("Successfully deleted the lucky pick");
        })
        .catch((error) => {
          if (error instanceof AxiosError)
            message.error(`${error?.response?.data?.message}`);
        });
    }
  };

  const navigateBack = () => {
    router.push(ROUTES.luckyPickManagement);
  };

  return (
    <LayoutSection>
      <div className="lucky-pick-management__details">
        {!luckyPickDetails?.loading ? (
          <Flex vertical gap={"middle"}>
            <Card
              loading={luckyPickDetails?.loading}
              className="lucky-pick-management__details__card"
            >
              <Row gutter={[20, 20]}>
                <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                  <Form
                    form={updateLuckyPickForm}
                    onFinish={handleOnFinishUpdate}
                    initialValues={{
                      option_name: luckyPickDetails?.data?.option_name,
                      description: luckyPickDetails?.data?.description,
                    }}
                  >
                    <Descriptions
                      layout="horizontal"
                      column={2}
                      bordered={true}
                      size="small"
                      className="lucky-pick-management__details__descriptions"
                      title={"Details"}
                      extra={
                        <Popconfirm
                          placement="topLeft"
                          zIndex={999}
                          title={"Delete"}
                          description={
                            "Are you sure you want to delete this lucky pick?"
                          }
                          open={deletePopconfirmOpen}
                          okText={"Yes"}
                          cancelText={"Cancel"}
                          onConfirm={() => {
                            onDeleteAction();
                            setDeletePopconfirmOpen(false);
                          }}
                          onCancel={() => setDeletePopconfirmOpen(false)}
                          icon={
                            <QuestionCircleOutlined className="lucky-pick-management__details__popconfirm__icon__danger" />
                          }
                        >
                          <Button
                            className="lucky-pick-management__details__delete__button"
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
                      <Descriptions.Item label={"Option Name"} span={2}>
                        <Form.Item name="option_name" rules={[validator.required]}>
                          <Input autoComplete="off" />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label={"Description"} span={2}>
                        <Form.Item name="description">
                          <Input.TextArea autoComplete="off" rows={4} />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label={"Modified Date"} span={2}>
                        {formatDate(luckyPickDetails?.data?.modified_date || "")}
                      </Descriptions.Item>
                      <Descriptions.Item label={"Created Date"} span={2}>
                        {formatDate(luckyPickDetails?.data?.created_date || "")}
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
                          loading={isSubmitLoading}
                          onClick={() => handleSaveAndContinue()}
                        >
                          {"Save and Continue"}
                        </Button>

                        <Button
                          className="primary__button"
                          htmlType="submit"
                          disabled={isSubmitLoading}
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
          <Skeleton.Node active className="lucky-pick-management__details__skeleton" />
        )}
      </div>
    </LayoutSection>
  );
};

export default LuckyPickDetails;
