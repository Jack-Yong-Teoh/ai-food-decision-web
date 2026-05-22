"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Flex, Input, message, Row, Switch, TableProps, Tag } from "antd";
import { CloseOutlined, PlusOutlined, ReloadOutlined, SaveOutlined } from "@ant-design/icons";

import { SearchInput } from "../_components/input/SearchInput";
import LayoutSection from "../_components/layout/LayoutSection";
import Table from "../_components/table/Table";

interface LuckyPickFood {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
}

const LUCKY_PICK_STORAGE_KEY = "food-genie-lucky-pick-items";

const DEFAULT_FOODS: LuckyPickFood[] = [
  "Pizza",
  "Sushi",
  "Fried Rice",
  "Sandwich",
  "Noodles",
  "Spring Rolls",
  "Fish & Chips",
  "Pho",
  "Hot Pot",
  "Burrito",
  "Salad",
  "Falafel",
  "Dumplings",
  "Pad Thai",
  "Curry",
  "Steak",
  "BBQ Ribs",
  "Tacos",
  "Kebab",
  "Fried Chicken",
  "Pasta",
  "Soup",
  "Ramen",
  "Burger",
].map((name, index) => ({
  id: index + 1,
  name,
  isActive: true,
  createdAt: new Date(2026, 0, index + 1).toISOString(),
}));

const getStoredFoods = () => {
  if (typeof window === "undefined") {
    return DEFAULT_FOODS;
  }

  const storedFoods = window.localStorage.getItem(LUCKY_PICK_STORAGE_KEY);

  if (!storedFoods) {
    window.localStorage.setItem(
      LUCKY_PICK_STORAGE_KEY,
      JSON.stringify(DEFAULT_FOODS),
    );
    return DEFAULT_FOODS;
  }

  try {
    const parsedFoods = JSON.parse(storedFoods) as LuckyPickFood[];
    return parsedFoods.length ? parsedFoods : DEFAULT_FOODS;
  } catch {
    window.localStorage.setItem(
      LUCKY_PICK_STORAGE_KEY,
      JSON.stringify(DEFAULT_FOODS),
    );
    return DEFAULT_FOODS;
  }
};

