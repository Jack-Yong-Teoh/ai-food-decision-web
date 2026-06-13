"use client";

import { Spin } from "antd";

const RecommendLoadingState = () => {
  return (
    <div className="recommend-loading">
      <div className="recommend-loading__orb recommend-loading__orb--one" />
      <div className="recommend-loading__orb recommend-loading__orb--two" />

      <div className="recommend-loading__card">
        <Spin size="large" />
        <div className="recommend-loading__title">Checking your access</div>
        <div className="recommend-loading__subtitle">
          We are verifying your session before opening the recommendation
          studio.
        </div>
      </div>
    </div>
  );
};

export default RecommendLoadingState;
