const TEXT_WITH_LETTERS_PATTERN = /^[\p{L}\s.'-]+$/u;
const DESCRIPTION_PATTERN = /^[\p{L}\p{N}\s.,;:()/#%+_'?-]+$/u;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DANGEROUS_HTML_PATTERN = /<[^>]*>|javascript:|on\w+=/i;
const MAX_AMOUNT = 100000000;

// Validaciones reforzadas con apoyo de IA: se combinan reglas semanticas,
// regex y rechazo de patrones peligrosos antes de guardar en localStorage.
export const sanitizeText = (value) =>
  String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const assertSafeText = (value, fieldName) => {
  const text = sanitizeText(value);
  if (!text) {
    throw new Error(`${fieldName} es obligatorio.`);
  }
  if (DANGEROUS_HTML_PATTERN.test(text)) {
    throw new Error(`${fieldName} no puede contener HTML ni codigo ejecutable.`);
  }
  return text;
};

export const validatePersonText = (value, fieldName, { min = 2, max = 80 } = {}) => {
  const text = assertSafeText(value, fieldName);
  if (text.length < min || text.length > max) {
    throw new Error(`${fieldName} debe tener entre ${min} y ${max} caracteres.`);
  }
  if (!TEXT_WITH_LETTERS_PATTERN.test(text)) {
    throw new Error(`${fieldName} solo puede contener letras, espacios, apostrofes, puntos o guiones.`);
  }
  return text;
};

export const validateDescription = (value, fieldName = "Descripcion", { min = 3, max = 120 } = {}) => {
  const text = assertSafeText(value, fieldName);
  if (text.length < min || text.length > max) {
    throw new Error(`${fieldName} debe tener entre ${min} y ${max} caracteres.`);
  }
  if (!DESCRIPTION_PATTERN.test(text)) {
    throw new Error(`${fieldName} contiene caracteres no permitidos.`);
  }
  return text;
};

export const validateSelectValue = (value, allowedValues, fieldName) => {
  const selected = String(value || "");
  if (!selected) {
    throw new Error(`${fieldName} es obligatorio.`);
  }
  if (!allowedValues.includes(selected)) {
    throw new Error(`${fieldName} no es una opcion valida.`);
  }
  return selected;
};

export const validateOptionalSelectValue = (value, allowedValues, fieldName) => {
  const selected = String(value || "");
  if (!selected) return null;
  if (!allowedValues.includes(selected)) {
    throw new Error(`${fieldName} no es una opcion valida.`);
  }
  return selected;
};

export const validateDate = (value, fieldName = "Fecha") => {
  const date = String(value || "");
  if (!ISO_DATE_PATTERN.test(date)) {
    throw new Error(`${fieldName} debe tener formato valido.`);
  }
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`${fieldName} no es una fecha real.`);
  }
  return date;
};

export const toPositiveAmount = (value, fieldName = "Monto") => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`${fieldName} debe ser mayor a cero.`);
  }
  if (amount > MAX_AMOUNT) {
    throw new Error(`${fieldName} supera el maximo permitido.`);
  }
  return Math.round(amount);
};

export const toBudgetAmount = (value, fieldName = "Presupuesto") => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error(`${fieldName} debe ser cero o mayor.`);
  }
  if (amount > MAX_AMOUNT) {
    throw new Error(`${fieldName} supera el maximo permitido.`);
  }
  return Math.round(amount);
};

export const requireText = (value, fieldName) => {
  return assertSafeText(value, fieldName);
};
