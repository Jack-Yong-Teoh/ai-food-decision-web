import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, Dropdown, Image, Layout, Menu, message, Skeleton } from "antd";
import { AxiosError } from "axios";
import {
  BulbOutlined,
  CoffeeOutlined,
  CreditCardOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import LoginModal from "@/app/_components/layout/LoginModal";
import IMAGES from "@/assets/images";
import coinsSecondary from "@/assets/paymentassets/coins-secondary.svg";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCollapsed } from "@/redux/slices/layoutSlice";
import {
  closeLoginModal,
  closeSignUpModal,
  openLoginModal,
  openSignUpModal,
} from "@/redux/slices/modalSlice";
import { setProfile } from "@/redux/slices/profileSlice";
import { getUserProfile } from "@/services/api/user";
import { getWallet } from "@/services/api/wallet";
import { handleApiError } from "@/utils/apiHelper/errorHandler";

import LayoutFooter from "./Footer";
import SignUpModal from "./SignUpModal";
import { GetUserDropdownItems } from "./UserDropdownMenu";

const { Header, Sider } = Layout;


interface LayoutSectionProps {
  children: ReactNode;
  noPadding?: boolean;
  showFooter?: boolean;
}
interface MenuItem {
  key: string;
  icon?: ReactNode;
  label: ReactNode;
  children?: MenuItem[];
  disabled?: boolean;
  showFooter?: boolean;
}

