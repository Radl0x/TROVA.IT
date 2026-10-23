/* TROVA interactive demo enhancement: browser-only state and modals, backend-ready adapters. */
(()=>{'use strict';
const M=window.TrovaModal,R=window.TrovaRepository,W=window.TrovaWorkflow;
if(!M||!R)return;
const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const actions=(html)=>`<div class="trova-modal-actions">${html}</div>`;
const button=(label,act)=>`<button type="button" data-trova-next="${E(act)}">${E(label)}</button>`;
const field=(label,name,value='')=>`<label class="modal-field">${E(label)}<input name="${E(name)}" value="${E(value)}" required></label>`;
const note=(title,msg)=>window.Trova?.toast?.(title,msg);
const current=()=>document.body.classList.contains('admin-console')?'admin':location.pathname.includes('pro-dashboard')?'pro':'public';
let ctx={};
function details(title,html){M.open(title,html,{wide:true});}
function profile(id){const p=window.TrovaDemoData?.professionals?.find(x=>String(x.id)===String(id));if(!p)return;
ctx={type:'professional',id:p.id,name:p.name};details(p.name,`<div class="modal-grid"><p><b>Settore</b><br>${E(p.sector)}</p><p><b>Servizio</b><br>${E(p.service)}</p><p><b>Città</b><br>${E(p.city)}</p><p><b>Prezzo indicativo</b><br>${E(p.price)} €</p></div><p>${E(p.description)}</p><p><b>Competenze</b>: ${E((p.skills||[]).join(', '))}</p><p class="modal-muted">Profilo dimostrativo: recensioni, verifiche e disponibilità non sono reali.</p>${actions(button('Salva tra i preferiti','favorite')+button('Contatta','contact')+`<a class="btn btn-outline" href="profilo-professionista.html?demo=${encodeURIComponent(p.id)}">Pagina completa ↗</a>`)}`);}
async function favorite(){const list=await R.list('favorites');if(list.some(x=>String(x.professionalId)===String(ctx.id))){note('Già nei preferiti','Questo professionista è già salvato.');return;}await R.create('favorites',{professionalId:ctx.id,name:ctx.name});note('Preferito salvato','Disponibile nei dati demo di questo browser.');}
function contact(){const name=ctx.name||'Professionista demo';M.open('Contatta '+name,`<p>Scrivi un messaggio a ${E(name)}. Nessun invio reale.</p><form id="trova-contact-form"><label class="modal-field">Messaggio<textarea name="message" required minlength="5"></textarea></label>${actions('<button type="button" data-modal-close>Annulla</button><button type="submit" class="primary">Invia nella demo</button>')}</form>`);}
function adminAction(action,el){const row=el.closest('tr,.surface-card,article');const name=row?.querySelector('td,strong,h3')?.textContent?.trim()||'Elemento demo';const destructive=/elimina|cancella|rimuovi|blocca|sospendi|revoca|disattiva/i.test(action);const view=/apri|dettagl|visualizz|consulta|esamina|anteprima|storico|registro|checklist|ispeziona|report/i.test(action);
ctx={type:'admin',action,name};
const rowData=row?.tagName==='TR'?[...row.cells].map(c=>c.innerText.trim()):[];
const summary=`<div class="modal-panel"><b>${E(name)}</b>${rowData.length?`<ul class="modal-list">${rowData.map(x=>`<li>${E(x)}</li>`).join('')}</ul>`:''}<p class="modal-muted">Contenuto e autorizzazioni dimostrativi: nessuna operazione server.</p></div>`;
if(view){details(action,summary+actions(button('Annota','admin-note')+button('Chiudi','close')));return;}
M.open(action,summary+`<form id="trova-admin-form">${destructive?'<p class="modal-warning">Conferma richiesta per questa modifica nella demo.</p>':''}${field('Riferimento','reference',name)}<label class="modal-field">Note / motivazione<textarea name="notes" required></textarea></label>${actions(`<button type="button" data-modal-close>Annulla</button><button class="primary" type="submit">${destructive?'Conferma modifica demo':'Salva azione demo'}</button>`)}</form>`);}
function settings(){const controls=[...document.querySelectorAll('[data-setting],.admin-inline-input')];const data=controls.map((c,i)=>({key:c.dataset.setting||'config-'+i,value:c.type==='checkbox'?c.checked:c.value}));R.setPreference('admin-settings',data).then(()=>note('Impostazioni salvate','Preferenze demo conservate nel browser.'));}
function authAction(action){if(action==='google'){M.info('Accesso Google · demo','<p>Non è disponibile un account Google reale. Usa il login dimostrativo della piattaforma.</p>');return;}
if(action==='forgot'){M.open('Recupero password · simulazione',`<form id="trova-recovery-form">${field('Indirizzo email','email')}${actions('<button type="submit" class="primary">Simula richiesta</button>')}</form>`);return;}}
// Intercept only specific actions before legacy placeholder listeners.
document.addEventListener('click',e=>{const el=e.target.closest('a,button');if(!el||el.closest('.trova-modal-layer'))return;
if(el.matches('[data-action],[data-row-action]')&&current()==='admin'){
e.preventDefault();e.stopImmediatePropagation();adminAction(el.dataset.action||el.dataset.rowAction,el);return;}
if(el.id==='fullProposal'||el.id==='preChat'||el.id==='reportOpportunity')return;
if(el.matches('[data-view-user-request]'))return;
if(el.dataset.trovaProfile){e.preventDefault();e.stopImmediatePropagation();profile(el.dataset.trovaProfile);return;}
if(el.dataset.trovaNext){e.preventDefault();e.stopImmediatePropagation();const act=el.dataset.trovaNext;if(act==='favorite')favorite();else if(act==='contact')contact();else if(act==='close')M.close();else if(act==='admin-note')M.open('Annotazione · '+ctx.name,`<form id="trova-admin-form"><label class="modal-field">Nota<textarea name="notes" required></textarea></label>${actions('<button type="submit" class="primary">Salva nota</button>')}</form>`);return;}
if(el.dataset.action==='Salva impostazioni piattaforma'){e.preventDefault();e.stopImmediatePropagation();settings();return;}
},true);
document.addEventListener('submit',async e=>{if(!['trova-contact-form','trova-admin-form','trova-recovery-form'].includes(e.target.id))return;e.preventDefault();e.stopImmediatePropagation();const data=Object.fromEntries(new FormData(e.target));try{if(e.target.id==='trova-contact-form')await R.sendMessage({...data,threadId:'professional:'+ctx.id,sender:'Cliente demo',recipient:ctx.name});else if(e.target.id==='trova-admin-form')await R.create('adminActions',{...data,action:ctx.action||'Annotazione',item:ctx.name});else await R.create('recoveries',{...data,simulated:true});M.close();note('Operazione salvata','Simulazione registrata nel browser.');}catch(err){note('Errore',err.message)}},true);
// Ensure admin configuration is restored on reload.
if(current()==='admin')R.getPreference('admin-settings').then(items=>{if(!items)return;const controls=[...document.querySelectorAll('[data-setting],.admin-inline-input')];items.forEach((item,i)=>{const control=controls.find(c=>c.dataset.setting===item.key)||controls[i];if(!control)return;if(control.type==='checkbox')control.checked=!!item.value;else control.value=item.value;});});
window.TrovaDemoEnhancements={profile,adminAction,settings};
})();