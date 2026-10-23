# Correzioni TROVA — preventivi e completamento

- Il professionista conferma esplicitamente prima di segnalare un lavoro completato.
- Il popup recensione non eredita gli stati CSS di sola lettura di altri popup; la chiusura ripristina lo scroll originale. Dopo l'invio, il popup si chiude e la recensione viene salvata una sola volta.
- Dopo l'invio di un preventivo si chiudono sia il modulo preventivo sia il popup dei dettagli dell'opportunità. Un preventivo in attesa blocca nuovi invii finché il cliente non decide.
- Il cliente può rifiutare un preventivo inviato. La richiesta resta attiva e il professionista riceve una notifica.
- Il preventivo rifiutato è evidenziato in rosso nella dashboard del professionista; il professionista può inviare una nuova versione, con importo/tempi/descrizione/condizioni aggiornati. La cronologia delle versioni viene conservata.
- Le richieste già assegnate non accettano nuovi preventivi da altri professionisti.

Il progetto resta una demo frontend con dati nel browser; le verifiche eseguite sono controlli statici, non un test end-to-end completo nel browser.

## Correzione successiva — rinuncia del professionista
- Dopo una rinuncia a un incarico già accettato, la richiesta torna aperta e il professionista può inviare una nuova proposta senza essere bloccato dal vecchio preventivo chiuso.
- La nuova proposta viene creata come nuova versione collegata alla precedente, mantenendo lo storico e notificando il cliente.
- Il cliente riceve una notifica esplicita di rinuncia; nella lista delle azioni viene evidenziato che l'incarico è stato lasciato e che la richiesta è stata riaperta per scegliere un'altra proposta.
