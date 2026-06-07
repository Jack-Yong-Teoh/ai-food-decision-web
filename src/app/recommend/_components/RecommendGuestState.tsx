"use client";

import { useRouter } from "next/navigation";
import { Button, Space } from "antd";
import {
  ArrowRightOutlined,
  HeartOutlined,
  LockOutlined,
  RadarChartOutlined,
  StarFilled,
} from "@ant-design/icons";

import { useAppDispatch } from "@/redux/hook";
import { openLoginModal, openSignUpModal } from "@/redux/slices/modalSlice";

const guestBenefits = [
  {
    icon: <RadarChartOutlined />,
    title: "AI meal matching",
    description:
      "Get recommendations shaped by cuisine, mood, and dietary needs.",
  },
  {
    icon: <HeartOutlined />,
    title: "Save your taste profile",
    description:
      "Keep your preferences ready for the next time you need a quick answer.",
  },
  {
    icon: <LockOutlined />,
    title: "Secure member access",
    description: "Your recommendation history stays linked to your account.",
  },
];

const RecommendGuestState = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRegister = () => {
    dispatch(openSignUpModal());
  };

  const handleLogin = () => {
    dispatch(openLoginModal());
  };

  const handleAboutUs = () => {
    router.push("/about-us");
  };

  return (
    <div className="recommend-guest">
      <div className="recommend-guest__content">
        <Space direction="vertical" size={14} className="recommend-guest__copy">
          <div className="recommend-guest__badge">
            <StarFilled />
            Members only
          </div>

          <h1 className="recommend-guest__title">
            Personal food recommendations start with a free account.
          </h1>

          <p className="recommend-guest__subtitle">
            Register to unlock AI-generated meal ideas, remember your
            preferences, and build a history of dishes you actually want to eat.
          </p>

          <div className="recommend-guest__actions">
            <Button
              type="primary"
              size="large"
              className="recommend-guest__actions__primary"
              onClick={handleRegister}
            >
              Create account
              <ArrowRightOutlined />
            </Button>

            <Button
              size="large"
              className="recommend-guest__actions__secondary"
              onClick={handleLogin}
            >
              I already have an account
            </Button>

            <Button
              size="large"
              className="recommend-guest__actions__secondary"
              onClick={handleAboutUs}
            >
              About us
            </Button>
          </div>
        </Space>

        <div className="recommend-guest__benefits">
          {guestBenefits.map((benefit) => (
            <div key={benefit.title} className="recommend-guest__benefit-card">
              <div className="recommend-guest__benefit-card__icon">
                {benefit.icon}
              </div>
              <div className="recommend-guest__benefit-card__title">
                {benefit.title}
              </div>
              <div className="recommend-guest__benefit-card__description">
                {benefit.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recommend-guest__panel">
        <div className="recommend-guest__panel__glow recommend-guest__panel__glow--one" />
        <div className="recommend-guest__panel__glow recommend-guest__panel__glow--two" />

        <div className="recommend-guest__panel__card">
          <div className="recommend-guest__panel__card__eyebrow">Preview</div>
          <div className="recommend-guest__panel__card__title">
            A better lunch, in seconds
          </div>
          <div className="recommend-guest__panel__card__description">
            Your future recommendations will adapt to the food you love, the
            mood you are in, and how adventurous you feel today.
          </div>

          <div className="recommend-guest__panel__metrics">
            <div className="recommend-guest__panel__metric">
              <div className="recommend-guest__panel__metric__value">01</div>
              <div className="recommend-guest__panel__metric__label">
                Sign up
              </div>
            </div>
            <div className="recommend-guest__panel__metric">
              <div className="recommend-guest__panel__metric__value">02</div>
              <div className="recommend-guest__panel__metric__label">
                Choose your taste
              </div>
            </div>
            <div className="recommend-guest__panel__metric">
              <div className="recommend-guest__panel__metric__value">03</div>
              <div className="recommend-guest__panel__metric__label">
                Get your pick
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendGuestState;
