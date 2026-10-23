(() => {
  const { $, toast } = window.Trova;
  const grid = $("#professionalGrid");
  if (!grid) return;
  const data = window.TrovaDemoData || {professionals:[]};
  const readStored = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } };
  const publicProfile = readStored('trova_pro_public_profile_v1', null);
  const compatibility = (() => { try { return JSON.parse(sessionStorage.getItem('trova_pro_compatibility') || 'null') || {}; } catch { return {}; } })();
  const publicServices = publicProfile?.services || compatibility.catalogState?.services || [];
  const savedProfessional = publicProfile?.businessName ? [{id:'saved-professional-profile',name:publicProfile.businessName,city:publicProfile.city||'',sector:publicProfile.sector||compatibility.proMainSector||compatibility.catalogState?.sector||'Professionisti',service:publicServices.join(', ')||'Servizi professionali',description:publicProfile.description||'Profilo professionale aggiornato dal titolare.',skills:publicServices,tags:publicServices,palette:'palette-blue',initials:publicProfile.businessName.split(/\s+/).map(x=>x[0]).join('').slice(0,2).toUpperCase(),price:Number(publicProfile.price??compatibility.proMinimum??0),available:!(/non disponibile/i.test(publicProfile.availability||compatibility.proAvailability||'')),urgent:publicProfile.urgent??/urgenze|subito/i.test(compatibility.proUrgency||''),mode:/remoto/i.test(publicProfile.workMode||compatibility.proWorkMode||'')?'remote':'presence',size:'small medium large',radius:Number(publicProfile.radius||compatibility.proRadius||25),profilePhoto:publicProfile.profilePhoto,coverPhoto:publicProfile.coverPhoto,portfolio:publicProfile.portfolio||[]}] : [];
  const professionals = [...(data.professionals || []), ...savedProfessional];
  if (!professionals.length) {
    grid.innerHTML = '<div class="adaptive-empty">Al momento non ci sono profili professionali pubblicati in questo browser. Completa il profilo nell’area professionista per mostrarlo qui.</div>';
    $("#resultCount").textContent = "0 professionisti";
    return;
  }
  const sectorBoxes = [...document.querySelectorAll('input[name="sector"]')];
  const search = $("#proSearch"), area = $("#areaFilter"), available = $("#availableFilter"), urgent = $("#urgentFilter"), sort = $("#sortSelect"), view = $("#viewSelect");
  const modeBoxes = [...document.querySelectorAll('input[name="serviceMode"]')], sizeBoxes = [...document.querySelectorAll('input[name="workSize"]')];
  const priceCeiling = $("#priceCeiling"), radiusFilter = $("#radiusFilter");
  const params = new URLSearchParams(location.search);
  if (params.get("category")) sectorBoxes.forEach(box => box.checked = box.value === params.get("category"));
  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[ch]));
  const cardMarkup = p => {
    const completedRequestIds = new Set();
    const reviews=readStored('trova_pro_reviews_v1',[]).filter(r=>Number(r.rating)>=1&&Number(r.rating)<=5&&(!r.professional||r.professional===p.name||p.id==='saved-professional-profile'));
    const avg=reviews.length?reviews.reduce((sum,r)=>sum+Number(r.rating),0)/reviews.length:0;
    const proposals=readStored('trova_f2_proposals',[]);
    const requests=readStored('trova_demo_requests_v1',[]);
    const norm=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it-IT').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
    const profileNames=p.id==='saved-professional-profile'?[publicProfile?.businessName,compatibility.proDisplayName,compatibility.businessName]:[];
    const professionalNames=new Set([p.name,...profileNames].filter(Boolean).map(norm));
    const isThisProfessional=pr=>{
      const names=[pr.professional,pr.professionalName,pr.professionalBusinessName,pr.businessName].filter(Boolean).map(norm);
      const nameMatch=names.some(name=>professionalNames.has(name));
      const idMatch=[pr.professionalId,pr.proId,pr.profileId].some(value=>value!==undefined&&value!==null&&String(value)===String(p.id));
      const currentProfileMatch=p.id==='saved-professional-profile'&&String(pr.professionalId||'')==='current-professional';
      return nameMatch||idMatch||currentProfileMatch;
    };
    const proposalsById=new Map(proposals.map(pr=>[String(pr.id),pr]));
    proposals.filter(pr=>isThisProfessional(pr)&&(pr.status==='completed'||requests.some(r=>String(r.id)===String(pr.requestId)&&r.status==='completed'&&(String(r.selectedProposalId||'')===String(pr.id)||!r.selectedProposalId)))).forEach(pr=>{
      const linkedRequest=requests.find(r=>String(r.id)===String(pr.requestId));
      if(pr.status==='completed'||linkedRequest?.status==='completed') completedRequestIds.add(String(pr.requestId));
    });
    requests.filter(r=>r.status==='completed'&&r.selectedProposalId).forEach(r=>{
      const selected=proposalsById.get(String(r.selectedProposalId));
      if(selected&&isThisProfessional(selected))completedRequestIds.add(String(r.id));
    });
    const completedJobs=completedRequestIds.size;
    const profession=p.service||p.services?.join(', ')||p.sector||'Professionista';
    return `<article class="pro-card" data-pro-id="${esc(p.id)}"><div class="pro-card-cover ${esc(p.palette||'palette-blue')}" ${p.coverPhoto?`style="background-image:linear-gradient(180deg,rgba(10,20,40,.08),rgba(10,20,40,.3)),url('${p.coverPhoto}')"`:''}><span class="cover-orb"></span>${p.profilePhoto?`<img class="pro-card-avatar-image" src="${p.profilePhoto}" alt="Foto profilo di ${esc(p.name)}">`:`<span class="pro-card-avatar">${esc(p.initials||p.name.slice(0,2).toUpperCase())}</span>`}</div><div class="pro-card-body"><div class="pro-card-title-row"><h3>${esc(p.name)}</h3><span class="verified">${p.id==='saved-professional-profile'?'✦ Profilo aggiornato':'✦ Profilo demo'}</span></div><div class="pro-card-meta"><span>⌖ ${esc(p.city||'Città non indicata')}</span><span>${esc(p.sector||'Professionista')}</span></div><div class="pro-card-rating">${avg?`<span class="pro-review-stars">${'★'.repeat(Math.round(avg))}${'☆'.repeat(5-Math.round(avg))}</span><strong>${avg.toFixed(1).replace('.',',')}/5</strong><span>(${reviews.length} ${reviews.length===1?'recensione':'recensioni'})</span>`:'<span class="pro-review-stars">☆☆☆☆☆</span><span>Nessuna recensione</span>'}</div><div class="pro-card-profession"><strong>Professione:</strong> ${esc(profession)}</div><div class="pro-card-jobs"><strong>${completedJobs}</strong> ${completedJobs===1?'lavoro completato sulla piattaforma':'lavori completati sulla piattaforma'}</div><p>${esc(p.description)}</p><div class="tag-list">${(p.tags||[]).map(tag=>`<span>${esc(tag)}</span>`).join('')}</div>${p.portfolio?.length?`<div class="directory-mini-portfolio">${p.portfolio.slice(0,3).map(photo=>`<img src="${photo.dataUrl}" alt="Lavoro del professionista">`).join('')}</div>`:''}<div class="pro-card-bottom"><div><small>Prezzo indicativo da</small><strong>${Number(p.price||0).toLocaleString('it-IT')} €</strong></div><a class="btn btn-outline" href="profilo-professionista.html?demo=${encodeURIComponent(p.id)}">Profilo ↗</a></div></div></article>`;
  };
  grid.innerHTML = professionals.map(cardMarkup).join("");
  const cards = [...grid.querySelectorAll(".pro-card")];
  const byId = new Map(professionals.map(p => [p.id, p]));
  const filter = () => {
    const terms = search.value.toLowerCase().trim();
    const selected = sectorBoxes.filter(b => b.checked).map(b => b.value);
    const areaTerm = (window.TrovaNormalizeCity ? window.TrovaNormalizeCity(area.value) : area.value.toLowerCase().trim());
    const modes = modeBoxes.filter(b => b.checked).map(b => b.value);
    const sizes = sizeBoxes.filter(b => b.checked).map(b => b.value);
    const ceiling = Number(priceCeiling.value || 0), radius = Number(radiusFilter.value || 0);
    let visible = [];
    cards.forEach(card => {
      const p = byId.get(card.dataset.proId);
      const matches = (!selected.length || selected.includes(p.sector)) &&
        (!terms || `${p.name} ${p.service} ${p.sector} ${p.description} ${(p.skills||[]).join(" ")}`.toLowerCase().includes(terms)) &&
        (!areaTerm || (window.TrovaNormalizeCity ? window.TrovaNormalizeCity(p.city) : String(p.city||'').toLowerCase().trim()) === areaTerm) &&
        (!available.checked || p.available) && (!urgent.checked || p.urgent) &&
        (!modes.length || modes.some(mode => p.mode.split(" ").includes(mode))) &&
        (!sizes.length || sizes.some(size => p.size.split(" ").includes(size))) &&
        (!ceiling || p.price <= ceiling) && (!radius || p.radius <= radius);
      card.hidden = !matches;
      if (matches) visible.push({card,p});
    });
    visible.sort((a,b) => sort.value === "name" ? a.p.name.localeCompare(b.p.name) : sort.value === "price" ? a.p.price-b.p.price : a.p.name.localeCompare(b.p.name));
    visible.forEach(({card}) => grid.appendChild(card));
    $("#resultCount").textContent = `${visible.length} professionisti`;
    $("#noResults").hidden = visible.length !== 0;
    grid.classList.toggle("directory-compact", view.value === "compact");
  };
  [search,area,available,urgent,sort,priceCeiling,radiusFilter,...sectorBoxes,...modeBoxes,...sizeBoxes].forEach(el => { el?.addEventListener("input",filter); el?.addEventListener("change",filter); });
  view.addEventListener("change", filter);
  window.addEventListener('trova-pro-profile-updated',()=>{window.location.reload()});
  window.addEventListener('storage',event=>{if(event.key==='trova_pro_public_profile_v1')window.location.reload()});
  $("#resetFilters").addEventListener("click", () => { search.value=""; area.value=""; available.checked=false; urgent.checked=false; sectorBoxes.forEach(b=>b.checked=false); modeBoxes.forEach(b=>b.checked=false); sizeBoxes.forEach(b=>b.checked=false); priceCeiling.value=""; radiusFilter.value=""; sort.value="recommended"; view.value="cards"; filter(); toast("Filtri azzerati","La ricerca è stata azzerata."); });
  filter();
})();
