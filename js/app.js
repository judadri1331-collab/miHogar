import { BudgetService } from "./services/BudgetService.js";
import { FamilyService } from "./services/FamilyService.js";
import { FinanceService } from "./services/FinanceService.js";
import { ReportService } from "./services/ReportService.js";
import { StorageService } from "./services/StorageService.js";
import { ChartsRenderer } from "./ui/ChartsRenderer.js";
import { DashboardRenderer } from "./ui/DashboardRenderer.js";
import { FamilyRenderer } from "./ui/FamilyRenderer.js";
import { BudgetFormRenderer } from "./ui/BudgetFormRenderer.js";
import { TabsRenderer } from "./ui/TabsRenderer.js";
import { EXPENSE_CATEGORIES, INCOME_TYPES, PAYMENT_METHODS } from "./utils/constants.js";
import { formatCLP, formatDate, humanizeOption } from "./utils/formatters.js";
import { escapeHTML, getCurrentMonth, getDefaultDateForMonth, isInMonth } from "./utils/helpers.js";
import { requireText, toPositiveAmount } from "./utils/validators.js";

class MisFinanzasApp {
  constructor() {
    this.storage = new StorageService();
    this.familyService = new FamilyService(this.storage);
    this.financeService = new FinanceService(this.storage);
    this.budgetService = new BudgetService(this.storage);
    this.reportService = new ReportService();
    this.charts = new ChartsRenderer();
    this.dashboard = new DashboardRenderer();
    this.familyRenderer = new FamilyRenderer();
    this.budgetRenderer = new BudgetFormRenderer();
    this.tabs = new TabsRenderer();
    this.month = getCurrentMonth();
  }

  init() {
    document.querySelector("#monthSelector").value = this.month;
    this.populateStaticSelects();
    this.bindEvents();
    this.tabs.bind();
    this.render();
  }

  bindEvents() {
    document.querySelector("#monthSelector").addEventListener("change", (event) => {
      this.month = event.target.value || getCurrentMonth();
      this.render();
    });

    document.querySelector("#openFamilyModal").addEventListener("click", () => this.openModal("#familyModal"));
    document.querySelector("#openIncomeModal").addEventListener("click", () => this.prepareIncomeForm());
    document.querySelector("#openExpenseModal").addEventListener("click", () => this.prepareExpenseForm());
    document.querySelectorAll("[data-close-modal]").forEach((button) => {
      button.addEventListener("click", () => button.closest("dialog").close());
    });

    document.querySelector("#familyForm").addEventListener("submit", (event) => this.saveMember(event));
    document.querySelector("#clearMemberForm").addEventListener("click", () => this.clearMemberForm());
    document.querySelector("#incomeForm").addEventListener("submit", (event) => this.saveIncome(event));
    document.querySelector("#expenseForm").addEventListener("submit", (event) => this.saveExpense(event));
    document.querySelector("#saveBudgetsButton").addEventListener("click", () => this.saveBudgets());

    document.querySelector("#familyMembersList").addEventListener("click", (event) => this.handleMemberAction(event));
    document.querySelector("#incomeTableBody").addEventListener("click", (event) => this.handleIncomeAction(event));
    document.querySelector("#expenseTableBody").addEventListener("click", (event) => this.handleExpenseAction(event));
    document.querySelector("#budgetGrid").addEventListener("input", (event) => this.syncBudgetInputs(event));

    ["#incomeMemberFilter", "#incomeTypeFilter", "#expenseCategoryFilter", "#expenseMemberFilter", "#expenseMethodFilter"].forEach((selector) => {
      document.querySelector(selector).addEventListener("change", () => this.renderTables());
    });

    document.querySelector("#incomeAmount").addEventListener("input", (event) => {
      document.querySelector("#incomeAmountPreview").textContent = formatCLP(event.target.value);
    });
    document.querySelector("#expenseAmount").addEventListener("input", (event) => {
      document.querySelector("#expenseAmountPreview").textContent = formatCLP(event.target.value);
    });
    document.querySelector("#expenseCategory").addEventListener("change", () => this.populateSubcategories());
  }

