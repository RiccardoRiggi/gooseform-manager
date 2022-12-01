# Goose Form Manager
###### *"Alla Goose più coraggiosa che io conosca"*

 ![Homepage](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/goose-form.png)
 
Goose Form Manager è un gestionale sviluppato in React che, mediante la sua interfaccia utente intuitiva, aiuta nella generazione dei form e degli oggetti JSON compatibili con il motore di [Goose Form](https://github.com/RiccardoRiggi/gooseform). Per funzionare necessità anche della componente [Goose Form BE](https://github.com/RiccardoRiggi/gooseform-be). A questo [indirizzo](https://github.com/RiccardoRiggi/gooseform-manager) è possibile trovare l'elenco di tutte le funzionalità offerte dal motore di Goose Form, di seguito è disponibile una guida all'utilizzo del [Goose Form Manager](https://github.com/RiccardoRiggi/gooseform-manager).    

---
## Lista form 

![Lista form](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/lista-form.png)

La lista form consente di vedere l'elenco di tutti i form che sono stati inseriti all'interno del gestionale. Per ogni record vengono visualizzate alcune informazioni come l'identificativo. Dato un form è possibile generare il codice JSON compatibile con il motore di Goose Form, modificarlo oppure eliminarlo. Per creare un form basta cliccare sul pulsante in alto a destra.

---
## Generazione del JSON

![Generazione del JSON](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/generazione-json.png)

Dalla lista form è possibile generare l'oggetto JSON da dare in input al motore di Goose Form.

---
## Inserisci form

![Inserisci form](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/inserisci-form.png)

Gli elementi necessari per creare un form sono l'identificativo e il titolo. Si possono inserire una descrizione e un'icona. Per il pattern di tutte le icone fa fede la documentazione d Font Awesome Free.

---
## Scheda form

La scheda form consente di modificare le informazioni precedentemente inserite e di aggiungere ulteriori elementi, nel dettaglio: 

---
#### Scheda pulsanti

![Scheda pulsanti](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/lista-form.png)

Ciascun form disponde di un pulsante di RESET e di SUBMIT. L'etichetta e l'icona sono personalizzabili.

---
#### Scheda popup

![Scheda popup](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/scheda-popup.png)

Sia il form che ciascun componente dispongono di un'icona che, se cliccata, apre un popup contenente un testo. Si può inserire un titolo, una descrizione, un'icona e un tooltip visualizzabile al passaggio del mouse.

---
#### Scheda endpoint DATA

![Scheda endpoint](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/scheda-endpoint.png)

Considerato il concetto di chiave/valore spiegato all'interno della documentazione del motore di Goose Form, attraverso la scheda endpoint DATA è possibile configurare la chiamata ad un endpoint contenente i dati da mostrare all'interno del form. Bisogna inserire l'indirizzo, il method HTTP, il body e gli headers. La stessa scheda è disponibile per alcuni componenti (come la GooseSelect) per recuperare una lista di valori dinamici da un endpoint. La scheda endpoint SUBMIT contiene le istruzioni per configurare l'endpoint che riceverà i dati del form.

---
#### Lista componenti

![Lista componenti](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/lista-componenti.png)

Da questa tab è possibile visualizzare l'elenco dei componenti che sono stati configurati per il form selezionato. Per ogni componente è possibile accedere alla sua scheda oppure eliminarlo. In alto a destra è disponibile il pulsante per creare un nuovo componente.

---
#### Lista controlli

![Lista controlli](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/lista-controlli.png)

Da questa tab è possibile visualizzare l'elenco dei controlli di validazione configurati per il form selezionato. Alcuni controlli (come STANDARD - IN) offrono la possibilità di inserire una lista di valori. Per maggiori informazioni si rimanda alla documentazione del motore di Goose Form.

---
#### Lista render

![Lista render](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/lista-render.png)

Da questa tab è possibile visualizzare l'elenco dei render condizionali. Per maggiori informazioni si rimanda alla documentazione del motore di Goose Form.

---
## Inserisci componente

![Inserisci componente](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/inserisci-componente.png)

Da questa pagina, selezionato il form, è possibile inserire un nuovo componente. Sono richiesti l'identificativo univoco, una label, il tipo, il required mark e la larghezza rispetto alla pagina data la grandezza dello schermo. I valori di Width si riferiscono al sistema di column di Bootstrap 4, per maggiori informazioni si rimanda alla documentazione di Bootstrap.

---
## Scheda componente

La scheda componente consente di modificare le informazioni precedentemente inserite e di aggiungere ulteriori attributi al componente, nel dettaglio: 

---
#### Scheda endpoint DATA

![Scheda endpoint](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/scheda-endpoint.png)

Considerato che alcuni componenti (come la GooseSelect) offrono una lista di valori tra cui scegliere, attraverso la scheda endpoint DATA è possibile configurare la chiamata ad un endpoint per recuperarli. Bisogna inserire l'indirizzo, il method HTTP, il body e gli headers. In questo caso è necessario inserire anche gli attributi aggiuntivi keyName e valueName. Si rimanda alla documentazione di GooseForm.

---
#### Scheda valori statici

![Scheda valori statici](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/inserisci-chiave-valore.png)

Considerato che alcuni componenti (come la GooseSelect) offrono una lista di valori tra cui scegliere, è comunque possibile inserire la lista di questi valori in maniera statica all'interno del JSON di configurazione.

---
#### Scheda tooltip

![Scheda tooltip](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/inserisci-tooltip.png)

Per ogni componente è disponibile un'icona che, al passaggio del mouse, mostra un tooltip.

---
#### Scheda popup

![Scheda popup](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/scheda-popup.png)

Ciascun componente dispone di un'icona che, se cliccata, apre un popup contenente un testo. Si può inserire un titolo, una descrizione, un'icona e un tooltip visualizzabile al passaggio del mouse.

---
#### Scheda attributi aggiuntivi

![Scheda attributi aggiuntivi](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/inserisci-attributo-aggiuntivo.png)

Questa tab consente di inserire una serie di attributi specifici che dipendono dal tipo di componente selezionato.

---
## Inserisci controllo

![Inserisci controllo](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/inserisci-controllo.png)

Per ogni componente è possibile inserire dei controlli di validazione. Dato il tipo apparirà la lista dei controlli specifici. Si rimanda alla documentazione del motore di Goose Form per le informazioni dettagliate.

---
#### Scheda valori statici del controllo

![Inserisci valori controlli](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/inserisci-valori-controlli.png)

Alcuni controlli (ad esempio STANDARD - IN) si basano su una lista di valori di riferimento. Da questa pagina è possibile gestirli. 

---
## Inserisci render

![Inserisci render](https://raw.githubusercontent.com/RiccardoRiggi/gooseform-manager/main/screenshots/inserisci-render.png)

Per ogni componente è possibile inserire un render condizionale, ovvero disabilitare un campo oppure nasconderlo date determinate condizioni. Dato il tipo apparirà la lista dei render specifici. Si rimanda alla documentazione del motore di Goose Form per le informazioni dettagliate.

---

## Bom / Diba

[SB Admin 2 (Tema basato su Bootstrap 4)](https://startbootstrap.com/theme/sb-admin-2)

[Font Awesome](https://fontawesome.com/)

[React 18](https://it.reactjs.org/)

[Redux 7](https://redux.js.org/)

[React Router 6](https://reactrouter.com/en/main)

[Axios](https://www.npmjs.com/package/react-axios)

[react-markdown](https://github.com/remarkjs/react-markdown)

[remark-gfm](https://github.com/remarkjs/remark-gfm)

[Favicon e logo](https://www.iconfinder.com/icons/3316541/animal_ganco_goose_gooses_icon)

---

## Licenza

Il codice sorgente da me scritto viene rilasciato con licenza [MIT](https://github.com/RiccardoRiggi/gooseform-manager/blob/main/LICENSE), framework, temi e librerie di terze parti mantengono le loro relative licenze. 