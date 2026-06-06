"use client";

import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";

import { useAppSelector } from "@/redux/hook";
import {
  createTransaction,
  lazyloadTransactions,
  PaymentData,
  processPayment,
} from "@/services/api/payment";
import { getUserProfile } from "@/services/api/user";
import { getWallet } from "@/services/api/wallet";
import { LazyloadParams, OperatorEnum, SortEnum } from "@/types/general";
import { handleApiError } from "@/utils/apiHelper/errorHandler";

import type { Package, PaymentHistoryRecord } from "@/types/payment";

import LayoutSection from "../_components/layout/LayoutSection";

import {
  PaymentBalance,
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
    null,
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryRecord[]>(
    [],
  );
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyPage, setHistoryPage] = useState(1);
  const profileWalletId = useAppSelector(
    (state) => state.profile.data?.wallet_id,
  );
  const [walletId, setWalletId] = useState<number | null>(null);

  const selectedPackage = PACKAGES.find((p) => p.id === selectedPackageId);

  const handleOpenPaymentModal = () => {
    if (!selectedPackage) return;
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const resolveWalletBalance = (wallet: unknown) => {
    if (!wallet || typeof wallet !== "object") {
      return 0;
    }

    const walletRecord = wallet as Record<string, unknown>;
    const balance = walletRecord.balance;

    if (typeof balance === "number" && Number.isFinite(balance)) {
      return balance;
    }

    if (typeof balance === "string") {
      const parsed = Number(balance);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return 0;
  };

  const fetchWalletId = useCallback(async () => {
    if (profileWalletId) {
      setWalletId(profileWalletId);
      return;
    }

    try {
      const profile = await getUserProfile();
      setWalletId(profile?.wallet_id ?? null);
    } catch (error) {
      handleApiError(error, "Failed to load payment data.");
    }
  }, [profileWalletId]);

  const fetchWalletBalance = useCallback(async () => {
    if (!walletId) {
      setTokenBalance(0);
      return;
    }

    setIsBalanceLoading(true);
    try {
      const wallet = await getWallet(walletId);
      setTokenBalance(resolveWalletBalance(wallet));
    } catch (error) {
      handleApiError(error, "Failed to load wallet balance.");
    } finally {
      setIsBalanceLoading(false);
    }
  }, [walletId]);

  const fetchTransactions = useCallback(
    async (pageNumber: number) => {
      if (!walletId) {
        setPaymentHistory([]);
        setHistoryTotal(0);
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
            page: pageNumber,
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
          const normalizedAmount = Number.isFinite(rawAmount) ? rawAmount : 0;

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

        setPaymentHistory(mapped);
        setHistoryTotal(data?.count ?? 0);
      } catch (error) {
        handleApiError(error, "Failed to load payment history.");
      } finally {
        setIsHistoryLoading(false);
      }
    },
    [walletId],
  );

  useEffect(() => {
    fetchWalletId();
  }, [fetchWalletId]);

  useEffect(() => {
    if (!walletId) {
      return;
    }
    setHistoryPage(1);
    fetchWalletBalance();
    fetchTransactions(1);
  }, [walletId, fetchTransactions, fetchWalletBalance]);

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
      await Promise.all([fetchWalletBalance(), fetchTransactions(historyPage)]);

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
        <PaymentBalance
          tokenBalance={tokenBalance}
          loading={isBalanceLoading}
        />
        <PaymentPackages
          packages={PACKAGES}
          selectedPackageId={selectedPackageId}
          onSelectPackage={setSelectedPackageId}
          onOpenPaymentModal={handleOpenPaymentModal}
        />
        <PaymentHistory
          paymentHistory={paymentHistory}
          loading={isHistoryLoading}
          currentPage={historyPage}
          total={historyTotal}
          onPageChange={(pageNumber) => {
            setHistoryPage(pageNumber);
            fetchTransactions(pageNumber);
          }}
        />
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
