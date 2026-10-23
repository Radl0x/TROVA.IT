/* Catalogo condiviso: i profili e le richieste vengono mostrati solo dopo essere stati creati localmente. */
(() => {
  const catalog = window.TrovaCatalog?.serviceOptions || {};
  const serviceSector = {};
  Object.entries(catalog).forEach(([sector, services]) => services.forEach(service => { serviceSector[service] = sector; }));
  window.TrovaDemoData = { professionals: [], requests: [], serviceSector, cities: ["Olbia", "Arzachena", "Golfo Aranci", "Tempio Pausania", "Sassari", "Cagliari"] };
})();
