export class TabsRenderer {
  constructor(onChange) {
    this.onChange = onChange;
  }

  bind() {
    document.querySelectorAll("[data-tab]").forEach((tab) => {
      tab.addEventListener("click", () => this.activate(tab.dataset.tab));
    });
  }

  activate(name) {
    document.querySelectorAll("[data-tab]").forEach((tab) => {
      const isActive = tab.dataset.tab === name;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    document.querySelectorAll("[data-panel]").forEach((panel) => {
      const isActive = panel.dataset.panel === name;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
    this.onChange?.(name);
  }
}
