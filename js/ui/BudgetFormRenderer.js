import { EXPENSE_CATEGORIES } from "../utils/constants.js";
import { formatCLP } from "../utils/formatters.js";
import { escapeHTML } from "../utils/helpers.js";

const progressClass = (percent) => (percent >= 100 ? "is-danger" : percent >= 80 ? "is-warning" : "");

export class BudgetFormRenderer {
  render(status) {
    document.querySelector("#budgetGrid").innerHTML = EXPENSE_CATEGORIES.map((category) => {
      const item = status.find((budget) => budget.category === category.name) || { spent: 0, limit: 0, percent: 0 };
      const width = Math.min(item.percent || 0, 100);
      return `
        <article class="card budget-card" data-budget-category="${escapeHTML(category.name)}">
          <div class="budget-card__header">
            <div>
              <h3>${escapeHTML(category.name)}</h3>
              <p>${formatCLP(item.spent)} gastado / ${formatCLP(item.limit)} limite</p>
            </div>
            <span class="budget-card__icon" style="background:${category.color}">
              <i class="fa-solid ${category.icon}" aria-hidden="true"></i>
            </span>
          </div>
          <div class="progress"><span class="progress__bar ${progressClass(item.percent)}" style="width:${width}%"></span></div>
          <div class="budget-controls">
            <input type="range" min="0" max="2000000" step="10000" value="${item.limit}" data-budget-range="${escapeHTML(category.name)}">
            <input type="number" min="0" step="10000" value="${item.limit}" data-budget-input="${escapeHTML(category.name)}" aria-label="Presupuesto ${escapeHTML(category.name)}">
          </div>
        </article>
      `;
    }).join("");
  }
}