  populateStaticSelects() {
    this.fillSelect("#incomeType", INCOME_TYPES);
    this.fillSelect("#incomeTypeFilter", [["", "Todos"], ...INCOME_TYPES]);
    this.fillSelect("#expenseCategory", EXPENSE_CATEGORIES.map((item) => [item.name, item.name]));
    this.fillSelect("#expenseCategoryFilter", [["", "Todas"], ...EXPENSE_CATEGORIES.map((item) => [item.name, item.name])]);
    this.fillSelect("#expensePaymentMethod", PAYMENT_METHODS);
    this.fillSelect("#expenseMethodFilter", [["", "Todos"], ...PAYMENT_METHODS]);
    this.populateSubcategories();
  }

  render() {
    this.renderMemberSelects();
    this.familyRenderer.renderList(this.members);
    const report = this.getReport();
    this.dashboard.renderSummary(report);
    this.dashboard.renderAlerts(report.budgetStatus);
    this.dashboard.renderTopExpenses(report.topExpenses);
    this.budgetRenderer.render(report.budgetStatus);
    this.charts.renderExpensePie(report.expensesByCategory);
    this.charts.renderMonthlyBars(this.reportService.getSixMonthSeries(this.month, this.incomes, this.expenses));
    this.renderTables();
  }

  renderTables() {
    this.renderIncomeTable();
    this.renderExpenseTable();
  }

  renderMemberSelects() {
    const memberOptions = this.members.map((member) => [member.id, `${member.name} (${member.relationship})`]);
    this.fillSelect("#incomeMember", memberOptions, "Agrega integrantes");
    this.fillSelect("#expenseMember", [["", "Sin asignar"], ...memberOptions]);
    this.fillSelect("#incomeMemberFilter", [["", "Todos"], ...memberOptions]);
    this.fillSelect("#expenseMemberFilter", [["", "Todos"], ...memberOptions]);
  }

  renderIncomeTable() {
    const memberFilter = document.querySelector("#incomeMemberFilter").value;
    const typeFilter = document.querySelector("#incomeTypeFilter").value;
    const rows = this.incomes
      .filter((item) => isInMonth(item.date, this.month))
      .filter((item) => !memberFilter || item.familyMemberId === memberFilter)
      .filter((item) => !typeFilter || item.type === typeFilter)
      .sort((a, b) => b.date.localeCompare(a.date));

    document.querySelector("#incomeTabTotal").textContent = formatCLP(rows.reduce((sum, item) => sum + item.amount, 0));
    document.querySelector("#incomeEmptyState").hidden = rows.length > 0;
    document.querySelector("#incomeTableBody").innerHTML = rows.map((income) => `
      <tr>
        <td>${formatDate(income.date)}</td>
        <td>${escapeHTML(this.memberName(income.familyMemberId))}</td>
        <td>${escapeHTML(humanizeOption(INCOME_TYPES, income.type))}</td>
        <td>${escapeHTML(income.description)}</td>
        <td class="text-right">${formatCLP(income.amount)}</td>
        <td>${this.actionButtons("income", income.id)}</td>
      </tr>
    `).join("");
  }

  renderExpenseTable() {
    const categoryFilter = document.querySelector("#expenseCategoryFilter").value;
    const memberFilter = document.querySelector("#expenseMemberFilter").value;
    const methodFilter = document.querySelector("#expenseMethodFilter").value;
    const rows = this.expenses
      .filter((item) => isInMonth(item.date, this.month))
      .filter((item) => !categoryFilter || item.category === categoryFilter)
      .filter((item) => !memberFilter || item.familyMemberId === memberFilter)
      .filter((item) => !methodFilter || item.paymentMethod === methodFilter)
      .sort((a, b) => b.date.localeCompare(a.date));

    document.querySelector("#expenseTabTotal").textContent = formatCLP(rows.reduce((sum, item) => sum + item.amount, 0));
    document.querySelector("#expenseEmptyState").hidden = rows.length > 0;
    document.querySelector("#expenseTableBody").innerHTML = rows.map((expense) => `
      <tr>
        <td>${formatDate(expense.date)}</td>
        <td>${escapeHTML(expense.category)}</td>
        <td>${escapeHTML(expense.description)}</td>
        <td>${escapeHTML(expense.familyMemberId ? this.memberName(expense.familyMemberId) : "Sin asignar")}</td>
        <td class="text-right">${formatCLP(expense.amount)}</td>
        <td><span class="badge ${expense.isPaid ? "badge--success" : "badge--muted"}">${expense.isPaid ? "Si" : "No"}</span></td>
        <td>${this.actionButtons("expense", expense.id)}</td>
      </tr>
    `).join("");
  }

