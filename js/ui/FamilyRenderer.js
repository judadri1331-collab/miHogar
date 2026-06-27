import { escapeHTML } from "../utils/helpers.js";

export class FamilyRenderer {
  renderList(members) {
    document.querySelector("#familyMembersList").innerHTML = members.length
      ? members.map((member) => `
        <div class="member-item">
          <div>
            <strong>${escapeHTML(member.name)}</strong>
            <span>${escapeHTML(member.relationship)}</span>
          </div>
          <div class="row-actions">
            <button class="icon-button" type="button" data-edit-member="${member.id}" aria-label="Editar integrante">
              <i class="fa-solid fa-pen" aria-hidden="true"></i>
            </button>
            <button class="icon-button icon-button--danger" type="button" data-delete-member="${member.id}" aria-label="Eliminar integrante">
              <i class="fa-solid fa-trash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      `).join("")
      : '<p class="empty-state">Aun no hay integrantes registrados.</p>';
  }
}
