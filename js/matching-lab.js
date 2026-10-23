/* Laboratorio matchmaking: dati fittizi e algoritmo locale, nessun backend. */
(() => {
  const catalog = window.TrovaCatalog.serviceOptions;
  const skills = window.TrovaProSkills;
  const sectors = Object.entries(catalog);
  const cities = ["Olbia", "Arzachena", "Golfo Aranci", "Tempio Pausania", "Sassari", "Cagliari", "Roma", "Milano", "Palermo"];
  const distances = {
    "Olbia": [0,25,18,46,104,270], "Arzachena": [25,0,30,62,120,295],
    "Golfo Aranci": [18,30,0,60,120,285], "Tempio Pausania": [46,62,60,0,68,245],
    "Sassari": [104,120,120,68,0,210], "Cagliari": [270,295,285,245,210,0]
  }; // distanze indicative inventate per la simulazione, non dati stradali
  const pros = [], requests = [];
  let seq = 0;
  for (const [sector, services] of sectors) {
    for (const service of services) {
      const n = ++seq;
      const groups = skills[service] || [];
      const options = groups.flatMap(g => g.options || []);
      const unique = [...new Set(options)];
      const a = unique[0] || "Servizio generale", b = unique[1] || a, c = unique[2] || b;
      const city = cities[n % cities.length], nearby = cities[(n+1) % cities.length];
      pros.push({id:`P${n}A`,name:`${service} · Studio ${String.fromCharCode(64+(n%26)+1)}`,sector,services:[service],city,radius:n%4===0?100:50,remote:n%7===0,urgent:n%3===0,available:true,skills:unique.slice(0,Math.min(5,unique.length)),minBudget:100+(n%5)*100});
      pros.push({id:`P${n}B`,name:`${service} · Specialista ${n}`,sector,services:[service],city:nearby,radius:n%5===0?10:50,remote:n%7===0,urgent:n%2===0,available:n%9!==0,skills:unique.slice(1,Math.min(3,unique.length)),minBudget:150+(n%4)*100});
      requests.push({id:`R${n}A`,title:`${service}: ${a}`,sector,service,city,required:[a],budget:900+(n%5)*500,urgent:false,remote:n%7===0,notes:`Richiesta di ${a.toLowerCase()} con preferenza per uno specialista del settore.`});
      requests.push({id:`R${n}B`,title:`${service}: ${b} e ${c}`,sector,service,city:nearby,required:[...new Set([b,c])],budget:650+(n%4)*350,urgent:n%2===0,remote:n%7===0,notes:`Il cliente richiede entrambe le competenze indicate, non una soltanto.`});
      requests.push({id:`R${n}C`,title:`${service}: ${c} · budget contenuto`,sector,service,city:cities[(n+4)%cities.length],required:[c],budget:180,urgent:true,remote:n%7===0,notes:`Caso di prova con urgenza, distanza o budget potenzialmente incompatibili.`});
    }
  }
  const $ = s => document.querySelector(s);
  const esc = value => String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function evaluate(p,r) {
    // Il laboratorio usa lo stesso motore del prodotto: soltanto specializzazione e località determinano l'idoneità.
    const engine = window.TrovaWorkflow;
    if (!engine?.match) return {eligible:false,score:0,reasons:[],failures:['Motore di matching non caricato'],distance:null};
    const result = engine.match({
      services:p.services, skills:p.skills, city:p.city, serviceAreas:[p.city], radius:p.radius,
      remote:p.remote, available:p.available, acceptUrgent:p.urgent, minimum:p.minBudget,
      qualifications:'', specialties:p.skills.join(' '), workMode:p.remote?'Da remoto':'In presenza'
    }, {
      service:r.service, location:r.city, city:r.city, required:r.required, requiredSkills:r.required,
      budgetAmount:r.budget, budget:r.budget, timing:r.urgent?'urgente':'programmabile',
      mode:r.remote?'remote':'presence', description:r.notes||'', adaptive:{}, requirements:''
    });
    const secondaryFailures=[];
    if (r.urgent && !p.urgent) secondaryFailures.push('Preferenza secondaria: il professionista non dichiara disponibilità per urgenze');
    if (r.budget < p.minBudget) secondaryFailures.push(`Preferenza secondaria: budget inferiore al minimo indicativo (€${p.minBudget})`);
    return {...result, reasons:[...result.reasons,...(secondaryFailures.length?['Alcune preferenze secondarie non sono soddisfatte']:[])], secondaryNotes:secondaryFailures};
  }
  const state={sector:'all',service:'all',request:requests[0].id,professional:'all',mode:'all'};
  function options(select,items,allText,selected){select.innerHTML=(allText?`<option value="all">${esc(allText)}</option>`:'')+items.map(o=>`<option value="${esc(o.id)}">${esc(o.label)}</option>`).join('');select.value=selected; if(select.selectedIndex<0)select.selectedIndex=0;}
  function rebuild(){
    const serviceNames = state.sector==='all'?sectors.flatMap(([,s])=>s):catalog[state.sector];
    options($('#labService'),serviceNames.map(s=>({id:s,label:s})),'Tutti i servizi',state.service);
    state.service=$('#labService').value;
    const filtered=requests.filter(r=>(state.sector==='all'||r.sector===state.sector)&&(state.service==='all'||r.service===state.service));
    options($('#labRequest'),filtered.map(r=>({id:r.id,label:`${r.id} · ${r.title} · ${r.city}`})),null,state.request);
    state.request=$('#labRequest').value;
    options($('#labProfessional'),pros.filter(p=>state.sector==='all'||p.sector===state.sector).map(p=>({id:p.id,label:`${p.id} · ${p.name}`})),'Tutti i professionisti',state.professional);
    state.professional=$('#labProfessional').value;
    render();
  }
  function render(){
    const r=requests.find(x=>x.id===state.request);if(!r)return;
    $('#labRequestDetail').innerHTML=`<div class="lab-heading"><div><span class="pill">${esc(r.sector)} · ${esc(r.service)}</span><h3>${esc(r.title)}</h3><p>${esc(r.notes)}</p></div><span class="pill gray">${esc(r.id)} · Fittizia</span></div><div class="lab-tags"><span>📍 ${esc(r.city)}</span><span>€ ${r.budget.toLocaleString('it-IT')}</span><span>${r.urgent?'⚡ Urgente':'🗓 Programmabile'}</span><span>${r.remote?'🌐 Da remoto possibile':'📍 Presenza richiesta'}</span></div><p><strong>Competenze essenziali:</strong> ${r.required.map(esc).join(' + ')}</p>`;
    let results=pros.filter(p=>state.professional==='all'||p.id===state.professional).map(p=>({...evaluate(p,r),p}));
    const compatible=results.filter(x=>x.eligible).length;
    $('#labStats').textContent=`${pros.length} professionisti · ${requests.length} richieste · ${compatible} compatibili su ${results.length} valutati`;
    if(state.mode==='eligible')results=results.filter(x=>x.eligible);
    if(state.mode==='rejected')results=results.filter(x=>!x.eligible);
    results.sort((a,b)=>Number(b.eligible)-Number(a.eligible)||b.score-a.score||a.p.name.localeCompare(b.p.name));
    $('#labResults').innerHTML=results.length?results.map(x=>`<article class="lab-result ${x.eligible?'lab-yes':'lab-no'}"><div class="lab-result-head"><div><strong>${esc(x.p.name)}</strong><small>${esc(x.p.id)} · ${esc(x.p.city)} · ${esc(x.p.sector)}</small></div><span class="pill ${x.eligible?'green':'gray'}">${x.eligible?'Compatibile · '+x.score+'/100':'Escluso'}</span></div><p><strong>Competenze:</strong> ${x.p.skills.map(esc).join(' · ')}</p><div class="lab-tags"><span>Raggio ${x.p.radius} km</span><span>${x.p.urgent?'Urgenze sì':'Urgenze no'}</span><span>${x.p.available?'Disponibile':'Non disponibile'}</span><span>Minimo €${x.p.minBudget}</span></div><div class="lab-reasons">${x.reasons.map(s=>`<span class="lab-ok">✓ ${esc(s)}</span>`).join('')}${x.failures.map(s=>`<span class="lab-fail">✕ ${esc(s)}</span>`).join('')}${(x.secondaryNotes||[]).map(s=>`<span class="lab-secondary">ⓘ ${esc(s)}</span>`).join('')}</div></article>`).join(''):'<div class="adaptive-empty">Nessun risultato con i filtri correnti. Prova a visualizzare anche gli esclusi.</div>';
  }
  $('#labSector').addEventListener('change',e=>{state.sector=e.target.value;state.service='all';state.request='';state.professional='all';rebuild()});
  $('#labService').addEventListener('change',e=>{state.service=e.target.value;state.request='';rebuild()});
  $('#labRequest').addEventListener('change',e=>{state.request=e.target.value;render()});
  $('#labProfessional').addEventListener('change',e=>{state.professional=e.target.value;render()});
  $('#labMode').addEventListener('change',e=>{state.mode=e.target.value;render()});
  $('#labNext').addEventListener('click',()=>{const select=$('#labRequest');select.selectedIndex=(select.selectedIndex+1)%select.options.length;state.request=select.value;render()});
  $('#labReset').addEventListener('click',()=>{Object.assign(state,{sector:'all',service:'all',request:requests[0].id,professional:'all',mode:'all'});$('#labSector').value='all';$('#labMode').value='all';rebuild()});
  rebuild();

  const matrixState={search:'',sector:'all',outcome:'all',expanded:new Set(),page:1,pageSize:18};
  function renderMatrix(){
    const host=$('#labMatrix'); if(!host)return;
    const sectorsList=[...new Set(requests.map(r=>r.sector))].sort((a,b)=>a.localeCompare(b,'it'));
    const sectorSelect=$('#labMatrixSector');
    if(sectorSelect && sectorSelect.options.length<=1){sectorSelect.innerHTML='<option value="all">Tutti i settori</option>'+sectorsList.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');}
    const rows=requests.map(r=>{const evaluations=pros.map(p=>({p,...evaluate(p,r)}));const eligible=evaluations.filter(x=>x.eligible).sort((a,b)=>b.score-a.score);return {r,evaluations,eligible};}).filter(row=>{
      const text=normalize(`${row.r.title} ${row.r.service} ${row.r.sector} ${row.r.city} ${row.eligible.map(x=>x.p.name).join(' ')}`);
      return (!matrixState.search||text.includes(normalize(matrixState.search)))&&(matrixState.sector==='all'||row.r.sector===matrixState.sector)&&(matrixState.outcome==='all'||(matrixState.outcome==='matched'?row.eligible.length>0:row.eligible.length===0));
    });
    const matchedRows=rows.filter(x=>x.eligible.length).length;
    $('#labMatrixSummary').innerHTML=`<span><strong>${rows.length}</strong> richieste filtrate</span><span><strong>${pros.length}</strong> professionisti simulati</span><span><strong>${matchedRows}</strong> richieste con almeno un compatibile</span><span><strong>${rows.length-matchedRows}</strong> senza compatibili</span>`;
    const pages=Math.max(1,Math.ceil(rows.length/matrixState.pageSize));matrixState.page=Math.min(matrixState.page,pages);
    const pageRows=rows.slice((matrixState.page-1)*matrixState.pageSize,matrixState.page*matrixState.pageSize);
    host.innerHTML=pageRows.length?pageRows.map(({r,evaluations,eligible})=>{const open=matrixState.expanded.has(r.id);const excluded=evaluations.filter(x=>!x.eligible);return `<article class="lab-matrix-row ${eligible.length?'has-matches':'no-matches'}"><button type="button" class="lab-matrix-toggle" data-matrix-toggle="${esc(r.id)}" aria-expanded="${open}"><span><small>${esc(r.sector)} · ${esc(r.service)} · ${esc(r.id)}</small><strong>${esc(r.title)}</strong><small>📍 ${esc(r.city)} · Budget €${r.budget.toLocaleString('it-IT')} · ${r.required.length} competenze obbligatorie</small></span><span class="lab-matrix-outcome"><b>${eligible.length} compatibili</b><small>${excluded.length} esclusi</small><i>${open?'−':'+'}</i></span></button>${open?`<div class="lab-matrix-detail"><section><h4>Ricevono la richiesta (${eligible.length})</h4>${eligible.length?eligible.map(x=>`<div class="lab-matrix-person is-eligible"><span><strong>${esc(x.p.name)}</strong><small>${esc(x.p.id)} · ${esc(x.p.sector)} · ${esc(x.p.city)}</small></span><b>${x.score}/100</b><small>${x.reasons.map(esc).join(' · ')}</small></div>`).join(''):'<p>Nessun professionista supera tutti i requisiti obbligatori.</p>'}</section><details class="lab-matrix-excluded"><summary>Professionisti esclusi (${excluded.length})</summary>${excluded.map(x=>`<div class="lab-matrix-person is-excluded"><span><strong>${esc(x.p.name)}</strong><small>${esc(x.p.id)} · ${esc(x.p.sector)} · ${esc(x.p.city)}</small></span><small>${x.failures.map(esc).join(' · ')}</small></div>`).join('')}</details></div>`:''}</article>`;}).join(''):'<div class="adaptive-empty">Nessuna richiesta corrisponde ai filtri selezionati.</div>';
    host.querySelectorAll('[data-matrix-toggle]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.matrixToggle;if(matrixState.expanded.has(id))matrixState.expanded.delete(id);else matrixState.expanded.add(id);renderMatrix();}));
    const nav=document.createElement('nav');nav.className='lab-matrix-pagination';nav.setAttribute('aria-label','Pagine simulazione globale');nav.innerHTML=`<button type="button" class="btn btn-outline btn-sm" ${matrixState.page<=1?'disabled':''} data-matrix-page="${matrixState.page-1}">← Precedente</button><span>Pagina ${matrixState.page} di ${pages}</span><button type="button" class="btn btn-outline btn-sm" ${matrixState.page>=pages?'disabled':''} data-matrix-page="${matrixState.page+1}">Successiva →</button>`;host.appendChild(nav);nav.querySelectorAll('[data-matrix-page]').forEach(b=>b.addEventListener('click',()=>{matrixState.page=Number(b.dataset.matrixPage);renderMatrix();}));
  }
  const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it-IT').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
  $('#labMatrixSearch')?.addEventListener('input',e=>{matrixState.search=e.target.value;matrixState.page=1;renderMatrix();});
  $('#labMatrixSector')?.addEventListener('change',e=>{matrixState.sector=e.target.value;matrixState.page=1;renderMatrix();});
  $('#labMatrixOutcome')?.addEventListener('change',e=>{matrixState.outcome=e.target.value;matrixState.page=1;renderMatrix();});
  renderMatrix();
})();
