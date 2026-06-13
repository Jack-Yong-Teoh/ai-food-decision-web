"use client";

import "../../styles/recommend/recommend.scss";

import RecommendAuthGate from "./_components/RecommendAuthGate";
import RecommendPageContent from "./_components/RecommendPageContent";

const RecommendPage = () => {
  return (
    <RecommendAuthGate>
      <RecommendPageContent />
    </RecommendAuthGate>
  );
};

export default RecommendPage;
