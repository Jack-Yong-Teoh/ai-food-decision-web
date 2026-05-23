"use client";

import "@/styles/payment/payment.scss";

import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

import { PACKAGE_TOKEN_MAP, PRICE_TOKEN_MAP } from "@/constants";
import { useAppSelector } from "@/redux/hook";
import {
  createTransaction,
  lazyloadTransactions,
  PaymentData,
  processPayment,
} from "@/services/api/payment";
import { LazyloadParams, OperatorEnum, SortEnum } from "@/types/general";
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
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryRecord[]>(
    []
  );
  const walletId = useAppSelector((state) => state.profile.data?.wallet_id);

  const selectedPackage = PACKAGES.find((p) => p.id === selectedPackageId);

  const handleOpenPaymentModal = () => {
    if (!selectedPackage) return;
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const fetchTransactions = useCallback(async () => {
    if (!walletId) {
      setPaymentHistory([]);
      setTokenBalance(0);
      return;
    }

    setIsHistoryLoading(true);
    try {
      const params: LazyloadParams = {
        filters: [
          {
            field: "wallet_id",
            operator: OperatorEnum.equals,
            value: walletId,
          },
        ],
        search: "",
        pagination: {
          limit: 10,
          page: 1,
        },
        sort: {
          order_by: "created_date",
          sort_order: SortEnum.desc,
        },
        included_fields: [],
        excluded_fields: [],
        export: false,
      };
      const data = await lazyloadTransactions(params);
      const mapped = (data?.data || []).map((record, index) => {
        const reference = record.reference_id || "-";
        const rawAmount =
          typeof record.amount === "number"
            ? record.amount
            : Number(record.amount);
        const amountKey = Number.isFinite(rawAmount)
          ? rawAmount.toFixed(2)
          : "";
        const normalizedAmount =
          PACKAGE_TOKEN_MAP[reference] ??
          PRICE_TOKEN_MAP[amountKey] ??
          (Number.isFinite(rawAmount) ? rawAmount : 0);

        return {
          key: String(record.id ?? record.reference_id ?? index),
          date: record.created_date
            ? dayjs(record.created_date).format("M/D/YYYY h:mm:ss A")
            : "-",
          reference,
          type: record.transaction_type
            ? record.transaction_type.replace("_", " ")
            : "-",
          amount: normalizedAmount,
          status: "Completed",
        };
      });

      const totalTokens = (data?.data || []).reduce((sum, record) => {
        const reference = record.reference_id || "-";
        const rawAmount =
          typeof record.amount === "number"
            ? record.amount
            : Number(record.amount);
        const amountKey = Number.isFinite(rawAmount)
          ? rawAmount.toFixed(2)
          : "";
        const normalizedAmount =
          PACKAGE_TOKEN_MAP[reference] ??
          PRICE_TOKEN_MAP[amountKey] ??
          (Number.isFinite(rawAmount) ? rawAmount : 0);
        const type = record.transaction_type;
        if (type === "deduct" || type === "payment") {
          return sum - normalizedAmount;
        }
        return sum + normalizedAmount;
      }, 0);

      setPaymentHistory(mapped);
      setTokenBalance(totalTokens);
    } catch (error) {
      handleApiError(error, "Failed to load payment history.");
    } finally {
      setIsHistoryLoading(false);
    }
  }, [walletId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);


  const handlePaymentSubmit = async (values: PaymentData) => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    try {
      await processPayment(values);
      if (!walletId) {
        throw new Error("Wallet not found");
      }

      await createTransaction({
        wallet_id: walletId,
        amount: selectedPackage.tokens,
        transaction_type: "top_up",
        reference_id: selectedPackage.name,
      });

      // On Success
      setTokenBalance((prev) => prev + selectedPackage.tokens);
      window.dispatchEvent(new CustomEvent("addTokens", { detail: { tokens: selectedPackage.tokens } }));
      
      await fetchTransactions();

      setIsPaymentModalOpen(false);
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
        <PaymentBalance tokenBalance={tokenBalance} loading={isHistoryLoading} />
        <PaymentPackages
          packages={PACKAGES}
          selectedPackageId={selectedPackageId}
          onSelectPackage={setSelectedPackageId}
          onOpenPaymentModal={handleOpenPaymentModal}
        />
        <PaymentHistory
          paymentHistory={paymentHistory}
          loading={isHistoryLoading}
        />
        <PaymentFooter />
        <PaymentModal
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
