/* Trova — demo frontend only. No backend, no real requests are sent. */
(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  window.Trova = {
    $, $$,
    toast(title, message = "Questa è una dimostrazione frontend: nessun dato è stato inviato.") {
      const region = $("#toastRegion") || (() => {
        const el = document.createElement("div"); el.id = "toastRegion"; el.className = "toast-region"; el.setAttribute("aria-live","polite"); document.body.appendChild(el); return el;
      })();
      const toast = document.createElement("div");
      toast.className = "toast";
      const mark = document.createElement("span"); mark.className = "toast-icon"; mark.setAttribute("aria-hidden","true"); mark.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
      const copy = document.createElement("span"); copy.className = "toast-copy";
      const strong = document.createElement("strong"); strong.textContent = title;
      const span = document.createElement("span"); span.textContent = message;
      copy.append(strong, span); toast.append(mark, copy); region.appendChild(toast);
      window.setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateY(8px)"; window.setTimeout(() => toast.remove(), 250); }, 4200);
    },
    safeText(value) { return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); },
    go(url) { window.location.href = url; }
  };
  // Dialoghi branded TROVA: sostituiscono i confirm/prompt nativi del browser.
  (() => {
    if (window.TrovaDialog) return;
    let activeLayer = null;
    const esc = value => window.Trova.safeText(value);
    function ask({title='Conferma operazione', message='', icon='fa-circle-info', confirmLabel='Conferma', cancelLabel='Annulla', danger=false, input=false, placeholder='', required=false}={}) {
      return new Promise(resolve => {
        if (activeLayer) { activeLayer.remove(); activeLayer = null; }
        const oldOverflow = document.body.style.overflow;
        const oldFocus = document.activeElement;
        const layer = document.createElement('div');
        layer.className = 'trova-dialog-layer';
        layer.innerHTML = `<section class="trova-dialog" role="dialog" aria-modal="true" aria-labelledby="trovaDialogTitle"><div class="trova-dialog-icon ${danger?'is-danger':''}"><i class="fa-solid ${icon}" aria-hidden="true"></i></div><div class="trova-dialog-copy"><p class="trova-dialog-kicker">TROVA · CONFERMA</p><h2 id="trovaDialogTitle"></h2><p class="trova-dialog-message"></p>${input?`<label class="trova-dialog-input-label"><span>Dettagli</span><textarea rows="3" maxlength="600" placeholder="${esc(placeholder)}"></textarea><small class="trova-dialog-error" hidden>Inserisci un motivo per continuare.</small></label>`:''}</div><div class="trova-dialog-actions"><button type="button" class="trova-dialog-cancel"><i class="fa-solid fa-xmark" aria-hidden="true"></i> ${esc(cancelLabel)}</button><button type="button" class="trova-dialog-confirm ${danger?'is-danger':''}"><i class="fa-solid ${input?'fa-paper-plane':danger?'fa-trash-can':'fa-check'}" aria-hidden="true"></i> ${esc(confirmLabel)}</button></div><button type="button" class="trova-dialog-x" aria-label="Chiudi finestra"><i class="fa-solid fa-xmark"></i></button></section>`;
        document.body.appendChild(layer); activeLayer=layer;
        layer.querySelector('h2').textContent=title;
        layer.querySelector('.trova-dialog-message').textContent=message;
        const field=layer.querySelector('textarea');
        const fieldError=layer.querySelector('.trova-dialog-error');
        field?.addEventListener('input',()=>{if(field.value.trim()&&fieldError)fieldError.hidden=true;});
        const finish=value=>{ if(!activeLayer || activeLayer!==layer)return; activeLayer=null; layer.classList.add('is-closing'); document.body.style.overflow=oldOverflow; layer.remove(); if(oldFocus?.isConnected)oldFocus.focus({preventScroll:true}); resolve(value); };
        layer.querySelector('.trova-dialog-cancel').addEventListener('click',()=>finish(input?null:false));
        layer.querySelector('.trova-dialog-x').addEventListener('click',()=>finish(input?null:false));
        layer.querySelector('.trova-dialog-confirm').addEventListener('click',()=>{if(input){const value=field.value.trim();if(required&&!value){field.focus();if(fieldError)fieldError.hidden=false;return;}finish(value||null);}else finish(true);});
        layer.addEventListener('click',e=>{if(e.target===layer)finish(input?null:false)});
        layer.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();finish(input?null:false)}if(e.key==='Enter'&&!input){e.preventDefault();finish(true)}});
        document.body.style.overflow='hidden'; requestAnimationFrame(()=>{if(field)field.focus();else layer.querySelector('.trova-dialog-confirm').focus();});
      });
    }
    window.TrovaDialog = {
      confirm:(message,options={})=>ask({message,...options}),
      prompt:(message,options={})=>ask({message,input:true,icon:'fa-comment-dots',confirmLabel:'Invia',...options})
    };
  })();

  const menu = $(".menu-toggle");
  const nav = $(".desktop-nav");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", event => { if (event.target.closest("a")) { nav.classList.remove("open"); menu.setAttribute("aria-expanded","false"); } });
  }
  $$("[data-demo-action]").forEach(button => button.addEventListener("click", event => {
    event.preventDefault();
    const title = button.dataset.demoAction || "Funzione dimostrativa";
    Trova.toast(title, button.dataset.demoMessage || "Funzione illustrativa: il backend non è collegato.");
  }));
  $$("[data-confirm-demo]").forEach(form => form.addEventListener("submit", event => {
    event.preventDefault();
    Trova.toast("Operazione simulata", "I campi sono stati controllati nel browser, ma nessun dato è stato inviato o salvato su un server.");
  }));
  $$("[data-tab-group]").forEach(group => {
    const buttons = $$("[data-tab]", group);
    buttons.forEach(button => button.addEventListener("click", () => {
      buttons.forEach(b => { b.classList.toggle("active", b === button); b.setAttribute("aria-selected", String(b === button)); });
      const target = button.dataset.tab;
      $$("[data-tab-panel]", group.parentElement).forEach(panel => panel.hidden = panel.dataset.tabPanel !== target);
    }));
  });
})();
