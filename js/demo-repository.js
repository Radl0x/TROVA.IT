/* TROVA Fase 2 — contratto dati sostituibile con API; esclusivamente demo locale. */
(()=>{'use strict';
const prefix='trova_f2_';
const clone=x=>JSON.parse(JSON.stringify(x));
const read=(type)=>{try{return JSON.parse(localStorage.getItem(prefix+type)||'[]')}catch{return []}};
const write=(type,items)=>{localStorage.setItem(prefix+type,JSON.stringify(items));window.dispatchEvent(new CustomEvent('trova-repository-change',{detail:{type}}));return items};
const uid=()=>('demo-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8));
const api={
 list:async type=>clone(read(type)),
 get:async(type,id)=>clone(read(type).find(x=>x.id===id)||null),
 create:async(type,data)=>{const item={...clone(data),id:uid(),createdAt:new Date().toISOString()};write(type,[item,...read(type)]);return clone(item)},
 update:async(type,id,patch)=>{const items=read(type),i=items.findIndex(x=>x.id===id);if(i<0)throw Error('Elemento non trovato');items[i]={...items[i],...clone(patch),updatedAt:new Date().toISOString()};write(type,items);return clone(items[i])},
 remove:async(type,id)=>{write(type,read(type).filter(x=>x.id!==id));return true},
 getRequest:async id=>clone(window.TrovaWorkflow?.getRequests().find(x=>x.id===id)||null),
 updateRequest:async(id,patch)=>{const item=await api.getRequest(id);if(!item)throw Error('Richiesta non trovata');return window.TrovaWorkflow.saveRequest({...item,...clone(patch)})},
 createProposal:data=>api.create('proposals',data),
 getProposals:async requestId=>(await api.list('proposals')).filter(p=>p.requestId===requestId),
 sendMessage:data=>api.create('messages',data),
 getMessages:async threadId=>(await api.list('messages')).filter(m=>m.threadId===threadId),
 createReport:data=>api.create('reports',data),
 setPreference:async(key,value)=>{const items=read('preferences');const index=items.findIndex(x=>x.id===key);if(index<0)items.push({id:key,value});else items[index].value=value;write('preferences',items);return value},
 getPreference:async(key)=>(read('preferences').find(x=>x.id===key)||{}).value
};
window.TrovaRepository=api;
})();
