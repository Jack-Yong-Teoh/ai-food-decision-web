import React from "react";

interface FooterProps {
  showFooter: boolean;
}

const LayoutFooter: React.FC<FooterProps> = ({ showFooter }) => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        color: "#888",
        background: "#18181b",
        display: showFooter ? "block" : "none",
      }}
    >
      © {new Date().getFullYear()} Food Genie. All rights reserved.
    </div>
  );
};

export default LayoutFooter;