  saveMember(event) {
    event.preventDefault();
    try {
      this.familyService.save({
        id: document.querySelector("#memberId").value || undefined,
        name: requireText(document.querySelector("#memberName").value, "Nombre"),
        relationship: requireText(document.querySelector("#memberRelationship").value, "Parentesco")
      });
      this.clearMemberForm();
      this.toast("Integrante guardado.");
      this.render();
    } catch (error) {
      this.toast(error.message);
    }
  }

  saveIncome(event) {
    event.preventDefault();
    try {
      this.financeService.saveIncome({
        id: document.querySelector("#incomeId").value || undefined,
        familyMemberId: requireText(document.querySelector("#incomeMember").value, "Integrante"),
        type: document.querySelector("#incomeType").value,
        description: requireText(document.querySelector("#incomeDescription").value, "Descripcion"),
        amount: toPositiveAmount(document.querySelector("#incomeAmount").value),
        date: document.querySelector("#incomeDate").value,
        isRecurring: document.querySelector("#incomeRecurring").checked,
        frequency: document.querySelector("#incomeFrequency").value || null
      });
      document.querySelector("#incomeModal").close();
      this.toast("Ingreso guardado.");
      this.render();
    } catch (error) {
      this.toast(error.message);
    }
  }

  saveExpense(event) {
    event.preventDefault();
    try {
      this.financeService.saveExpense({
        id: document.querySelector("#expenseId").value || undefined,
        category: document.querySelector("#expenseCategory").value,
        subcategory: document.querySelector("#expenseSubcategory").value || null,
        description: requireText(document.querySelector("#expenseDescription").value, "Descripcion"),
        amount: toPositiveAmount(document.querySelector("#expenseAmount").value),
        date: document.querySelector("#expenseDate").value,
        familyMemberId: document.querySelector("#expenseMember").value || null,
        paymentMethod: document.querySelector("#expensePaymentMethod").value,
        isPaid: document.querySelector("#expensePaid").checked,
        isRecurring: document.querySelector("#expenseRecurring").checked,
        frequency: document.querySelector("#expenseFrequency").value || null
      });
      document.querySelector("#expenseModal").close();
      this.toast("Egreso guardado.");
      this.render();
    } catch (error) {
      this.toast(error.message);
    }
  }

  saveBudgets() {
    const budgets = [...document.querySelectorAll("[data-budget-input]")].map((input) => ({
      category: input.dataset.budgetInput,
      limitAmount: Number(input.value) || 0
    }));
    this.budgetService.saveMany(this.month, budgets);
    this.toast("Presupuesto guardado.");
    this.render();
  }

  handleMemberAction(event) {
    const editButton = event.target.closest("[data-edit-member]");
    const deleteButton = event.target.closest("[data-delete-member]");
    if (editButton) {
      const member = this.members.find((item) => item.id === editButton.dataset.editMember);
      if (!member) return;
      document.querySelector("#memberId").value = member.id;
      document.querySelector("#memberName").value = member.name;
      document.querySelector("#memberRelationship").value = member.relationship;
    }
    if (deleteButton && confirm("Eliminar este integrante?")) {
      this.familyService.remove(deleteButton.dataset.deleteMember);
      this.render();
    }
  }

  handleIncomeAction(event) {
    const editButton = event.target.closest("[data-edit-income]");
    const deleteButton = event.target.closest("[data-delete-income]");
    if (editButton) this.prepareIncomeForm(this.incomes.find((item) => item.id === editButton.dataset.editIncome));
    if (deleteButton && confirm("Eliminar este ingreso?")) {
      this.financeService.removeIncome(deleteButton.dataset.deleteIncome);
      this.render();
    }
  }

  handleExpenseAction(event) {
    const editButton = event.target.closest("[data-edit-expense]");
    const deleteButton = event.target.closest("[data-delete-expense]");
    if (editButton) this.prepareExpenseForm(this.expenses.find((item) => item.id === editButton.dataset.editExpense));
    if (deleteButton && confirm("Eliminar este egreso?")) {
      this.financeService.removeExpense(deleteButton.dataset.deleteExpense);
      this.render();
    }
  }

