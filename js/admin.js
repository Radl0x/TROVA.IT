(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const dashboard = document.body.classList.contains('admin-console');
  if (!dashboard) return;
  if (sessionStorage.getItem('trova_demo_role') !== 'admin') {
    location.replace('admin-login.html');
    return;
  }
  const titles = {
    overview:['Panoramica piattaforma','Una vista unica dello stato operativo e di tutte le aree gestibili di Trova.'],
    users:['Utenti e account','Gestisci account cliente, stato, accessi e richieste di assistenza.'],
    professionals:['Professionisti','Verifica profili, competenze, portfolio, area operativa e completezza.'],
    requests:['Richieste','Monitora richieste, stato, visibilità, allegati e compatibilità.'],
    proposals:['Proposte e incarichi','Segui proposte, conversazioni preliminari, selezioni e incarichi confermati.'],
    matching:['Matching e regole','Configura i requisiti essenziali, il ranking e l’allargamento guidato.'],
    categories:['Categorie e servizi','Gestisci tassonomia, specializzazioni e moduli adattivi per settore.'],
    moderation:['Segnalazioni e moderazione','Esamina segnalazioni e gestisci contenuti e comportamenti.'],
    messages:['Messaggi e notifiche','Controlla canali, modelli di comunicazione e stato delle notifiche.'],
    reviews:['Recensioni e portfolio','Modera contenuti e recensioni collegate agli incarichi.'],
    commercial:['Piani e pagamenti','Configura piani, abbonamenti, commissioni e report economici.'],
    analytics:['Dati e report','Consulta indicatori, periodi e report illustrativi del marketplace.'],
    settings:['Impostazioni piattaforma','Controlla le impostazioni globali e i parametri operativi.'],
    security:['Privacy e sicurezza','Rivedi controlli di accesso, privacy, consensi e procedure di sicurezza.'],
    audit:['Registro attività','Consulta le azioni amministrative dimostrative della sessione corrente.']
  };
  let activeTab = 'overview';
  const audit = [];
  const toast = (title, message = 'Azione dimostrativa: nessun dato è stato inviato a un server.') => {
    const box = $('#adminToast');
    box.replaceChildren(); box.hidden = false;
    const strong = document.createElement('strong'); strong.textContent = title;
    const span = document.createElement('span'); span.textContent = message;
    box.append(strong, span);
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => { box.hidden = true; }, 4300);
  };
  const addAudit = (action, area = titles[activeTab]?.[0] || activeTab, result = 'Simulato') => {
    const now = new Date();
    audit.unshift({time: now.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})+' · demo', action, area, result});
    renderAudit();
  };
  const renderAudit = () => {
    const body = $('#adminAuditRows');
    if (!body) return;
    const seeded = [
      {time:'09:42 · demo',action:'Accesso alla console',area:'Autenticazione',result:'Riuscito'},
      {time:'09:38 · demo',action:'Controllo impostazioni notifiche',area:'Sistema',result:'Completato'}
    ];
    body.replaceChildren();
    [...audit, ...seeded].forEach(item => {
      const tr = document.createElement('tr');
      [item.time,item.action,item.area,item.result,'Browser locale'].forEach((value,index) => {
        const td = document.createElement('td');
        if (index === 3) { const pill = document.createElement('span'); pill.className='pill '+(value==='Riuscito'||value==='Completato'?'green':'amber'); pill.textContent=value; td.append(pill); }
        else td.textContent=value;
        tr.append(td);
      }); body.append(tr);
    });
    const overview = $('#overviewActivity');
    if (overview && audit.length) {
      audit.slice(0,3).forEach(item => {
        const tr=document.createElement('tr');
        [item.action,item.area,item.result,item.time].forEach((value,index)=>{const td=document.createElement('td');td.textContent=value;tr.append(td);});
        overview.prepend(tr);
      });
    }
  };

  const escHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const getAllProfessionals = () => (window.TrovaDemoData?.professionals || []).map(p => ({...p, isDemo:true}));
  const getAllRequests = () => {
    const seed = (window.TrovaDemoData?.requests || []).map(r => ({
      ...r, status:r.status || 'open', isSeedDemo:true,
      required:r.required || r.requiredSkills || [],
      createdAt:r.createdAt || new Date().toISOString()
    }));
    const saved = window.TrovaWorkflow?.getRequests() || [];
    const savedIds = new Set(saved.map(r => r.id));
    return [...saved, ...seed.filter(r => !savedIds.has(r.id))];
  };
  const statusLabel = request => {
    const status = String(request.status || 'open').toLowerCase();
    if (status === 'closed' || status === 'chiusa') return 'Chiusa';
    if (status === 'assigned' || status === 'assegnata') return 'Assegnata';
    if (status === 'review' || status === 'in revisione') return 'In revisione';
    if (request.verificationStatus && request.verificationStatus !== 'verificata-solo-demo') return 'Da verificare';
    return 'Aperta';
  };
  const renderMarketplaceTables = () => {
    const professionals = getAllProfessionals();
    const requests = getAllRequests();
    const proBody = $('[data-admin-panel="professionals"] .searchable-table tbody');
    if (proBody) {
      proBody.replaceChildren();
      professionals.forEach(pro => {
        const tr = document.createElement('tr');
        const skillSummary = (pro.skills || []).slice(0,5).join(', ') || 'Competenze da configurare';
        const profileStatus = pro.available === false ? 'In pausa · demo' : 'Disponibile · demo';
        const cells = [pro.name, `${pro.sector} · ${pro.service}`, `${skillSummary}${(pro.skills || []).length > 5 ? '…' : ''}`, profileStatus];
        cells.forEach((value, i) => {
          const td = document.createElement('td');
          if (i === 3) { const pill=document.createElement('span'); pill.className='pill '+(pro.available === false?'amber':'green'); pill.textContent=value; td.append(pill); }
          else td.textContent=value;
          tr.append(td);
        });
        const actionCell=document.createElement('td');
        const detailBtn=document.createElement('button'); detailBtn.className='btn btn-outline btn-xs'; detailBtn.textContent='Dettagli';
        detailBtn.addEventListener('click',()=>toast(pro.name, `${pro.service} · ${pro.city} · Raggio ${pro.radius} km · Competenze: ${(pro.skills||[]).join(', ') || 'non specificate'}. Profilo fittizio.`));
        actionCell.append(detailBtn); tr.append(actionCell); proBody.append(tr);
      });
    }
    const reqBody = $('#requestsTable');
    if (reqBody) {
      reqBody.replaceChildren();
      requests.forEach(request => {
        const tr=document.createElement('tr');
        const status=statusLabel(request);
        tr.dataset.status=status;
        const visibility=request.isUserDemo ? 'Solo compatibili · demo locale' : 'Archivio demo · visibilità simulata';
        const cells=[`${request.id || 'REQ'} · ${request.title || request.service}`, request.sector || '—', request.location || '—'];
        cells.forEach(value=>{const td=document.createElement('td');td.textContent=value;tr.append(td);});
        const statusTd=document.createElement('td'); const pill=document.createElement('span'); pill.className='pill '+(status==='Aperta'?'green':status==='Chiusa'?'gray':'amber'); pill.textContent=status; statusTd.append(pill);tr.append(statusTd);
        const visibilityTd=document.createElement('td');visibilityTd.textContent=visibility;tr.append(visibilityTd);
        const actions=document.createElement('td');
        const detail=document.createElement('button');detail.className='btn btn-outline btn-xs';detail.textContent='Dettagli';
        detail.addEventListener('click',()=>toast(request.title || request.service, `${request.sector || ''} · ${request.service || ''} · ${request.location || ''} · Stato: ${status}. ${request.description || ''}`)); actions.append(detail);
        if (request.isUserDemo) {
          const toggle=document.createElement('button');toggle.className='btn btn-outline btn-xs';toggle.style.marginLeft='5px';toggle.textContent=status==='Chiusa'?'Riapri demo':'Chiudi demo';
          toggle.addEventListener('click',()=>{request.status=status==='Chiusa'?'open':'closed';request.closedAt=request.status==='closed'?new Date().toISOString():null;window.TrovaWorkflow?.saveRequest(request);renderMarketplaceTables();toast('Stato richiesta aggiornato','Modifica salvata solo nel browser demo.');addAudit(`Stato richiesta ${request.id}: ${request.status}`,'Richieste');});actions.append(toggle);
        }
        tr.append(actions);reqBody.append(tr);
      });
    }
    // KPI e contatori di navigazione riflettono l'archivio effettivo del prototipo.
    const openRequests=requests.filter(r=>statusLabel(r)!=='Chiusa').length;
    const kpis=$$('.admin-kpi');
    if(kpis[1]?.querySelector('strong')) kpis[1].querySelector('strong').textContent=String(professionals.length);
    if(kpis[2]?.querySelector('strong')) kpis[2].querySelector('strong').textContent=String(openRequests);
    const proNav=$('[data-admin-tab="professionals"] b'); if(proNav) proNav.textContent=String(professionals.length);
    const reqNav=$('[data-admin-tab="requests"] b'); if(reqNav) reqNav.textContent=String(openRequests);
    const proCards=$('[data-admin-panel="professionals"] .admin-section-cards');
    if(proCards){const first=proCards.querySelector('.admin-mini-card strong');if(first)first.textContent=String(professionals.length);const small=proCards.querySelector('.admin-mini-card small');if(small)small.textContent='Profili demo caricati dall’archivio condiviso';}
    const reqFilter=$('#requestStatusFilter');
    if(reqFilter && ![...reqFilter.options].some(o=>o.value==='Chiusa')) reqFilter.add(new Option('Chiusa','Chiusa'));
    const liveLabel=$('#adminMarketplaceLive');
    if(liveLabel) liveLabel.textContent=`Archivio aggiornato · ${professionals.length} professionisti · ${requests.length} richieste disponibili · aggiornamento automatico`;
    // Riapplica filtri e ricerca anche alle righe appena arrivate durante il refresh automatico.
    const statusValue=$('#requestStatusFilter')?.value || 'all';
    const searchValue=($('#adminGlobalSearch')?.value || '').trim().toLowerCase();
    $$('[data-admin-panel="professionals"] .searchable-table tbody tr, [data-admin-panel="requests"] .searchable-table tbody tr').forEach(row=>{
      const statusOk=!row.closest('#requestsTable') || statusValue==='all' || row.dataset.status===statusValue;
      const searchOk=!searchValue || row.innerText.toLowerCase().includes(searchValue);
      row.hidden=!(statusOk && searchOk);
    });
  };
  // L'archivio condiviso viene aggiornato subito dagli eventi e ricontrollato periodicamente.
  renderMarketplaceTables();
  window.addEventListener('trova-demo-updated', renderMarketplaceTables);
  window.addEventListener('storage', event => { if (!event.key || ['trova_demo_requests_v1','trova_demo_notifications_v1'].includes(event.key)) renderMarketplaceTables(); });
  let lastMarketplaceSnapshot='';
  window.setInterval(()=>{
    const snapshot=JSON.stringify({p:getAllProfessionals().length,r:getAllRequests().map(r=>[r.id,r.status,r.title])});
    if(snapshot!==lastMarketplaceSnapshot){lastMarketplaceSnapshot=snapshot;renderMarketplaceTables();}
  },1500);

  const renderDemoReports = () => {
    const panel = $('[data-admin-panel="moderation"]');
    if (!panel || !window.TrovaWorkflow) return;
    let box = $('#demoReportsMount');
    if (!box) {
      box = document.createElement('section'); box.id = 'demoReportsMount'; box.className = 'surface-card admin-widget';
      box.innerHTML = '<div class="admin-widget-head"><div><h2>Segnalazioni ricevute dal prototipo</h2><p>Segnalazioni registrate localmente dal pulsante “Segnala richiesta”. Non sono ticket reali.</p></div><span class="pill amber">Browser locale</span></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>ID</th><th>Richiesta</th><th>Motivo</th><th>Data</th><th>Stato</th><th>Azione demo</th></tr></thead><tbody id="demoReportsRows"></tbody></table></div><p class="tiny muted" id="demoReportsEmpty">Nessuna segnalazione inviata dal prototipo in questo browser.</p>';
      panel.prepend(box);
    }
    const reports = window.TrovaWorkflow.read('trova_demo_reports_v1', []);
    const tbody = $('#demoReportsRows'); tbody.replaceChildren();
    reports.forEach(report => {
      const tr = document.createElement('tr');
      [report.id, report.requestId, report.reason, new Date(report.createdAt).toLocaleString('it-IT'), report.status || 'Aperta'].forEach(value => { const td=document.createElement('td'); td.textContent=value; tr.append(td); });
      const actionCell=document.createElement('td');
      if ((report.status || '').toLowerCase().includes('risolta')) { actionCell.textContent='—'; }
      else { const button=document.createElement('button'); button.className='btn btn-outline btn-xs'; button.textContent='Segna risolta (demo)'; button.addEventListener('click',()=>{const all=window.TrovaWorkflow.read('trova_demo_reports_v1',[]);const item=all.find(x=>x.id===report.id);if(item){item.status='Risolta nella demo';item.resolvedAt=new Date().toISOString();window.TrovaWorkflow.write('trova_demo_reports_v1',all);renderDemoReports();toast('Segnalazione aggiornata','Stato salvato solo nel browser. Nessuna moderazione reale è stata eseguita.');addAudit('Segnalazione demo risolta','Moderazione');}});actionCell.append(button); }
      tr.append(actionCell); tbody.append(tr);
    });
    $('#demoReportsEmpty').hidden = reports.length > 0;
  };
  renderDemoReports();
  window.addEventListener('storage', event => { if (event.key === 'trova_demo_reports_v1') renderDemoReports(); });
  window.addEventListener('trova-demo-updated', renderDemoReports);

  const switchTab = (tab) => {
    if (!titles[tab]) return;
    activeTab = tab;
    $$('.admin-nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.adminTab === tab));
    $$('.admin-panel').forEach(panel => { const active = panel.dataset.adminPanel === tab; panel.hidden = !active; panel.classList.toggle('active',active); });
    $('#adminPageTitle').textContent = titles[tab][0]; $('#adminPageSubtitle').textContent = titles[tab][1];
    $('#adminGlobalSearch').value = '';
    applySearch('');
    if (tab === 'audit') renderAudit();
    if (window.matchMedia('(max-width:780px)').matches) $('.admin-main').scrollIntoView({behavior:'smooth',block:'start'});
  };
  $$('.admin-nav-item').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.adminTab)));
  $$('[data-jump]').forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.jump)));
  const applySearch = (query) => {
    const needle = query.trim().toLowerCase();
    const panel = $(`[data-admin-panel="${activeTab}"]`);
    if (!panel) return;
    $$('.searchable-table tbody tr', panel).forEach(row => { row.hidden = !!needle && !row.innerText.toLowerCase().includes(needle); });
    $$('.admin-category-grid article', panel).forEach(card => { card.hidden = !!needle && !card.innerText.toLowerCase().includes(needle); });
    $$('.admin-action-list>button', panel).forEach(card => { card.hidden = !!needle && !card.innerText.toLowerCase().includes(needle); });
  };
  $('#adminGlobalSearch')?.addEventListener('input', event => applySearch(event.target.value));
  $('#requestStatusFilter')?.addEventListener('change', event => {
    $$('#requestsTable tr').forEach(row => row.hidden = event.target.value !== 'all' && row.dataset.status !== event.target.value);
  });
  document.addEventListener('click', event => {
    const action = event.target.closest('[data-action],[data-row-action]');
    if (action) {
      const label = action.dataset.action || action.dataset.rowAction;
      toast(label, 'Anteprima amministrativa locale. L’operazione reale richiede backend, permessi e conferma appropriata.');
      addAudit(label);
      return;
    }
    const status = event.target.closest('[data-status-toggle]');
    if (status) {
      const old = status.textContent.trim();
      status.textContent = status.dataset.originalLabel || 'Aggiornato ✓';
      status.dataset.originalLabel = old;
      status.classList.toggle('btn-primary');
      const row = status.closest('tr');
      if (row) {
        const pill = row.querySelector('.pill');
        if (pill) { pill.textContent = status.textContent.includes('✓') ? 'Modificato demo' : 'Stato demo'; pill.className='pill blue'; }
      }
      toast('Stato aggiornato nella demo', 'Modifica visibile solo in questa pagina; nessun record reale è stato cambiato.');
      addAudit('Cambio stato: '+(row?.cells?.[0]?.innerText || old));
    }
  });
  $$('[data-setting]').forEach(input => input.addEventListener('change', () => {
    toast('Impostazione modificata', `${input.dataset.setting}: ${input.checked ? 'attivata' : 'disattivata'} solo in questa demo.`);
    addAudit(`${input.dataset.setting}: ${input.checked ? 'attivata' : 'disattivata'}`,'Impostazioni');
  }));
  $('#adminExport')?.addEventListener('click', () => {
    const panel = $(`[data-admin-panel="${activeTab}"]`);
    const rows = $$('tr', panel).filter(row => !row.hidden).map(row => $$('.admin-table th,td', row).map(cell => '"'+cell.innerText.replace(/"/g,'""')+'"').join(','));
    const csv = rows.join('\r\n') || 'Nessun dato disponibile';
    const blob = new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href=url; link.download=`trova-${activeTab}-demo.csv`; link.click(); URL.revokeObjectURL(url);
    toast('Esportazione pronta', 'È stato generato un CSV con i dati visibili della demo.'); addAudit('Esportazione CSV');
  });
  $('#clearDemoAudit')?.addEventListener('click', () => { audit.length=0; renderAudit(); toast('Registro demo svuotato','Sono state rimosse solo le azioni registrate durante questa sessione.'); });
  $('#adminLogout')?.addEventListener('click', () => { sessionStorage.removeItem('trova_demo_role'); sessionStorage.removeItem('trova_demo_email'); location.href='admin-login.html'; });
  switchTab('overview');
})();
