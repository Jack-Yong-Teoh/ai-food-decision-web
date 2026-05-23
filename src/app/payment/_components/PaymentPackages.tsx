"use client";

import { Button } from "antd";

import type { Package } from "../types";

import TokenIcon from "./TokenIcon";

interface PaymentPackagesProps {
  packages: Package[];
  selectedPackageId: string | null;
  onSelectPackage: (id: string) => void;
  onOpenPaymentModal: () => void;
}

const PaymentPackages = ({
  packages,
  selectedPackageId,
  onSelectPackage,
  onOpenPaymentModal,
}: PaymentPackagesProps) => (
  <div className="payment__packages">
    <div className="payment__packages-title">Token Packages</div>
    <div className="payment__packages-grid">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className={`payment__package ${
            selectedPackageId === pkg.id ? "payment__package--selected" : ""
          }`}
          onClick={() => onSelectPackage(pkg.id)}
        >
          {pkg.isPopular && (
            <div className="payment__package-badge">Most Popular</div>
          )}
          <TokenIcon className="payment__package-icon" variant="primary" />
          <div className="payment__package-title">{pkg.name}</div>
          <div className="payment__package-tokens">{pkg.tokens}</div>
          <div className="payment__package-tokens-label">Tokens</div>
          <div className="payment__package-price">${pkg.price}</div>
          {pkg.save ? (
            <div className="payment__package-save">Save {pkg.save}%</div>
          ) : (
            <div className="payment__package-save payment__package-save--hidden">
              Placeholder
            </div>
          )}
          <div className="payment__package-unit-price">
            ${pkg.unitPrice.toFixed(2)} per token
          </div>
        </div>
      ))}
    </div>

    <Button
      type="primary"
      className="payment__submit primary__button"
      disabled={!selectedPackageId}
      onClick={onOpenPaymentModal}
    >
      Select a Package
    </Button>

    <div className="payment__disclaimer">
      This is a mock payment. No real transaction will occur.
    </div>
  </div>
);

export default PaymentPackages;