const LuckyPickManagementPage: React.FC = () => {
  const [foods, setFoods] = useState<LuckyPickFood[]>([]);
  const [foodName, setFoodName] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const activeFoodCount = useMemo(
    () => foods.filter((food) => food.isActive).length,
    [foods],
  );

  const filteredFoods = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) {
      return foods;
    }

    return foods.filter((food) => food.name.toLowerCase().includes(keyword));
  }, [foods, searchValue]);

  useEffect(() => {
    setFoods(getStoredFoods());
    setLoading(false);
  }, []);

  const persistFoods = (nextFoods: LuckyPickFood[]) => {
    setFoods(nextFoods);
    window.localStorage.setItem(
      LUCKY_PICK_STORAGE_KEY,
      JSON.stringify(nextFoods),
    );
    window.dispatchEvent(new Event("lucky-pick-items-updated"));
  };

  const resetForm = () => {
    setFoodName("");
    setEditingId(null);
  };

  const handleSaveFood = () => {
    const normalizedFoodName = foodName.trim();

    if (!normalizedFoodName) {
      message.warning("Please enter a food name.");
      return;
    }

    const hasDuplicateFood = foods.some(
      (food) =>
        food.name.toLowerCase() === normalizedFoodName.toLowerCase() &&
        food.id !== editingId,
    );

    if (hasDuplicateFood) {
      message.warning("This food already exists.");
      return;
    }

    if (editingId) {
      persistFoods(
        foods.map((food) =>
          food.id === editingId ? { ...food, name: normalizedFoodName } : food,
        ),
      );
      message.success("Food item updated.");
      resetForm();
      return;
    }

    persistFoods([
      {
        id: Date.now(),
        name: normalizedFoodName,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      ...foods,
    ]);
    message.success("Food item added.");
    resetForm();
  };

  const handleEditFood = (id: React.Key) => {
    const food = foods.find((item) => item.id === Number(id));

    if (!food) {
      return;
    }

    setFoodName(food.name);
    setEditingId(food.id);
  };

  const handleDeleteFood = (id: React.Key) => {
    const nextFoods = foods.filter((food) => food.id !== Number(id));
    persistFoods(nextFoods);
    message.success("Food item deleted.");

    if (editingId === Number(id)) {
      resetForm();
    }
  };

  const handleToggleFood = (id: number, checked: boolean) => {
    persistFoods(
      foods.map((food) =>
        food.id === id ? { ...food, isActive: checked } : food,
      ),
    );
  };

  const handleResetDefaults = () => {
    persistFoods(DEFAULT_FOODS);
    resetForm();
    message.success("Default food list restored.");
  };

  const columns: TableProps<LuckyPickFood>["columns"] = useMemo(
    () => [
      {
        title: "Food Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        align: "center",
        render: (isActive: boolean) => (
          <Tag
            className={`lucky-pick-management__table__status ${
              isActive ? "is-active" : "is-inactive"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </Tag>
        ),
      },
      {
        title: "Use in Pick",
        dataIndex: "isActive",
        key: "toggle",
        align: "center",
        render: (isActive: boolean, record: LuckyPickFood) => (
          <Switch
            checked={isActive}
            onChange={(checked) => handleToggleFood(record.id, checked)}
          />
        ),
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (createdAt: string) =>
          new Intl.DateTimeFormat("en-MY", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).format(new Date(createdAt)),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [foods],
  );

  return (
    <LayoutSection>
      <div className="lucky-pick-management">
        <div className="lucky-pick-management__hero">
          <div>
            <div className="lucky-pick-management__hero__title">
              Manage Lucky Pick
            </div>
            <div className="lucky-pick-management__hero__subtitle">
              Curate the meals that appear in the Lucky Pick random selector.
            </div>
          </div>
          <div className="lucky-pick-management__hero__summary">
            <span className="lucky-pick-management__hero__summary__value">
              {activeFoodCount}
            </span>
            <span className="lucky-pick-management__hero__summary__label">
              Active Foods
            </span>
          </div>
        </div>

        <div className="lucky-pick-management__form">
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={14} lg={12}>
              <Input
                value={foodName}
                onChange={(event) => setFoodName(event.target.value)}
                onPressEnter={handleSaveFood}
                placeholder="Food name"
                maxLength={40}
              />
            </Col>
            <Col xs={24} md={10} lg={12}>
              <Flex gap="small" wrap="wrap">
                <Button
                  className="primary__button"
                  icon={editingId ? <SaveOutlined /> : <PlusOutlined />}
                  onClick={handleSaveFood}
                >
                  {editingId ? "Save" : "Add Food"}
                </Button>
                {editingId && (
                  <Button
                    className="secondary__button"
                    icon={<CloseOutlined />}
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  className="secondary__button"
                  icon={<ReloadOutlined />}
                  onClick={handleResetDefaults}
                >
                  Reset
                </Button>
              </Flex>
            </Col>
          </Row>
        </div>

        <div className="lucky-pick-management__toolbar">
          <Row gutter={[12, 12]} align="middle">
            <Col xs={24} md={12} lg={8}>
              <SearchInput
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search food"
              />
            </Col>
            <Col xs={24} md={12} lg={16}>
              <div className="lucky-pick-management__toolbar__meta">
                {filteredFoods.length} food items
              </div>
            </Col>
          </Row>
        </div>

        <Table
          dataSource={filteredFoods}
          columns={columns}
          loading={loading}
          className="lucky-pick-management__table"
          actions={["update", "delete"]}
          onUpdate={handleEditFood}
          onDelete={handleDeleteFood}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]} - ${range[1]} of ${total} items`,
          }}
        />
      </div>
    </LayoutSection>
  );
};

export default LuckyPickManagementPage;
