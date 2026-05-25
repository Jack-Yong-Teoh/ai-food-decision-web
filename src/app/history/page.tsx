"use client";
import '../../styles/history/history.scss';
import React, { useEffect, useState } from "react";
import {
  Typography,
  Image,
  Spin,
  Empty,
  message,
} from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  ShopOutlined,
  FireOutlined,
} from "@ant-design/icons";
import LayoutSection from "../_components/layout/LayoutSection";
import { getFoods, GetFoodsResponse, FoodItem } from "@/services/api/history";

const { Title, Text } = Typography;

// 页面展示用的历史记录类型
interface HistoryItem {
  id: string;
  name: string;
  cuisine: string;
  description: string;
  calories: string;
  image: string;
  date: string;
}

const HistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * 将 API 数据映射到页面展示结构
   */
  const mapApiToHistoryItems = (foods: FoodItem[]): HistoryItem[] => {
    return foods.map((item) => ({
      id: String(item.id),
      name: item.food_name,
      cuisine: item.food_type,
      description: item.description,
      calories: item.calories,
      image: item.image_url,
      date: new Date(item.created_date).toLocaleDateString("zh-CN"),
    }));
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = {
        filters: [],
        search: "",
        pagination: {
          limit: 10,
          page: 1,
        },
        sort: {
          order_by: "id",
          sort_order: "desc" as const,
        },
        included_fields: [],
        excluded_fields: [],
        export: false,
      };

      const response: GetFoodsResponse = await getFoods(params);

      const mappedItems = mapApiToHistoryItems(response.data);
      setHistoryItems(mappedItems);
      setTotalCount(response.count);
    } catch (error: any) {
      console.error("Fetch history failed:", error);
      message.error(error.response?.data?.message || "Failed to load history");
      setHistoryItems([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
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
              {totalCount} recommendation{totalCount !== 1 ? 's' : ''} saved
            </Text>
          </div>
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
