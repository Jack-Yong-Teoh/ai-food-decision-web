"use client";
import '../../styles/history/history.scss';
import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Image,
  Spin,
  Empty,
  Popconfirm,
} from "antd";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  CalendarOutlined,
  ShopOutlined,
  FireOutlined,
} from "@ant-design/icons";
import LayoutSection from "../_components/layout/LayoutSection";


const { Title, Text } = Typography;

interface HistoryItem {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  calories: number;
  image: string;
  date: string;
}

// 改成 [] 即可看到空状态（第一张图）
const MOCK_HISTORY_DATA: HistoryItem[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    cuisine: "Italian Cuisine",
    description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil on a crispy thin crust.",
    calories: 520,
    image: "/assets/images/margherita-pizza.webp",
    date: "2026/5/12",
  },
];

const HistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setHistoryItems(MOCK_HISTORY_DATA);
    setLoading(false);
  };

  const handleClearHistory = async () => {
    setClearing(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setHistoryItems([]);
    setClearing(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <LayoutSection>
        <div className="history__loading">
          <Spin size="large" />
        </div>
      </LayoutSection>
    );
  }

  if (!historyItems || historyItems.length === 0) {
    return (
      <LayoutSection>
        <div className="history__empty">
          <Empty
            image={<ClockCircleOutlined className="history__empty__icon" />}
            description={
              <div className="history__empty__content">
                <Text className="history__empty__title">No History Yet</Text>
                <Text className="history__empty__subtitle secondary__text">
                  Your food recommendations will appear here
                </Text>
              </div>
            }
          />
        </div>
      </LayoutSection>
    );
  }

  return (
    <LayoutSection>
      <div className="history">
        <div className="history__header">
          <div className="history__header__info">
            <Title level={3} className="history__header__title">
              Decision History
            </Title>
            <Text className="history__header__count secondary__text">
              {historyItems.length} recommendation saved
            </Text>
          </div>
          <Popconfirm
            title="Clear History"
            description="Are you sure you want to clear all history?"
            onConfirm={handleClearHistory}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: clearing }}
          >
            <Button
              className="history__header__clear-btn"
              icon={<DeleteOutlined />}
              loading={clearing}
            >
              Clear History
            </Button>
          </Popconfirm>
        </div>

        <div className="history__list">
          {historyItems.map((item: HistoryItem) => (
            <div key={item.id} className="history__card">
              <div className="history__card__image-wrapper">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="history__card__image"
                  preview={false}
                  fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjcyNzJiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzllOWU5ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvb2QgSW1hZ2U8L3RleHQ+PC9zdmc+"
                />
              </div>
              <div className="history__card__content">
                <div className="history__card__header">
                  <Text className="history__card__title">{item.name}</Text>
                  <div className="history__card__date">
                    <CalendarOutlined className="history__card__date-icon" />
                    <Text className="history__card__date-text secondary__text">
                      {item.date}
                    </Text>
                  </div>
                </div>
                <div className="history__card__cuisine">
                  <ShopOutlined className="history__card__cuisine-icon" />
                  <Text className="history__card__cuisine-text">
                    {item.cuisine}
                  </Text>
                </div>
                <Text className="history__card__description secondary__text">
                  {item.description}
                </Text>
                <div className="history__card__calories">
                  <FireOutlined className="history__card__calories-icon" />
                  <Text className="history__card__calories-text">
                    {item.calories} cal
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LayoutSection>
  );
};

export default HistoryPage;
