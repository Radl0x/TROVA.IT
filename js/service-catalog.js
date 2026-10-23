/* Catalogo condiviso: i moduli richiesta e profilo professionista condividono le attività, ma non le domande. */
(() => {
  window.TrovaCatalog = {
    serviceOptions: {
    Casa:["Ristrutturazione completa","Idraulica e bagno","Impianto elettrico","Climatizzazione","Giardinaggio e manutenzione","Pulizie e sanificazione","Trasloco e montaggio"],
    Auto:["Meccanica e diagnosi","Carrozzeria e verniciatura","Elettrauto","Pneumatici e manutenzione","Dettagli e lavaggio","Soccorso e recupero"],
    Tecnologia:["Sito web ed e-commerce","Software e automazioni","Riparazione smartphone","Computer e notebook","Rete e Wi-Fi","Recupero dati","Assistenza informatica"],
    Creatività:["Fotografia","Produzione video","Design e identità visiva","Tatuaggio realistico","Tatuaggio fine line","Social media e contenuti","Illustrazione"],
    Riparazioni:["Tapparelle e infissi","Elettrodomestici","Piccole riparazioni domestiche","Serrature","Falegnameria","Riparazione dispositivi"],
    Professionisti:["Consulenza aziendale","Servizi amministrativi","Consulenza tecnica","Servizi legali","Contabilità e fiscalità","Traduzioni e lingue","Formazione e lezioni","Altro servizio specialistico"]
  },
    serviceSchemas: {
    "Ristrutturazione completa":[
      {id:"renovationRooms",label:"Quali ambienti vuoi ristrutturare?",type:"text",placeholder:"Es. bagno, cucina, intero appartamento"},
      {id:"renovationArea",label:"Superficie indicativa",type:"text",placeholder:"Es. 85 m²"},
      {id:"renovationCondition",label:"Stato attuale dell'immobile",type:"select",options:["Abitabile, da rinnovare","Da demolire in parte","Immobile al grezzo","Danni importanti","Da valutare con sopralluogo"]},
      {id:"renovationDesign",label:"Progetto tecnico disponibile?",type:"select",options:["Sì, completo","Parziale","No, serve supporto tecnico","In preparazione"]},
      {id:"renovationSystems",label:"Quali lavorazioni sono comprese?",type:"select",options:["Solo finiture","Impianti e finiture","Demolizioni, impianti e finiture","Ristrutturazione chiavi in mano","Da definire"]}
    ],
    "Idraulica e bagno":[
      {id:"plumbingProblem",label:"Problema o intervento idraulico",type:"select",options:["Perdita d'acqua","Scarico ostruito","Rubinetto o sanitario","Pressione dell'acqua","Installazione / sostituzione","Rifacimento bagno","Altro"]},
      {id:"plumbingArea",label:"Punto dell'impianto interessato",type:"select",options:["Bagno","Cucina","Caldaia / riscaldamento","Tubazioni interne","Scarichi","Esterno / giardino","Altro"]},
      {id:"plumbingSeverity",label:"Gravità del problema",type:"select",options:["Perdita attiva / rischio danni","Impianto inutilizzabile","Problema limitato","Intervento programmato","Da diagnosticare"]},
      {id:"plumbingWater",label:"È possibile chiudere l'acqua?",type:"select",options:["Sì","No","Non so"]},
      {id:"plumbingMaterials",label:"Sanitari e materiali",type:"select",options:["Già acquistati","Da fornire dal professionista","Da scegliere insieme","Non servono materiali"]}
    ],
    "Impianto elettrico":[
      {id:"electricalIssue",label:"Tipo di intervento elettrico",type:"select",options:["Guasto o interruzione","Prese / interruttori","Punti luce","Quadro elettrico","Nuovo impianto","Adeguamento / verifica","Certificazione quando prevista"]},
      {id:"electricalProperty",label:"Tipo di ambiente",type:"select",options:["Abitazione","Ufficio","Locale commerciale","Condominio","Esterno","Cantiere"]},
      {id:"electricalStatus",label:"Stato dell'impianto",type:"select",options:["Funziona parzialmente","Non funziona","Funziona ma va modificato","Impianto nuovo","Da verificare"]},
      {id:"electricalPoints",label:"Numero indicativo di punti o ambienti",type:"text",placeholder:"Es. 6 prese e 3 punti luce"},
      {id:"electricalPlan",label:"Schema o documentazione disponibile?",type:"select",options:["Sì","No","Non applicabile"]}
    ],
    "Climatizzazione":[
      {id:"climateJob",label:"Intervento richiesto",type:"select",options:["Installazione nuovo impianto","Manutenzione ordinaria","Guasto / riparazione","Sostituzione apparecchio","Controllo prima della stagione","Altro"]},
      {id:"climateSystem",label:"Tipo di impianto",type:"select",options:["Split","Multi-split","Pompa di calore","Impianto canalizzato","Climatizzazione commerciale","Non so"]},
      {id:"climateUnits",label:"Numero di unità",type:"number",placeholder:"Es. 2"},
      {id:"climateArea",label:"Superficie da climatizzare",type:"text",placeholder:"Es. soggiorno 35 m², ufficio 90 m²"},
      {id:"climateExisting",label:"Impianto già presente?",type:"select",options:["Sì, funzionante","Sì, guasto","No, nuova installazione","Da verificare"]}
    ],
    "Giardinaggio e manutenzione":[
      {id:"gardenTask",label:"Lavoro da svolgere",type:"select",options:["Taglio prato","Potatura","Siepi e arbusti","Pulizia area verde","Impianto di irrigazione","Progettazione giardino","Manutenzione periodica","Altro"]},
      {id:"gardenSize",label:"Dimensione dell'area",type:"text",placeholder:"Es. giardino di circa 300 m²"},
      {id:"gardenCondition",label:"Condizioni attuali",type:"select",options:["Manutenzione ordinaria","Molto incolto","Nuova area da realizzare","Danni / piante da rimuovere","Da valutare"]},
      {id:"gardenWaste",label:"Gestione degli sfalci e residui",type:"select",options:["Inclusa nel lavoro","Li gestisco io","Da concordare"]},
      {id:"gardenFrequency",label:"Frequenza",type:"select",options:["Una tantum","Settimanale","Ogni 2 settimane","Mensile","Stagionale","Da concordare"]}
    ],
    "Pulizie e sanificazione":[
      {id:"cleaningPlace",label:"Tipo di ambiente",type:"select",options:["Appartamento","Casa indipendente","Ufficio","Negozio / locale commerciale","Condominio","Fine cantiere","Altro"]},
      {id:"cleaningSize",label:"Superficie e numero di locali",type:"text",placeholder:"Es. 100 m², 4 stanze e 2 bagni"},
      {id:"cleaningLevel",label:"Tipo di pulizia",type:"select",options:["Ordinaria","Profonda","Fine lavori","Cambio ospiti / alloggio turistico","Vetri","Sanificazione specifica"]},
      {id:"cleaningSupplies",label:"Prodotti e attrezzature",type:"select",options:["Porta tutto il professionista","Sono disponibili sul posto","Da concordare"]},
      {id:"cleaningFrequency",label:"Frequenza del servizio",type:"select",options:["Una volta","Settimanale","Quindicinale","Mensile","Periodica da definire"]}
    ],
    "Trasloco e montaggio":[
      {id:"moveType",label:"Tipo di servizio",type:"select",options:["Trasloco completo","Trasporto di pochi mobili","Imballaggio","Smontaggio e rimontaggio","Montaggio mobili nuovi","Sgombero"]},
      {id:"moveFromTo",label:"Partenza e destinazione",type:"text",placeholder:"Indica comuni o zone, senza indirizzi privati"},
      {id:"moveVolume",label:"Quantità da trasportare",type:"select",options:["Pochi oggetti","Monolocale","Appartamento 2–3 locali","Casa grande","Ufficio / attività","Da valutare"]},
      {id:"moveFloors",label:"Piani e ascensore",type:"text",placeholder:"Es. 3° piano senza ascensore"},
      {id:"moveLift",label:"Serve elevatore esterno?",type:"select",options:["Probabilmente sì","No","Da valutare sul posto"]}
    ],
    "Meccanica e diagnosi":[
      {id:"mechanicVehicle",label:"Tipo di veicolo",type:"select",options:["Auto","Moto / scooter","Furgone","Veicolo commerciale","Altro"]},
      {id:"mechanicInfo",label:"Marca, modello, anno e chilometraggio",type:"text",placeholder:"Inserisci i dati che conosci"},
      {id:"mechanicSymptoms",label:"Sintomi, rumori o spie",type:"textarea",placeholder:"Descrivi quando si presenta il problema"},
      {id:"mechanicDrivetrain",label:"Alimentazione",type:"select",options:["Benzina","Diesel","Ibrida","Elettrica","GPL / metano","Non so"]},
      {id:"mechanicDriveable",label:"Il veicolo può circolare?",type:"select",options:["Sì","Sì, ma con difficoltà","No","Non so"]}
    ],
    "Carrozzeria e verniciatura":[
      {id:"bodyVehicle",label:"Veicolo e modello",type:"text",placeholder:"Marca, modello e anno"},
      {id:"bodyDamageType",label:"Danno da riparare",type:"select",options:["Graffi","Ammaccatura","Danno da incidente","Paraurti / componente","Grandine","Verniciatura parziale","Verniciatura completa","Altro"]},
      {id:"bodyPanels",label:"Parti della carrozzeria coinvolte",type:"text",placeholder:"Es. paraurti anteriore e parafango"},
      {id:"bodyInsurance",label:"È coinvolta un'assicurazione?",type:"select",options:["Sì, pratica aperta","Da aprire / valutare","No"]},
      {id:"bodyUse",label:"Il veicolo è utilizzabile?",type:"select",options:["Sì","No","Solo con limitazioni"]}
    ],
    "Elettrauto":[
      {id:"autoElectricSystem",label:"Sistema interessato",type:"select",options:["Batteria / avviamento","Luci","Alternatore","Sensori / centralina","Infotainment","Alzacristalli / chiusure","Impianto elettrico generale","Altro"]},
      {id:"autoElectricVehicle",label:"Marca, modello e anno",type:"text",placeholder:"Dati del veicolo"},
      {id:"autoElectricSymptoms",label:"Spie o sintomi",type:"textarea",placeholder:"Descrivi il problema e quando si presenta"},
      {id:"autoElectricScan",label:"È già stata fatta una diagnosi?",type:"select",options:["Sì, ho il codice errore","Sì, ma senza risultato","No","Non so"]}
    ],
    "Pneumatici e manutenzione":[
      {id:"tyreVehicle",label:"Veicolo",type:"select",options:["Auto","Moto","Furgone","Veicolo commerciale","Altro"]},
      {id:"tyreService",label:"Servizio richiesto",type:"select",options:["Cambio stagionale","Foratura","Sostituzione pneumatici","Equilibratura / convergenza","Controllo usura","Tagliando / manutenzione periodica"]},
      {id:"tyreSize",label:"Misura pneumatici (se nota)",type:"text",placeholder:"Es. 205/55 R16"},
      {id:"tyreQuantity",label:"Numero di pneumatici",type:"select",options:["1","2","4","Da verificare"]},
      {id:"tyreAtHome",label:"Serve intervento a domicilio?",type:"select",options:["Sì","No, posso recarmi in officina","Da concordare"]}
    ],
    "Dettagli e lavaggio":[
      {id:"detailVehicle",label:"Tipo di veicolo",type:"select",options:["Auto","Moto","Furgone","Camper","Altro"]},
      {id:"detailPackage",label:"Trattamento desiderato",type:"select",options:["Lavaggio interno ed esterno","Pulizia profonda interni","Lucidatura carrozzeria","Correzione vernice","Protezione / trattamento ceramico","Pulizia tappezzeria","Altro"]},
      {id:"detailCondition",label:"Condizioni attuali",type:"select",options:["Normali","Molto sporco","Macchie o odori persistenti","Graffi / opacità","Da valutare"]},
      {id:"detailLocation",label:"Dove preferisci il servizio?",type:"select",options:["Centro specializzato","A domicilio","Entrambe le opzioni"]}
    ],
    "Soccorso e recupero":[
      {id:"rescueVehicle",label:"Veicolo da recuperare",type:"text",placeholder:"Tipo, marca e modello"},
      {id:"rescueCondition",label:"Condizione del veicolo",type:"select",options:["Guasto meccanico","Incidente","Batteria scarica","Ruota danneggiata","Bloccato fuori strada","Altro"]},
      {id:"rescueLocation",label:"Zona in cui si trova",type:"text",placeholder:"Comune, strada o punto di riferimento"},
      {id:"rescueDestination",label:"Destinazione",type:"select",options:["Officina indicata da me","Officina da consigliare","Deposito / altro luogo","Non so ancora"]},
      {id:"rescueWheels",label:"Ruote sterzanti o bloccate?",type:"select",options:["No","Sì","Non so"]}
    ],
    "Sito web ed e-commerce":[
      {id:"webType",label:"Tipo di progetto web",type:"select",options:["Sito vetrina","E-commerce","Landing page","Portfolio","Portale / marketplace","Restyling di sito esistente"]},
      {id:"webPages",label:"Numero indicativo di pagine",type:"text",placeholder:"Es. 6 pagine + contatti"},
      {id:"webPlatform",label:"Piattaforma preferita o attuale",type:"select",options:["WordPress","Shopify","HTML / CSS / JavaScript","Web app personalizzata","Nessuna preferenza","Altro"]},
      {id:"webFeatures",label:"Funzioni necessarie",type:"text",placeholder:"Es. prenotazioni, area utenti, catalogo, chat"},
      {id:"webCommerce",label:"Servono pagamenti online?",type:"select",options:["Sì","No","Da valutare"]},
      {id:"webContent",label:"Testi, foto e traduzioni",type:"select",options:["Fornisco tutto","Serve produzione dei contenuti","Ho parte dei materiali","Da concordare"]}
    ],
    "Software e automazioni":[
      {id:"softwareGoal",label:"Quale processo vuoi digitalizzare?",type:"textarea",placeholder:"Descrivi il problema o il processo attuale"},
      {id:"softwareUsers",label:"Chi utilizzerà il software?",type:"select",options:["Solo io","Piccolo team","Azienda / più reparti","Clienti esterni","Pubblico generico"]},
      {id:"softwarePlatform",label:"Dove deve funzionare?",type:"select",options:["Web browser","Windows / Mac","Android / iOS","Web e mobile","Integrazione con sistemi esistenti"]},
      {id:"softwareIntegrations",label:"Sistemi da integrare",type:"text",placeholder:"Es. Excel, CRM, gestionale, API"},
      {id:"softwareData",label:"Dati e accessi necessari",type:"select",options:["Dati nuovi","Importazione da file","Collegamento a database esistente","Da definire"]}
    ],
    "Riparazione smartphone":[
      {id:"phoneBrandModel",label:"Marca e modello",type:"text",placeholder:"Es. Samsung Galaxy, iPhone…"},
      {id:"phoneFault",label:"Problema principale",type:"select",options:["Schermo rotto","Batteria","Connettore di ricarica","Fotocamera","Audio / microfono","Danni da liquido","Non si accende","Altro"]},
      {id:"phoneCondition",label:"Il dispositivo si accende?",type:"select",options:["Sì, normalmente","Sì, ma con problemi","No","A intermittenza"]},
      {id:"phoneData",label:"È importante conservare i dati?",type:"select",options:["Essenziale","Preferibile","Non necessario / non so"]},
      {id:"phoneWarranty",label:"È ancora in garanzia?",type:"select",options:["Sì","No","Non so"]}
    ],
    "Computer e notebook":[
      {id:"computerDevice",label:"Dispositivo e caratteristiche",type:"text",placeholder:"Marca, modello, sistema operativo"},
      {id:"computerIssue",label:"Problema o intervento",type:"select",options:["Non si avvia","Lento / blocchi","Schermo / tastiera","Surriscaldamento","Aggiornamento / configurazione","Upgrade RAM / SSD","Rimozione malware","Altro"]},
      {id:"computerData",label:"I dati devono essere preservati?",type:"select",options:["Sì, indispensabile","Preferibile","Non applicabile"]},
      {id:"computerAccess",label:"Modalità preferita",type:"select",options:["Assistenza da remoto","Consegna in laboratorio","A domicilio","Da concordare"]}
    ],
    "Rete e Wi-Fi":[
      {id:"networkPlace",label:"Ambiente da coprire",type:"select",options:["Appartamento","Casa su più piani","Ufficio","Negozio / locale","Magazzino / spazio esterno"]},
      {id:"networkProblem",label:"Problema o obiettivo",type:"select",options:["Segnale debole","Zone senza copertura","Connessione instabile","Nuova rete","Rete cablata","Configurazione router / firewall","Rete per azienda"]},
      {id:"networkSize",label:"Dimensione e piani",type:"text",placeholder:"Es. 120 m² su 2 piani"},
      {id:"networkProvider",label:"Connessione e router attuali",type:"text",placeholder:"Operatore, modem/router, velocità se nota"},
      {id:"networkWiring",label:"È possibile passare cavi?",type:"select",options:["Sì","No","Da verificare"]}
    ],
    "Recupero dati":[
      {id:"dataDevice",label:"Supporto da cui recuperare i dati",type:"select",options:["Hard disk","SSD","Chiavetta USB / scheda SD","Smartphone","Computer non funzionante","NAS / RAID","Altro"]},
      {id:"dataFailure",label:"Cosa è successo?",type:"select",options:["Cancellazione accidentale","Disco non rilevato","Danno fisico / rumori","Dispositivo rotto","File corrotti","Richiesta di recupero dopo formattazione","Altro"]},
      {id:"dataCapacity",label:"Capacità e quantità di dati",type:"text",placeholder:"Es. SSD 1 TB, documenti e foto"},
      {id:"dataActions",label:"Sono già stati fatti tentativi?",type:"select",options:["No","Sì, con software","Sì, aperto o riparato","Non so"]},
      {id:"dataPriority",label:"Priorità dei dati",type:"select",options:["Lavoro / dati insostituibili","Importanti ma non urgenti","Recupero parziale accettabile"]}
    ],
    "Assistenza informatica":[
      {id:"itEnvironment",label:"Ambiente da assistere",type:"select",options:["Computer personale","Ufficio / azienda","Rete aziendale","Posta elettronica e account","Stampanti / periferiche","Configurazione software"]},
      {id:"itIssue",label:"Problema principale",type:"textarea",placeholder:"Descrivi l'errore o l'attività da svolgere"},
      {id:"itUsers",label:"Quanti dispositivi o utenti?",type:"text",placeholder:"Es. 3 PC e 4 account email"},
      {id:"itMode",label:"Come preferisci ricevere assistenza?",type:"select",options:["Da remoto","A domicilio / in sede","In laboratorio","Da valutare"]}
    ],
    "Fotografia":[
      {id:"photoGenre",label:"Genere fotografico",type:"select",options:["Matrimonio","Evento / festa","Ritratto individuale","Famiglia","Gravidanza / newborn","Prodotti / e-commerce","Immobili / architettura","Aziendale / corporate","Moda","Sport","Altro"]},
      {id:"photoDate",label:"Data e fascia oraria",type:"text",placeholder:"Data, ora di inizio e fine previste"},
      {id:"photoLocation",label:"Luogo e ambientazione",type:"text",placeholder:"Studio, esterni, location evento e comune"},
      {id:"photoSubjects",label:"Numero di persone o prodotti",type:"text",placeholder:"Es. 2 persone, 30 prodotti, circa 80 invitati"},
      {id:"photoDeliverables",label:"Consegna desiderata",type:"select",options:["Selezione di foto ritoccate","Tutte le foto riuscite","Album stampato","File ad alta risoluzione","Pacchetto digitale + stampe","Da consigliare"]},
      {id:"photoStyle",label:"Stile e riferimenti",type:"text",placeholder:"Es. reportage naturale, editoriale, luminoso"}
    ],
    "Produzione video":[
      {id:"videoPurpose",label:"Tipo di video",type:"select",options:["Video evento","Video promozionale","Intervista","Video social / reel","Video prodotto","Video immobiliare","Matrimonio","Formazione / tutorial","Altro"]},
      {id:"videoLength",label:"Durata finale indicativa",type:"text",placeholder:"Es. 60 secondi, 5 minuti"},
      {id:"videoShoot",label:"Riprese necessarie",type:"select",options:["Sì, in una location","Sì, in più location","Ho già il girato","Solo montaggio e post-produzione"]},
      {id:"videoFormat",label:"Formati di pubblicazione",type:"select",options:["Orizzontale 16:9","Verticale 9:16","Quadrato","Più formati"]},
      {id:"videoExtras",label:"Servizi aggiuntivi",type:"select",options:["Drone (se consentito)","Voce narrante","Sottotitoli","Animazioni / motion graphics","Musica con licenza","Nessuno / da concordare"]}
    ],
    "Design e identità visiva":[
      {id:"designDeliverable",label:"Materiali da progettare",type:"select",options:["Logo","Identità visiva completa","Biglietto da visita","Brochure / catalogo","Packaging","Presentazione","Materiali social","Restyling del brand"]},
      {id:"designBrand",label:"Nome e settore del brand",type:"text",placeholder:"Nome attività e settore"},
      {id:"designAssets",label:"Materiali già disponibili",type:"select",options:["Parto da zero","Logo esistente","Brand guideline","Bozze e riferimenti","Da valutare"]},
      {id:"designStyle",label:"Stile e valori da comunicare",type:"text",placeholder:"Es. premium, minimale, artigianale, giovane"},
      {id:"designFormats",label:"Formati finali necessari",type:"text",placeholder:"Es. SVG, PDF stampa, PNG, file sorgenti"}
    ],
    "Tatuaggio realistico":[
      {id:"tattooSubjectReal",label:"Soggetto del tatuaggio",type:"text",placeholder:"Es. ritratto, animale, scena, oggetto"},
      {id:"tattooBodyReal",label:"Zona del corpo",type:"select",options:["Braccio o avambraccio","Manica completa (braccio intero)","Gamba o polpaccio","Coscia","Schiena","Petto","Spalla","Costato","Altro / da valutare"]},
      {id:"tattooSizeReal",label:"Dimensioni o estensione desiderata",type:"text",placeholder:"Es. 15 × 20 cm oppure tutto il braccio"},
      {id:"tattooColorReal",label:"Tecnica e colore",type:"select",options:["Realismo in nero e grigio","Realismo a colori","Microrealismo","Da consigliare al tatuatore"]},
      {id:"tattooExistingReal",label:"Tipo di intervento",type:"select",options:["Nuovo tatuaggio","Copertura di un tatuaggio esistente","Ritocco o completamento"]},
      {id:"tattooReferenceReal",label:"Hai immagini di riferimento?",type:"select",options:["Sì, le allegherò","Ho un'idea da spiegare","Vorrei una proposta originale"]}
    ],
    "Tatuaggio fine line":[
      {id:"tattooSubjectFine",label:"Soggetto o simbolo",type:"text",placeholder:"Es. scritta, fiore, simbolo, disegno minimal"},
      {id:"tattooBodyFine",label:"Zona del corpo",type:"select",options:["Polso","Avambraccio","Caviglia","Costato","Collo","Dietro l'orecchio","Dita / mano","Altro"]},
      {id:"tattooSizeFine",label:"Dimensioni indicative",type:"text",placeholder:"Es. 3 cm, 6 × 2 cm"},
      {id:"tattooLineFine",label:"Stile delle linee",type:"select",options:["Linea singola molto sottile","Linework geometrico","Floreale delicato","Scritta / lettering","Minimal con piccoli dettagli","Da definire"]},
      {id:"tattooColorFine",label:"Colore",type:"select",options:["Nero","Nero e grigio","Piccoli dettagli a colore"]},
      {id:"tattooPlacementFine",label:"Hai già deciso il posizionamento?",type:"select",options:["Sì, preciso","Ho una zona indicativa","Vorrei un consiglio"]}
    ],
    "Social media e contenuti":[
      {id:"socialChannels",label:"Canali da gestire",type:"text",placeholder:"Es. Instagram, TikTok, LinkedIn, Facebook"},
      {id:"socialGoal",label:"Obiettivo principale",type:"select",options:["Aumentare visibilità","Generare contatti / vendite","Costruire il brand","Piano editoriale","Gestione community","Campagne pubblicitarie"]},
      {id:"socialVolume",label:"Volume indicativo di contenuti",type:"text",placeholder:"Es. 3 post e 4 storie a settimana"},
      {id:"socialAssets",label:"Foto e materiali disponibili",type:"select",options:["Fornisco i materiali","Serve produzione di foto/video","Entrambe le cose","Da definire"]},
      {id:"socialAccess",label:"Il profilo è già attivo?",type:"select",options:["Sì, con contenuti pubblicati","Sì, ma da rilanciare","No, va creato","Preferisco discuterne"]}
    ],
    "Illustrazione":[
      {id:"illustrationUse",label:"Uso dell'illustrazione",type:"select",options:["Personale / regalo","Libro / editoria","Gioco / personaggio","Pubblicità","Merchandising","Editoriale / articolo","Altro"]},
      {id:"illustrationSubject",label:"Soggetto e numero di elementi",type:"text",placeholder:"Descrivi personaggi, ambienti o oggetti"},
      {id:"illustrationStyle",label:"Stile desiderato",type:"text",placeholder:"Es. fumetto, acquerello, vettoriale, fantasy"},
      {id:"illustrationColor",label:"Tecnica e colore",type:"select",options:["A colori","Bianco e nero","Tradizionale","Digitale","Da consigliare"]},
      {id:"illustrationRights",label:"Diritti di utilizzo",type:"select",options:["Uso personale","Uso commerciale","Pubblicazione / stampa","Licenza da concordare"]},
      {id:"illustrationFiles",label:"Formato finale",type:"select",options:["PNG / JPG","PDF","SVG / vettoriale","File sorgente modificabile","Da concordare"]}
    ],
    "Tapparelle e infissi":[
      {id:"shutterObject",label:"Elemento interessato",type:"select",options:["Tapparella","Persiana","Finestra","Porta-finestra","Zanzariera","Serramento completo"]},
      {id:"shutterIssue",label:"Problema",type:"select",options:["Bloccato","Cinghia rotta","Motore elettrico guasto","Non chiude bene","Vetro danneggiato","Sostituzione completa","Nuova installazione"]},
      {id:"shutterQuantity",label:"Numero di elementi",type:"text",placeholder:"Es. 2 finestre e 1 tapparella"},
      {id:"shutterMaterial",label:"Materiale (se noto)",type:"select",options:["PVC","Alluminio","Legno","Misto","Non so"]},
      {id:"shutterMotor",label:"Tapparella motorizzata?",type:"select",options:["Sì","No","Non applicabile","Non so"]}
    ],
    "Elettrodomestici":[
      {id:"applianceType",label:"Elettrodomestico",type:"select",options:["Lavatrice","Lavastoviglie","Frigorifero","Forno / piano cottura","Asciugatrice","Condizionatore","Piccolo elettrodomestico","Altro"]},
      {id:"applianceBrand",label:"Marca e modello",type:"text",placeholder:"Marca, modello o codice prodotto"},
      {id:"applianceFault",label:"Guasto o sintomo",type:"textarea",placeholder:"Es. non scarica, fa rumore, mostra codice errore"},
      {id:"applianceAge",label:"Età indicativa",type:"select",options:["Meno di 2 anni","2–5 anni","6–10 anni","Oltre 10 anni","Non so"]},
      {id:"appliancePlace",label:"Dove si trova?",type:"select",options:["Presso la mia abitazione","Da portare in laboratorio","Da concordare"]}
    ],
    "Piccole riparazioni domestiche":[
      {id:"handymanTask",label:"Quali lavori servono?",type:"text",placeholder:"Es. fissare mensole, montare accessori, piccoli ritocchi"},
      {id:"handymanCount",label:"Numero di interventi",type:"text",placeholder:"Es. 4 attività in 2 stanze"},
      {id:"handymanTools",label:"Materiali e attrezzi",type:"select",options:["Li porta il professionista","Sono già disponibili","Da concordare"]},
      {id:"handymanSurface",label:"Superfici o supporti coinvolti",type:"select",options:["Muratura","Cartongesso","Legno","Piastrelle","Metallo","Misti / non so"]},
      {id:"handymanAccess",label:"Sono necessari lavori in altezza?",type:"select",options:["No","Sì, scala domestica","Sì, attrezzatura specifica","Da valutare"]}
    ],
    "Serrature":[
      {id:"lockType",label:"Tipo di porta o serratura",type:"select",options:["Porta d'ingresso","Porta interna","Porta blindata","Serranda / cancello","Cassaforte","Altro"]},
      {id:"lockProblem",label:"Intervento richiesto",type:"select",options:["Sono rimasto fuori","Chiave spezzata","Cilindro da sostituire","Serratura bloccata","Installazione nuova","Aumento sicurezza"]},
      {id:"lockAccess",label:"Puoi accedere all'immobile?",type:"select",options:["Sì","No, sono bloccato fuori","Accesso parziale"]},
      {id:"lockSecurity",label:"Preferenze di sicurezza",type:"select",options:["Ripristino funzionalità","Cilindro di sicurezza","Serratura multipunto","Vorrei un consiglio"]}
    ],
    "Falegnameria":[
      {id:"carpentryObject",label:"Manufatto richiesto",type:"select",options:["Armadio / guardaroba","Cucina","Tavolo / scrivania","Porta","Mobile su misura","Riparazione mobile","Struttura esterna","Altro"]},
      {id:"carpentryMeasure",label:"Misure indicative",type:"text",placeholder:"Larghezza × altezza × profondità"},
      {id:"carpentryMaterial",label:"Materiale preferito",type:"select",options:["Massello","Multistrato","MDF / pannelli","Legno da recupero","Da consigliare"]},
      {id:"carpentryFinish",label:"Finitura",type:"select",options:["Naturale","Verniciata","Laccata","Impiallacciata","Da definire"]},
      {id:"carpentryInstall",label:"Serve anche montaggio in loco?",type:"select",options:["Sì","No","Da concordare"]}
    ],
    "Riparazione dispositivi":[
      {id:"deviceKind",label:"Dispositivo",type:"select",options:["Tablet","Console da gioco","Smartwatch","Stampante","Monitor","Dispositivo audio","Altro"]},
      {id:"deviceMake",label:"Marca e modello",type:"text",placeholder:"Inserisci modello o codice prodotto"},
      {id:"deviceFault",label:"Guasto",type:"select",options:["Non si accende","Schermo / display","Batteria / alimentazione","Porte / connettori","Problema software","Danno da liquido","Altro"]},
      {id:"deviceData",label:"Dati da conservare?",type:"select",options:["Sì, indispensabile","Preferibile","Non applicabile"]},
      {id:"deviceWarranty",label:"Garanzia attiva?",type:"select",options:["Sì","No","Non so"]}
    ],
    "Consulenza aziendale":[
      {id:"businessTopic",label:"Area della consulenza",type:"select",options:["Strategia e crescita","Marketing e vendite","Organizzazione interna","Business plan","Avvio attività","Controllo di gestione","Digitalizzazione","Altro"]},
      {id:"businessSize",label:"Dimensione dell'organizzazione",type:"select",options:["Idea / progetto da avviare","Ditta individuale","Microimpresa","Piccola o media impresa","Organizzazione più grande"]},
      {id:"businessGoal",label:"Obiettivo da raggiungere",type:"textarea",placeholder:"Descrivi il risultato che ti aspetti"},
      {id:"businessStage",label:"Tempistica del progetto",type:"select",options:["Decisione urgente","Entro 1 mese","Entro 3 mesi","Pianificazione a lungo termine"]},
      {id:"businessFormat",label:"Modalità preferita",type:"select",options:["Singolo incontro","Analisi e relazione","Percorso di più incontri","Affiancamento continuativo"]}
    ],
    "Servizi amministrativi":[
      {id:"adminTask",label:"Pratica amministrativa",type:"select",options:["Compilazione modulistica","Presentazione pratica","Gestione documenti","Pratiche aziendali","Pratiche immobiliari","Segreteria continuativa","Altro"]},
      {id:"adminRequester",label:"Per chi è la pratica?",type:"select",options:["Privato","Ditta individuale","Società","Associazione / ente"]},
      {id:"adminDeadline",label:"Scadenza prevista",type:"text",placeholder:"Indica la data o il termine"},
      {id:"adminDocuments",label:"Documenti già disponibili",type:"select",options:["Tutti","In parte","Da raccogliere","Non so quali servano"]}
    ],
    "Consulenza tecnica":[
      {id:"technicalField",label:"Ambito tecnico",type:"select",options:["Edilizia / costruzioni","Impianti","Energia","Sicurezza","Perizie / valutazioni","Disegno tecnico","Ambiente","Altro"]},
      {id:"technicalDeliverable",label:"Risultato richiesto",type:"select",options:["Sopralluogo","Relazione tecnica","Progetto / elaborati","Perizia","Verifica / collaudo","Consulenza specialistica"]},
      {id:"technicalSite",label:"È necessario un sopralluogo?",type:"select",options:["Sì","No","Da valutare"]},
      {id:"technicalDocs",label:"Documenti o elaborati disponibili",type:"select",options:["Sì, completi","Parziali","No","Da raccogliere"]},
      {id:"technicalPurpose",label:"Finalità dell'incarico",type:"text",placeholder:"Es. ristrutturazione, conformità, acquisto immobile"}
    ],
    "Servizi legali":[
      {id:"legalArea",label:"Area legale",type:"select",options:["Contratti","Lavoro","Famiglia","Locazioni / immobili","Impresa / commerciale","Contenzioso","Recupero crediti","Privacy","Altro"]},
      {id:"legalRole",label:"Ruolo del richiedente",type:"select",options:["Privato","Lavoratore","Datore di lavoro","Impresa","Proprietario / locatore","Inquilino","Altro"]},
      {id:"legalStage",label:"Fase della questione",type:"select",options:["Informazione iniziale","Negoziazione","Diffida / comunicazione ricevuta","Procedura già avviata","Contenzioso","Da valutare"]},
      {id:"legalDeadline",label:"Esistono scadenze formali?",type:"select",options:["Sì, ravvicinate","Sì, non imminenti","No","Da verificare"]},
      {id:"legalDocuments",label:"Documenti disponibili",type:"select",options:["Sì","In parte","No","Da raccogliere"]}
    ],
    "Contabilità e fiscalità":[
      {id:"taxClientType",label:"Posizione fiscale",type:"select",options:["Privato","Lavoratore autonomo","Ditta individuale","Società","Associazione / ente","Altro"]},
      {id:"taxNeed",label:"Servizio richiesto",type:"select",options:["Dichiarazione fiscale","Contabilità ordinaria","Apertura attività / partita IVA","Adempimenti periodici","Bilancio","Consulenza fiscale","Regolarizzazione / arretrati","Altro"]},
      {id:"taxPeriod",label:"Anno o periodo di riferimento",type:"text",placeholder:"Es. anno fiscale 2025, trimestre"},
      {id:"taxUrgency",label:"Scadenza o urgenza",type:"text",placeholder:"Indica la data limite, se esiste"},
      {id:"taxRecords",label:"Documentazione contabile",type:"select",options:["Ordinata e completa","Parzialmente disponibile","Da ricostruire","Da valutare"]}
    ],
    "Traduzioni e lingue":[
      {id:"translationPair",label:"Lingua di partenza e arrivo",type:"text",placeholder:"Es. italiano → inglese"},
      {id:"translationContent",label:"Tipo di contenuto",type:"select",options:["Documento personale","Documento legale / ufficiale","Testo commerciale","Sito web","Manuale tecnico","Contenuto creativo","Traduzione orale / interpretariato"]},
      {id:"translationLength",label:"Lunghezza indicativa",type:"text",placeholder:"Es. 8 pagine, 2.000 parole, 30 minuti"},
      {id:"translationCertified",label:"Serve una traduzione asseverata o certificata?",type:"select",options:["Sì","No","Da verificare in base all'uso"]},
      {id:"translationFormat",label:"Formato di consegna",type:"select",options:["Word modificabile","PDF","Mantenere impaginazione originale","Consegna orale","Da concordare"]}
    ],
    "Formazione e lezioni":[
      {id:"lessonSubject",label:"Materia o competenza",type:"text",placeholder:"Es. matematica, inglese conversazione, Excel"},
      {id:"lessonLevel",label:"Livello attuale",type:"select",options:["Principiante","Base","Intermedio","Avanzato","Preparazione esame / certificazione"]},
      {id:"lessonGoal",label:"Obiettivo dell'apprendimento",type:"text",placeholder:"Es. recupero scolastico, conversazione, lavoro"},
      {id:"lessonFormat",label:"Modalità delle lezioni",type:"select",options:["Individuali in presenza","Individuali online","Gruppo in presenza","Gruppo online","Flessibile"]},
      {id:"lessonFrequency",label:"Frequenza desiderata",type:"select",options:["Lezione singola","1 volta a settimana","2 o più volte a settimana","Percorso intensivo","Da concordare"]}
    ],
    "Altro servizio specialistico":[
      {id:"specialistField",label:"Ambito specialistico",type:"text",placeholder:"Indica settore e specializzazione"},
      {id:"specialistGoal",label:"Risultato desiderato",type:"textarea",placeholder:"Descrivi il problema o l'obiettivo"},
      {id:"specialistFormat",label:"Modalità del servizio",type:"select",options:["In presenza","Da remoto","Mista","Da concordare"]},
      {id:"specialistDeliverable",label:"Cosa deve essere consegnato?",type:"text",placeholder:"Es. relazione, sessione, elaborato, intervento"},
      {id:"specialistRequirements",label:"Requisiti o competenze indispensabili",type:"text",placeholder:"Indica eventuali requisiti specifici"}
    ]
  }
  };
})();
