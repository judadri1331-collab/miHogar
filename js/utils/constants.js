export const STORAGE_KEYS = {
  members: "misFinanzas_members",
  incomes: "misFinanzas_incomes",
  expenses: "misFinanzas_expenses",
  budgets: "misFinanzas_budgets"
};

export const INCOME_TYPES = [
  ["sueldo_mensual", "Sueldo mensual"],
  ["honorarios", "Boletas de honorarios"],
  ["aguinaldo", "Aguinaldo"],
  ["asignacion_familiar", "Asignacion familiar"],
  ["subsidio", "Subsidio"],
  ["extra", "Trabajo extra"],
  ["otro", "Otro"]
];

export const PAYMENT_METHODS = [
  ["efectivo", "Efectivo"],
  ["debito", "Debito"],
  ["credito", "Credito"],
  ["transferencia", "Transferencia"]
];

export const EXPENSE_CATEGORIES = [
  { name: "Vivienda", color: "#5B9A8B", icon: "fa-house", subcategories: ["Dividendo / Arriendo", "Gastos comunes"] },
  { name: "Servicios Basicos", color: "#81B29A", icon: "fa-bolt", subcategories: ["Luz", "Agua", "Gas", "Internet", "Telefonia", "TV Cable/Streaming"] },
  { name: "Alimentacion", color: "#F2CC8F", icon: "fa-basket-shopping", subcategories: ["Supermercado", "Ferias/verdulerias", "Delivery", "Colaciones"] },
  { name: "Salud", color: "#E07A5F", icon: "fa-heart-pulse", subcategories: ["Isapre / Fonasa", "Copagos", "Farmacia", "Psicologo/Dentista"] },
  { name: "Educacion", color: "#3D405B", icon: "fa-graduation-cap", subcategories: ["Colegio", "Universidad/CFT", "Jardin Infantil", "Uniformes", "Utiles"] },
  { name: "Transporte", color: "#6D8EA0", icon: "fa-bus", subcategories: ["Bencina", "TAG", "Micro", "Metro", "Uber/Cabify", "Estacionamiento"] },
  { name: "Deudas", color: "#C95D63", icon: "fa-credit-card", subcategories: ["Tarjeta de Credito", "Credito de Consumo", "Credito Hipotecario", "Credito Automotriz", "Avance en Efectivo"] },
  { name: "Prevision", color: "#96705B", icon: "fa-shield-halved", subcategories: ["AFP", "Seguro de Cesantia", "Seguro de Vida", "APV"] },
  { name: "Hogar", color: "#9A8C98", icon: "fa-couch", subcategories: ["Mantencion", "Muebles", "Electrodomesticos", "Articulos de limpieza"] },
  { name: "Entretencion", color: "#577590", icon: "fa-ticket", subcategories: ["Salidas", "Cine", "Restaurantes", "Viajes", "Deportes", "Mascotas"] },
  { name: "Ahorro", color: "#43AA8B", icon: "fa-piggy-bank", subcategories: ["Ahorro programado", "Inversiones", "Cuenta 2 AFP"] },
  { name: "Otros", color: "#8A8A8A", icon: "fa-ellipsis", subcategories: ["Vestuario", "Regalos", "Gastos varios"] }
];
