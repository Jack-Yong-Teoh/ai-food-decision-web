"use client";

import { ForkOutlined } from "@ant-design/icons";

const PaymentFooter = () => (
  <div className="payment__footer">
    <div className="payment__footer-logo">
      <ForkOutlined className="payment__footer-logo-icon" />
      <span className="payment__footer-logo-text">FoodGenie</span>
    </div>
    <div className="payment__footer-text">
      For any inquiries or support, please feel free to contact our team.
    </div>
    <div className="payment__footer-text payment__footer-text--emphasis">
      University of Malaya
    </div>
    <div className="payment__footer-text">Phone: +60 3453723214</div>
    <div className="payment__footer-text">Email: 25093666@siswa365.um.edu.my</div>
    <div className="payment__footer-copyright">
      © 2026 FoodGenie. All rights reserved.
    </div>
  </div>
);

export default PaymentFooter;
