import dayjs from "dayjs";

const formatDate = (date: string, format?: string) => {
  if (!date) return;
  return dayjs(date).format(format ?? "DD MMM YYYY, hh:mm a");
};

export default formatDate;
