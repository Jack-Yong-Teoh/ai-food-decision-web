const checkNull = (val: string | number | null | undefined) => {
  if (typeof val === "string") {
    val = val.trim();
  }

  if (val === null || val === "" || val === undefined) {
    return "-";
  }

  return val;
};

export default checkNull;