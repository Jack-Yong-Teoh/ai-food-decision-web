import { useState } from "react";
import { Button, Flex, Form, Input, message } from "antd";
import { AxiosError } from "axios";

import { useAuth } from "@/hooks/auth/useAuth";
import { useAppDispatch } from "@/redux/hook";
import { openLoginModal } from "@/redux/slices/modalSlice";
import { signUp } from "@/services/api/auth";
import useValidator from "@/utils/validator";

import Modal from "../modal/Modal";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
}

const SignUpModal = ({ open, onClose }: CustomModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const validator = useValidator();
  const { setIsLogin } = useAuth();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = () => {
    setLoading(true);
    form.validateFields().then(async (values) => {
      const formData = new FormData();
      formData.append("username", values.username);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      try {
        await signUp(formData);
        message.success("Sign up successful!");
        setIsLogin(true);
        setLoading(false);
        form.resetFields();
        onClose();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        if (error instanceof AxiosError) {
          message.error(
            error?.response?.data?.message ||
              "Sign up failed. Please try again.",
          );
        } else {
          message.error("Sign up failed. Please try again.");
        }
        setLoading(false);
      }
    });
  };

  const handleOnLogin = () => {
    onClose();
    dispatch(openLoginModal());
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} centered>
      <div className={`signup__modal__container`}>
        <div className={`signup__modal__container__title`}>{"Sign Up"}</div>

        <Form onFinish={handleSignUp} form={form} labelCol={{ span: 24 }}>
          <Flex gap={10}>
            <Form.Item
              name="username"
              label={"Username"}
              className={`signup__modal__input`}
              rules={[validator.required, validator.username]}
            >
              <Input
                autoComplete="username"
                placeholder={"Enter your username"}
              />
            </Form.Item>

            <Form.Item
              name="name"
              label={"Name"}
              className={`signup__modal__input`}
              rules={[validator.required]}
            >
              <Input autoComplete="name" placeholder={"Enter your name"} />
            </Form.Item>
          </Flex>

          <Form.Item
            name="email"
            label={"Email Address"}
            rules={[validator.required, validator.email]}
          >
            <Input
              autoComplete="email"
              placeholder={"Enter your email address"}
            />
          </Form.Item>

          <div className={`signup__modal__container__divider`} />

          <Form.Item
            name="password"
            label={"Password"}
            rules={[validator.required, validator.password]}
          >
            <Input.Password
              autoComplete="password"
              placeholder={"Enter your password"}
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label={"Confirm Password"}
            rules={[
              validator.required,
              validator.passwordMatch,
              validator.password,
            ]}
          >
            <Input.Password
              autoComplete="confirm_password"
              placeholder={"Enter your password again"}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className={`signup__modal__container__signup__button primary__button`}
            loading={loading}
          >
            {"Sign Up"}
          </Button>
        </Form>

        <div className={`signup__modal__footer`}>
          <div>
            <span className={`signup__modal__footer__already__account`}>
              {"Already have an account? "}
            </span>
            <span
              className={`signup__modal__footer__login__here`}
              onClick={handleOnLogin}
            >
              {"Login here"}
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignUpModal;
