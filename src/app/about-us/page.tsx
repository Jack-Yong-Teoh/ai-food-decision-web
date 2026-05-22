"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Col, Flex, Row, Space, Typography } from "antd";
import {
  BulbOutlined,
  HeartOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import LayoutSection from "../_components/layout/LayoutSection";

const { Text, Title } = Typography;

const featureItems = [
  {
    icon: <BulbOutlined />,
    title: "Smarter Decisions",
    description:
      "FoodGenie narrows down choices quickly, so users spend less time debating and more time enjoying their meal.",
  },
  {
    icon: <HeartOutlined />,
    title: "Personal Taste",
    description:
      "The experience is designed around everyday cravings, budget awareness, and practical food discovery.",
  },
  {
    icon: <SafetyCertificateOutlined />,
    title: "Simple Guidance",
    description:
      "Clear recommendations and playful random picks keep the journey approachable for students and busy users.",
  },
];

const stepItems = [
  "Tell FoodGenie what kind of food mood you are in.",
  "Explore recommendations or let Lucky Pick choose for you.",
  "Review your decision history and keep improving your next choice.",
];

const AboutUsPage = () => {
  const router = useRouter();

  return (
    <LayoutSection>
      <div className="about-us">
        <div className="about-us__hero">
          <div className="about-us__hero__content">
            <Text className="about-us__hero__eyebrow">FoodGenie</Text>
            <Title level={1} className="about-us__hero__title">
              Helping people decide what to eat with less stress.
            </Title>
            <Text className="about-us__hero__description">
              FoodGenie is an AI food decision platform built to make daily meal
              choices faster, easier, and a little more fun.
            </Text>
            <Flex className="about-us__hero__actions" gap="middle" wrap="wrap">
              <Button
                className="primary__button about-us__hero__actions__button"
                onClick={() => router.push("/recommend")}
              >
                Explore Recommendations
              </Button>
              <Button
                className="secondary__button about-us__hero__actions__button"
                onClick={() => router.push("/lucky-pick")}
              >
                Try Lucky Pick
              </Button>
            </Flex>
          </div>

          <div className="about-us__hero__panel">
            <div className="about-us__hero__panel__icon">
              <TeamOutlined />
            </div>
            <Text className="about-us__hero__panel__label">Built for</Text>
            <Text className="about-us__hero__panel__value">
              University life, busy schedules, and everyday cravings.
            </Text>
          </div>
        </div>

        <Row gutter={[16, 16]} className="about-us__features">
          {featureItems.map((item) => (
            <Col xs={24} md={8} key={item.title}>
              <Card className="about-us__features__card">
                <div className="about-us__features__card__icon">
                  {item.icon}
                </div>
                <Title level={3} className="about-us__features__card__title">
                  {item.title}
                </Title>
                <Text className="about-us__features__card__description">
                  {item.description}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="about-us__story">
          <div className="about-us__story__content">
            <Title level={2} className="about-us__story__title">
              Our Mission
            </Title>
            <Text className="about-us__story__description">
              We believe choosing food should feel effortless. FoodGenie brings
              together recommendation tools, decision history, wallet-aware
              flows, and a playful Lucky Pick experience to support better daily
              decisions.
            </Text>
          </div>

          <div className="about-us__story__steps">
            {stepItems.map((step, index) => (
              <div className="about-us__story__steps__item" key={step}>
                <span className="about-us__story__steps__item__number">
                  {index + 1}
                </span>
                <Text className="about-us__story__steps__item__text">
                  {step}
                </Text>
              </div>
            ))}
          </div>
        </div>

        <div className="about-us__contact">
          <div className="about-us__contact__content">
            <Title level={2} className="about-us__contact__title">
              Contact Our Team
            </Title>
            <Text className="about-us__contact__description">
              For inquiries or support, please feel free to reach out to the
              FoodGenie team.
            </Text>
          </div>

          <Space
            direction="vertical"
            size="middle"
            className="about-us__contact__details"
          >
            <div className="about-us__contact__details__item">
              <TeamOutlined />
              <Text>University of Malaya</Text>
            </div>
            <div className="about-us__contact__details__item">
              <PhoneOutlined />
              <Text>+60 3453723214</Text>
            </div>
            <div className="about-us__contact__details__item">
              <MailOutlined />
              <Text>25093666@siswa365.um.edu.my</Text>
            </div>
          </Space>
        </div>
      </div>
    </LayoutSection>
  );
};

export default AboutUsPage;
