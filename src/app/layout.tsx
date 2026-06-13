/* eslint-disable react-refresh/only-export-components */
import "../styles/global.scss";

import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import { AuthProvider } from "@/context/AuthContext";
import { getIsLoggedIn } from "@/lib/auth";

import metadata from "./metadata";
import Providers from "./providers";

import "@ant-design/v5-patch-for-react-19";

export { metadata };

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const isLoggedIn = await getIsLoggedIn();

  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AuthProvider isLogin={isLoggedIn}>
            <Providers>{children}</Providers>
          </AuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
