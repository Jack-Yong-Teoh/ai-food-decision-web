"use client";

import { Image } from "antd";

import coinsPrimary from "@/assets/paymentassets/coins-primary.svg";
import coinsWhite from "@/assets/paymentassets/coins-white.svg";

type TokenIconVariant = "primary" | "light";

interface TokenIconProps {
  className?: string;
  variant?: TokenIconVariant;
}

const TokenIcon = ({ className, variant = "primary" }: TokenIconProps) => {
  const source = variant === "light" ? coinsWhite.src : coinsPrimary.src;

  return <Image preview={false} src={source} className={className} />;
};

export default TokenIcon;
