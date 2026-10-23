# TROVA — correzione critica del matchmaking

## Regole ora applicate
- **Requisiti fondamentali di idoneità:** specializzazione/servizio esatto e località compatibile.
- **Località:** se il comune è dichiarato tra le aree servite viene considerato coperto; altrimenti viene calcolata la distanza quando i dati geografici sono disponibili. Fuori raggio o località non verificabile = esclusione, mai ammissione automatica.
- **Criteri secondari:** competenze aggiuntive, disponibilità, budget, urgenza, qualifiche e dettagli adattivi incidono sul punteggio, ma non escludono da soli il professionista.
- **Occasioni professionista:** provengono esclusivamente dalle richieste locali `open`, con titolo, non nascoste dal cliente e senza incarico già assegnato. Le richieste demo/statiche non vengono mostrate come occasioni reali.
- **Laboratorio:** usa lo stesso motore `TrovaWorkflow.match` della dashboard e include città di più aree d'Italia per evidenziare incompatibilità geografiche.

## Test tecnici eseguiti
- Tatuaggio realistico, professionista a Olbia, richiesta a Roma, raggio 25 km: **escluso** (distanza indicativa 273 km).
- Tatuaggio realistico, professionista a Olbia, richiesta a Olbia: **idoneo**.
- Tatuaggio fine line contro richiesta di tatuaggio realistico: **escluso** per specializzazione fondamentale diversa.
- Requisito secondario mancante: il professionista resta idoneo se località e specializzazione corrispondono, con punteggio ridotto.
- Comune non mappato e non dichiarato tra le aree servite: **escluso**, invece di essere ammesso senza verifica.

Le distanze sono indicative, non routing stradale; il prototipo resta frontend/localStorage e non sostituisce un backend di produzione.
