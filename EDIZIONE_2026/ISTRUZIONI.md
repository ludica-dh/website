# Guida al LUDiCa — pubblicazione e personalizzazione

## Proposta grafica

Le sei aree precedono la guida: card su tre colonne al desktop e due al mobile, con stato scritto e accessi riconoscibili. La guida usa numeri progressivi, ricerca su titoli e contenuti, pannelli accessibili da tastiera e comandi per aprire/chiudere tutte le voci visibili. La ricerca apre le corrispondenze e ripristina le aperture precedenti quando viene cancellata.

Blu inchiostro, avorio e terracotta sostituiscono la barra inferiore compatta. Il titolo serif mantiene il carattere editoriale; i testi funzionali usano font di sistema leggibili. Nessuna risorsa esterna è necessaria.

## Fedeltà allo screenshot

Titoli, nomi delle aree e stati derivano dall'immagine. Il testo del tema è trascritto. Gli altri pannelli sono chiusi nello screenshot: i loro contenuti non sono ricostruibili e sono indicati come informazioni da completare. Gli URL non sono visibili: il CSV di esempio li lascia vuoti. Le card senza URL non sono cliccabili e mostrano “Collegamento in arrivo”. Non sono state inventate date, sedi, CFU, borse o destinazioni.

## Colonne CSV

Prima riga con questi nomi, in minuscolo. Le colonne obbligatorie sono tipo, id, titolo. Per le sezioni va compilato anche contenuto.

| Colonna | Valori e funzione |
| --- | --- |
| tipo | sezione oppure area |
| id | ID stabile e univoco nel proprio tipo: tema, quando, iscrizioni… |
| edizione | 2026, 2027…; vuoto rende la riga comune a tutte le edizioni |
| ordine | Numero per l'ordinamento all'interno di sezioni/aree; se manca si usa ID, in ordine naturale |
| titolo | Testo visibile, senza HTML |
| contenuto | Testo semplice o HTML limitato, solo per sezioni |
| url | URL della card o approfondimento della sezione; preferire https:// assoluti |
| stato | accedi, disponibile, aggiornamento; nascosto esclude la riga. Vuoto = accedi |
| visibile | true/false, sì/no oppure 1/0; vuoto = visibile |
| aperto | true/false per le sezioni; vuoto usa CONFIG.aperti |

Esempi (le celle vuote sono intenzionali):

```csv
tipo,id,edizione,ordine,titolo,contenuto,url,stato,visibile,aperto
sezione,tema,2026,1,Il tema della scuola,<p>Come si studia la storia di una Comunità di villaggio?</p>,,,true,true
sezione,quando,2026,2,Quando si tiene,Le informazioni di questa sezione saranno pubblicate a breve.,,,true,false
area,iscrizioni,2026,1,Iscrizioni,,,accedi,true,
area,esiti,2026,4,Esiti,,,aggiornamento,true,
area,stampa,2026,5,Stampa e media,,,disponibile,true,
```

Il file dati-esempio.csv contiene tutte le 16 righe. Importalo in Google Sheets per evitare di modificare manualmente virgolette e delimitatori. Sono supportati virgola, punto e virgola, tabulazione, virgolette doppie escape, celle multilinea, BOM e righe vuote. Mantieni lo stesso numero di celle in ogni riga: gli errori attivano il fallback.

L'HTML ammesso comprende p, br, strong, b, em, i, ul, ol, li, a, blockquote, h3, h4, code. Attributi arbitrari, script, immagini e incorporamenti vengono esclusi. I link esterni si aprono in una nuova scheda. Non inserire dati riservati nel CSV pubblicato.

## Pubblicare il CSV

1. In Google Drive crea o apri un foglio Google Sheets e importa dati-esempio.csv.
2. Compila i contenuti e gli URL effettivi. Le aree in aggiornamento restano non cliccabili anche se hanno un URL: cambia lo stato per abilitarle.
3. In Sheets scegli **File → Condividi → Pubblica sul web**. Seleziona la scheda dati e il formato **Valori separati da virgola (.csv)**, poi pubblica e copia il collegamento. La pubblicazione deve essere accessibile al pubblico; alcune organizzazioni possono limitarla.
4. Incolla il collegamento in CONFIG.csvUrl dentro index.html. Un esempio della forma attesa è:
   https://docs.google.com/spreadsheets/d/e/ID_PUBBLICAZIONE/pub?gid=0&single=true&output=csv
