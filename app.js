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
    window.recoverySupabaseClient = supabase;
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

/* Revenue goal tracker: records actual revenue and carries unmet target into the next 30-day cycle. */
(() => {
  const workspace = document.getElementById("lead-workspace");
  if (!workspace) return;
  const section = document.createElement("section");
  section.className = "revenue-tracker";
  section.id = "revenue-tracker";
  section.innerHTML = '<div class="section-title"><div><p class="overline">REVENUE CONTROL · PHASE 02</p><h2>30-day target tracker<span>.</span></h2></div><p>USD · actuals only</p></div><div class="revenue-grid"><article class="revenue-card"><span class="revenue-label">Current cycle target</span><strong id="cycle-target">$100,000,000</strong><small id="cycle-dates">Sign in to load your cycle</small></article><article class="revenue-card"><span class="revenue-label">Actual revenue recorded</span><strong id="cycle-actual">$0</strong><small>Enter collected revenue only</small></article><article class="revenue-card"><span class="revenue-label">Unmet target to carry forward</span><strong id="cycle-gap">$100,000,000</strong><small id="cycle-next">Next cycle target includes the remaining gap</small></article></div><div class="revenue-panel"><h3>Record verified revenue</h3><p>Enter cumulative revenue received during the current cycle in USD. This is a manual record, not a payment processor connection.</p><label for="actual-revenue">Actual revenue received (USD)</label><input id="actual-revenue" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00"><label for="revenue-notes">Evidence / notes (optional)</label><input id="revenue-notes" type="text" maxlength="1000" placeholder="Invoice or payment reference; no sensitive details"><div class="revenue-actions"><button type="button" class="primary-btn" id="save-revenue">Save actual revenue</button><button type="button" class="secondary-btn" id="start-cycle" hidden>Start next 30-day cycle</button></div><p class="form-message" id="revenue-message" role="status" aria-live="polite"></p></div>';
  workspace.parentNode.insertBefore(section, workspace.nextSibling);
  const byId = id => document.getElementById(id);
  const fmt = n => new Intl.NumberFormat("en-US", {style:"currency",currency:"USD",maximumFractionDigits:2}).format(Number(n || 0));
  let client = null, user = null, cycle = null;
  const say = text => { byId("revenue-message").textContent = text; };
  const draw = () => {
    byId("cycle-target").textContent = fmt(cycle ? cycle.target_usd : 100000000);
    byId("cycle-actual").textContent = fmt(cycle ? cycle.actual_revenue_usd : 0);
    const gap = cycle ? Math.max(Number(cycle.target_usd)-Number(cycle.actual_revenue_usd),0) : 100000000;
    byId("cycle-gap").textContent = fmt(gap);
    byId("cycle-dates").textContent = cycle ? new Date(cycle.starts_at).toLocaleDateString()+" – "+new Date(cycle.ends_at).toLocaleDateString() : "Sign in to load your cycle";
    byId("cycle-next").textContent = cycle ? "Next cycle base $100M + gap "+fmt(gap) : "Next cycle carries any unmet target";
    byId("start-cycle").hidden = !cycle || new Date(cycle.ends_at).getTime() > Date.now();
    byId("save-revenue").disabled = !user || !cycle;
    byId("actual-revenue").disabled = !user || !cycle;
    byId("revenue-notes").disabled = !user || !cycle;
  };
  const load = async () => {
    if (!client || !user) { cycle = null; draw(); return; }
    const {data,error} = await client.from("revenue_cycles").select("id,cycle_number,starts_at,ends_at,base_target_usd,carried_gap_usd,target_usd,actual_revenue_usd,notes").order("cycle_number",{ascending:false}).limit(1);
    if (error) { say("Could not load revenue cycle: "+error.message); return; }
    cycle = data && data[0] ? data[0] : null;
    if (!cycle) {
      const now = new Date();
      const end = new Date(now.getTime()+30*24*60*60*1000);
      const {data:created,error:createError} = await client.from("revenue_cycles").insert({cycle_number:1,starts_at:now.toISOString(),ends_at:end.toISOString(),base_target_usd:100000000,carried_gap_usd:0}).select().single();
      if (createError) { say("Could not create first cycle: "+createError.message); draw(); return; }
      cycle = created;
    }
    byId("actual-revenue").value = cycle.actual_revenue_usd;
    byId("revenue-notes").value = cycle.notes || "";
    draw();
  };
  byId("save-revenue").addEventListener("click", async () => {
    if (!client || !user || !cycle) { say("Sign in to use the revenue tracker."); return; }
    const raw = byId("actual-revenue").value;
    const amount = Number(raw);
    if (raw.trim()==="" || !Number.isFinite(amount) || amount < 0) { say("Enter a valid non-negative USD amount."); return; }
    if (new Date(cycle.ends_at).getTime() <= Date.now()) { say("This cycle ended. Start the next cycle before changing its revenue."); return; }
    const {data,error} = await client.from("revenue_cycles").update({actual_revenue_usd:amount,notes:byId("revenue-notes").value.trim()}).eq("id",cycle.id).select().single();
    if (error) { say("Revenue save failed: "+error.message); return; }
    cycle = data; draw(); say("Revenue entry saved. Only use verified money received; this is not automatic bank/payment verification.");
  });
  byId("start-cycle").addEventListener("click", async () => {
    if (!client || !user) { say("Sign in first."); return; }
    if (!cycle || new Date(cycle.ends_at).getTime() > Date.now()) { say("The current 30-day cycle must end before starting another."); return; }
    const {data,error} = await client.rpc("start_next_revenue_cycle");
    if (error) { say("Could not start next cycle: "+error.message); return; }
    cycle = data; byId("actual-revenue").value = cycle.actual_revenue_usd; byId("revenue-notes").value = cycle.notes || ""; draw(); say("Next cycle started with the previous cycle's unmet target carried forward.");
  });
  const attach = () => {
    client = window.recoverySupabaseClient || null;
    if (!client || window.__recoveryRevenueTrackerAttached) return;
    window.__recoveryRevenueTrackerAttached = true;
    client.auth.getSession().then(({data}) => { user = data.session ? data.session.user : null; load().catch(e=>say(e.message)); });
    client.auth.onAuthStateChange((_event,session) => { user = session ? session.user : null; load().catch(e=>say(e.message)); });
  };
  const waitForSDK = () => {
    if (window.recoverySupabaseClient) attach();
    else setTimeout(waitForSDK,100);
  };
  waitForSDK();

})();
