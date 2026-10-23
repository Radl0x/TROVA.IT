/* Flussi demo condivisi: storage locale, stato richieste, compatibilità e notifiche simulate.
   Non sostituisce autenticazione, verifica email o autorizzazioni server-side. */
(() => {
  const KEY = 'trova_demo_requests_v1';
  const NOTIFY = 'trova_demo_notifications_v1';
  const read = (key, fallback = []) => { try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value ?? fallback; } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new CustomEvent('trova-demo-updated')); return true; } catch { return false; } };
  const getRequests = () => read(KEY, []);
  const saveRequest = request => { const all = getRequests(); const idx = all.findIndex(item => item.id === request.id); if (idx >= 0) all[idx] = request; else all.unshift(request); write(KEY, all); return request; };
  const getNotifications = () => read(NOTIFY, []);
  const notify = item => { const all=getNotifications(); const index=all.findIndex(n=>n.id && item.id && n.id===item.id); if(index>=0) all[index]={...all[index],...item}; else all.unshift(item); return write(NOTIFY,all.slice(0,100)); };
  const markNotificationRead = id => { if(!id)return false; const all=getNotifications(); let changed=false; const next=all.map(n=>{if(n.id===id&&!n.read){changed=true;return {...n,read:true,readAt:new Date().toISOString()};}return n;}); if(changed)write(NOTIFY,next); return changed; };
  const markNotificationsRead = predicate => { const all=getNotifications(); let changed=false; const next=all.map(n=>{if(!n.read&&(!predicate||predicate(n))){changed=true;return {...n,read:true,readAt:new Date().toISOString()};}return n;}); if(changed)write(NOTIFY,next); return changed; };
  const cityDistances = { 'Olbia': { 'Olbia':0,'Arzachena':25,'Golfo Aranci':18,'Tempio Pausania':46,'Sassari':104,'Cagliari':270 }, 'Arzachena': { 'Olbia':25,'Arzachena':0,'Golfo Aranci':30,'Tempio Pausania':62,'Sassari':120,'Cagliari':295 }, 'Golfo Aranci': { 'Olbia':18,'Arzachena':30,'Golfo Aranci':0,'Tempio Pausania':60,'Sassari':120,'Cagliari':285 }, 'Tempio Pausania': { 'Olbia':46,'Arzachena':62,'Golfo Aranci':60,'Tempio Pausania':0,'Sassari':68,'Cagliari':245 }, 'Sassari': { 'Olbia':104,'Arzachena':120,'Golfo Aranci':120,'Tempio Pausania':68,'Sassari':0,'Cagliari':210 }, 'Cagliari': { 'Olbia':270,'Arzachena':295,'Golfo Aranci':285,'Tempio Pausania':245,'Sassari':210,'Cagliari':0 } };
  // Coordinate indicative per evitare che città non presenti nella vecchia tabella risultino "compatibili" per errore.
  const cityCoordinates = {
    'Roma':[41.9028,12.4964],'Olbia':[40.9236,9.4964],'Arzachena':[41.0765,9.3895],'Golfo Aranci':[41.0006,9.6134],
    'Tempio Pausania':[40.9006,9.1038],'Sassari':[40.7259,8.5557],'Cagliari':[39.2238,9.1217],'Milano':[45.4642,9.1900],
    'Torino':[45.0703,7.6869],'Napoli':[40.8518,14.2681],'Palermo':[38.1157,13.3615],'Catania':[37.5079,15.0830],
    'Bologna':[44.4949,11.3426],'Firenze':[43.7696,11.2558],'Genova':[44.4056,8.9463],'Venezia':[45.4408,12.3155],
    'Verona':[45.4384,10.9916],'Bari':[41.1171,16.8719],'Perugia':[43.1107,12.3908],'Pescara':[42.4618,14.2161],
    'Ancona':[43.6158,13.5189],'Trieste':[45.6495,13.7768],'Padova':[45.4064,11.8768],'Parma':[44.8015,10.3279],
    'Modena':[44.6471,10.9252],'Reggio Emilia':[44.6980,10.6297],'Brescia':[45.5416,10.2118],'Bergamo':[45.6983,9.6773],
    'Cosenza':[39.2983,16.2537],'Reggio Calabria':[38.1113,15.6473],'Messina':[38.1938,15.5540],'Trapani':[38.0176,12.5365],
    'Agrigento':[37.3111,13.5765],'Nuoro':[40.3210,9.3290],'Oristano':[39.9062,8.5884],'Alghero':[40.5579,8.3193]
  };
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('it-IT').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
  const cityName = value => {
    let city = String(value || '').trim().split(',')[0].trim();
    // Gestisce input comuni come "Roma (RM)" e "Roma - RM" senza cambiare il nome del comune.
    city = city.replace(/\s*\([^)]{2,3}\)\s*$/, '').replace(/\s+-\s+[A-Z]{2}$/i, '').trim();
    return city;
  };
  const distanceBetween = (a,b) => {
    const fromTable=Object.keys(cityDistances).find(c=>normalize(c)===normalize(cityName(a)));
    const toTable=Object.keys(cityDistances).find(c=>normalize(c)===normalize(cityName(b)));
    if(fromTable && toTable && cityDistances[fromTable]?.[toTable] !== undefined) return cityDistances[fromTable][toTable];
    const from=Object.keys(cityCoordinates).find(c=>normalize(c)===normalize(cityName(a)));
    const to=Object.keys(cityCoordinates).find(c=>normalize(c)===normalize(cityName(b)));
    if(!from||!to)return null;
    const rad=n=>n*Math.PI/180, [lat1,lon1]=cityCoordinates[from], [lat2,lon2]=cityCoordinates[to];
    const dLat=rad(lat2-lat1),dLon=rad(lon2-lon1),h=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLon/2)**2;
    return Math.round(6371*2*Math.asin(Math.sqrt(h)));
  };
  function match(profile, request) {
    const reasons = [], failures = [];
    const services = Array.isArray(profile.services) ? profile.services : [];
    const requestedService = normalize(request.service || request.specialty || '');
    const serviceMatch = !!requestedService && services.some(service => normalize(service) === requestedService);
    if (!serviceMatch) failures.push('Specializzazione fondamentale non corrispondente: il servizio richiesto deve essere dichiarato nel profilo');
    else reasons.push('Specializzazione fondamentale corrispondente');

    const requiredRaw = request.requiredSkills ?? request.required ?? [];
    const required = [...new Set((Array.isArray(requiredRaw) ? requiredRaw : [requiredRaw]).filter(v=>String(v??'').trim()).map(v=>String(v).trim()))];
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    const owned = new Set(skills.map(normalize));
    const matchedRequired = required.filter(skill => owned.has(normalize(skill)));
    if (required.length) {
      const missing = required.filter(skill => !owned.has(normalize(skill)));
      if (missing.length) failures.push(`Competenze obbligatorie mancanti: ${missing.join(', ')}`);
      else reasons.push('Tutte le competenze obbligatorie sono presenti');
    }

    const requestedCity = cityName(request.location || request.city);
    const profileAreasRaw = profile.serviceAreas ?? profile.areas ?? profile.city ?? profile.location ?? '';
    const profileAreas = [...new Set((Array.isArray(profileAreasRaw) ? profileAreasRaw : String(profileAreasRaw).split(/[,;|]/)).map(cityName).filter(Boolean))];
    const sameDeclaredArea = !!requestedCity && profileAreas.some(area => normalize(area) === normalize(requestedCity));
    const modeText = normalize(`${request.mode || ''} ${request.description || ''}`);
    const remoteRequest = /(^| )(remote|da remoto|remoto|online|solo remoto)( |$)/.test(modeText);
    const remotePro = !!profile.remote || /da remoto|remoto|online/.test(normalize(profile.workMode || ''));
    const inPersonRequest = /in presenza|presenza/.test(modeText) || normalize(request.mode) === 'presence';
    let distance = sameDeclaredArea ? 0 : null;
    if (!requestedCity) {
      if (!(remoteRequest && remotePro)) failures.push('Località della richiesta non indicata');
      else reasons.push('Richiesta da remoto: la distanza geografica non è un vincolo');
    } else if (remoteRequest) {
      if (!remotePro) failures.push('La richiesta è da remoto ma il professionista non dichiara di offrire servizi da remoto');
      else reasons.push('Richiesta da remoto compatibile con il profilo');
    } else if (sameDeclaredArea) {
      reasons.push('Località inclusa esplicitamente nelle aree servite');
    } else {
      // Valuta tutte le aree dichiarate: la prima non deve impedire un match valido con la seconda.
      const distances = profileAreas.map(area => distanceBetween(area, requestedCity)).filter(value => value !== null);
      if (!distances.length && profile.city && !profileAreas.length) {
        const fallbackDistance = distanceBetween(profile.city, requestedCity);
        if (fallbackDistance !== null) distances.push(fallbackDistance);
      }
      distance = distances.length ? Math.min(...distances) : null;
      if (distance === null) failures.push(`Località non verificabile: aggiungi il comune alle aree servite oppure usa comuni riconosciuti dal sistema (${requestedCity})`);
      else {
        const radius = Number(profile.radius || 25);
        if (distance > radius) failures.push(`Fuori raggio operativo (~${distance} km; limite ${radius} km)`);
        else reasons.push(`Località compatibile (~${distance} km dalla più vicina area servita)`);
      }
    }
    if (inPersonRequest && remotePro && !/in presenza|presenza|mista/.test(normalize(profile.workMode || '')) && !sameDeclaredArea) failures.push('La richiesta richiede presenza, ma il profilo risulta solo da remoto');

    // Disponibilità, budget e urgenza influenzano il punteggio; non scavalcano mai i requisiti essenziali.
    let secondary = 0, possible = 0;
    const addPreference = (applies, satisfied, points) => { if (applies) { possible += points; if (satisfied) secondary += points; } };
    addPreference(required.length > 0, required.length > 0 && matchedRequired.length === required.length, 8);
    const available = profile.available !== false && !/non disponibile/i.test(String(profile.availability || ''));
    addPreference(true, available, 4);
    const budget = Number(request.budgetAmount ?? request.budget ?? 0) || 0;
    const minimum = Number(profile.minimum ?? profile.minBudget ?? 0) || 0;
    addPreference(budget > 0 && minimum > 0, !budget || !minimum || minimum <= budget, 4);
    const urgent = /urgente|entro oggi|immediata|il prima possibile/i.test(`${request.timing||''} ${request.description||''}`);
    addPreference(urgent, !!profile.acceptUrgent, 4);
    const reqMode = normalize(request.mode || '');
    const proMode = normalize(profile.workMode || (remotePro?'da remoto':'in presenza'));
    addPreference(!!reqMode, remoteRequest ? remotePro : /in presenza|presenza/.test(reqMode) ? /in presenza|presenza|mista/.test(proMode) : true, 4);
    const qualifications = String(profile.qualifications || '').trim();
    addPreference(!!request.requirements && /qualifica|certificazione|abilitazione/i.test(request.requirements), !!qualifications, 3);
    const adaptiveText = normalize(Object.values(request.adaptive || {}).join(' '));
    const profileText = normalize(`${profile.specialties || ''} ${skills.join(' ')} ${qualifications}`);
    const adaptiveTerms = adaptiveText.split(' ').filter(word=>word.length>3);
    const adaptiveHits = adaptiveTerms.filter(word=>profileText.includes(word)).length;
    addPreference(adaptiveTerms.length>0, adaptiveHits >= Math.max(1, Math.ceil(adaptiveTerms.length*0.4)), 7);
    const eligible = failures.length === 0;
    const score = eligible ? Math.min(100, Math.round(72 + (possible ? secondary/possible*28 : 28))) : 0;
    return { eligible, score, reasons, failures, distance, secondaryScore: possible ? Math.round(secondary/possible*100) : 100 };
  }
  window.TrovaWorkflow = { getRequests, saveRequest, getNotifications, notify, markNotificationRead, markNotificationsRead, match, read, write, normalize };
})();
