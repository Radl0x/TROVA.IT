(() => {
  const { $, $$, toast, safeText } = window.Trova;
  const category = $("#category"), service = $("#service"), form = $("#requestWizard");
  if (!form) return;

  const { serviceOptions, serviceSchemas } = window.TrovaCatalog || { serviceOptions: {}, serviceSchemas: {} };
  const workflow = window.TrovaWorkflow;
  const readAttachments = async () => {
    const files = [...($("#attachments")?.files || [])];
    const total = files.reduce((sum, file) => sum + file.size, 0);
    if (total > 2 * 1024 * 1024) throw new Error("Gli allegati non possono superare 2 MB complessivi. Riduci le dimensioni o il numero dei file.");
    return Promise.all(files.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({name:file.name,type:file.type || "application/octet-stream",size:file.size,dataUrl:String(reader.result)});
      reader.onerror = () => reject(new Error(`Impossibile leggere il file ${file.name}.`));
      reader.readAsDataURL(file);
    })));
  };

  let step = 1;
  const pages = $$(".wizard-page");
  const get = id => $("#" + id)?.value?.trim() || "";
  const selected = id => !!$("#" + id)?.checked;
  const updateServices = (preferred) => {
    const options = serviceOptions[category.value] || [];
    service.innerHTML = '<option value="">Seleziona un servizio</option>' + options.map(x => `<option>${safeText(x)}</option>`).join("");
    if (preferred && options.includes(preferred)) service.value = preferred;
    else if (options.length === 1) service.value = options[0];
    renderAdaptiveFields();
  };
  const renderAdaptiveFields = (restoreValues = {}) => {
    const container = $("#adaptiveFields");
    if (!container) return;
    if (!category.value || !service.value) {
      container.innerHTML = '<div class="adaptive-empty">Seleziona un settore e un servizio per vedere le domande specifiche di quel lavoro.</div>';
      return;
    }
    const fields = serviceSchemas[service.value] || serviceSchemas["Altro servizio specialistico"];
    container.innerHTML = `<div class="adaptive-service-intro">Domande dedicate a <strong>${safeText(service.value)}</strong>. I campi non pertinenti ad altri servizi non vengono mostrati.</div>` + fields.map(field => {
      const id = `spec_${field.id}`;
      const label = `<label for="${id}">${safeText(field.label)}</label>`;
      if (field.type === "select") return `<div class="field"><div>${label}</div><select id="${id}" data-adaptive-field="${field.id}" data-adaptive-label="${safeText(field.label)}"><option value="">Non specificato</option>${field.options.map(v=>`<option>${safeText(v)}</option>`).join("")}</select></div>`;
      if (field.type === "textarea") return `<div class="field full">${label}<textarea id="${id}" data-adaptive-field="${field.id}" data-adaptive-label="${safeText(field.label)}" maxlength="1000" placeholder="${safeText(field.placeholder || "Inserisci i dettagli, se disponibili")}"></textarea></div>`;
      return `<div class="field">${label}<input id="${id}" type="${field.type === "number" ? "number" : "text"}" data-adaptive-field="${field.id}" data-adaptive-label="${safeText(field.label)}" ${field.type === "number" ? 'min="0" step="1"' : 'maxlength="240"'} placeholder="${safeText(field.placeholder || "Inserisci un dettaglio, se disponibile")}"></div>`;
    }).join("");
    Object.entries(restoreValues).forEach(([key,value])=>{const el=$("#spec_"+key);if(el)el.value=value;});
  };
  category.addEventListener("change", () => updateServices());
  service.addEventListener("change", () => { renderAdaptiveFields(); });
  const adaptiveData = () => Object.fromEntries($$("[data-adaptive-field]").map(el=>[el.dataset.adaptiveField,el.value.trim()]).filter(([,v])=>v));
  const adaptiveLabels = () => Object.fromEntries($$("[data-adaptive-field]").map(el=>[el.dataset.adaptiveField,el.dataset.adaptiveLabel || el.dataset.adaptiveField]));
  const getDraft = () => {
    const data = {};
    ["category","service","title","description","location","timing","workMode","budget","budgetType","requirements"].forEach(id => data[id] = get(id));
    data.adaptive = adaptiveData();
    data.adaptiveLabels = adaptiveLabels();
    data.contactEmail = get("contactEmail");
    data.confirmIntent = selected("confirmIntent");
    data.simulateEmailVerification = selected("simulateEmailVerification");
    return data;
  };
  const render = () => {
    pages.forEach(p => p.hidden = Number(p.dataset.step) !== step);
    $("#stepCount").textContent = step;
    $("#progressBar").style.width = (step / 3 * 100) + "%";
    $("#prevStep").disabled = step === 1;
    $("#nextStep").textContent = step === 3 ? "Conferma richiesta ✓" : "Continua →";
    $$("[data-wstep]").forEach(el => {
      const n = Number(el.dataset.wstep); el.classList.toggle("active", n === step); el.classList.toggle("done", n < step);
      el.querySelector(".num").textContent = n < step ? "✓" : n;
    });
    if (step === 3) updateReview();
  };
  const validate = n => {
    const fields = n === 1 ? [category, service, $("#title"), $("#description")] : n === 2 ? [$("#location"), $("#timing"), $("#workMode")] : [$("#contactEmail")];
    for (const field of fields) {
      if (!field.value.trim() || !field.checkValidity()) {
        field.focus(); field.reportValidity();
        toast("Controlla questo campo", "Completa i dati essenziali per passare allo step successivo.");
        return false;
      }
    }
    if (n === 3 && !selected("confirmIntent")) { $("#confirmIntent").focus(); toast("Conferma necessaria", "Conferma che la richiesta è attuale prima di pubblicarla."); return false; }
    if (n === 3 && !selected("simulateEmailVerification")) { $("#simulateEmailVerification").focus(); toast("Conferma email necessaria", "Conferma di poter ricevere comunicazioni all’indirizzo indicato."); return false; }
    if (n === 1 && get("description").length < 20) {
      $("#description").setCustomValidity("Descrivi il lavoro con almeno 20 caratteri."); $("#description").reportValidity(); $("#description").focus(); $("#description").setCustomValidity(""); return false;
    }
    return true;
  };
  const updateReview = () => {
    const rows = [["Settore",get("category")],["Servizio",get("service")],["Titolo",get("title")],["Descrizione",get("description")],["Zona",get("location")],["Tempistica",get("timing")],["Modalità",({presence:"In presenza",remote:"Da remoto",mixed:"Indifferente / da concordare"})[get("workMode")] || "—"],["Budget",get("budget") || "Da definire"],["Tipo budget",get("budgetType")], ["Requisiti irrinunciabili",get("requirements") || "Nessuno indicato"]];
    const labels = adaptiveLabels();
    Object.entries(adaptiveData()).forEach(([k,v])=>rows.push([labels[k]||k,v]));
    $("#reviewBox").innerHTML = `<div class="panel-title"><h3>Riepilogo della richiesta</h3><span class="pill gray">Riepilogo</span></div>` + rows.map(([k,v]) => `<div class="request-review-row"><span class="muted">${safeText(k)}</span><strong>${safeText(v || "—")}</strong></div>`).join("") + `<div class="request-review-row"><span>Conferma cliente</span><strong>${selected("confirmIntent") ? "Confermata" : "Da confermare"}</strong></div>` + `<div class="request-review-row"><span>Verifica email</span><strong>${selected("simulateEmailVerification") ? "Da verificare" : "Da verificare"}</strong></div>`;
    const files = $("#attachments").files;
    $("#fileList").textContent = files.length ? [...files].map(f=>f.name).join(" · ") : "Nessun allegato selezionato";
  };
  $("#prevStep").addEventListener("click", () => { if (step > 1) { step--; render(); window.scrollTo({top:0,behavior:"smooth"}); } });
  $("#nextStep").addEventListener("click", async () => {
    if (!validate(step)) return;
    if (step < 3) { step++; render(); window.scrollTo({top:0,behavior:"smooth"}); }
    else {
      if (!validate(3)) return;
      if (!workflow) { toast("Funzione non disponibile", "Non è stato possibile caricare il modulo di pubblicazione."); return; }
      const draft = getDraft();
      let attachments;
      try { attachments = await readAttachments(); }
      catch (error) { toast("Allegati non validi", error.message || "Impossibile leggere gli allegati selezionati."); return; }
      // Trasforma in requisiti obbligatori soltanto le competenze professionali riconoscibili
      // esplicitamente nei dettagli scelti dal cliente o nel testo dei requisiti irrinunciabili.
      // Gli altri dettagli (marca, dimensioni, budget, ecc.) restano informazioni di progetto.
      const normalizeRequirement = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("it-IT").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
      const requirementText = normalizeRequirement([draft.requirements, ...Object.values(draft.adaptive || {})].join(" "));
      const serviceSkillFields = (window.TrovaProSkills || {})[draft.service] || [];
      const requiredSkills = [...new Set(serviceSkillFields.flatMap(field => field.options || []).filter(option => {
        const normalized = normalizeRequirement(option);
        return normalized.length >= 4 && (` ${requirementText} `).includes(` ${normalized} `);
      }))];
      const budgetMap = {"Fino a 250 €":250,"250–1.000 €":1000,"1.000–5.000 €":5000,"5.000–15.000 €":15000,"Oltre 15.000 €":15000};
      const request = {
        id: `USR-${Date.now().toString(36).toUpperCase()}`, service:draft.service, sector:draft.category,
        title:draft.title, description:draft.description, location:draft.location, timing:draft.timing, mode:draft.workMode,
        budget:draft.budget || "Da definire", budgetAmount:budgetMap[draft.budget] || 0, budgetType:draft.budgetType,
        requirements:draft.requirements, required:requiredSkills, requiredSkills,
        adaptive:draft.adaptive, requiredSkillsSource:requiredSkills.length ? "adaptive-and-client-requirements" : "none-detected", adaptiveLabels:draft.adaptiveLabels, attachments,
        contactEmail:draft.contactEmail, intentConfirmed:true, verificationStatus:"verificata-solo-demo", contactVerifiedDemo:true,
        status:"open", createdAt:new Date().toISOString(), age:"Appena pubblicata", kind:"Richiesta cliente", isUserDemo:true
      };
      workflow.saveRequest(request);
      if (!(workflow.getRequests() || []).some(item => item.id === request.id)) {
        toast("Spazio locale insufficiente", "Il browser non ha spazio sufficiente per conservare la richiesta e gli allegati. Riduci gli allegati e riprova.");
        return;
      }
      workflow.notify({id:`N-${request.id}`,type:"request-published",requestId:request.id,title:"Richiesta pubblicata",message:`${request.title} · ${request.service}`,createdAt:request.createdAt,read:false});
      try { sessionStorage.removeItem("trova_request_draft"); } catch {}
      const status = $("#draftState"); if (status) { status.textContent = "Richiesta pubblicata"; status.className = "pill green"; }
      toast("Richiesta pubblicata", "La richiesta è stata salvata in questo browser e può apparire ai professionisti compatibili. L’invio di email e notifiche richiede l’attivazione dei servizi online.");
      const next = $("#nextStep"); if (next) { next.disabled = true; next.textContent = "Richiesta pubblicata ✓"; }
      const prev = $("#prevStep"); if (prev) prev.disabled = true;
    }
  });
  $("#saveDraft").addEventListener("click", () => {
    try { sessionStorage.setItem("trova_request_draft", JSON.stringify(getDraft())); } catch {}
    $("#draftState").textContent = "Bozza salvata in sessione"; $("#draftState").className = "pill green";
    toast("Bozza salvata", "Salvata solo nella sessione di questo browser. Il salvataggio persistente richiede il backend.");
  });
  $("#attachments").addEventListener("change", () => { const fs = [...$("#attachments").files]; const total = fs.reduce((sum,file)=>sum+file.size,0); $("#fileList").textContent = fs.length ? `${fs.map(f=>`${f.name} (${Math.round(f.size/1024)} KB)`).join(" · ")} — Totale ${Math.round(total/1024)} KB / 2 MB` : "Nessun allegato selezionato"; if (total > 2*1024*1024) toast("Allegati troppo grandi", "Il limite è di 2 MB complessivi."); });
  try {
    const initialCat = sessionStorage.getItem("trova_demo_category");
    const initialDesc = sessionStorage.getItem("trova_demo_description");
    const draft = JSON.parse(sessionStorage.getItem("trova_request_draft") || "null");
    if (draft) {
      ["contactEmail","category","title","description","location","timing","workMode","budget","budgetType","requirements"].forEach(id=>{const el=$("#"+id);if(el&&draft[id]!==undefined)el.value=draft[id];});
      updateServices(draft.service); renderAdaptiveFields(draft.adaptive||{}); if (draft.confirmIntent !== undefined) $("#confirmIntent").checked = !!draft.confirmIntent; if (draft.simulateEmailVerification !== undefined) $("#simulateEmailVerification").checked = !!draft.simulateEmailVerification;
      $("#draftState").textContent = "Bozza ripristinata"; $("#draftState").className = "pill green";
    } else { if (initialCat) category.value = initialCat; updateServices(); if (initialDesc) $("#description").value = initialDesc; }
  } catch { updateServices(); }
  render();
})();
