(() => {
  const { $, $$, safeText, toast } = window.Trova;
  const filter = $("#requestFilter"), sort = $("#requestSort"), list = $("#requestList"), empty = $("#requestEmpty");
  if (!filter || !list) return;
  const workflow = window.TrovaWorkflow;
  const esc = safeText || (v => String(v ?? ""));
  const readLocal = key => { try { return JSON.parse(localStorage.getItem(key) || "[]") || []; } catch { return []; } };
  const formatDate = value => { if (!value) return ""; const date = new Date(value); return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("it-IT", {day:"2-digit",month:"short"}); };
  function getRequests() { return (workflow?.getRequests() || []).filter(r => r && r.title && !r.clientHidden); }
  function renderUserRequests() {
    const requests = getRequests().filter(r=>!['closed','completed','cancelled','archived'].includes(r.status));
    const proposalsAll=readLocal("trova_f2_proposals");
    list.innerHTML = requests.map(request => {
      const isClosed = ["closed","completed","cancelled","archived"].includes(request.status);
      const hasPendingModification=proposalsAll.some(p=>String(p.requestId)===String(request.id)&&p.status==='modification_pending');
      const hasAcceptedJob=!!request.selectedProposalId&&['in_progress','awaiting_client_completion','completion_disputed'].includes(request.status);
      const proposalCount=request.selectedProposalId ? 0 : proposalsAll.filter(p=>String(p.requestId)===String(request.id)&&!['rejected','closed','completion_disputed','completed','awaiting_client_completion'].includes(p.status)).length;
      const date = formatDate(request.createdAt || request.publishedAt);
      return `<article class="list-row user-request-row ${hasPendingModification?'has-pending-modification':hasAcceptedJob?'has-accepted-job':proposalCount ? 'has-proposals-highlight' : ''}" data-user-request="${esc(request.id)}" data-status="${isClosed ? "done" : "review"}" data-title="${esc(request.title)}"><div class="list-avatar ${isClosed ? "green" : ""}">${isClosed ? "✓" : "⌑"}</div><div class="list-row-main"><strong>${esc(request.title)}</strong><small>${esc(request.sector || "Servizio")} · ${esc(request.location || "Località non indicata")}${date ? ` · ${date}` : ""}</small><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><span class="pill ${isClosed ? "gray" : hasPendingModification || request.status==='awaiting_client_completion' || request.status==='completion_disputed' ? "amber" : "green"}">${request.status === "completed" ? "Completata" : isClosed ? "Archiviata" : request.status==='awaiting_client_completion' ? "Conferma completamento richiesta" : request.status==='completion_disputed' ? "Completamento contestato" : hasPendingModification ? "Modifica preventivo da confermare" : hasAcceptedJob ? "LAVORO ACCETTATO" : proposalCount ? "Offerte ricevute" : "In attesa di offerte"}</span>${!['completion_disputed','awaiting_client_completion'].includes(request.status)&&proposalCount ? `<span class="pill client-has-proposals">${proposalCount} ${proposalCount===1?"proposta ricevuta":"proposte ricevute"}</span>` : `<span class="pill gray">In attesa di proposte</span>`}</div></div><div class="list-row-side user-request-actions"><button class="btn btn-outline btn-sm" type="button" data-view-user-request="${esc(request.id)}">Dettagli</button><button class="btn btn-quiet btn-sm" type="button" data-delete-user-request="${esc(request.id)}">Elimina</button></div></article>`;
    }).join("");
    if (!requests.length) list.innerHTML = "";
    list.querySelectorAll('[data-delete-user-request]').forEach(button=>button.addEventListener('click',async()=>{
      const item=getRequests().find(r=>String(r.id)===String(button.dataset.deleteUserRequest));
      if(!item)return;
      const confirmRemoval=()=>{
        const current=getRequests().find(r=>String(r.id)===String(item.id));
        if(!current)return;
        workflow.saveRequest({...current,clientHidden:true,clientHiddenAt:new Date().toISOString()});
        workflow?.markNotificationsRead?.(n=>String(n.requestId)===String(current.id));
        window.TrovaModal?.close();
        renderAll();toast('Richiesta rimossa','La richiesta non sarà più visibile nella tua dashboard.');
      };
      if(window.TrovaModal?.open){
        window.TrovaModal.open('Conferma eliminazione',`<div class="trova-notice-layout is-danger" role="alert"><span class="trova-notice-icon"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></span><div class="trova-notice-copy"><strong>Eliminare questa richiesta?</strong><p><b>${esc(item.title||item.service||'Questa richiesta')}</b></p><p>La richiesta sparirà dalla tua lista. Se il lavoro è già assegnato, resterà nello storico del professionista.</p></div></div><div class="trova-modal-actions"><button type="button" data-cancel-request-delete><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Annulla</button><button type="button" class="danger" data-confirm-request-delete><i class="fa-solid fa-trash-can" aria-hidden="true"></i> Elimina</button></div>`,{wide:false});
        document.querySelector('[data-cancel-request-delete]')?.addEventListener('click',()=>window.TrovaModal.close());
        document.querySelector('[data-confirm-request-delete]')?.addEventListener('click',confirmRemoval);
      }else if(await window.TrovaDialog.confirm(`La richiesta «${item.title||item.service||'Richiesta'}» verrà rimossa dalla tua lista. Se il lavoro è assegnato, resterà nello storico del professionista.`,{title:'Conferma eliminazione',icon:'fa-trash-can',danger:true,confirmLabel:'Elimina richiesta'}))confirmRemoval();
    }));
    list.querySelectorAll("[data-view-user-request]").forEach(button => button.addEventListener("click", () => {
      const item = getRequests().find(r => r.id === button.dataset.viewUserRequest);
      if (!item) return;
      workflow?.markNotificationsRead?.(n=>n.recipientRole==="client"&&n.type==="proposal-received"&&String(n.requestId)===String(item.id));
      if (window.TrovaPhase2?.detail) window.TrovaPhase2.detail(item);
      else toast(item.title, `${item.sector || "Servizio"} · ${item.service || ""} · ${item.location || "Località non indicata"}`);
    }));
  }
  let clientArchivePage=1;
  function renderArchive(){const target=$("#clientArchiveList"),count=$("#clientArchiveCount");if(!target)return;const archived=getRequests().filter(r=>['closed','completed','cancelled','archived'].includes(r.status));if(count)count.textContent=`${archived.length} ${archived.length===1?'richiesta archiviata':'richieste archiviate'}`;const archivePageSize=6;const pages=Math.ceil(archived.length/archivePageSize);clientArchivePage=Math.min(Math.max(1,clientArchivePage),Math.max(1,pages));target.innerHTML=archived.length?archived.slice((clientArchivePage-1)*archivePageSize,clientArchivePage*archivePageSize).map(r=>`<article class="list-row archive-request-row"><div class="list-avatar green">✓</div><div class="list-row-main"><strong>${esc(r.title||r.service||'Richiesta')}</strong><small>${esc(r.sector||'Servizio')} · ${esc(r.location||'Località non indicata')}</small><div style="margin-top:7px"><span class="pill gray">${r.status==='completed'?'Completata':r.status==='cancelled'?'Annullata':'Chiusa / archiviata'}</span></div></div><div class="list-row-side"><button class="btn btn-outline btn-sm" type="button" data-view-archive-request="${esc(r.id)}">Apri storico</button></div></article>`).join('')+`<nav class="archive-pagination" aria-label="Pagine archivio cliente">${Array.from({length:pages},(_,i)=>`<button type="button" class="btn btn-sm ${clientArchivePage===i+1?'btn-primary':'btn-outline'}" data-client-archive-page="${i+1}" aria-current="${clientArchivePage===i+1?'page':'false'}">${i+1}</button>`).join('')}</nav>`:'<div class="adaptive-empty">Non ci sono richieste archiviate. Le richieste chiuse o completate compariranno qui.</div>';target.querySelectorAll('[data-client-archive-page]').forEach(button=>button.addEventListener('click',()=>{clientArchivePage=Number(button.dataset.clientArchivePage)||1;renderArchive();}));target.querySelectorAll('[data-view-archive-request]').forEach(button=>button.addEventListener('click',()=>{const item=getRequests().find(r=>String(r.id)===String(button.dataset.viewArchiveRequest));if(item&&window.TrovaPhase2?.detail)window.TrovaPhase2.detail(item,{readonly:true})}));}
  function renderActions() {
    const target = $("#clientActionList"), count = $("#pendingActionCount");
    if (!target) return;
    const requests = getRequests();
    const proposals = readLocal("trova_f2_proposals");
    const messages = readLocal("trova_f2_messages");
    const tasks = [];
    proposals.filter(p => p && p.requestId && !['selected','rejected','closed','modification_pending','completed','awaiting_client_completion'].includes(p.status)).forEach(p => {
      const req = requests.find(r => String(r.id) === String(p.requestId) && !r.selectedProposalId && !['closed','completed','completion_disputed','awaiting_client_completion'].includes(r.status));
      if (req) tasks.push({title:`Valuta una proposta per ${req.title}`, detail:`Hai ricevuto una proposta${p.professional ? ` da ${p.professional}` : ""}. Apri la richiesta per confrontare i dettagli.`, requestId:req.id, kind:"request"});
    });
    (workflow?.getNotifications()||[]).filter(n=>!n.read&&n.recipientRole==='client'&&['job-completed','proposal-modification','job-withdrawn'].includes(n.type)).forEach(n=>{const req=requests.find(r=>String(r.id)===String(n.requestId));if(req&&!['closed','completed','cancelled','archived','deleted','completion_disputed'].includes(req.status))tasks.push({title:n.type==='job-withdrawn'?'⚠️ Il professionista ha rinunciato all’incarico':(n.title||'Aggiornamento sul lavoro'),detail:n.type==='job-withdrawn'?`${n.message||'Il professionista ha rinunciato.'} La richiesta è stata riaperta: controlla le nuove proposte e scegli un altro professionista.`:(n.message||'Apri la richiesta per gestire l’aggiornamento.'),requestId:req.id,kind:'request'});});
    messages.filter(m => m && !m.read && (m.recipientRole === 'client' || (!m.recipientRole && !/cliente|client/i.test(String(m.sender||'')) && (m.requiresResponse === true || /chiarimento|richiesta-info|clarification|professional-reply/i.test(String(m.type || '')))))).forEach(m => {
      const req = requests.find(r => (String(r.id) === String(m.requestId) || String(r.id) === String(m.threadId)) && !['closed','completed','cancelled','archived'].includes(r.status));
      if (req) tasks.push({title:m.type==='professional-reply'?'Risposta del professionista':'Nuovo messaggio', detail:m.message || 'È arrivato un messaggio relativo alla tua richiesta.', requestId:req.id, kind:'message'});
    });
    try {
      const draft = JSON.parse(sessionStorage.getItem("trova_request_draft") || "null");
      if (draft && (draft.title || draft.description || draft.category || draft.service)) tasks.push({title:"Riprendi la richiesta in bozza", detail:draft.title || "Completa le informazioni mancanti prima di pubblicare.", href:"nuova-richiesta.html", kind:"draft"});
    } catch {}
    if (count) count.textContent = `${tasks.length} ${tasks.length === 1 ? "azione" : "azioni"}`;
    target.innerHTML = tasks.length ? tasks.map(task => `<div class="activity-item"><span class="activity-dot"></span><div><strong>${esc(task.title)}</strong><small>${esc(task.detail)}</small>${task.href ? `<a class="text-link" href="${task.href}">Riprendi ↗</a>` : task.requestId ? `<button class="text-link" type="button" data-action-request="${esc(task.requestId)}" data-action-kind="${esc(task.kind||'request')}">Apri richiesta ↗</button>` : ""}</div></div>`).join("") : '<div class="adaptive-empty">Non hai azioni in sospeso.</div>';
    target.querySelectorAll("[data-action-request]").forEach(button => button.addEventListener("click", () => {
      const item = getRequests().find(r => r.id === button.dataset.actionRequest);
      if (item && button.dataset.actionKind === "message" && window.TrovaPhase2?.openChat) window.TrovaPhase2.openChat(item.id);
      else if (item && window.TrovaPhase2?.detail) window.TrovaPhase2.detail(item);
    }));
  }
  function updateStats() {
    const requests = getRequests(), proposals = readLocal("trova_f2_proposals"), messages = readLocal("trova_f2_messages");
    const active = requests.filter(r => !["closed","completed","cancelled","archived"].includes(r.status)).length;
    const closed = requests.filter(r => ["closed","completed","cancelled","archived"].includes(r.status)).length;
    const put = (id, value) => { const el = $("#" + id); if (el) el.textContent = String(value); };
    put("clientActiveCount", active); put("clientProposalCount", proposals.length);
    const activeRequestIds=new Set(requests.filter(r=>! ["closed","completed","cancelled","archived"].includes(r.status)).map(r=>String(r.id)));
    put("clientUnreadCount", messages.filter(m => !m.read && (m.recipientRole === "client" || (!m.recipientRole && !/cliente|client/i.test(String(m.sender||"")) && m.requiresResponse)) && activeRequestIds.has(String(m.requestId||m.threadId||""))).length);
    put("clientClosedCount", closed);
  }
  function apply() {
    const rows = $$(".list-row", list);
    const visible = rows.filter(row => filter.value === "all" || row.dataset.status === filter.value);
    visible.sort((a,b) => sort.value === "title" ? a.dataset.title.localeCompare(b.dataset.title) : rows.indexOf(a)-rows.indexOf(b));
    rows.forEach(row => row.hidden = true); visible.forEach(row => { row.hidden = false; list.appendChild(row); });
    if (empty) { empty.hidden = visible.length > 0; if (!visible.length) { const heading = empty.querySelector("h3"); const paragraph = empty.querySelector("p"); const activeCount=getRequests().filter(r=>! ["closed","completed","cancelled","archived"].includes(r.status)).length; if (heading) heading.textContent = activeCount ? "Nessuna richiesta in questa vista" : (getRequests().length ? "Tutte le richieste sono archiviate" : "Non hai ancora richieste"); if (paragraph) paragraph.textContent = activeCount ? "Prova un altro filtro oppure crea una nuova richiesta." : (getRequests().length ? "Consulta la sezione Cestino / Archivio per aprire lo storico." : "Descrivi ciò di cui hai bisogno e ricevi proposte da professionisti compatibili."); } }
  }
  function renderAll() { renderUserRequests(); renderArchive(); updateStats(); renderActions(); apply(); }
  filter.addEventListener("change", apply); sort.addEventListener("change", apply);
  renderAll();
  window.addEventListener("trova-demo-updated", renderAll);
  window.addEventListener("trova-repository-change", renderAll);
  window.addEventListener("storage", event => { if (!event.key || /trova_demo_requests_v1|trova_demo_notifications_v1|trova_f2_(proposals|messages)/.test(event.key)) renderAll(); });
  let lastSnapshot = "";
  window.setInterval(() => { const next = JSON.stringify([workflow?.getRequests() || [], readLocal("trova_f2_proposals"), readLocal("trova_f2_messages")]); if (next !== lastSnapshot) { lastSnapshot = next; renderAll(); } }, 1200);
})();