  prepareIncomeForm(income = null) {
    document.querySelector("#incomeForm").reset();
    document.querySelector("#incomeId").value = income?.id || "";
    document.querySelector("#incomeMember").value = income?.familyMemberId || this.members[0]?.id || "";
    document.querySelector("#incomeType").value = income?.type || INCOME_TYPES[0][0];
    document.querySelector("#incomeDescription").value = income?.description || "";
    document.querySelector("#incomeAmount").value = income?.amount || "";
    document.querySelector("#incomeAmountPreview").textContent = formatCLP(income?.amount || 0);
    document.querySelector("#incomeDate").value = income?.date || getDefaultDateForMonth(this.month);
    document.querySelector("#incomeRecurring").checked = Boolean(income?.isRecurring);
    document.querySelector("#incomeFrequency").value = income?.frequency || "";
    this.openModal("#incomeModal");
  }

  prepareExpenseForm(expense = null) {
    document.querySelector("#expenseForm").reset();
    document.querySelector("#expenseId").value = expense?.id || "";
    document.querySelector("#expenseCategory").value = expense?.category || EXPENSE_CATEGORIES[0].name;
    this.populateSubcategories();
    document.querySelector("#expenseSubcategory").value = expense?.subcategory || "";
    document.querySelector("#expenseDescription").value = expense?.description || "";
    document.querySelector("#expenseAmount").value = expense?.amount || "";
    document.querySelector("#expenseAmountPreview").textContent = formatCLP(expense?.amount || 0);
    document.querySelector("#expenseDate").value = expense?.date || getDefaultDateForMonth(this.month);
    document.querySelector("#expenseMember").value = expense?.familyMemberId || "";
    document.querySelector("#expensePaymentMethod").value = expense?.paymentMethod || PAYMENT_METHODS[0][0];
    document.querySelector("#expensePaid").checked = expense ? Boolean(expense.isPaid) : true;
    document.querySelector("#expenseRecurring").checked = Boolean(expense?.isRecurring);
    document.querySelector("#expenseFrequency").value = expense?.frequency || "";
    this.openModal("#expenseModal");
  }

  populateSubcategories() {
    const selected = document.querySelector("#expenseCategory").value || EXPENSE_CATEGORIES[0].name;
    const category = EXPENSE_CATEGORIES.find((item) => item.name === selected) || EXPENSE_CATEGORIES[0];
    this.fillSelect("#expenseSubcategory", [["", "Sin subcategoria"], ...category.subcategories.map((item) => [item, item])]);
  }

  syncBudgetInputs(event) {
    const range = event.target.closest("[data-budget-range]");
    const input = event.target.closest("[data-budget-input]");
    if (range) document.querySelector(`[data-budget-input="${CSS.escape(range.dataset.budgetRange)}"]`).value = range.value;
    if (input) document.querySelector(`[data-budget-range="${CSS.escape(input.dataset.budgetInput)}"]`).value = input.value;
  }

  clearMemberForm() {
    document.querySelector("#familyForm").reset();
    document.querySelector("#memberId").value = "";
  }

  getReport() {
    return this.reportService.getMonthData({
      month: this.month,
      incomes: this.incomes,
      expenses: this.expenses,
      budgets: this.budgetService.getByMonth(this.month)
    });
  }

  fillSelect(selector, options, emptyLabel = null) {
    const select = document.querySelector(selector);
    select.innerHTML = options.length
      ? options.map(([value, label]) => `<option value="${escapeHTML(value)}">${escapeHTML(label)}</option>`).join("")
      : `<option value="">${escapeHTML(emptyLabel || "Sin opciones")}</option>`;
  }

  actionButtons(kind, id) {
    return `
      <div class="row-actions">
        <button class="icon-button" type="button" data-edit-${kind}="${id}" aria-label="Editar">
          <i class="fa-solid fa-pen" aria-hidden="true"></i>
        </button>
        <button class="icon-button icon-button--danger" type="button" data-delete-${kind}="${id}" aria-label="Eliminar">
          <i class="fa-solid fa-trash" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }

  memberName(id) {
    const member = this.members.find((item) => item.id === id);
    return member ? member.name : "Sin integrante";
  }

  openModal(selector) {
    const dialog = document.querySelector(selector);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  toast(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2400);
  }

  get members() {
    return this.familyService.getAll();
  }

  get incomes() {
    return this.financeService.getIncomes();
  }

  get expenses() {
    return this.financeService.getExpenses();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MisFinanzasApp().init();
});
