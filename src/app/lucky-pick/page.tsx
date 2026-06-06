"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button, Empty, message, Spin } from "antd";
import {
  PlayCircleOutlined,
  ReloadOutlined,
  StopOutlined,
} from "@ant-design/icons";

import { getLuckyPicks } from "@/services/api/luckyPick";
import { SortEnum } from "@/types/general";
import { LuckyPickData } from "@/types/luckyPick";
import { handleApiError } from "@/utils/apiHelper/errorHandler";

import LayoutSection from "../_components/layout/LayoutSection";

const LUCKY_PICK_LIMIT = 100;
const ROLLING_INTERVAL = 90;
const AUTO_STOP_DELAY = 2600;
const LUCKY_PICK_POSITION_SEQUENCE = [
  4, 8, 22, 36, 7, 13, 25, 31, 1, 11, 18, 35, 5, 15, 21, 28, 3, 12, 24, 34,
  6, 17, 26, 33, 2, 10, 20, 30, 9, 16, 23, 32, 14, 19, 27, 29,
];

const getPositionClass = (index: number) =>
  `lucky-pick__stage__item--${
    LUCKY_PICK_POSITION_SEQUENCE[index % LUCKY_PICK_POSITION_SEQUENCE.length]
  }`;

const LuckyPickPage: React.FC = () => {
  const rollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [foods, setFoods] = useState<LuckyPickData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [rollingFoodId, setRollingFoodId] = useState<number | null>(null);
  const [selectedFood, setSelectedFood] = useState<LuckyPickData | null>(null);

  const availableFoods = useMemo(
    () => foods.filter((food) => Boolean(food.option_name)),
    [foods],
  );

  const getFoodName = (food: LuckyPickData) => food.option_name ?? "Untitled";

  const clearPickingTimers = () => {
    if (rollingTimerRef.current) {
      clearInterval(rollingTimerRef.current);
      rollingTimerRef.current = null;
    }

    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  };

  const fetchLuckyPicks = async () => {
    setLoading(true);

    try {
      const data = await getLuckyPicks({
        filters: [],
        search: "",
        sort: { order_by: "id", sort_order: SortEnum.desc },
        pagination: { limit: LUCKY_PICK_LIMIT, page: 1 },
        export: false,
      });

      setFoods(data?.data ?? []);
    } catch (error) {
      handleApiError(error, "Error fetching lucky picks.");
      setFoods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLuckyPicks();

    return () => {
      clearPickingTimers();
    };
  }, []);

  const finishPick = () => {
    clearPickingTimers();

    if (!availableFoods.length) {
      message.warning("No lucky pick options are available.");
      setIsPicking(false);
      setRollingFoodId(null);
      return;
    }

    const food =
      availableFoods[Math.floor(Math.random() * availableFoods.length)];

    setRollingFoodId(food.id);
    setSelectedFood(food);
    setIsPicking(false);
    message.success(`Lucky pick: ${getFoodName(food)}`);
  };

  const startPick = () => {
    if (!availableFoods.length) {
      message.warning("No lucky pick options are available.");
      return;
    }

    clearPickingTimers();
    setSelectedFood(null);
    setIsPicking(true);

    rollingTimerRef.current = setInterval(() => {
      const food =
        availableFoods[Math.floor(Math.random() * availableFoods.length)];
      setRollingFoodId(food.id);
    }, ROLLING_INTERVAL);

    autoStopTimerRef.current = setTimeout(() => {
      finishPick();
    }, AUTO_STOP_DELAY);
  };

  const handleLuckyPick = () => {
    if (isPicking) {
      finishPick();
      return;
    }

    startPick();
  };

  const handlePickAgain = () => {
    startPick();
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

        <div
          className={`lucky-pick__panel ${isPicking ? "is-picking" : ""} ${
            selectedFood ? "has-result" : ""
          }`}
        >
          <div className="lucky-pick__stage">
            {loading && (
              <div className="lucky-pick__stage__loading">
                <Spin />
              </div>
            )}

            {!loading && !availableFoods.length && (
              <div className="lucky-pick__stage__empty">
                <Empty description="No lucky pick options" />
              </div>
            )}

            {availableFoods.map((food, index) => (
              <span
                key={food.id}
                className={`lucky-pick__stage__item ${getPositionClass(index)} ${
                  selectedFood?.id === food.id || rollingFoodId === food.id
                    ? "is-selected"
                    : ""
                }`}
              >
                {getFoodName(food)}
              </span>
            ))}

            <div
              className={`lucky-pick__stage__center ${
                selectedFood ? "has-result" : ""
              }`}
            >
              {selectedFood && (
                <>
                  <span className="lucky-pick__stage__center__halo" />
                  <span className="lucky-pick__stage__center__spark lucky-pick__stage__center__spark--1" />
                  <span className="lucky-pick__stage__center__spark lucky-pick__stage__center__spark--2" />
                  <span className="lucky-pick__stage__center__spark lucky-pick__stage__center__spark--3" />
                  <span className="lucky-pick__stage__center__spark lucky-pick__stage__center__spark--4" />
                </>
              )}
              <div className="lucky-pick__stage__center__question">
                {selectedFood ? getFoodName(selectedFood) : "What should I eat?"}
              </div>
              {selectedFood && (
                <div className="lucky-pick__stage__center__answer">
                  Perfect choice!
                </div>
              )}
            </div>

            <div className="lucky-pick__stage__actions">
              <Button
                className="lucky-pick__stage__actions__button"
                disabled={loading || !availableFoods.length}
                icon={isPicking ? <StopOutlined /> : <PlayCircleOutlined />}
                loading={loading}
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
              <span>The animation will stop and reveal your meal</span>
            </div>
            <div className="lucky-pick__guide__line">
              <span className="lucky-pick__guide__line__bullet">-</span>
              <span>Let fate decide your next delicious meal!</span>
            </div>
          </div>
        </div>
      </div>
    </LayoutSection>
  );
};

export default LuckyPickPage;
