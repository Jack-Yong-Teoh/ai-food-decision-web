"use client";

import Link from "next/link";
import { Button, Result } from "antd";

export default function NotFound() {
  return (
    <div className="not__found">
      <div className="not__found__container">
        <Result
          status="404"
          title="Page Not Found"
          subTitle={"Sorry, the page you visited does not exist."}
          className="not__found__container__result"
          extra={
            <Link href="/" passHref>
              <Button type="primary" className="not__found__container__button">
                {"Back Home"}
              </Button>
            </Link>
          }
        />
      </div>
    </div>
  );
}
