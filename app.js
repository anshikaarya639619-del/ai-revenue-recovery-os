"use strict";
(() => {
  const SUPABASE_URL = "https://edpawydxeqbopjotxwiw.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Ehbmcbz6rlnXND-48uuDbw_gZ_F-HYY";
  const form = document.getElementById("lead-form");
  const list = document.getElementById("lead-list");
  const count = document.getElementById("lead-count");
  const message = document.getElementById("lead-message");
  const exportButton = document.getElementById("export-leads");
  if (!form || !list || !count || !message || !exportButton) return;

  const auth = document.createElement("section");
  auth.className = "cloud-auth";
  auth.innerHTML = '<div class="cloud-auth-head"><div><p class="overline">CLOUD DATABASE</p><h3>Sign in to sync your leads</h3><p class="form-help">Your records will be stored in Supabase and protected by account-level database policies.</p></div><span class="cloud-status" id="cloud-status">Connecting…</span></div><form id="cloud-auth-form" class="cloud-auth-form"><label for="cloud-email">Email</label><input id="cloud-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"><label for="cloud-password">Password</label><input id="cloud-password" name="password" type="password" autocomplete="current-password" required minlength="8" maxlength="128" placeholder="At least 8 characters"><div class="cloud-auth-actions"><button class="primary-btn" type="submit" data-auth="signin">Sign in <span>→</span></button><button class="secondary-btn" type="button" id="cloud-signup">Create account</button><button class="secondary-btn" type="button" id="cloud-signout" hidden>Sign out</button></div><p class="form-message" id="cloud-auth-message" role="status" aria-live="polite"></p></form>';
  document.getElementById("lead-workspace").insertBefore(auth, document.querySelector(".lead-layout"));
  const authForm = document.getElementById("cloud-auth-form");
  const authMessage = document.getElementById("cloud-auth-message");
  const cloudStatus = document.getElementById("cloud-status");
  const signInButton = authForm.querySelector('[data-auth="signin"]');
  const signUpButton = document.getElementById("cloud-signup");
  const signOutButton = document.getElementById("cloud-signout");
  const formHelp = form.querySelector(".form-help");
  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const setCloudMessage = (target, text) => { target.textContent = text; };
  const statusMap = {"Follow-up due":"Follow-up","Converted":"Recovered","Closed":"Lost","New":"New","Contacted":"Contacted"};
  const uiStatus = {"Follow-up":"Follow-up due","Recovered":"Converted","Lost":"Closed","New":"New","Contacted":"Contacted"};
  let supabase = null;
  let currentUser = null;
  let leads = [];

  const render = () => {
    count.textContent = leads.length + (leads.length === 1 ? " cloud record" : " cloud records");
    if (!leads.length) {
      list.innerHTML = '<div class="records-empty">No cloud leads yet. Add a lead after signing in.</div>';
      return;
    }
    list.innerHTML = leads.slice().sort((a,b) => (a.follow_up_date || "9999").localeCompare(b.follow_up_date || "9999")).map(lead =>
      '<article class="lead-row"><div class="lead-row-main"><strong>' + escapeHTML(lead.name) + '</strong><span>' + escapeHTML(lead.source) + ' · ' + escapeHTML(uiStatus[lead.status] || lead.status) + '</span>' +
      (lead.contact ? '<small>' + escapeHTML(lead.contact) + '</small>' : '') +
      (lead.follow_up_date ? '<small>Follow-up: ' + escapeHTML(lead.follow_up_date) + '</small>' : '') +
      (lead.notes ? '<small>' + escapeHTML(lead.notes) + '</small>' : '') +
      '</div><button type="button" class="delete-lead" data-delete="' + escapeHTML(lead.id) + '" aria-label="Delete ' + escapeHTML(lead.name) + '">Delete</button></article>'
    ).join("");
  };

  const refreshLeads = async () => {
    if (!supabase || !currentUser) { leads = []; render(); return; }
    const { data, error } = await supabase.from("leads").select("id,name,contact,source,status,follow_up_date,notes,created_at").order("created_at", {ascending:false}).limit(500);
    if (error) { setCloudMessage(message, "Cloud load failed: " + error.message); return; }
    leads = data || [];
    render();
  };

  const setSignedInUI = async user => {
    currentUser = user || null;
    const signedIn = Boolean(currentUser);
    cloudStatus.textContent = signedIn ? "Cloud connected" : "Sign in required";
    cloudStatus.classList.toggle("is-connected", signedIn);
    signInButton.hidden = signedIn;
    signUpButton.hidden = signedIn;
    signOutButton.hidden = !signedIn;
    document.getElementById("cloud-email").disabled = signedIn;
    document.getElementById("cloud-password").disabled = signedIn;
    form.querySelectorAll("input,select,button").forEach(el => { el.disabled = !signedIn; });
    exportButton.disabled = !signedIn;
    if (formHelp) formHelp.textContent = signedIn ? "Cloud sync is active for the signed-in account. Only add information you have permission to store." : "Sign in or create an account above before adding cloud leads.";
    await refreshLeads();
  };

  authForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!supabase) return;
    const data = new FormData(authForm);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    setCloudMessage(authMessage, "Signing in…");
    const { error } = await supabase.auth.signInWithPassword({email, password});
    setCloudMessage(authMessage, error ? error.message : "Signed in.");
  });

  signUpButton.addEventListener("click", async () => {
    if (!supabase) return;
    const email = document.getElementById("cloud-email").value.trim();
    const password = document.getElementById("cloud-password").value;
    if (!email || password.length < 8) { setCloudMessage(authMessage, "Enter a valid email and a password of at least 8 characters."); return; }
    setCloudMessage(authMessage, "Creating account…");
    const { data, error } = await supabase.auth.signUp({email, password});
    setCloudMessage(authMessage, error ? error.message : (data.session ? "Account created and signed in." : "Account created. Check your email to confirm, then sign in."));
  });

  signOutButton.addEventListener("click", async () => {
    const { error } = await supabase.auth.signOut();
    setCloudMessage(authMessage, error ? error.message : "Signed out.");
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!supabase || !currentUser) { setCloudMessage(message, "Sign in first to save leads to the cloud."); return; }
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim().slice(0,120);
    const contact = String(data.get("contact") || "").trim().slice(0,200);
    const sourceOptions = ["Website","WhatsApp","Instagram","Referral","Phone call","Other"];
    const status = statusMap[String(data.get("status") || "New")] || "New";
    const next = String(data.get("next") || "");
    if (!name) { setCloudMessage(message, "Enter a name before saving."); return; }
    const payload = {name, contact, source:sourceOptions.includes(String(data.get("source"))) ? String(data.get("source")) : "Other", status, follow_up_date:/^\d{4}-\d{2}-\d{2}$/.test(next) ? next : null};
    const { error } = await supabase.from("leads").insert(payload);
    if (error) { setCloudMessage(message, "Cloud save failed: " + error.message); return; }
    form.reset();
    setCloudMessage(message, "Lead saved to your secure account database.");
    await refreshLeads();
  });

  list.addEventListener("click", async event => {
    const button = event.target.closest("[data-delete]");
    if (!button || !supabase || !currentUser) return;
    const { error } = await supabase.from("leads").delete().eq("id", button.dataset.delete);
    if (error) { setCloudMessage(message, "Delete failed: " + error.message); return; }
    setCloudMessage(message, "Lead deleted from cloud database.");
    await refreshLeads();
  });

  exportButton.addEventListener("click", () => {
    if (!currentUser || !leads.length) { setCloudMessage(message, "Sign in and add cloud leads before exporting."); return; }
    const columns = ["name","contact","source","status","follow_up_date","created_at"];
    const csvCell = value => '"' + String(value ?? "").replace(/"/g, '""') + '"';
    const csv = [columns.join(","), ...leads.map(lead => columns.map(key => csvCell(lead[key])).join(","))].join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "recovery-os-cloud-leads.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCloudMessage(message, "Cloud CSV export started.");
  });

  const init = async () => {
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      cloudStatus.textContent = "SDK unavailable";
      setCloudMessage(authMessage, "Could not load the Supabase client. Refresh the page and try again.");
      form.querySelectorAll("input,select,button").forEach(el => { el.disabled = true; });
      exportButton.disabled = true;
      return;
    }
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    const { data: { session } } = await supabase.auth.getSession();
    await setSignedInUI(session ? session.user : null);
    supabase.auth.onAuthStateChange((_event, sessionNow) => {
      setSignedInUI(sessionNow ? sessionNow.user : null).catch(() => setCloudMessage(message, "Could not refresh cloud records."));
    });
  };
  init().catch(error => {
    cloudStatus.textContent = "Connection error";
    setCloudMessage(authMessage, "Could not initialize cloud connection: " + error.message);
  });
})();