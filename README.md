# Murals by Vaisgaard

Portfolio-side med vægmalerier. Hver mappe i `assets/images/` bliver vist som sit eget galleri på siden.

## Tilføj billeder og steder

### 1. Opret en mappe til stedet

Lav en ny mappe inde i `assets/images/`. Mappens navn bliver brugt som titel på galleriet.

```
assets/
└── images/
    ├── Hobbyhuset/
    ├── spaceman/
    ├── vikingslogo/
    └── Cafe Solsikken/     ← ny mappe
```

### 2. Læg billederne i mappen

Kopiér billederne ind i den nye mappe.

- Tilladte filtyper: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` og `.avif`
- Billederne vises i alfabetisk rækkefølge efter filnavn. Vil du styre rækkefølgen, kan du sætte et tal foran, fx `01-facade.jpg`, `02-detalje.jpg`.
- Filnavnet (uden `.jpg`) vises under billedet, når man åbner det i stor visning, så giv gerne filerne sigende navne.
- Billederne bliver beskåret til samme format (3:2) i oversigten. I stor visning ses hele billedet.
- Mapper uden billeder bliver ikke vist.

### 3. Giv galleriet en titel og beskrivelse (valgfrit)

Mappens navn bruges som titel. Første bogstav i hvert ord bliver gjort stort, og `-` og `_` bliver til mellemrum. Vil du have en anden titel, eller vise sted, år og en kort beskrivelse, så læg en fil med navnet `info.json` i mappen:

```json
{
  "title": "Café Solsikken",
  "place": "Aarhus",
  "year": "2025",
  "description": "Vægmaleri i caféens gård"
}
```

Alle felter kan udelades. Husk anførselstegn og kommaer præcis som i eksemplet, ellers bliver filen ignoreret.

### 4. Vis ændringerne på siden

**Med den lokale server (anbefalet):**

```
npm start
```

Åbn derefter **http://localhost:3000**. Siden læser mapperne igen, hver gang den genindlæses, så nye billeder og mapper kommer frem med det samme, når du trykker F5.

**Uden server (fx når siden skal lægges på et webhotel):**

```
npm run build
```

Det opdaterer filen `gallery-data.js` med det, der ligger i `assets/images/` lige nu. Kør kommandoen igen, hver gang du har tilføjet eller fjernet billeder, og upload derefter hele mappen inklusive `gallery-data.js`.

**Automatisk via GitHub:**

Siden bygges og udgives automatisk på GitHub Pages, hver gang der pushes til `main`. Du behøver altså kun at lægge billederne i mappen, committe og pushe, så opdaterer GitHub selv `gallery-data.js` og siden. Du kan følge med under fanen **Actions** på GitHub.

Første gang skal GitHub Pages slås til: gå til **Settings → Pages** på GitHub og vælg **GitHub Actions** under **Source**.

## Fjern billeder eller steder

Slet billedet eller hele mappen i `assets/images/`. Genindlæs siden, hvis serveren kører, eller kør `npm run build` igen.

## Krav

Kommandoerne kræver [Node.js](https://nodejs.org/) (version 18 eller nyere). Der skal ikke installeres andre pakker.
