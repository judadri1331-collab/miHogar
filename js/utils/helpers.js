export const createId = () =>
  crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

export const getDefaultDateForMonth = (month) => {
  const today = new Date().toISOString().slice(0, 10);
  return today.startsWith(month) ? today : `${month}-01`;
};

export const isInMonth = (isoDate, month) => Boolean(isoDate && isoDate.startsWith(month));

export const escapeHTML = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

export const sumBy = (items, selector) =>
  items.reduce((total, item) => total + (Number(selector(item)) || 0), 0);

export const getLastMonths = (selectedMonth, count = 6) => {
  const [year, month] = selectedMonth.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return Array.from({ length: count }, (_, index) => {
    const next = new Date(date);
    next.setMonth(date.getMonth() - (count - 1 - index));
    return next.toISOString().slice(0, 7);
  });
};
