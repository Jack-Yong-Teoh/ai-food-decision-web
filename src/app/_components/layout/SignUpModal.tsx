import { useState } from "react";
import { Button, Flex, Form, Input, message } from "antd";
import { AxiosError } from "axios";

import { useAuth } from "@/hooks/auth/useAuth";
import { useAppDispatch } from "@/redux/hook";
import { openLoginModal } from "@/redux/slices/modalSlice";
import { logIn,signUp } from "@/services/api/auth";
import { handleApiError } from "@/utils/apiHelper/errorHandler";
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
      const params = {
        username: values.username,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      };
      try {
        await signUp(params);
        await logIn({ username: params.username, password: params.password });
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
          handleApiError(error, "Failed to sign up");
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

          <Flex gap={10}>
            <Form.Item
              name="first_name"
              label={"First Name"}
              className={`signup__modal__input`}
              rules={[validator.required]}
            >
              <Input
                autoComplete="first_name"
                placeholder={"Enter your first name"}
              />
            </Form.Item>

            <Form.Item
              name="last_name"
              label={"Last Name"}
              className={`signup__modal__input`}
              rules={[validator.required]}
            >
              <Input
                autoComplete="last_name"
                placeholder={"Enter your last name"}
              />
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
