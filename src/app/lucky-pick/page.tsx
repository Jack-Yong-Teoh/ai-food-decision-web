"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, message } from "antd";
import { PlayCircleOutlined, ReloadOutlined, StopOutlined } from "@ant-design/icons";

import LayoutSection from "../_components/layout/LayoutSection";

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

const LuckyPickPage: React.FC = () => {
  const [foods, setFoods] = useState<LuckyPickFood[]>(DEFAULT_FOODS);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<LuckyPickFood | null>(null);

  const activeFoods = useMemo(
    () => foods.filter((food) => food.isActive),
    [foods],
  );

  useEffect(() => {
    const syncFoods = () => {
      setFoods(getStoredFoods());
    };

    syncFoods();
    window.addEventListener("storage", syncFoods);
    window.addEventListener("lucky-pick-items-updated", syncFoods);

    return () => {
      window.removeEventListener("storage", syncFoods);
      window.removeEventListener("lucky-pick-items-updated", syncFoods);
    };
  }, []);

  const pickFood = () => {
    if (!activeFoods.length) {
      message.warning("Please add an active food item first.");
      setIsPicking(false);
      return;
    }

    const food = activeFoods[Math.floor(Math.random() * activeFoods.length)];
    setSelectedFood(food);
    setIsPicking(false);
    message.success(`Lucky pick: ${food.name}`);
  };

  const handleLuckyPick = () => {
    if (isPicking) {
      pickFood();
      return;
    }

    if (!activeFoods.length) {
      message.warning("Please add an active food item first.");
      return;
    }

    setSelectedFood(null);
    setIsPicking(true);
  };

  const handlePickAgain = () => {
    setSelectedFood(null);
    setIsPicking(true);
  };

  return (
    <LayoutSection showFooter={false}>
      <div className="lucky-pick">
        <div className="lucky-pick__header">
          <div className="lucky-pick__header__title">Lucky Pick</div>
          <div className="lucky-pick__header__subtitle">
            Let fate decide what you should eat today!
          </div>
        </div>

        <div className={`lucky-pick__panel ${isPicking ? "is-picking" : ""}`}>
          <div className="lucky-pick__stage">
            {activeFoods.map((food, index) => (
              <span
                key={food.id}
                className={`lucky-pick__stage__item lucky-pick__stage__item--${
                  (index % 24) + 1
                } ${selectedFood?.id === food.id ? "is-selected" : ""}`}
              >
                {food.name}
              </span>
            ))}

            <div className="lucky-pick__stage__center">
              <div className="lucky-pick__stage__center__question">
                {selectedFood ? selectedFood.name : "What should I eat?"}
              </div>
              {selectedFood && (
                <div className="lucky-pick__stage__center__answer">
                  Today&apos;s lucky meal
                </div>
              )}
            </div>

            <div className="lucky-pick__stage__actions">
              <Button
                className="lucky-pick__stage__actions__button"
                icon={isPicking ? <StopOutlined /> : <PlayCircleOutlined />}
                onClick={handleLuckyPick}
              >
                {isPicking ? "Stop" : "Start"}
              </Button>
              {selectedFood && (
                <Button
                  className="lucky-pick__stage__actions__button lucky-pick__stage__actions__button--secondary"
                  icon={<ReloadOutlined />}
                  onClick={handlePickAgain}
                >
                  Pick Again
                </Button>
              )}
            </div>
          </div>

          <div className="lucky-pick__guide">
            <div className="lucky-pick__guide__title">How to Play</div>
            <div className="lucky-pick__guide__line">
              <span className="lucky-pick__guide__line__bullet">-</span>
              <span>Click &quot;Start&quot; to begin the random selection</span>
            </div>
            <div className="lucky-pick__guide__line">
              <span className="lucky-pick__guide__line__bullet">-</span>
              <span>Watch as food items float around the screen</span>
            </div>
            <div className="lucky-pick__guide__line">
              <span className="lucky-pick__guide__line__bullet">-</span>
              <span>Click &quot;Stop&quot; to randomly pick your meal</span>
            </div>
            <div className="lucky-pick__guide__line">
              <span className="lucky-pick__guide__line__bullet">-</span>
              <span>Let fate decide your next delicious meal!</span>
            </div>
          </div>
        </div>

        <div className="lucky-pick__footer">
          <div className="lucky-pick__footer__brand">FoodGenie</div>
          <div className="lucky-pick__footer__support">
            For any inquiries or support, please feel free to contact our team.
          </div>
          <div className="lucky-pick__footer__text">University of Malaya</div>
          <div className="lucky-pick__footer__text">
            Phone: +60 3453723214
          </div>
          <div className="lucky-pick__footer__text">
            Email: 25093666@siswa365.um.edu.my
          </div>
          <div className="lucky-pick__footer__copyright">
            Copyright 2026 FoodGenie. All rights reserved.
          </div>
        </div>
      </div>
    </LayoutSection>
  );
};

export default LuckyPickPage;
