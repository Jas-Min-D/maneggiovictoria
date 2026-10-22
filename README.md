# Maneggio Victoria Country Club — sito web

Sito statico (HTML, CSS, JavaScript): nessun server, nessun database.

## Pagine
- `index.html` Home · `esperienze.html` · `eventi.html` (Feste ed eventi) · `galleria.html`
- `prenota.html` · `conferma.html` (link calendario inviato su WhatsApp) · `contatti.html` (Contatti e Chi siamo)
- `faq.html` Domande frequenti · `privacy.html`

## Contenuti modificabili senza toccare il codice
- **Evento in programma**: `evento.json`, locandine nella cartella `eventi/` (formato 4:5, es. 1080 × 1350 px).
  Con `"attivo": false` l'evento non compare; passata la data `"fino_al"` sparisce da solo.
- **Galleria**: `galleria.json` (ordine = ordine sul sito), foto e video nella cartella `foto/`.
  Ridurre le foto a circa 1600 px sul lato lungo prima di caricarle.
- Entrambi si gestiscono dal pannello **Pages CMS** (configurazione in `.pages.yml`): https://app.pagescms.org

## Prezzi e orari
In `prenota.js`: `PRICES` (euro a persona per durata) e orari prenotabili (dalle 9:00 alle 19:00, ogni 30 minuti).

## Contatti nel codice
Numero WhatsApp `393737560870` in `prenota.js`, `evento.js` e nei link delle pagine.
