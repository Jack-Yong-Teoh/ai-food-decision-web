import { ReactNode } from "react";
import { Modal as AntdModal, ModalProps as AntdModalProps } from "antd";

export interface ModalProps
  extends Omit<AntdModalProps, "children" | "confirmLoading"> {
  children: ReactNode;
  loading?: boolean;
  className?: string;
}

const Modal = ({ loading, children, className, ...restProps }: ModalProps) => {
  return (
    <AntdModal
      confirmLoading={loading}
      className={className ? `${className}` : "modal"}
      {...restProps}
    >
      {children}
    </AntdModal>
  );
};

export default Modal;
