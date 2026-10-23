# TROVA — Fase 2 (prima implementazione)

## Implementato
- Repository asincrono `js/demo-repository.js` con contratti list/get/create/update/remove, getRequest/updateRequest, createProposal/getProposals, sendMessage/getMessages, createReport, preferenze.
- Archiviazione localStorage separata dalla UI, eventi `trova-repository-change` e possibilità di sostituire le funzioni con chiamate API.
- `js/phase2-actions.js`: scheda richiesta cliente con modifica, chiusura/riapertura, eliminazione con conferma, lista proposte, selezione proposta, conversazione locale.
- Le proposte e i messaggi dei popup professionista vengono salvati in repository; le segnalazioni hanno archivio locale.
- Script inclusi nelle 13 pagine HTML.

## Limiti dichiarati
Questa è una **prima implementazione della fase 2, non un completamento al 100%**. Restano da collegare numerose azioni e schede statiche in directory, public, CMS e CMS Admin. Alcuni pulsanti amministrativi registrano solo azioni demo; i dati di esempio generati separatamente non hanno ancora un archivio comune per ogni entità. La demo non implementa permessi, sicurezza o invii reali. La persistenza localStorage non equivale a backend. Non usare dati personali reali.

## Verifiche
Controllo sintattico JS; non è stato svolto un test end-to-end su browser di tutti i percorsi.
