"use strict";
(() => {
  const STORAGE_KEY = "recovery-os-leads-v1";
  const form = document.getElementById("lead-form");
  const list = document.getElementById("lead-list");
  const count = document.getElementById("lead-count");
  const message = document.getElementById("lead-message");
  const exportButton = document.getElementById("export-leads");
  if (!form || !list || !count || !message || !exportButton) return;

  const safeLoad = () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(value) ? value.filter(x => x && typeof x.id === "string") : [];
    } catch { return []; }
  };
  let leads = safeLoad();
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); return true; }
    catch { message.textContent = "Could not save: browser storage may be full or disabled."; return false; }
  };
  const render = () => {
    count.textContent = leads.length + (leads.length === 1 ? " record on this device" : " records on this device");
    if (!leads.length) {
      list.innerHTML = '<div class="records-empty">No leads saved yet. Add a test lead to try the workflow.</div>';
      return;
    }
    list.innerHTML = leads.slice().sort((a,b) => (a.next || "9999").localeCompare(b.next || "9999")).map(lead =>
      '<article class="lead-row"><div class="lead-row-main"><strong>' + escapeHTML(lead.name) + '</strong><span>' + escapeHTML(lead.source) + ' · ' + escapeHTML(lead.status) + '</span>' +
      (lead.contact ? '<small>' + escapeHTML(lead.contact) + '</small>' : '') +
      (lead.next ? '<small>Follow-up: ' + escapeHTML(lead.next) + '</small>' : '') +
      '</div><button type="button" class="delete-lead" data-delete="' + escapeHTML(lead.id) + '" aria-label="Delete ' + escapeHTML(lead.name) + '">Delete</button></article>'
    ).join("");
  };
  form.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    if (!name) { message.textContent = "Enter a name before saving."; return; }
    leads.push({id: (Date.now().toString(36) + Math.random().toString(36).slice(2,8)), name, contact:String(data.get("contact")||"").trim(), source:String(data.get("source")||"Website"), status:String(data.get("status")||"New"), next:String(data.get("next")||""), createdAt:new Date().toISOString()});
    if (!save()) { leads.pop(); return; }
    form.reset(); message.textContent = "Saved on this device. No message was sent."; render();
  });
  list.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    leads = leads.filter(lead => lead.id !== button.dataset.delete);
    if (save()) { message.textContent = "Lead deleted from this browser."; render(); }
  });
  exportButton.addEventListener("click", () => {
    if (!leads.length) { message.textContent = "There are no leads to export yet."; return; }
    const columns = ["name","contact","source","status","next","createdAt"];
    const csvCell = value => '"' + String(value ?? "").replace(/"/g, '""') + '"';
    const csv = [columns.join(","), ...leads.map(lead => columns.map(key => csvCell(lead[key])).join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "recovery-os-leads.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    message.textContent = "CSV export started.";
  });
  render();
})();