# TROVA — Prototipo frontend multisettoriale

Questo pacchetto contiene un prototipo visuale responsive, realizzato con HTML, CSS e JavaScript vanilla. È pensato per esplorare graficamente i flussi concordati prima di iniziare l'integrazione backend.

## Avvio rapido

1. Estrai `trova_frontend.zip` in una cartella.
2. Apri `index.html` con un browser moderno.
3. Per un'esperienza più affidabile, usa un server statico locale (ad esempio l'estensione Live Server di VS Code) dalla cartella estratta.

Non sono richiesti npm, framework o build step.

## Pagine incluse

- `index.html` — homepage, categorie interattive, sezione di matching, FAQ.
- `pages/nuova-richiesta.html` — wizard adattivo in tre passaggi, validazione frontend, riepilogo, allegati locali dimostrativi e bozza in sessione.
- `pages/directory.html` — directory con ricerca, filtri, ordinamento e schede professionista.
- `pages/profilo-professionista.html` — profilo, servizi, portfolio illustrativo, preferiti simulati.
- `pages/client-dashboard.html` — dashboard cliente con filtri sulle richieste e attività.
- `pages/pro-dashboard.html` — dashboard professionista, opportunità e anteprima dettagli.
- `pages/admin-dashboard.html` — console amministrativa visuale con code operative filtrabili.
- `pages/login-cliente.html` e `pages/login-professionista.html` — accessi separati per ruolo.
- `pages/registrazione-cliente.html` e `pages/registrazione-professionista.html` — registrazioni demo separate.
- `js/auth.js` — autenticazione di prova locale, con instradamento alle dashboard.

## Struttura

```text
multimarket_frontend/
├── index.html
├── README.md
├── assets/
│   └── mark.svg
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── home.js
│   ├── request.js
│   ├── directory.js
│   ├── client-dashboard.js
│   ├── pro-dashboard.js
│   ├── profile.js
│   └── admin.js
└── pages/
    ├── nuova-richiesta.html
    ├── directory.html
    ├── profilo-professionista.html
    ├── client-dashboard.html
    ├── pro-dashboard.html
    └── admin-dashboard.html
```

## Importante

- È un **frontend demo**, non una piattaforma pubblicabile pronta per utenti reali.
- I profili, le proposte, i numeri, i nomi e le statistiche sono fittizi.
- Il login è soltanto una simulazione frontend: su entrambe le pagine di accesso, `test@test.com` / `test` apre la dashboard del ruolo selezionato. Non è autenticazione sicura e non protegge le dashboard.
- Le registrazioni, il recupero password e il pulsante Google sono anteprime: non creano account né inviano dati.
- Non esistono database, upload remoto, notifiche reali, chat reale, autorizzazioni server-side o matching backend.
- La bozza viene mantenuta soltanto nella sessione del browser; non è una persistenza affidabile tra dispositivi.
- I file selezionati nel modulo restano sul dispositivo e non vengono caricati.
- Le restrizioni di privacy visualizzate descrivono il comportamento previsto, ma devono essere implementate e testate lato server prima di gestire dati reali.
- La tipografia Google Fonts richiede connessione internet; in assenza di rete vengono usati font di sistema.

## Direzione visuale

- Palette: `#F8FAFC`, `#2563EB`, `#172033`, `#DCEAFE`.
- Navigazione flottante traslucida.
- Layout responsive e menu mobile.
- Animazioni sobrie e supporto `prefers-reduced-motion`.
- Nessun framework JavaScript e nessun backend.

## Prossima fase suggerita

Esaminare il prototipo in browser e annotare le modifiche visuali o funzionali. Solo dopo aver confermato le schermate conviene definire e implementare autenticazione, database, storage protetto, matching reale e autorizzazioni.


## Aggiornamento filtri avanzati (frontend demo)

- La pubblicazione richiesta mostra campi adattivi per Casa, Auto, Tecnologia, Creatività, Riparazioni e Professionisti.
- La richiesta include preferenze/requisiti di matching distinti e un riepilogo dei campi specifici.
- L'area professionista include un editor dimostrativo per specializzazioni, zona/raggio, dimensione dei lavori, modalità, disponibilità, urgenze, prezzi, materiali, qualifiche, limiti operativi e tipologia di clientela.
- Il profilo pubblico presenta una sezione di capacità operative e compatibilità.
- La directory include filtri demo per disponibilità, urgenze, modalità, dimensione incarico, budget e raggio operativo.
- La dashboard amministratore include una tabella di progettazione degli attributi adattivi per settore.

**Importante:** tutto rimane frontend dimostrativo. Le preferenze della richiesta e del profilo vengono conservate al massimo nella sessione locale del browser; non vengono inviate a un server. Il matching, le autorizzazioni e la configurazione dinamica reale dovranno essere implementati nel backend.

## Catalogo attività condiviso

Il catalogo `js/service-catalog.js` è la fonte condivisa per il modulo di pubblicazione richieste e per il configuratore del profilo professionista. I 41 servizi sono associati a schemi specifici. Nella dashboard professionista è possibile scegliere più servizi e, per ciascuno, indicare più opzioni offerte nei campi a selezione multipla. Le preferenze sono salvate soltanto nella sessione del browser: il matching e la persistenza reali richiedono il backend.


## Archivio demo condiviso
La directory pubblica e la dashboard professionista caricano `js/demo-data.js`, che genera un archivio dimostrativo condiviso a partire dal catalogo dei servizi e dalle competenze professionali. La directory mostra tutti i profili demo generati (due per ciascun servizio del catalogo); le richieste demo sono generate dallo stesso modulo e usate nella dashboard. Questi dati sono locali e fittizi, non provengono da utenti reali e sono pensati per essere sostituiti da API/backend in produzione.

## Flussi operativi dimostrativi aggiornati

- **Matching rigoroso locale:** le opportunità della dashboard vengono filtrate per servizio e competenze richieste; i requisiti di qualifiche, esperienza, modalità, disponibilità, budget e raggio operativo possono escludere richieste non compatibili. Il punteggio ordina soltanto le opportunità che superano i controlli applicabili.
- **Richieste pubblicate nel prototipo:** il wizard richiede email formalmente valida, conferma dell'intenzione e una verifica email simulata esplicitamente. Le richieste sono condivise tra le pagine aperte nello stesso browser tramite `localStorage`; la verifica non invia email e non certifica l'identità.
- **Aggiornamenti demo:** le dashboard possono rilevare nuove richieste locali e ricalcolare il matching. Non sono implementate notifiche push, SMS o email reali.
- **Gestione stato:** dalla dashboard cliente è possibile chiudere una richiesta demo; una richiesta chiusa viene esclusa dalle opportunità professionali.
- **Segnalazioni:** il professionista può segnalare una richiesta e l'area admin mostra le segnalazioni registrate nel browser, con risoluzione dimostrativa.
- **Trasparenza economica:** il prototipo non addebita crediti, abbonamenti o commissioni. Le informazioni in dashboard indicano che i prezzi, i rimborsi e le controversie devono essere implementati con regole e backend prima del lancio.

I dati di questo flusso sono salvati nel browser e non vanno usati con dati personali reali. Per rendere queste funzioni affidabili in produzione servono API, autenticazione e autorizzazioni server-side, verifica email reale, database, notifiche, monitoraggio, strumenti di moderazione e un sistema economico definito.
