"use client";

import { Button, Form, Input, Modal } from "antd";
import dayjs from "dayjs";

import type { Package } from "../types";
import type { PaymentData } from "@/services/api/payment";
import type { FormInstance } from "antd";

interface PaymentModalProps {
  form: FormInstance;
  isOpen: boolean;
  isProcessing: boolean;
  selectedPackage?: Package;
  onClose: () => void;
  onSubmit: (values: PaymentData) => void;
}

const PaymentModal = ({
  form,
  isOpen,
  isProcessing,
  selectedPackage,
  onClose,
  onSubmit,
}: PaymentModalProps) => (
  <Modal
    title={`Checkout - ${selectedPackage?.name}`}
    open={isOpen}
    onCancel={onClose}
    footer={null}
    className="payment-modal"
    centered
  >
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      requiredMark={false}
    >
      <Form.Item
        label="Card Holder Name"
        name="name"
        rules={[
          { required: true, message: "Please enter card holder name" },
          {
            pattern: /^[a-zA-Z\s]*$/,
            message: "Name can only contain letters and spaces",
          },
        ]}
      >
        <Input placeholder="John Doe" />
      </Form.Item>

      <Form.Item
        label="Card Number"
        name="cardNumber"
        rules={[
          { required: true, message: "Please enter card number" },
          {
            pattern: /^\d{16}$/,
            message: "Card number must be exactly 16 digits",
          },
        ]}
      >
        <Input placeholder="1234 5678 1234 5678" maxLength={16} />
      </Form.Item>

      <div className="payment__form-row">
        <Form.Item
          label="Expiry Date"
          name="expiry"
          className="payment__form-col"
          rules={[
            { required: true, message: "Required" },
            {
              pattern: /^(0[1-9]|1[0-2])\/\d{2}$/,
              message: "Format MM/YY",
            },
            {
              validator: async (_, value) => {
                if (!value || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
                  return Promise.resolve();
                }
                const [month, year] = value.split("/");
                const expiryDate = dayjs(`20${year}-${month}-01`).endOf("month");
                if (expiryDate.isBefore(dayjs(), "month")) {
                  return Promise.reject(new Error("Card expired"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="MM/YY"
            maxLength={5}
            onChange={(e) => {
              let val = e.target.value.replace(/\D/g, "");
              if (val.length >= 3) {
                val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
              }
              form.setFieldsValue({ expiry: val });
            }}
          />
        </Form.Item>

        <Form.Item
          label="CVV"
          name="cvv"
          className="payment__form-col"
          rules={[
            { required: true, message: "Required" },
            {
              pattern: /^\d{3}$/,
              message: "Exactly 3 digits",
            },
          ]}
        >
          <Input.Password placeholder="123" maxLength={3} />
        </Form.Item>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        className="primary__button payment__submit-button"
        loading={isProcessing}
      >
        Pay ${selectedPackage?.price}
      </Button>
    </Form>
  </Modal>
);

export default PaymentModal;
