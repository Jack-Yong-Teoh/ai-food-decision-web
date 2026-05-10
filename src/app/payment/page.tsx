"use client";

import "@/styles/payment/payment.scss";

import React, { useState } from "react";
import { Form } from "antd";
import dayjs from "dayjs";

import { PaymentData, processPayment } from "@/services/api/payment";
import { handleApiError } from "@/utils/apiHelper/errorHandler";

import type { Package, PaymentHistoryRecord } from "./types";

import LayoutSection from "../_components/layout/LayoutSection";

import {
  PaymentBalance,
  PaymentFooter,
  PaymentHeader,
  PaymentHistory,
  PaymentModal,
  PaymentPackages,
  PaymentSuccessModal,
} from "./_components";

const PACKAGES: Package[] = [
  {
    id: "starter",
    name: "Starter Pack",
    tokens: 10,
    price: 4.99,
    unitPrice: 0.5,
  },
  {
    id: "popular",
    name: "Popular Pack",
    tokens: 30,
    price: 12.99,
    unitPrice: 0.43,
    save: 13,
    isPopular: true,
  },
  {
    id: "premium",
    name: "Premium Pack",
    tokens: 100,
    price: 34.99,
    unitPrice: 0.35,
    save: 30,
  },
];

const PaymentPage: React.FC = () => {
  const [form] = Form.useForm();
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryRecord[]>(
    []
  );

  const selectedPackage = PACKAGES.find((p) => p.id === selectedPackageId);

  const handleOpenPaymentModal = () => {
    if (!selectedPackage) return;
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    form.resetFields();
  };

  const handlePaymentSubmit = async (values: PaymentData) => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    try {
      await processPayment(values);

      // On Success
      setTokenBalance((prev) => prev + selectedPackage.tokens);
      window.dispatchEvent(new CustomEvent("addTokens", { detail: { tokens: selectedPackage.tokens } }));
      
      setPaymentHistory((prev) => [
        {
          key: Date.now().toString(),
          date: dayjs().format("M/D/YYYY h:mm:ss A"),
          packageName: selectedPackage.name,
          tokens: selectedPackage.tokens,
          amount: selectedPackage.price,
          status: "Completed",
        },
        ...prev,
      ]);

      setIsPaymentModalOpen(false);
      form.resetFields();
      setIsSuccessModalOpen(true);
    } catch (error) {
      handleApiError(error, "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <LayoutSection>
      <div className="payment">
        <PaymentHeader
          title="Get More Tokens"
          subtitle="Choose a package to continue getting food recommendations"
        />
        <PaymentBalance tokenBalance={tokenBalance} />
        <PaymentPackages
          packages={PACKAGES}
          selectedPackageId={selectedPackageId}
          onSelectPackage={setSelectedPackageId}
          onOpenPaymentModal={handleOpenPaymentModal}
        />
        <PaymentHistory paymentHistory={paymentHistory} />
        <PaymentFooter />
        <PaymentModal
          form={form}
          isOpen={isPaymentModalOpen}
          isProcessing={isProcessing}
          selectedPackage={selectedPackage}
          onClose={handleClosePaymentModal}
          onSubmit={handlePaymentSubmit}
        />
        <PaymentSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
        />
      </div>
    </LayoutSection>
  );
};

export default PaymentPage;
