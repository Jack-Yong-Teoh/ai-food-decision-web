"use client";
import '../../styles/history/history.scss';

import React, { useEffect, useState } from "react";
import {
  Divider,
  Empty,
  Image,
  message,
  Modal,
  Pagination,
  Spin,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  FileTextOutlined,
  FireOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import { useAppSelector } from '@/redux/hook';
import { FoodItem, getFood, getFoods, GetFoodsResponse } from "@/services/api/history";
import { LazyloadParams, OperatorEnum, SortEnum } from '@/types/general';

import LayoutSection from "../_components/layout/LayoutSection";

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

// 详情弹窗展示类型
interface DetailItem {
  id: number;
  name: string;
  cuisine: string;
  calories: string;
  description: string;
  ingredients: string[];
  imageUrl: string;
  createdDate: string;
}

const PAGE_SIZE = 10;

const HistoryPage: React.FC = () => {
  const profileUserId = useAppSelector(
    (state) => state.profile.data?.id,
  );
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null);

  /**
   * 将 API 列表数据映射到页面展示结构
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

  /**
   * 将单个 Food API 响应映射到详情展示结构
   */
  const mapApiToDetail = (item: FoodItem): DetailItem => {
    return {
      id: item.id,
      name: item.food_name,
      cuisine: item.food_type + " Cuisine",
      calories: item.calories,
      description: item.description,
      ingredients: item.ingredients
        ? item.ingredients.replace(/^\{/, "").replace(/\}$/, "").split(",").map((s: string) => s.trim()).filter(Boolean)
        : [],
      imageUrl: item.image_url,
      createdDate: new Date(item.created_date).toLocaleDateString("zh-CN"),
    };
  };

  const fetchHistory = async (page: number = 1) => {
    setLoading(true);
    try {
      const params: LazyloadParams = {
        filters: [
          {
            field: "user_id",
            operator: OperatorEnum.equals,
            value: profileUserId
          }
        ],
        search: "",
        pagination: {
          limit: PAGE_SIZE,
          page: page,
        },
        sort: {
          order_by: "id",
          sort_order: SortEnum.desc,
        },
        included_fields: [],
        excluded_fields: [],
        export: false,
      };

      const response: GetFoodsResponse = await getFoods(params);

      const mappedItems = mapApiToHistoryItems(response.data);
      setHistoryItems(mappedItems);
      setTotalCount(response.count);
      setCurrentPage(page);
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
    if (profileUserId !== undefined) {
      fetchHistory(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUserId]);

  const handlePageChange = (page: number) => {
    fetchHistory(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = async (foodId: string) => {
    setDetailLoading(true);
    setDetailModalOpen(true);
    try {
      const food: FoodItem = await getFood(Number(foodId));
      setDetailItem(mapApiToDetail(food));
    } catch (error: any) {
      console.error("Fetch food detail failed:", error);
      message.error(error.response?.data?.message || "Failed to load food detail");
      setDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleModalClose = () => {
    setDetailModalOpen(false);
    setDetailItem(null);
  };

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
              {totalCount} recommendation{totalCount !== 1 ? "s" : ""} saved
            </Text>
          </div>
        </div>

        <div className="history__list">
          {historyItems.map((item: HistoryItem) => (
            <div
              key={item.id}
              className="history__card"
              onClick={() => handleCardClick(item.id)}
            >
              <div className="history__card__image-wrapper">
                <Image
                  src={item.image}
                  alt={item.name}
                  className="history__card__image"
                  preview={false}
                  fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjcyNzJiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzllOWU5ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvb2QgSW1hZ2U8L3RleHQ+PC9zdmc+"
                  wrapperStyle={{ width: "100%", height: "100%", display: "block" }}
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

        {totalCount > PAGE_SIZE && (
          <div className="history__pagination">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={totalCount}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="history__pagination__component"
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        open={detailModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={520}
        className="history-detail-modal"
        centered
        destroyOnHidden
        closeIcon={<CloseOutlined />}
      >
        {detailLoading ? (
          <div className="history-detail-modal__loading">
            <Spin size="large" />
          </div>
        ) : detailItem ? (
          <div className="history-detail-modal__content">
            <div className="history-detail-modal__image-wrapper">
              <Image
                src={detailItem.imageUrl}
                alt={detailItem.name}
                className="history-detail-modal__image"
                preview={false}
                fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjcyNzJiIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzllOWU5ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZvb2QgSW1hZ2U8L3RleHQ+PC9zdmc+"
                wrapperStyle={{ width: "100%", height: "100%", display: "block" }}
              />
              <div className="history-detail-modal__image-overlay">
                <div className="history-detail-modal__name">{detailItem.name}</div>
                <div className="history-detail-modal__cuisine">
                  <ShopOutlined style={{ marginRight: "6px" }} />
                  {detailItem.cuisine}
                </div>
              </div>
            </div>

            <div className="history-detail-modal__body">
              <div className="history-detail-modal__calories">
                <FireOutlined style={{ marginRight: "6px" }} />
                {detailItem.calories} cal
              </div>

              <Divider className="history-detail-modal__divider" />

              <div className="history-detail-modal__section">
                <div className="history-detail-modal__section-title">
                  <FileTextOutlined style={{ marginRight: "8px" }} />
                  Description
                </div>
                <div className="history-detail-modal__section-content">
                  {detailItem.description}
                </div>
              </div>

              <Divider className="history-detail-modal__divider" />

              <div className="history-detail-modal__section">
                <div className="history-detail-modal__section-title">
                  <UnorderedListOutlined style={{ marginRight: "8px" }} />
                  Main Ingredients
                </div>
                <div className="history-detail-modal__ingredients">
                  {detailItem.ingredients.map((ingredient) => (
                    <Tag key={ingredient} className="history-detail-modal__ingredient-tag">
                      {ingredient}
                    </Tag>
                  ))}
                </div>
              </div>

              <Divider className="history-detail-modal__divider" />

              <div className="history-detail-modal__meta">
                <CalendarOutlined style={{ marginRight: "6px", fontSize: "13px" }} />
                <Text className="history-detail-modal__meta-text">
                  Created on {detailItem.createdDate}
                </Text>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </LayoutSection>
  );
};

export default HistoryPage;
