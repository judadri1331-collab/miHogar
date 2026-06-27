export class ChartsRenderer {
  constructor() {
    this.pie = null;
    this.bar = null;
  }

  renderExpensePie(items) {
    const empty = document.querySelector("#expensePieEmpty");
    empty.hidden = items.length > 0;
    this.pie = this.#replaceChart(this.pie, "#expensePieChart", {
      type: "doughnut",
      data: {
        labels: items.map((item) => item.category),
        datasets: [{ data: items.map((item) => item.total), backgroundColor: items.map((item) => item.color) }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom" } } }
    });
  }

  renderMonthlyBars(series) {
    this.bar = this.#replaceChart(this.bar, "#monthlyBarChart", {
      type: "bar",
      data: {
        labels: series.map((item) => item.month),
        datasets: [
          { label: "Ingresos", data: series.map((item) => item.incomes), backgroundColor: "#81B29A" },
          { label: "Egresos", data: series.map((item) => item.expenses), backgroundColor: "#E07A5F" }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
  }

  #replaceChart(current, selector, config) {
    if (!window.Chart) return null;
    current?.destroy();
    return new Chart(document.querySelector(selector), config);
  }
}
