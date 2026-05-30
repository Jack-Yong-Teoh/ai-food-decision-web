import visa_logo from "../paymentassets/visa-logo.webp";
import system_logo from "../project/food-genie-logo.webp";
import user_icon from "../project/user-icon.webp";

const mastercard_logo = new URL(
  "../paymentassets/ma_symbol.svg",
  import.meta.url
).toString();

const IMAGES = {
  system_logo: system_logo.src,
  user_icon: user_icon.src,
  visa_logo: visa_logo.src,
  mastercard_logo,
};

export default IMAGES;
