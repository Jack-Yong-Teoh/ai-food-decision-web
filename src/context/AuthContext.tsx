/* eslint-disable react-refresh/only-export-components */

"use client";

import { createContext, useState } from "react";

export type AuthContextType = {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
  isLogin: initialIsLogin,
}: {
  children: React.ReactNode;
  isLogin: boolean;
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(initialIsLogin);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
