(() => {
  const { $, $$, toast, safeText } = window.Trova;
  let category = "Casa";
  const picker = $("#categoryPicker");
  if (picker) {
    $$(".category-option", picker).forEach(button => button.addEventListener("click", () => {
      $$(".category-option", picker).forEach(item => item.classList.toggle("selected", item === button));
      category = button.dataset.category;
      const input = $("#quickNeed");
      const examples = {Casa:"Es. ristrutturazione completa di un bagno…",Auto:"Es. diagnosi e riparazione del motore…",Tecnologia:"Es. riparazione del mio smartphone…",Creatività:"Es. tatuaggio iperrealistico sulla schiena…",Riparazioni:"Es. riparazione di una tapparella…",Professionisti:"Es. consulenza specialistica per la mia attività…"};
      if (input) input.placeholder = examples[category] || "Descrivi cosa ti serve…";
    }));
  }
  const start = $("#startRequest");
  if (start) start.addEventListener("click", () => {
    const description = $("#quickNeed")?.value.trim() || "";
    sessionStorage.setItem("trova_demo_category", category);
    sessionStorage.setItem("trova_demo_description", description);
    window.location.href = "pages/nuova-richiesta.html";
  });
  const faq = $$(".faq-list details");
  faq.forEach(detail => detail.addEventListener("toggle", () => {
    if (detail.open) faq.filter(other => other !== detail).forEach(other => other.open = false);
  }));
})();
