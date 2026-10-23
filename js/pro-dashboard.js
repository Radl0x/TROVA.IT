(() => {
  const { $, $$, toast, safeText } = window.Trova;
  const detail = $("#opportunityDetail");
  const detailLayer = $("#opportunityDetailLayer");
  let opportunityPreviousOverflow = "";
  let opportunityPreviousFocus = null;
  const closeOpportunityModal = () => {
    if (detailLayer) detailLayer.hidden = true;
    if (detail) detail.hidden = false;
    document.body.style.overflow = opportunityPreviousOverflow;
    if (opportunityPreviousFocus?.isConnected) opportunityPreviousFocus.focus({ preventScroll: true });
  };

  const renderProRatingStat = () => {
    const profile = (() => { try { return JSON.parse(localStorage.getItem("trova_pro_public_profile_v1") || "null") || {}; } catch { return {}; } })();
    const all = (() => { try { return JSON.parse(localStorage.getItem("trova_pro_reviews_v1") || "[]") || []; } catch { return []; } })();
    const norm = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("it-IT").trim();
    const name = norm(profile.businessName);
    const mine = all.filter(r => Number(r.rating) >= 1 && Number(r.rating) <= 5 && (!name || !r.professional || norm(r.professional) === name || norm(r.professional) === "professionista"));
    const average = mine.length ? mine.reduce((sum, r) => sum + Number(r.rating), 0) / mine.length : 0;
    const value = $("#statProAverageRating"), stars = $("#statProRatingStars"), count = $("#statProReviewCount");
    if (value) value.innerHTML = mine.length ? `${average.toFixed(1).replace(".", ",")}<small class="pro-rating-out-of">/5</small>` : `—<small class="pro-rating-out-of">/5</small>`;
    if (stars) { stars.innerHTML = Array.from({length:5}, (_,i) => `<i class="fa-${i < Math.round(average) ? "solid" : "regular"} fa-star" aria-hidden="true"></i>`).join(""); stars.setAttribute("aria-label", mine.length ? `Valutazione media ${average.toFixed(1)} su 5` : "Nessuna valutazione"); }
    if (count) count.textContent = `${mine.length} ${mine.length === 1 ? "recensione" : "recensioni"}`;
  };
  const profileForm = $("#proCompatibilityForm");
  const catalog = window.TrovaCatalog || { serviceOptions: {} };
  const professionalSkills = window.TrovaProSkills || {};
  const catalogSector = $("#proCatalogSector");
  const catalogServices = $("#proCatalogServices");
  const catalogFields = $("#proCatalogFields");
  let catalogState = { sector: "Casa", services: ["Ristrutturazione completa"], values: {} };
  const profileEditor = $("#proCompatibilityEditor");
  const profileSummary = $("#proProfileSummary");
  const profileSummaryText = $("#proProfileSummaryText");
  const openProfileEditor = () => {
    if (profileEditor) profileEditor.hidden = false;
    if (profileSummary) profileSummary.hidden = true;
    const openButton = $("#openProProfileEditor");
    if (openButton) { openButton.textContent = "Modifica profilo ↗"; openButton.setAttribute("aria-expanded", "true"); }
    profileEditor?.scrollIntoView({behavior:"smooth",block:"start"});
  };
  const collapseProfileEditor = () => {
    const services = catalogState.services || [];
    const sector = catalogState.sector || $("#proCatalogSector")?.value || "Attività non specificata";
    if (profileSummaryText) profileSummaryText.textContent = services.length ? `${sector} · ${services.join(", ")} · Preferenze salvate in questa sessione.` : `${sector} · Nessun servizio selezionato. Puoi riaprire la configurazione per completarla.`;
    if (profileEditor) profileEditor.hidden = true;
    if (profileSummary) profileSummary.hidden = false;
    const openButton = $("#openProProfileEditor");
    if (openButton) { openButton.textContent = "Modifica profilo ↗"; openButton.setAttribute("aria-expanded", "false"); }
  };
  $("#openProProfileEditor")?.addEventListener("click", openProfileEditor);
  $("#editProProfile")?.addEventListener("click", openProfileEditor);
  $("#improveProProfile")?.addEventListener("click", openProfileEditor);
  const renderCatalogServices = (restore = false) => {
    if (!catalogSector || !catalogServices) return;
    const options = catalog.serviceOptions[catalogSector.value] || [];
    const selected = new Set(catalogState.sector === catalogSector.value ? catalogState.services : []);
    catalogServices.innerHTML = options.length ? `<div class="pro-catalog-service-grid">${options.map((name, i) => `<label class="matching-filter-option pro-service-option"><input type="checkbox" data-pro-service="${safeText(name)}" ${selected.has(name) ? "checked" : ""}><span><strong>${safeText(name)}</strong><small>Configura le opzioni offerte per questa attività.</small></span></label>`).join("")}</div>` : '<div class="adaptive-empty">Nessun servizio disponibile per questo settore.</div>';
    catalogState.sector = catalogSector.value;
    catalogState.services = [...catalogServices.querySelectorAll("[data-pro-service]:checked")].map(el => el.dataset.proService);
    catalogServices.querySelectorAll("[data-pro-service]").forEach(el => el.addEventListener("change", () => {
      catalogState.services = [...catalogServices.querySelectorAll("[data-pro-service]:checked")].map(input => input.dataset.proService);
      renderCatalogFields();
      renderOpportunities();
      updateProfileCompletion();
    }));
    renderCatalogFields(restore);
  };
  const renderCatalogFields = (restore = false) => {
    if (!catalogFields) return;
    if (!catalogState.services.length) {
      catalogFields.innerHTML = '<div class="adaptive-empty">Seleziona almeno un servizio per configurare le tue specializzazioni.</div>';
      return;
    }
    catalogFields.innerHTML = catalogState.services.map(serviceName => {
      const fields = professionalSkills[serviceName] || professionalSkills["Altro servizio specialistico"] || [];
      const values = catalogState.values[serviceName] || {};
      const fieldHtml = fields.map(field => {
        const chosen = Array.isArray(values[field.id]) ? values[field.id] : [];
        return `<div class="field full"><span class="field-label">${safeText(field.label)}</span><div class="pro-multi-options">${field.options.map(option => `<label class="pro-option-chip"><input type="checkbox" data-pro-service-value="${safeText(serviceName)}" data-pro-field="${safeText(field.id)}" value="${safeText(option)}" ${chosen.includes(option) ? "checked" : ""}><span>${safeText(option)}</span></label>`).join("")}</div><small class="helper">Seleziona tutte le competenze che offri realmente.</small></div>`;
      }).join("");
      return `<section class="pro-service-schema"><div class="pro-service-schema-heading"><strong>${safeText(serviceName)}</strong><span class="pill gray">Competenze offerte</span></div><div class="pro-service-schema-grid">${fieldHtml}</div></section>`;
    }).join("");
    catalogFields.querySelectorAll("[data-pro-service-value]").forEach(el => el.addEventListener("change", () => {
      const serviceName = el.dataset.proServiceValue, fieldId = el.dataset.proField;
      if (!catalogState.values[serviceName]) catalogState.values[serviceName] = {};
      if (el.type === "checkbox") {
        const group = [...catalogFields.querySelectorAll(`[data-pro-service-value="${CSS.escape(serviceName)}"][data-pro-field="${CSS.escape(fieldId)}"]`)];
        catalogState.values[serviceName][fieldId] = group.filter(input => input.checked).map(input => input.value);
      } else catalogState.values[serviceName][fieldId] = el.value.trim();
      renderOpportunities();
      updateProfileCompletion();
    }));
  };
  const demoProfiles = {
    "tattoo-realistic": {name:"Studio Nero",sector:"Creatività",services:["Tatuaggio realistico"]},
    "tattoo-fineline": {name:"Linea Fine",sector:"Creatività",services:["Tatuaggio fine line"]},
    "social-content": {name:"Pixel Social",sector:"Creatività",services:["Social media e contenuti"]},
    "illustrator": {name:"Carta Viva",sector:"Creatività",services:["Illustrazione"]},
    "plumber": {name:"IdroPronto",sector:"Casa",services:["Idraulica e bagno"]},
    "photographer": {name:"Luce Studio",sector:"Creatività",services:["Fotografia"]},
    "videomaker": {name:"Frame Lab",sector:"Creatività",services:["Produzione video"]},
    "webdev": {name:"WebCraft",sector:"Tecnologia",services:["Sito web ed e-commerce"]},
    "mechanic": {name:"Officina Nord",sector:"Auto",services:["Meccanica e diagnosi"]},
    "electrician": {name:"ElettroPro",sector:"Casa",services:["Impianto elettrico"]},
    "accountant": {name:"Studio Conti",sector:"Professionisti",services:["Contabilità e fiscalità"]},
    "garden": {name:"Verde Vivo",sector:"Casa",services:["Giardinaggio e manutenzione"]}
  };
  const serviceSector = {};
  Object.entries(catalog.serviceOptions).forEach(([sector, services]) => services.forEach(service => serviceSector[service] = sector));
  const allDemoRequests = (window.TrovaDemoData && window.TrovaDemoData.requests) || [];
  const workflow = window.TrovaWorkflow;
  const normalizeMatchValue = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("it-IT").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
  // Le richieste create dal modulo cliente sono già validate nel flusso di pubblicazione.
  // Non richiediamo nuovamente flag legacy di verifica, che potevano nascondere richieste valide.
  const userRequests = () => (workflow?.getRequests() || []).filter(r => r && r.title && !r.clientHidden && r.status === "open" && !r.selectedProposalId && !(() => { try { return (JSON.parse(localStorage.getItem("trova_f2_proposals")||"[]")||[]).some(p => String(p.requestId)===String(r.id) && p.status==="selected"); } catch { return false; } })());
  const sameService = (a,b) => normalizeMatchValue(a) === normalizeMatchValue(b);
  const selectedSkillsFor = serviceName => {
    const serviceValues = catalogState.values[serviceName] || {};
    return [...new Set(Object.values(serviceValues).flatMap(v => Array.isArray(v) ? v : []))];
  };
  let matchingDiagnostics = [];
  const getMatchingRequests = () => {
    matchingDiagnostics = [];
    const chosenServices = catalogState.services || [];
    const stored = (() => { try { return JSON.parse(sessionStorage.getItem("trova_pro_compatibility") || "null") || {}; } catch { return {}; } })();
    const serviceAreas = String(stored.proServiceArea || $("#proServiceArea")?.value || "").split(/[,;|]/).map(value=>value.trim()).filter(Boolean);
    const area = serviceAreas[0] || "";
    const radiusValue = stored.proRadius || $("#proRadius")?.value || "25";
    const profile = {
      services: chosenServices,
      skills: [...new Set(chosenServices.flatMap(selectedSkillsFor))],
      city: area,
      serviceAreas,
      radius: radiusValue === "remote" ? 999 : radiusValue === "custom" ? 50 : Number(radiusValue),
      remote: radiusValue === "remote" || /da remoto|remoto/i.test(stored.proWorkMode || $("#proWorkMode")?.value || ""),
      available: (stored.proAvailability || $("#proAvailability")?.value || "") !== "Non disponibile temporaneamente",
      availability: stored.proAvailability || $("#proAvailability")?.value || "",
      acceptUrgent: /urgenze|subito/i.test(stored.proUrgency || $("#proUrgency")?.value || ""),
      minimum: Number(stored.proMinimum || $("#proMinimum")?.value || 0),
      qualifications: stored.proQualifications || $("#proQualifications")?.value || ""
    };
    const requests = userRequests(); // Le occasioni derivano esclusivamente dalle richieste aperte e visibili nella dashboard cliente.
    return requests.map((request, index) => {
      const matchedService = chosenServices.find(service => sameService(service, request.service));
      if (!matchedService) {
        matchingDiagnostics.push({title:request.title||request.service||'Richiesta senza titolo',location:request.location||'Località non indicata',failures:[`Servizio non selezionato nel profilo: ${request.service||'non specificato'}`]});
        return null;
      }
      const declared = selectedSkillsFor(matchedService);
      const rawRequired = request.requiredSkills ?? request.required ?? [];
      const required = (Array.isArray(rawRequired) ? rawRequired : [rawRequired]).filter(value => String(value ?? "").trim() !== "");
      profile.specialties = String(stored.proSpecialties || $("#proSpecialties")?.value || "").trim();
      if (workflow) {
        const result = workflow.match(profile, {...request, requiredSkills: required, required});
        if (!result.eligible) {
          matchingDiagnostics.push({title:request.title||request.service||'Richiesta senza titolo',location:request.location||'Località non indicata',failures:result.failures||['Non compatibile con il profilo']});
          return null;
        }
        return {...request, required, score:result.score, matchReasons:result.reasons, matchFailures:result.failures, matchDistance:result.distance, isUserDemo:!!request.isUserDemo};
      }
      const coverage = required.length ? required.filter(skill=>declared.includes(skill)).length/required.length : 1;
      return {...request, required, score:Math.min(99,80+Math.round(coverage*15)+(required.length>1?3:0)), idNumber:request.idNumber || (10000 + index), isUserDemo:!!request.isUserDemo};
    }).filter(Boolean);
  };
  const awaitProposalRecord = requestId => { try { const proposals=JSON.parse(localStorage.getItem('trova_f2_proposals')||'[]');let name='';try{const profile=JSON.parse(sessionStorage.getItem('trova_pro_compatibility')||'{}');name=profile.proDisplayName||profile.businessName||'';}catch{}return proposals.filter(item=>String(item.requestId)===String(requestId)&&(item.professionalId==='current-professional'||(name&&String(item.professional||'').trim().toLocaleLowerCase()===name.trim().toLocaleLowerCase())||!item.professionalId)).sort((a,b)=>new Date(b.updatedAt||b.resentAt||b.createdAt||0)-new Date(a.updatedAt||a.resentAt||a.createdAt||0))[0]||null;}catch{return null;} };
  const awaitProposalStatus = requestId => {const p=awaitProposalRecord(requestId);if(!p)return '';return ({selected:'Preventivo accettato',replied:'Risposta ricevuta',closed:'Incarico chiuso',rejected:'Preventivo rifiutato · puoi riprovare',sent:'Preventivo inviato · in attesa del cliente',modification_pending:'Preventivo modificato · in attesa di risposta'})[p.status]|| (p.modificationAcceptedAt?'Preventivo modificato':'');};
  const readF2 = type => { try { return JSON.parse(localStorage.getItem(`trova_f2_${type}`)||'[]')||[]; } catch { return []; } };
  const requestById = id => [...(workflow?.getRequests()||[]), ...allDemoRequests].find(r=>String(r.id)===String(id));
  let proArchivePage=1;
  const renderAcceptedJobs = () => {
    const target=$('#proAcceptedJobs'),count=$('#proAcceptedJobsCount'),archiveTarget=$('#proArchiveJobs'),archiveCount=$('#proArchiveCount');
    if(!target)return;
    const proposals=readF2('proposals');
    const allJobs=proposals.map(p=>({proposal:p,request:requestById(p.requestId)})).filter(({proposal:p,request:r})=>r&&(['selected','awaiting_client_completion','completion_disputed','completed','closed'].includes(p.status)||(p.status==='modification_pending'&&p.preModificationStatus==='selected')));
    const activeJobs=allJobs.filter(({proposal:p,request:r})=>p.status!=='completed'&&!['closed','cancelled','archived','completed','deleted'].includes(r.status)&&!['closed','cancelled','archived','deleted'].includes(p.status));
    const archivedJobs=allJobs.filter(({proposal:p,request:r})=>p.status==='completed'||r.status==='completed'||['closed','cancelled','archived','deleted'].includes(r.status)||['closed','cancelled','archived'].includes(p.status));
    const card=({proposal:p,request:r},archived=false)=>`<article class="pro-accepted-job-card ${p.status==='completed'||r.status==='completed'?'is-job-completed':''} ${archived?'is-archived-job':''} ${p.status==='modification_pending'?'is-modification-pending':''}"><div class="pro-accepted-job-heading"><div><span class="pill ${p.status==='completed'||r.status==='completed'?'green':archived?'gray':p.status==='awaiting_client_completion'||r.status==='completion_disputed'||p.status==='completion_disputed'||p.status==='modification_pending'?'amber':'green'}">${p.status==='completed'||r.status==='completed'?'✓ Lavoro completato':archived?'Archiviato':r.status==='completion_disputed'||p.status==='completion_disputed'?'Completamento contestato · contatta subito il cliente':p.status==='awaiting_client_completion'?'In attesa di conferma cliente':p.status==='modification_pending'?'Modifica preventivo in attesa':'✓ Preventivo accettato'}</span><h3>${safeText(r.title||r.service||'Lavoro confermato')}</h3><p>${safeText(r.sector||'Settore')} · ${safeText(r.service||'Servizio')} · ${safeText(r.location||'Località da concordare')}</p></div><span class="pro-accepted-job-price">${p.amount!==undefined&&String(p.amount).trim()!==''?`€ ${safeText(p.amount)}`:'Importo da concordare'}</span></div><div class="pro-accepted-job-meta"><span><strong>Cliente:</strong> ${safeText(r.clientName||r.contactName||'Cliente della richiesta')}</span><span><strong>Tempistiche:</strong> ${safeText(p.timing||'Da concordare')}</span><span><strong>Accettato il:</strong> ${safeText(p.selectedAt?new Date(p.selectedAt).toLocaleDateString('it-IT'):'Data non disponibile')}</span>${r.clientCompletedAt?`<span><strong>Confermato dal cliente:</strong> ${new Date(r.clientCompletedAt).toLocaleDateString('it-IT')}</span>`:''}</div>${p.description?`<p class="pro-accepted-job-description">${safeText(p.description)}</p>`:''}<div class="pro-accepted-job-actions">${archived?`<button type="button" class="btn btn-outline btn-sm" data-open-archived-job="${safeText(r.id)}" data-proposal-id="${safeText(p.id)}" title="Apri i dettagli dello storico in sola lettura">Apri storico ↗</button>`:`<button type="button" class="btn btn-outline btn-sm" data-open-accepted-job="${safeText(r.id)}">Apri richiesta e conversazione ↗</button>${p.status==='selected'?`<button type="button" class="btn btn-primary btn-sm" data-pro-job-action="complete" data-request-id="${safeText(r.id)}" data-proposal-id="${safeText(p.id)}">Segna lavoro completato</button><button type="button" class="btn btn-quiet btn-sm" data-pro-job-action="withdraw" data-request-id="${safeText(r.id)}" data-proposal-id="${safeText(p.id)}">Rinuncia / chiudi incarico</button>`:''}`}</div></article>`;
    if(count)count.textContent=`${activeJobs.length} ${activeJobs.length===1?'lavoro':'lavori'}`;
    target.innerHTML=activeJobs.length?activeJobs.map(item=>card(item)).join(''):'<div class="adaptive-empty">Non hai ancora lavori accettati. Quando un cliente sceglierà il tuo preventivo, il lavoro comparirà qui.</div>';
    if(archiveTarget){if(archiveCount)archiveCount.textContent=`${archivedJobs.length} ${archivedJobs.length===1?'elemento':'elementi'}`;const archivePageSize=6;const pages=Math.ceil(archivedJobs.length/archivePageSize);proArchivePage=Math.min(Math.max(1,proArchivePage),Math.max(1,pages));archiveTarget.innerHTML=archivedJobs.length?archivedJobs.slice((proArchivePage-1)*archivePageSize,proArchivePage*archivePageSize).map(item=>card(item,true)).join('')+`<nav class="archive-pagination" aria-label="Pagine archivio professionista">${Array.from({length:pages},(_,i)=>`<button type="button" class="btn btn-sm ${proArchivePage===i+1?'btn-primary':'btn-outline'}" data-pro-archive-page="${i+1}" aria-current="${proArchivePage===i+1?'page':'false'}">${i+1}</button>`).join('')}</nav>`:'<div class="adaptive-empty">L’archivio è vuoto. I lavori completati o chiusi compariranno qui.</div>';}
    document.querySelectorAll('[data-open-accepted-job]').forEach(button=>button.addEventListener('click',()=>openOpportunity(button.dataset.openAcceptedJob)));
    document.querySelectorAll('[data-open-archived-job]').forEach(button=>button.addEventListener('click',()=>openOpportunity(button.dataset.openArchivedJob,{readonly:true,proposalId:button.dataset.proposalId})));
  };
  const updateProfileCompletion = () => {
    const output = $("#statProfileCompletion");
    if (!output) return;
    const profileIds = ["proMainSector","proSpecialties","proServiceArea","proRadius","proWorkSize","proWorkMode","proAvailability","proUrgency","proPricing","proMinimum","proEstimate","proMaterials","proQualifications","proExcluded","proAcceptPrivate","proAcceptBusiness","proTravelCost","proCanVisit"];
    let profileFilled = 0;
    for (const id of profileIds) {
      const el = $("#" + id); if (!el) continue;
      if (el.type === "checkbox") { if (el.checked) profileFilled++; }
      else if (String(el.value || "").trim() !== "") profileFilled++;
    }
    const profileRatio = profileIds.length ? profileFilled / profileIds.length : 0;
    const services = catalogState.services || [];
    const serviceRatio = Math.min(1, services.length / 3);
    let groupsTotal = 0, groupsFilled = 0;
    services.forEach(serviceName => {
      (professionalSkills[serviceName] || professionalSkills["Altro servizio specialistico"] || []).forEach(field => {
        groupsTotal++;
        if ((catalogState.values[serviceName]?.[field.id] || []).length) groupsFilled++;
      });
    });
    const skillsRatio = groupsTotal ? groupsFilled / groupsTotal : 0;
    let publicRatio = 0;
    try {
      const publicProfile = JSON.parse(localStorage.getItem('trova_pro_public_profile_v1') || 'null') || {};
      const publicChecks = [publicProfile.businessName, publicProfile.city, publicProfile.description, publicProfile.profilePhoto, publicProfile.coverPhoto, (publicProfile.portfolio || []).length > 0];
      publicRatio = publicChecks.filter(Boolean).length / publicChecks.length;
    } catch {}
    const percentage = Math.round(profileRatio * 35 + serviceRatio * 25 + skillsRatio * 25 + publicRatio * 15);
    output.textContent = `${percentage}%`;
    const hint = output.closest(".stat-card")?.querySelector(".stat-change");
    if (hint) hint.textContent = percentage >= 90 ? "Profilo ben configurato" : percentage >= 60 ? "Profilo abbastanza completo: puoi perfezionarlo" : "Completa attività, competenze e preferenze";
  };
  const renderOpportunities = () => {
    const list = $("#proOpportunities"), empty = $("#proNoOpportunities"), count = $("#opportunityCount"), serviceFilter = $("#opportunitySectorFilter"), sort = $("#opportunitySort");
    if (!list || !serviceFilter) return;
    const services = catalogState.services || [];
    const prior = serviceFilter.value || "all";
    serviceFilter.innerHTML = `<option value="all">Tutti i miei servizi</option>${services.map(s=>`<option value="${safeText(s)}">${safeText(s)}</option>`).join("")}`;
    serviceFilter.value = services.includes(prior) ? prior : "all";
    const acceptedIds=new Set(readF2("proposals").filter(p=>p.status==="selected").map(p=>String(p.requestId)));
    let requests = getMatchingRequests().filter(r=>!acceptedIds.has(String(r.id))&&r.status!=="in_progress"&&!r.selectedProposalId).filter(r=>serviceFilter.value==="all"||sameService(r.service,serviceFilter.value));
    if (sort?.value === "budget") requests.sort((a,b)=>b.budget-a.budget);
    else if (sort?.value === "newest") requests.sort((a,b)=>b.idNumber-a.idNumber);
    else requests.sort((a,b)=>b.score-a.score||b.idNumber-a.idNumber);
    if (count) count.textContent = `${requests.length} compatibili`;
    renderAcceptedJobs();
    const stat = $("#statOpportunityValue"); if (stat) stat.textContent = String(requests.length);
    updateProfileCompletion();
    if (empty) {
      empty.hidden = requests.length>0;
      if (!requests.length) {
        const diagnostics = matchingDiagnostics.slice(0,5);
        empty.innerHTML = diagnostics.length
          ? `<strong>Nessuna richiesta supera tutti i requisiti del tuo profilo.</strong><p>Queste sono le cause rilevate sulle richieste aperte presenti in questo browser:</p><div class="matching-diagnostic-list">${diagnostics.map(item=>`<article><strong>${safeText(item.title)}</strong><small>📍 ${safeText(item.location)}</small><ul>${item.failures.map(reason=>`<li>${safeText(reason)}</li>`).join('')}</ul></article>`).join('')}</div>${matchingDiagnostics.length>5?`<small>Mostrate 5 richieste su ${matchingDiagnostics.length} escluse.</small>`:''}<p class="muted">Se non compare la richiesta che hai appena creato, controlla che cliente e professionista siano aperti sullo stesso indirizzo e porta (stessa origine) e che la richiesta sia salvata nello stesso browser.</p>`
          : 'Non risultano richieste aperte salvate in questo browser. Se ne hai appena pubblicata una, verifica che cliente e professionista usino lo stesso indirizzo e porta (stessa origine).';
      }
    }
    list.innerHTML = requests.length ? requests.map(r=>`<article class="pro-opportunity-card ${awaitProposalStatus(r.id).includes('modificat')?'has-proposal-modification':''} ${awaitProposalRecord(r.id)?.status==='rejected'?'has-rejected-proposal':''}"><div class="pro-opportunity-main"><div class="pro-opportunity-top"><span class="pill">${safeText(r.sector)} · ${safeText(r.service)}</span><span class="pill green">${r.score}% compatibilità</span>${(window.TrovaRepository?awaitProposalStatus(r.id):'') ? `<span class="pill proposal-state">${safeText(awaitProposalStatus(r.id))}</span>` : ''}</div><h3>${safeText(r.title)}</h3><p>${safeText(r.description)}</p><div class="pro-opportunity-meta"><span>⌖ ${safeText(r.location)}</span><span>Budget indicativo: ${typeof r.budget === "number" ? `€${r.budget.toLocaleString("it-IT")}` : safeText(r.budget || "Da definire")}</span><span>${safeText(r.age || "Appena pubblicata")}</span><span class="pill ${r.isUserDemo ? "amber" : "gray"}">Richiesta locale</span></div><div class="pro-opportunity-skills"><strong>Competenze richieste:</strong> ${r.required.map(s=>`<span>${safeText(s)}</span>`).join("")}</div></div><div class="pro-opportunity-action"><button class="btn btn-primary btn-sm" data-open-opportunity="${safeText(r.id)}">Apri dettagli ↗</button></div></article>`).join("") : "";
    list.querySelectorAll("[data-open-opportunity]").forEach(button=>button.addEventListener("click",()=>openOpportunity(button.dataset.openOpportunity)));
  };
  const applyDemoProfile = profileId => {
    const preset = demoProfiles[profileId];
    if (!preset || !catalogSector) return;
    catalogState.sector = preset.sector;
    catalogState.services = [...preset.services];
    catalogState.values = {};
    preset.services.forEach(service => {
      const groups = professionalSkills[service] || [];
      catalogState.values[service] = {};
      groups.forEach(group => { catalogState.values[service][group.id] = (group.options || []).slice(0,4); });
    });
    catalogSector.value = preset.sector;
    const sectorSummary = $("#proMainSector"); if (sectorSummary) sectorSummary.value = preset.sector;
    const specialtySummary = $("#proSpecialties"); if (specialtySummary) specialtySummary.value = preset.services.join(", ");
    const demoName = $(".page-header h1"); if (demoName) demoName.textContent = `Buongiorno, ${preset.name}.`;
    renderCatalogServices(true);
    renderOpportunities();
    toast("Profilo professionista demo caricato", `${preset.name}: le opportunità sono state aggiornate in base ai servizi e alle competenze selezionate.`);
  };
  function openOpportunity(id, options = {}) {
    const request = [...(workflow?.getRequests()||[]), ...allDemoRequests].find(r=>String(r.id)===String(id));
    if (!request || !detail) return;
    const archiveReadonly = Boolean(options.readonly || ["completed","closed","cancelled","archived","deleted"].includes(request.status));
    current = request;
    workflow?.markNotificationsRead?.(n=>n.recipientRole==='professional'&&String(n.requestId)===String(request.id)&&['proposal-selected','proposal-rejected','proposal-modification-accepted','proposal-modification-rejected','job-completed','job-withdrawn','job-completion-disputed'].includes(n.type));
    detail.dataset.requestId = request.id;
    $("#opportunityTitle").textContent = request.title;
    const budgetLabel = typeof request.budget === "number" ? `€${request.budget.toLocaleString("it-IT")}` : safeText(request.budget || "Da definire");
    const modeLabels = {presence:"In presenza",remote:"Da remoto",mixed:"Indifferente / da concordare"};
    const adaptive = request.adaptive || {};
    const adaptiveLabels = request.adaptiveLabels || {};
    const adaptiveLabel = key => adaptiveLabels[key] || ({tattooSubjectReal:'Soggetto del tatuaggio',tattooBodyReal:'Zona del corpo',tattooSizeReal:'Dimensioni o estensione desiderata',tattooColorReal:'Tecnica e colore',tattooExistingReal:'Tipo di intervento',tattooReferenceReal:'Immagini di riferimento'}[key] || String(key).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^./,c=>c.toUpperCase()));
    const detailRows = Object.entries(adaptive).filter(([,value]) => String(value ?? "").trim()).map(([key,value]) => `<div class="request-review-row"><span class="muted">${safeText(adaptiveLabel(key))}</span><strong>${safeText(String(value).replace(/^\s*maori\s*$/i,'Motivo in stile maori').replace(/^braccio\s*\/\s*avambraccio$/i,'Braccio o avambraccio').replace(/^realistico black\s*&\s*grey$/i,'Realismo in nero e grigio').replace(/^tatuaggio nuovo$/i,'Nuovo tatuaggio').replace(/^./,c=>c.toLocaleUpperCase('it-IT')))}</strong></div>`).join("");
    const attachments = Array.isArray(request.attachments) ? request.attachments : [];
    const attachmentHtml = attachments.length ? `<section class="request-full-section"><h4>Foto e documenti allegati <span class="pill gray">${attachments.length}</span></h4><div class="request-attachment-grid">${attachments.map(file => {
      const name = safeText(file.name || "Allegato");
      const candidateUrl = String(file.dataUrl || file.url || file.src || "");
      const url = /^data:(image\/[a-z0-9.+-]+|application\/pdf);base64,/i.test(candidateUrl) ? candidateUrl : "";
      if (!url) return `<div class="request-attachment-card"><span class="request-attachment-icon">📎</span><strong>${name}</strong><small>File presente, anteprima non disponibile</small></div>`;
      if (String(file.type || url.slice(5).split(";")[0] || "").startsWith("image/")) return `<a class="request-attachment-card request-attachment-image" href="#" data-media-preview="image" data-media-url="${url}" data-media-name="${name}"><img src="${url}" alt="${name}" loading="lazy"><strong>${name}</strong><small>Apri immagine ↗</small></a>`;
      return `<a class="request-attachment-card" href="#" data-media-preview="pdf" data-media-url="${url}" data-media-name="${name}"><span class="request-attachment-icon">PDF</span><strong>${name}</strong><small>Apri documento ↗</small></a>`;
    }).join("")}</div></section>` : `<section class="request-full-section"><h4>Foto e documenti allegati</h4><p class="muted">Nessun allegato presente in questa richiesta.</p></section>`;
    const requestDetails = [
      ["Tempistica desiderata", request.timing || "Non specificata"],
      ["Modalità del servizio", modeLabels[request.mode] || request.mode || "Da concordare"],
      ["Tipologia di budget", request.budgetType || "Non specificata"],
      ["Requisiti irrinunciabili", request.requirements || "Nessuno indicato"]
    ];
    const opportunityMarkup = `<div class="request-meta"><span>⌖ ${safeText(request.location || "Località non specificata")}</span><span>Budget indicativo: ${budgetLabel}</span><span>${safeText(request.sector || "Settore non specificato")} · ${safeText(request.service || "Servizio non specificato")}</span><span>${safeText(request.id)} · Richiesta salvata nel browser</span><span>Stato: ${safeText(request.status || "aperta")}</span>${request.isUserDemo ? `<span>Verifica email: simulata esclusivamente nel prototipo</span>` : ""}</div>
      <section class="request-full-section"><h4>Descrizione completa del cliente</h4><p class="request-full-description">${safeText(request.description || "Nessuna descrizione inserita.")}</p></section>
      <section class="request-full-section"><h4>Dettagli del lavoro</h4><div class="request-full-grid">${requestDetails.map(([label,value])=>`<div class="request-full-field"><span>${safeText(label)}</span><strong>${safeText(value)}</strong></div>`).join("")}</div>${detailRows ? `<div class="request-adaptive-details">${detailRows}</div>` : `<p class="muted">Il cliente non ha compilato ulteriori dettagli specifici del servizio.</p>`}</section>
      ${attachmentHtml}
      <div class="notice"><span>ⓘ</span><div>La richiesta e gli eventuali allegati sono conservati nel browser. I dati di contatto identificativi non vengono mostrati in questa vista.</div></div>`;
    $("#opportunityBody").innerHTML = archiveReadonly ? opportunityMarkup.replace(/<section class="request-full-section"><h4>([\s\S]*?)<\/h4>/g, '<details class="request-full-section pro-archive-collapsible"><summary><h4>$1</h4></summary>').replace(/<\/section>/g, '</details>') : opportunityMarkup;
    const actionBar = detail.querySelector(".pro-opportunity-modal-actions");
    if (actionBar) actionBar.hidden = archiveReadonly;
    detail.dataset.readonly = String(archiveReadonly);
    const isAccepted=request.status==="in_progress"||!!request.selectedProposalId;
    const completionPending=request.status==="awaiting_client_completion";
    const completionDisputed=request.status==="completion_disputed";
    const archivedReadonly=['completed','closed','cancelled','archived','deleted'].includes(request.status);
    const ownProposal=awaitProposalRecord(request.id);const proposalPending=['sent','modification_pending','replied'].includes(ownProposal?.status);const proposalLocked=completionPending||completionDisputed||archivedReadonly||proposalPending||((!!request.selectedProposalId||request.status==='in_progress')&&ownProposal?.status!=='selected');
    const proposalButton=$("#fullProposal"); if(proposalButton){proposalButton.hidden=archiveReadonly;proposalButton.disabled=proposalLocked;proposalButton.setAttribute("aria-disabled",String(proposalLocked));proposalButton.textContent=completionPending?"Preventivo bloccato · in attesa cliente":completionDisputed?"Preventivo bloccato · riattiva il lavoro":archivedReadonly?"Preventivo non modificabile · archivio":proposalPending?"Preventivo inviato · in attesa del cliente":ownProposal?.status==='rejected'?"Invia nuovo preventivo ↗":isAccepted?"Modifica preventivo ↗":"Invia preventivo ↗";}
    const chatButton=$("#preChat"); if(chatButton){chatButton.hidden=archiveReadonly;chatButton.textContent=isAccepted?"Contatta il cliente ↗":"Avvia conversazione preliminare";}
    const reportButton=$("#reportOpportunity"); if(reportButton)reportButton.hidden=archiveReadonly;
    let completionNotice=document.querySelector('#opportunityCompletionNotice');
    if(proposalLocked){if(!completionNotice){completionNotice=document.createElement('div');completionNotice.id='opportunityCompletionNotice';completionNotice.className='completed-readonly-notice';detail.insertBefore(completionNotice,detail.querySelector('.pro-opportunity-modal-actions'));}completionNotice.textContent=completionPending?'Il lavoro è in attesa di conferma del cliente. Il preventivo è bloccato e non può essere modificato in questa fase.':proposalPending?'Hai già inviato un preventivo. Potrai inviare una nuova versione solo dopo il rifiuto o la decisione del cliente.':completionDisputed?'Il completamento è stato rifiutato dal cliente. Il preventivo resta bloccato finché il cliente non riattiva il lavoro.':'Questo elemento è archiviato o chiuso: i dettagli sono in sola lettura e il preventivo non può essere modificato.';}else completionNotice?.remove();
    opportunityPreviousFocus=document.activeElement;
    opportunityPreviousOverflow=document.body.style.overflow;
    detail.hidden = false;
    if(detailLayer){detailLayer.hidden=false;document.body.style.overflow='hidden';}
    detail.focus({preventScroll:true});
  }
  let current = null;
  const demoProfileSelect = $("#proDemoProfile");
  if (demoProfileSelect) demoProfileSelect.addEventListener("change",()=>{if(demoProfileSelect.value!=="custom")applyDemoProfile(demoProfileSelect.value);});
  document.querySelectorAll("[data-demo-profile]").forEach(button=>button.addEventListener("click",()=>{
    openProfileEditor();
    const profileId=button.dataset.demoProfile;
    if(demoProfileSelect) demoProfileSelect.value=profileId;
    applyDemoProfile(profileId);
    $("#proCompatibilityEditor")?.scrollIntoView({behavior:"smooth",block:"start"});
  }));
  $("#opportunitySectorFilter")?.addEventListener("change",renderOpportunities);
  $("#opportunitySort")?.addEventListener("change",renderOpportunities);

  if (profileForm) {
    const profileIds = ["proMainSector","proSpecialties","proServiceArea","proRadius","proWorkSize","proWorkMode","proAvailability","proUrgency","proPricing","proMinimum","proEstimate","proMaterials","proQualifications","proExcluded","proAcceptPrivate","proAcceptBusiness","proTravelCost","proCanVisit"];
    let hasSavedPreferences = false;
    try {
      const saved = JSON.parse(sessionStorage.getItem("trova_pro_compatibility") || "null");
      if (saved) {
        hasSavedPreferences = true;
        profileIds.forEach(id => { const el = $("#"+id); if (el && saved[id] !== undefined) { if (el.type === "checkbox") el.checked = !!saved[id]; else el.value = saved[id]; } });
        if (saved.catalogState && saved.proSkillsVersion === 2) catalogState = saved.catalogState;
      }
    } catch {}
    if (catalogSector) {
      catalogSector.value = catalogState.sector || "Casa";

      renderCatalogServices(true);
      renderOpportunities();
      if (hasSavedPreferences) collapseProfileEditor();
      catalogSector.addEventListener("change", () => {
        catalogState.sector = catalogSector.value; catalogState.services = [];
        const sectorSummary = $("#proMainSector"); if (sectorSummary) sectorSummary.value = catalogState.sector;
        const specialtySummary = $("#proSpecialties"); if (specialtySummary) specialtySummary.value = "";
        if (demoProfileSelect) demoProfileSelect.value = "custom";
        renderCatalogServices();
        renderOpportunities();
      });
    }
    profileForm.addEventListener("submit", event => {
      event.preventDefault();
      const data = {};
      profileIds.forEach(id => { const el = $("#"+id); if (el) data[id] = el.type === "checkbox" ? el.checked : el.value.trim(); });
      if (catalogSector) {
        catalogState.sector = catalogSector.value;
        catalogState.services = [...catalogServices.querySelectorAll("[data-pro-service]:checked")].map(el => el.dataset.proService);
        data.catalogState = catalogState;
        data.proSkillsVersion = 2;
        const sectorSummary = $("#proMainSector"); if (sectorSummary) sectorSummary.value = catalogState.sector;
        const specialtySummary = $("#proSpecialties"); if (specialtySummary) specialtySummary.value = catalogState.services.join(", ");
      }
      if (demoProfileSelect) demoProfileSelect.value = "custom";
      try { sessionStorage.setItem("trova_pro_compatibility", JSON.stringify(data)); } catch {}
      try {
        const publicProfile = JSON.parse(localStorage.getItem('trova_pro_public_profile_v1') || 'null') || {};
        localStorage.setItem('trova_pro_public_profile_v1', JSON.stringify({...publicProfile, sector:data.proMainSector || catalogState.sector, services:[...(catalogState.services || [])], price:Number(data.proMinimum || 0), workMode:data.proWorkMode || 'In presenza', availability:data.proAvailability || '', urgent:/urgenze|subito/i.test(data.proUrgency || ''), radius:data.proRadius || '25'}));
        window.dispatchEvent(new CustomEvent('trova-pro-profile-updated'));
      } catch {}
      collapseProfileEditor();
      updateProfileCompletion();
      toast("Preferenze salvate", "Le preferenze sono state conservate in questo browser.");
    });
  }
  profileForm?.querySelectorAll('input,select,textarea').forEach(el=>el.addEventListener('change',updateProfileCompletion));
  updateProfileCompletion();
  renderProRatingStat();
  window.addEventListener('trova-pro-profile-updated', updateProfileCompletion);
  window.addEventListener('trova-pro-reviews-updated',()=>{renderAcceptedJobs();renderOpportunities();renderProRatingStat();});
  window.addEventListener('storage',e=>{if(e.key==='trova_pro_reviews_v1'){renderAcceptedJobs();renderOpportunities();renderProRatingStat();}});
  if (workflow) {
    let lastRequestCount = userRequests().length;
    const refreshDemoNotices = (announce = false) => {
      const activity=$('#proActivityList');
      const closedIds=new Set((workflow.getRequests()||[]).filter(r=>r.status==='closed').map(r=>String(r.id)));
      const currentRequests=new Map((workflow.getRequests()||[]).map(r=>[String(r.id),r]));
      const items=workflow.getNotifications().filter(n=>{if(n.read|| (n.recipientRole&&n.recipientRole!=='professional')||!['proposal-selected','proposal-rejected','message-received','proposal-received','request-closed','request-reactivated','proposal-modification-accepted','proposal-modification-rejected','job-completed','job-withdrawn','job-completion-disputed','review-received'].includes(n.type))return false;const current=currentRequests.get(String(n.requestId));if(n.type==='review-received'){const profile=(()=>{try{return JSON.parse(localStorage.getItem('trova_pro_public_profile_v1')||'null')||{}}catch{return {}}})();const mine=String(profile.businessName||'').trim().toLocaleLowerCase('it-IT'),target=String(n.professional||'').trim().toLocaleLowerCase('it-IT');if(mine&&target&&target!=='professionista'&&mine!==target)return false;}if(n.type==='job-completion-disputed'&&current&&current.status!=='completion_disputed')return false;return !(closedIds.has(String(n.requestId))&&['proposal-received','proposal-selected'].includes(n.type));}).slice(0,5);
      if(activity) activity.innerHTML=items.length?items.map(n=>`<article class="activity-item pro-activity-notice ${n.type==='review-received'?'pro-review-notification':''}"><span class="activity-dot ${['proposal-selected','review-received'].includes(n.type)?'is-success':''}"></span><div><strong>${n.type==='review-received'?'<i class="fa-solid fa-star" aria-hidden="true"></i> ':''}${safeText(n.title||'Aggiornamento')}</strong><small>${safeText(n.message||'')}${n.createdAt?` · ${new Date(n.createdAt).toLocaleString('it-IT')}`:''}</small>${n.type==='review-received'?`<div class="pro-review-notification-detail"><span><i class="fa-solid fa-user" aria-hidden="true"></i> ${safeText(n.clientName||'Cliente')}</span><span><i class="fa-solid fa-briefcase" aria-hidden="true"></i> ${safeText(n.workTitle||'Lavoro')}</span><span class="pro-review-notification-stars">${Array.from({length:5},(_,i)=>`<i class="fa-${i<Number(n.rating)?'solid':'regular'} fa-star" aria-hidden="true"></i>`).join('')} <b>${safeText(n.rating||'—')}/5</b></span>${n.comment?`<p>${safeText(n.comment)}</p>`:''}</div><button type="button" class="text-link pro-review-notification-open" data-notification-id="${safeText(n.id||'')}">Apri recensioni ↗</button>`:['message-received','job-completion-disputed'].includes(n.type)&&n.requestId?`<button type="button" class="text-link pro-notification-open" data-request-id="${safeText(n.requestId)}" data-notification-id="${safeText(n.id||'')}">Apri conversazione ↗</button>`:`<button type="button" class="text-link pro-notification-dismiss" data-notification-id="${safeText(n.id||'')}">Segna come letto</button>`}</div></article>`).join(''):'<div class="adaptive-empty">Non ci sono notifiche da leggere.</div>';
      const currentCount=userRequests().length;
      if(announce&&currentCount>lastRequestCount)toast('Nuova richiesta disponibile','Le opportunità compatibili sono state aggiornate.');
      lastRequestCount=currentCount;
      renderAcceptedJobs();
      renderProRatingStat();
    };
    refreshDemoNotices();
    window.addEventListener('trova-demo-updated',()=>{renderOpportunities();refreshDemoNotices(true)});
    window.addEventListener('trova-repository-change',()=>{renderOpportunities();refreshDemoNotices()});
    window.addEventListener('trova-pro-reviews-updated',()=>refreshDemoNotices());
    window.addEventListener('storage',event=>{if(event.key==='trova_pro_reviews_v1')refreshDemoNotices()});
    window.addEventListener('storage',event=>{if(!event.key||/trova_demo_requests_v1|trova_demo_notifications_v1|trova_f2_(proposals|messages)/.test(event.key)){renderOpportunities();refreshDemoNotices(true)}});
    let lastRequestSnapshot=JSON.stringify([workflow.getRequests(),readF2('proposals'),workflow.getNotifications()]);
    window.setInterval(()=>{const snapshot=JSON.stringify([workflow.getRequests(),readF2('proposals'),workflow.getNotifications()]);if(snapshot!==lastRequestSnapshot){lastRequestSnapshot=snapshot;renderOpportunities();refreshDemoNotices()}},1500);
  }
  document.addEventListener('click',async e=>{
    const jobAction=e.target.closest('[data-pro-job-action]');
    if(jobAction){e.preventDefault();const requestId=jobAction.dataset.requestId,proposalId=jobAction.dataset.proposalId,repo=window.TrovaRepository,req=await repo?.getRequest(requestId),proposal=await repo?.get('proposals',proposalId);if(!req||!proposal)return;const stamp=new Date().toISOString();if(jobAction.dataset.proJobAction==='complete'){if(!await window.TrovaDialog.confirm('Il cliente riceverà una richiesta per confermare il completamento. Vuoi procedere?',{title:'Segnala lavoro completato',icon:'fa-circle-check',confirmLabel:'Sì, completa'}))return;await repo.updateRequest(requestId,{status:'awaiting_client_completion',professionalCompletedAt:stamp});await repo.update('proposals',proposalId,{status:'awaiting_client_completion',professionalCompletedAt:stamp});workflow?.notify({id:'N-JOB-DONE-'+requestId,type:'job-completed',senderRole:'professional',recipientRole:'client',requestId,proposalId,title:'Il professionista ha completato il lavoro',message:`Il professionista segnala il completamento di “${req.title||req.service||'il lavoro'}”. Apri la richiesta per confermare e lasciare una recensione.`,createdAt:stamp,read:false});toast('Completamento segnalato','Il cliente riceverà una richiesta di conferma.');}else{const reason=await window.TrovaDialog.prompt('Spiega brevemente perché rinunci all’incarico. Il cliente riceverà questo motivo nella notifica.',{title:'Motivo della rinuncia',placeholder:'Descrivi il motivo…',required:true,confirmLabel:'Invia rinuncia'});if(!reason||!reason.trim())return;await repo.update('proposals',proposalId,{status:'closed',closedAt:stamp,closeReason:reason.trim()});const all=await repo.getProposals(requestId);for(const other of all){if(other.id!==proposalId&&['rejected','closed'].includes(other.status))await repo.update('proposals',other.id,{status:'sent',rejectedAt:null,closedAt:null});}await repo.updateRequest(requestId,{status:'open',selectedProposalId:null,acceptedAt:null,professionalWithdrawalAt:stamp});workflow?.notify({id:'N-JOB-WITHDRAW-'+requestId,type:'job-withdrawn',senderRole:'professional',recipientRole:'client',requestId,proposalId,title:'Il professionista ha chiuso l’incarico',message:`Il professionista ha rinunciato all’incarico. Motivo: ${reason.trim()}. La richiesta è stata riaperta per valutare altre proposte.`,createdAt:stamp,read:false});toast('Incarico chiuso','La richiesta è stata riaperta per altre proposte.');}renderOpportunities();return;}
    const archivePageButton=e.target.closest('[data-pro-archive-page]');if(archivePageButton){proArchivePage=Number(archivePageButton.dataset.proArchivePage)||1;renderAcceptedJobs();return;}
    const reviewOpen=e.target.closest('.pro-review-notification-open');
    if(reviewOpen){e.preventDefault();workflow?.markNotificationRead?.(reviewOpen.dataset.notificationId);const reviewsSection=$('#proReviewsTitle')?.closest('.pro-reviews-section');if(reviewsSection){reviewsSection.scrollIntoView({behavior:'smooth',block:'start'});reviewsSection.setAttribute('tabindex','-1');reviewsSection.focus({preventScroll:true});}return;}
    const dismiss=e.target.closest('.pro-notification-dismiss');
    if(dismiss){e.preventDefault();workflow?.markNotificationRead?.(dismiss.dataset.notificationId);return;}
    const inbox=e.target.closest('.pro-notification-open');
    if(inbox){e.preventDefault();if(window.TrovaChatCenter){window.TrovaChatCenter.open(inbox.dataset.requestId);return;}const id=inbox.dataset.requestId,repo=window.TrovaRepository;const items=repo?await repo.getMessages(id):[];
      try{const all=JSON.parse(localStorage.getItem('trova_f2_messages')||'[]');localStorage.setItem('trova_f2_messages',JSON.stringify(all.map(m=>(String(m.threadId)===String(id)||String(m.requestId)===String(id))&&m.recipientRole==='professional'?{...m,read:true,readAt:new Date().toISOString()}:m)));window.dispatchEvent(new CustomEvent('trova-repository-change',{detail:{type:'messages'}}));}catch{}
      workflow?.markNotificationsRead?.(n=>n.recipientRole==='professional'&&n.type==='message-received'&&String(n.requestId)===String(id));
      const escHtml=v=>String(v??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
      window.TrovaModal?.open('Conversazione con il cliente',`<div class="pro-inbox-thread">${items.length?items.map(m=>`<article><strong>${escHtml(m.sender||'Utente')}</strong><p>${escHtml(m.message||'')}</p><small>${m.createdAt?new Date(m.createdAt).toLocaleString('it-IT'):''}</small></article>`).join(''):'<p>Non ci sono ancora messaggi in questa conversazione.</p>'}</div><form id="proInboxReplyForm" data-request-id="${escHtml(id)}"><label class="modal-field">Rispondi al cliente<textarea name="message" required minlength="2"></textarea></label><div class="trova-modal-actions"><button type="button" data-modal-close>Chiudi</button><button class="primary" type="submit">Invia risposta</button></div></form>`,{wide:true});return;
    }
    const media=e.target.closest('[data-media-preview]');if(!media)return;e.preventDefault();const url=media.dataset.mediaUrl,name=media.dataset.mediaName||'Allegato';if(!url)return;window.TrovaModal?.open(name,media.dataset.mediaPreview==='image'?`<div class="media-preview-fullscreen"><img src="${url}" alt="${safeText(name)}"></div>`:`<div class="media-preview-fullscreen"><iframe src="${url}" title="${safeText(name)}"></iframe></div>`,{wide:true});
  });
  document.addEventListener('submit',async e=>{if(e.target.id!=='proInboxReplyForm')return;e.preventDefault();const id=e.target.dataset.requestId,message=new FormData(e.target).get('message');try{const item=await window.TrovaRepository.sendMessage({threadId:id,requestId:id,message,sender:'Professionista',recipientRole:'client',type:'professional-reply',requiresResponse:true,read:false});window.TrovaWorkflow?.notify({id:'N-PRO-REPLY-'+item.id,type:'message-received',senderRole:'professional',recipientRole:'client',requestId:id,messageId:item.id,title:'Risposta del professionista',message:String(message),createdAt:new Date().toISOString(),read:false});window.TrovaModal?.close();toast('Risposta inviata nella demo','Il cliente la vedrà nella conversazione della richiesta.');}catch(error){toast('Invio non riuscito',error.message||'Riprova.');}});
  if (!detail) return;
  $("#closeOpportunity")?.addEventListener("click", closeOpportunityModal);
  window.addEventListener('trova-proposal-saved',closeOpportunityModal);
  detailLayer?.addEventListener("click", event => { if (event.target === detailLayer) closeOpportunityModal(); });
  document.addEventListener("keydown", event => { const sharedModal=document.querySelector('.trova-modal-layer'); if (!detailLayer?.hidden && (!sharedModal || sharedModal.hidden) && event.key === "Escape") { event.preventDefault(); closeOpportunityModal(); } });
  // I pulsanti sono gestiti dal popup condiviso, che salva proposte e messaggi nella demo locale.
  $("#reportOpportunity")?.addEventListener("click", async () => {
    if (detail?.dataset.readonly === "true" || !current || !workflow) return;
    const reason = await window.TrovaDialog.prompt('Descrivi il motivo della segnalazione (ad esempio richiesta falsa, dati incoerenti o contenuto inappropriato).',{title:'Segnala richiesta',placeholder:'Motivo della segnalazione…',required:true,confirmLabel:'Invia segnalazione'});
    if (!reason || !reason.trim()) return;
    const reports = workflow.read("trova_demo_reports_v1", []);
    reports.unshift({id:`REP-${Date.now()}`,requestId:current.id,reason:reason.trim(),createdAt:new Date().toISOString(),status:"in attesa di revisione"});
    workflow.write("trova_demo_reports_v1", reports);
    toast("Segnalazione salvata", "La segnalazione è stata conservata in questo browser.");
  });
})();
