export const toPositiveAmount = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Ingresa un monto mayor a cero.");
  }
  return Math.round(amount);
};

export const requireText = (value, fieldName) => {
  const text = String(value || "").trim();
  if (!text) {
    throw new Error(`${fieldName} es obligatorio.`);
  }
  return text;
};
