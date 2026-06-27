export const formatCLP = (value) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);

export const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
};

export const formatPercent = (value) => `${Math.round(Number(value) || 0)}%`;

export const humanizeOption = (items, value) => {
  const option = items.find(([key]) => key === value);
  return option ? option[1] : value || "-";
};