5. Verifica dal sito GitHub Pages. L'URL deve restituire CSV senza login, non una pagina HTML di visualizzazione o download. Mantieni abilitata la ripubblicazione automatica se desideri diffondere le modifiche al foglio.

Un file .csv semplicemente condiviso su Drive può restituire redirect, pagine di conferma o risposte senza intestazioni CORS compatibili. Il browser non può aggirare CORS. Preferisci Sheets pubblicato come CSV; in alternativa carica il CSV nel repository GitHub e usa CONFIG.csvUrl:'./dati-esempio.csv'. Questa alternativa si aggiorna ricommittando il CSV. Non si usa mode:'no-cors', che renderebbe la risposta illeggibile, né proxy pubblici.

Senza CSV configurato il fallback funziona subito e non mostra avvisi. Se il caricamento configurato fallisce (rete, timeout, CORS, dati non validi o nessuna riga per l'anno), la pagina conserva i dati locali e mostra un messaggio discreto. Non effettua polling: le modifiche del foglio vengono lette al successivo caricamento e possono risentire della cache di pubblicazione Google.

## GitHub Pages

1. Carica index.html nella cartella principale del repository. Gli altri file sono di supporto: index.html è autosufficiente.
2. Abilita la pubblicazione GitHub Pages dalla cartella contenente index.html nelle impostazioni del repository.
3. Usa l'indirizzo effettivo della pagina, tipicamente https://NOME.github.io/REPOSITORY/.

## WordPress

Copia wordpress.html in un blocco HTML personalizzato e sostituisci l'URL dell'iframe con quello effettivo di GitHub Pages. Lo script del parent controlla origine, finestra mittente e tipo di messaggio, poi adatta l'altezza anche quando i pannelli vengono richiusi. Il widget deduce l'origine WordPress dal referrer; se questo viene eliminato dalle impostazioni del sito, imposta CONFIG.parentOrigin all'origine esatta, per esempio https://ludica.dh.unica.it.

WordPress deve consentire iframe e script per il ruolo/piano utilizzato. Se rimuove il tag script, inserisci il listener tramite un'area autorizzata del tema o un plugin per codice personalizzato. Con il solo iframe resta l'altezza iniziale e può comparire lo scorrimento interno: non disabilitarlo, perché nasconderebbe parti della guida. Non è possibile adattare in modo affidabile un iframe di altra origine usando solo HTML o CSS del parent.

Più istanze nella stessa pagina richiedono ID diversi e il relativo listener per ciascuna. L'altezza iniziale è una riserva prima del messaggio; non è un limite massimo.

## Aggiornare l'edizione e lo stile

Nel blocco CONFIG all'inizio dello script modifica edizione, titolo, sottotitolo, accent, sfondo, csvUrl, mostraAree, mostraRicerca e aperti. CONFIG.edizioni permette impostazioni per anni diversi. Il cambio di anno non inventa nuovi contenuti: per anni diversi dal 2026 il fallback mostra testi da completare.

Nella prima regola CSS .ludica-widget trovi font, dimensione titolo, dimensione testo, dimensione card, dimensione voci, colori secondari, larghezza massima e raggio delle card. Non servono font esterni.

Override opzionali nell'URL:

- ?edizione=2026 seleziona l'anno e filtra le righe del CSV; le righe senza anno sono condivise.
- ?csv=URL_CODIFICATO sostituisce csvUrl. Codifica l'intero URL con encodeURIComponent, inclusi & e ?. ?csv= vuoto disabilita la fonte remota.
- ?sfondo=trasparente rende trasparente il fondo del documento iframe. Il fondo del documento esterno rimane quello deciso da WordPress.

Esempio per costruire un URL senza errori:

```js
const widget = new URL('https://NOME.github.io/REPOSITORY/index.html');
widget.searchParams.set('edizione', '2026');
widget.searchParams.set('csv', 'https://docs.google.com/spreadsheets/d/e/ID/pub?gid=0&output=csv');
console.log(widget.href);
```

## Riferimenti

- Google: https://support.google.com/docs/answer/183965?hl=it
- MDN postMessage: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
- MDN ResizeObserver: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
