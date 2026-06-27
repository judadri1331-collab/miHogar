import { formatCLP, formatPercent } from "../utils/formatters.js";
import { escapeHTML } from "../utils/helpers.js";

const progressClass = (percent) => (percent >= 100 ? "is-danger" : percent >= 80 ? "is-warning" : "");

export class DashboardRenderer {
  renderSummary(report) {
    document.querySelector("#summaryIncome").textContent = formatCLP(report.incomeTotal);
    document.querySelector("#summaryExpense").textContent = formatCLP(report.expenseTotal);
    document.querySelector("#summaryBalance").textContent = formatCLP(report.balance);
    document.querySelector("#summaryBalance").classList.toggle("negative", report.balance < 0);
    document.querySelector("#summaryBalance").classList.toggle("positive", report.balance >= 0);
    document.querySelector("#summarySavingRate").textContent = formatPercent(report.savingRate);
  }

  renderAlerts(status) {
    const risky = status.filter((item) => item.limit > 0 && item.percent >= 80);
    document.querySelector("#budgetAlerts").innerHTML = risky.length
      ? risky.map((item) => this.#budgetLine(item)).join("")
      : '<p class="empty-state">No hay alertas de presupuesto para este mes.</p>';
  }

  renderTopExpenses(expenses) {
    document.querySelector("#topExpenses").innerHTML = expenses.length
      ? expenses.map((expense) => `
        <div class="stack-item">
          <div class="stack-item__row">
            <strong>${escapeHTML(expense.description)}</strong>
            <span>${formatCLP(expense.amount)}</span>
          </div>
          <span>${escapeHTML(expense.category)} - ${escapeHTML(expense.date)}</span>
        </div>
      `).join("")
      : '<p class="empty-state">No hay egresos registrados en el mes.</p>';
  }

  #budgetLine(item) {
    const width = Math.min(item.percent, 100);
    return `
      <div class="stack-item">
        <div class="stack-item__row">
          <strong>${escapeHTML(item.category)}</strong>
          <span>${formatCLP(item.spent)} / ${formatCLP(item.limit)}</span>
        </div>
        <div class="progress"><span class="progress__bar ${progressClass(item.percent)}" style="width:${width}%"></span></div>
      </div>
    `;
  }
}
