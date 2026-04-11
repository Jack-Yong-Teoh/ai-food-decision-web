/* eslint-disable react-refresh/only-export-components */
import "../styles/global.scss";

import metadata from "./metadata";
import Providers from "./providers";

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