const LayoutSection: React.FC<LayoutSectionProps> = ({
  children,
  noPadding,
  showFooter = true,
}) => {
  const dispatch = useAppDispatch();
  const { isLogin } = useAuth();
  const isAdmin = useAppSelector((state) => state.profile.data?.is_superuser);
  const collapsed = useAppSelector((state) => state.layout.collapsed);
  const logoutProgress = useAppSelector((state) => state.layout.logoutProgress);
  const profile = useAppSelector((state) => state.profile.data);

  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const currentKey = pathname.split("/")[1];

  const [selectedKey, setSelectedKey] = useState<string>(currentKey);
  const [wallet, setWallet] = useState<any>(null);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const loginModalOpen = useAppSelector((state) => state.modal.loginModalOpen);
  const signUpModalOpen = useAppSelector(
    (state) => state.modal.signUpModalOpen,
  );

  const userDropdownItems = GetUserDropdownItems({ isLoggedIn: isLogin });

  const menuItems = useMemo(() => {
    const createMenuLabel = (href: string, label: string) => (
      <a
        href={href}
        className={`layout__section__menu__bar__item__anchor`}
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey || e.button === 1) {
            return;
          }
          e.preventDefault();
          setSelectedKey(href.split("/")[1]);
          startTransition(() => {
            router.push(href);
          });
        }}
      >
        {label}
      </a>
    );

    const items: (false | MenuItem)[] = [
      {
        key: "recommend",
        icon: <CoffeeOutlined />,
        label: createMenuLabel("/recommend", "Recommend"),
        disabled: false,
      },
      {
        key: "lucky-pick",
        icon: <BulbOutlined />,
        label: createMenuLabel("/lucky-pick", "Lucky Pick"),
        disabled: false,
      },
      {
        key: "history",
        icon: <HistoryOutlined />,
        label: createMenuLabel("/history", "History"),
        disabled: !isLogin,
      },
      {
        key: "payment",
        icon: <CreditCardOutlined />,
        label: createMenuLabel("/payment", "Payment"),
        disabled: !isLogin,
      },
      isAdmin && {
        key: "user-management",
        icon: <TeamOutlined />,
        label: createMenuLabel("/user-management", "Manage User"),
        disabled: !isAdmin && !isLogin,
      },
      isAdmin && {
        key: "lucky-pick-management",
        icon: <PlusCircleOutlined />,
        label: createMenuLabel("/lucky-pick-management", "Manage Lucky Pick"),
        disabled: !isAdmin && !isLogin,
      },
    ];

    return items.filter(Boolean) as MenuItem[];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, isAdmin]);

  useEffect(() => {
    if (isLogin) {
      fetchUserProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin]);

  useEffect(() => {
    setScreenWidth(window.innerWidth);

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCollapse = () => {
    dispatch(setCollapsed(!collapsed));
  };

  const handleMenu = (key: string) => {
    const item = menuItems.find((i) => i.key === key);
    if (item?.disabled) {
      message.open({
        type: "warning",
        content: "Please log in to access this page.",
        key: "auth-required",
        duration: 2,
      });
      dispatch(openSignUpModal());
      return;
    }

    const targetPath = `/${key}`;
    if (!pathname.startsWith(targetPath) || pathname !== targetPath) {
      setSelectedKey(key);
      startTransition(() => {
        router.push(targetPath);
      });
    }
  };

  const handleLogoClick = () => {
    if (pathname !== "/") {
      setSelectedKey("recommend");
      router.push("/");
    }
  };

  const fetchUserProfile = async () => {
    try {
      const data = await getUserProfile();
      fetchWallet(data?.wallet_id);
      dispatch(setProfile(data));
    } catch (error) {
      if (error instanceof AxiosError) {
        handleApiError(error, "Error fetching profile.");
      }
    }
  };

  const fetchWallet = async (wallet_id: number) => {
    try {
      const data = await getWallet(wallet_id);
      setWallet(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        handleApiError(error, "Error fetching wallet.");
      }
    }
  };

  useEffect(() => {
    const handleAddTokens = (e: any) => {
      setWallet((prev: any) => {
        if (prev) {
          return { ...prev, balance: prev.balance + e.detail.tokens };
        }
        return { balance: e.detail.tokens };
      });
    };
    window.addEventListener("addTokens", handleAddTokens as EventListener);
    return () => window.removeEventListener("addTokens", handleAddTokens as EventListener);
  }, []);

  return (
    <Layout className={`layout__section`}>
      <Header className={`layout__section__header`}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapse}
          className={`layout__section__header__button ${
            collapsed ? "collapsed" : ""
          }`}
        />

        <div className={`layout__section__header__middle__container`}>
          <Image
            src={IMAGES.system_logo}
            preview={false}
            className={`layout__section__header__logo`}
            onClick={handleLogoClick}
          />

          <div
            className={`layout__section__header__middle__container__button__container`}
          >
            {isLogin ? (
              <>
                <Button
                  icon={
                    <Image
                      preview={false}
                      src={coinsSecondary.src}
                      className={`layout__section__header__middle__container__button__container__wallet__button__icon`}
                    />
                  }
                  className={`layout__section__header__middle__container__button__container__wallet__button`}
                  onClick={() => router.push("/payment")}
                >
                  {wallet?.balance.toFixed(2) ?? "-"}
                </Button>
                <Dropdown
                  menu={{ items: userDropdownItems }}
                  trigger={["click"]}
                >
                  <Image
                    src={profile?.profile_image || IMAGES.user_icon}
                    preview={false}
                    className={`layout__section__header__middle__container__button__container__avatar loggedIn`}
                  />
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  className={`layout__section__header__middle__container__button__container__login__button primary__button`}
                  onClick={() => dispatch(openLoginModal())}
                >
                  {"Login"}
                </Button>

                <Button
                  className={`layout__section__header__middle__container__button__container__sign__up__button secondary__button`}
                  onClick={() => dispatch(openSignUpModal())}
                >
                  {"Sign Up"}
                </Button>
              </>
            )}
          </div>
        </div>
      </Header>

      <Layout className={`layout__section__layout`}>
        <Sider
          width={210}
          collapsed={collapsed}
          collapsedWidth={screenWidth > 430 ? 80 : 0}
          className={`layout__section__sider`}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            className={`layout__section__sider__menu`}
            items={menuItems.map((item) => ({
              ...item,
              disabled: false,
              className: item.disabled ? "ant-menu-item-disabled" : "",
              onClick: () => handleMenu(item.key),
            }))}
          />
        </Sider>

        <Layout
          className={`layout__section__content ${collapsed && "collapsed"} ${
            noPadding ? "no__padding" : ""
          }`}
        >
          {isPending ? (
            <div className={`layout__section__content__container `}>
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          ) : (
            <>
              <div className={`layout__section__content__container `}>
                <div>{children}</div>
              </div>
            </>
          )}
          <LayoutFooter showFooter={showFooter} />
        </Layout>
      </Layout>

      <LoginModal
        open={loginModalOpen}
        onClose={() => dispatch(closeLoginModal())}
      />

      <SignUpModal
        open={signUpModalOpen}
        onClose={() => dispatch(closeSignUpModal())}
      />

      <div className={`logout__mask ${logoutProgress ? "visible" : ""}`} />
    </Layout>
  );
};

export default LayoutSection;
