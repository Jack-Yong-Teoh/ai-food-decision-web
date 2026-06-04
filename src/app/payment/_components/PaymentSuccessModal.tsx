"use client";

import { Button, Modal } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentSuccessModal = ({ isOpen, onClose }: PaymentSuccessModalProps) => (
  <Modal
    open={isOpen}
    onCancel={onClose}
    footer={null}
    className="payment-modal"
    centered
  >
    <div className="payment-success">
      <CheckCircleFilled className="payment-success__icon" />
      <div className="payment-success__title">Payment Successful</div>
      <div className="payment-success__message">
        The tokens have been credited successfully.
      </div>
      <Button
        type="primary"
        className="primary__button payment-success__button"
        onClick={onClose}
      >
        Back to Payment
      </Button>
    </div>
  </Modal>
);

export default PaymentSuccessModal;
