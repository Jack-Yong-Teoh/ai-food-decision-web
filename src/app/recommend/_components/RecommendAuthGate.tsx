"use client";

import { ReactNode, useEffect, useState } from "react";

import { useAuth } from "@/hooks/auth/useAuth";

import LayoutSection from "../../_components/layout/LayoutSection";
import RecommendGuestState from "./RecommendGuestState";
import RecommendLoadingState from "./RecommendLoadingState";

interface RecommendAuthGateProps {
  children: ReactNode;
}

const RecommendAuthGate = ({ children }: RecommendAuthGateProps) => {
  const { isLogin } = useAuth();
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    setIsChecking(false);
  }, []);

  return (
    <LayoutSection>
      {isChecking ? (
        <RecommendLoadingState />
      ) : isLogin ? (
        children
      ) : (
        <RecommendGuestState />
      )}
    </LayoutSection>
  );
};

export default RecommendAuthGate;
