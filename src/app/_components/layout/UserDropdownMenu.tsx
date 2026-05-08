"use client";

import { useRouter } from "next/navigation";
import { type MenuProps, message } from "antd";
import { AxiosError } from "axios";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";

import { useAuth } from "@/hooks/auth/useAuth";
import { useAppDispatch } from "@/redux/hook";
import { setLogoutProgress } from "@/redux/slices/layoutSlice";
import { logOut } from "@/services/api/auth";

interface GetUserDropdownItemsProps {
  isLoggedIn: boolean;
}

export const GetUserDropdownItems = ({
  isLoggedIn,
}: GetUserDropdownItemsProps): MenuProps["items"] => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { setIsLogin } = useAuth();

  const handleLogOut = async () => {
    dispatch(setLogoutProgress(true));
    message.loading("Logging out...");

    try {
      await logOut().then(() => {
        setIsLogin(false);
        dispatch(setLogoutProgress(false));
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        message.error(error?.response?.data?.message || "Failed to log out.");
      } else {
        message.error("Failed to log out.");
      }
      dispatch(setLogoutProgress(false));
    }
  };

  const items: MenuProps["items"] = [];

  if (isLoggedIn) {
    items.push(
      {
        key: "profile",
        icon: <UserOutlined />,
        label: "Profile",
        onClick: () => {
          router.push("/profile");
        },
      },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: () => {
          handleLogOut();
        },
      },
    );
  }

  return items;
};
