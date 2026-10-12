"use strict";

const leadRows = document.getElementById("leadRows");
const addLeadButton = document.getElementById("addLead");
const activityLog = document.getElementById("activityLog");
const invoiceInfo = document.getElementById("invoiceInfo");
const invoicePreview = document.getElementById("invoicePreview");

let demoLeadCount = 2;

function logActivity(message) {
  activityLog.textContent = message;
}

function attachFollowButton(button) {
  button.addEventListener("click", () => {
    const row = button.closest("tr");
    const status = row.querySelector(".status");
    status.textContent = "Marked contacted (demo)";
    button.textContent = "Updated";
    button.disabled = true;
    logActivity("Demo status changed in this browser only. No customer was contacted or notified.");
  });
}

document.querySelectorAll(".follow").forEach(attachFollowButton);

addLeadButton.addEventListener("click", () => {
  demoLeadCount += 1;
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = `Sample customer ${demoLeadCount}`;

  const amountCell = document.createElement("td");
  amountCell.textContent = "$0.00";

  const statusCell = document.createElement("td");
  const status = document.createElement("span");
  status.className = "status";
  status.textContent = "New demo";
  statusCell.appendChild(status);

  const actionCell = document.createElement("td");
  const button = document.createElement("button");
  button.type = "button";
  button.className = "secondary";
  button.textContent = "Mark contacted";
  attachFollowButton(button);
  actionCell.appendChild(button);

  row.append(nameCell, amountCell, statusCell, actionCell);
  leadRows.appendChild(row);
  logActivity("A sample lead was added to this page. It is not saved to a database.");
});

invoiceInfo.addEventListener("click", () => {
  invoicePreview.hidden = !invoicePreview.hidden;
  invoiceInfo.textContent = invoicePreview.hidden ? "View reminder preview" : "Hide reminder preview";
  invoiceInfo.setAttribute("aria-expanded", String(!invoicePreview.hidden));
  logActivity("Sample invoice reminder preview toggled. No message was sent.");
});
