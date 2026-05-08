"use client";

import React from "react";

import LayoutSection from "../_components/layout/LayoutSection";

const UserManagementPage: React.FC = () => {
  return (
    <LayoutSection>
      <h1 style={{ color: "white" }}>User Management</h1>
      <p>This is the user management page. Here you can manage users.</p>
    </LayoutSection>
  );
};

export default UserManagementPage;
