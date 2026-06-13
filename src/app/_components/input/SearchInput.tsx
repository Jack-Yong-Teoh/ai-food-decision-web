"use client"
import { Input as AntInput, InputProps } from "antd";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";

export const SearchInput = (props: InputProps) => {
  const { placeholder, size } = props;
  return (
    <AntInput
      placeholder={placeholder}
      allowClear={{
        clearIcon: <CloseCircleOutlined className="input__icon" />,
      }}
      size={size ?? "middle"}
      prefix={<SearchOutlined className="input__icon" />}
      className={`input__search`}
      {...props}
    />
  );
};
