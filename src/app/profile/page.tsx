"use client";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Skeleton } from "antd";

import { updatePassword } from "@/services/api/auth";
import { getUserProfile, updateUserProfile } from "@/services/api/user";
import { UserData } from "@/types/user";
import { handleApiError } from "@/utils/apiHelper/errorHandler";
import useValidator from "@/utils/validator";

import LayoutSection from "../_components/layout/LayoutSection";

const ProfilePage: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const validator = useValidator();

  const [userData, setUserData] = useState<UserData>();
  const [pageLoading, setPageLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserProfile();
        setUserData(user);
      } catch (error) {
        handleApiError(error, "Failed to load user");
      } finally {
        setPageLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleProfileSubmit = async () => {
    setProfileLoading(true);
    try {
      const { username: _, ...values } = await profileForm.validateFields();
      await updateUserProfile({
        ...values,
      });

      message.success("Successfully updated the profile");
    } catch (error) {
      handleApiError(error, "Failed to update the profile");
    } finally {
      setTimeout(() => {
        setProfileLoading(false);
      }, 1500);
    }
  };

  const handlePasswordSubmit = async () => {
    setPasswordLoading(true);
    try {
      const values = await passwordForm.validateFields();
      const { confirm_password: _, ...rest } = values;
      await updatePassword(rest);
      message.success("Successfully updated the password");
      passwordForm.resetFields();
    } catch (error) {
      handleApiError(error, "Failed to update the password");
    } finally {
      setTimeout(() => {
        setPasswordLoading(false);
      }, 1500);
    }
  };

  return (
    <LayoutSection>
      <div className={`profile`}>
        {pageLoading ? (
          <div className={`profile__skeleton`}>
            <Skeleton active />
            <Skeleton.Button
              active
              shape={"default"}
              className={`profile__skeleton__button`}
            />

            <div className={`profile__divider`} />

            <Skeleton active />
            <Skeleton.Button
              active
              shape={"default"}
              className={`profile__skeleton__button`}
            />
          </div>
        ) : (
          <>
            <div className={`profile__details`}>
              <div className={`profile__details__title`}>
                {"Change Details"}
              </div>
              <Form
                labelCol={{ span: 24 }}
                form={profileForm}
                initialValues={{
                  username: userData?.username,
                  first_name: userData?.first_name,
                  last_name: userData?.last_name,
                }}
                onFinish={handleProfileSubmit}
              >
                <Form.Item label={"Username"} name="username">
                  <Input
                    placeholder={"Username"}
                    autoComplete="username"
                    disabled
                    readOnly
                  />
                </Form.Item>

                <Form.Item label={"First Name"} name="first_name">
                  <Input placeholder={"First Name"} autoComplete="first_name" />
                </Form.Item>

                <Form.Item label={"Last Name"} name="last_name">
                  <Input placeholder={"Last Name"} autoComplete="last_name" />
                </Form.Item>

                <Button
                  type="primary"
                  className={`profile__button primary__button`}
                  htmlType="submit"
                  loading={profileLoading}
                >
                  {"Save"}
                </Button>
              </Form>
            </div>

            <div className={`profile__divider`} />

            <div className={`profile__password`}>
              <div className={`profile__details__title`}>
                {"Change Password"}
              </div>
              <Form
                labelCol={{ span: 24 }}
                form={passwordForm}
                onFinish={handlePasswordSubmit}
              >
                <Form.Item
                  label={"Current Password"}
                  name="current_password"
                  rules={[validator.required, validator.password]}
                >
                  <Input.Password
                    placeholder={"Enter your password"}
                    autoComplete="ori_password"
                  />
                </Form.Item>

                <Form.Item
                  label={"New Password"}
                  name="new_password"
                  rules={[validator.required, validator.password]}
                >
                  <Input.Password
                    placeholder={"Enter your new password"}
                    autoComplete="password"
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
                    placeholder={"Confirm Password"}
                    autoComplete="confirm_password"
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  className={`profile__button primary__button`}
                  loading={passwordLoading}
                >
                  {"Save"}
                </Button>
              </Form>
            </div>
          </>
        )}
      </div>
    </LayoutSection>
  );
};

export default ProfilePage;
