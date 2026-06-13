"use client";

import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { AxiosError } from "axios";

import { useAuth } from "@/hooks/auth/useAuth";
import { useAppDispatch } from "@/redux/hook";
import { openSignUpModal } from "@/redux/slices/modalSlice";
import { logIn } from "@/services/api/auth";
import { handleApiError } from "@/utils/apiHelper/errorHandler";
import useValidator from "@/utils/validator";

import Modal from "../modal/Modal";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal = ({ open, onClose }: CustomModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const validator = useValidator();
  const { setIsLogin } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = () => {
    setLoading(true);
    form.validateFields().then(async (values) => {
      try {
        await logIn({
          username: values?.username,
          password: values?.password,
        });
        message.success("Login successful!");
        setIsLogin(true);
        setLoading(false);
        form.resetFields();
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        if (error instanceof AxiosError) {
          handleApiError(error, "Failed to log in, Please try again");
        }
        setLoading(false);
      }
    });
  };

  const handleOnCreateAccount = () => {
    dispatch(openSignUpModal());
    onClose();
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered>
      <div className={`login__modal__container`}>
        <div className={`login__modal__container__title`}>{"Login"}</div>

        <Form onFinish={handleLogin} form={form} labelCol={{ span: 24 }}>
          <Form.Item
            name="username"
            label={"Username"}
            rules={[validator.required]}
          >
            <Input autoComplete="username" placeholder={"Username"} />
          </Form.Item>

          <Form.Item
            name="password"
            label={"Password"}
            rules={[validator.required]}
          >
            <Input.Password
              autoComplete="password"
              placeholder={"Enter your password"}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className={`login__modal__container__login__button primary__button`}
            loading={loading}
          >
            {"Login"}
          </Button>
        </Form>

        <div className={`login__modal__footer`}>
          <div>
            <span className={`login__modal__footer__new__here`}>
              {"New here? "}
            </span>
            <span
              className={`login__modal__footer__create__account`}
              onClick={handleOnCreateAccount}
            >
              {"Create an account"}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
