(() => {
  const { $, toast } = window.Trova;
  const fav = $("#saveFavorite");
  if (fav) fav.addEventListener("click", () => { const saved = fav.classList.toggle("saved"); fav.textContent = saved ? "♥ Salvato" : "♡ Salva preferito"; fav.style.color = saved ? "#2563eb" : ""; toast(saved ? "Aggiunto ai preferiti" : "Rimosso dai preferiti", "Stato dimostrativo, non collegato a un account."); });
  $("#contactPro")?.addEventListener("click", () => toast("Contatto dal portale", "In una versione collegata si aprirebbe la conversazione interna. Nessun contatto è stato avviato."));
  $("#askPro")?.addEventListener("click", () => toast("Richiesta di informazioni", "Questa azione è simulata: nessun messaggio è stato inviato."));
})();