# Blomst-animation: rækkefølge

Denne fil beskriver **i hvilken rækkefølge** de forskellige dele af Sprogblomsten animeres, når siden loades. Lav indekset **0** = først, **6** = sidst.

---

## Nuværende rækkefølge (først → sidst)

Overlap-regionerne kommer først (0–2), derefter centrum og kronblade. Hele blomst-animationen afsluttes omkring **1,3 s**.

| Index | Farve (hex)   | Region / betydning              | Forsinkelse (CSS) |
|-------|---------------|----------------------------------|-------------------|
| **0** | `#FFC8A1`     | Fag- og akademisk sprog         | 0 s               |
| **1** | `#B0CAE3`     | Hverdags- og akademisk sprog    | 0,15 s            |
| **2** | `#B3E7CB`     | Fag- og hverdagssprog          | 0,3 s             |
| **3** | `#B3E8D0`     | **Sprog i EUD** (centrum)       | 0,45 s            |
| **4** | `#FEEFAE`     | Fagsprog                        | 0,6 s             |
| **5** | `#B0F0F2`     | Hverdagssprog                   | 0,75 s            |
| **6** | `#FEB5E2`     | Akademisk sprog                 | 0,9 s             |

- **Petal-animation:** 0,4 s pr. del (sidste del slutter ved 0,9 + 0,4 = **1,3 s**).
- **Tekstlabels** fader ind med forsinkelse 1,2 s.

---

## Sådan ændrer du rækkefølgen

### 1. JavaScript: hvilken farve der er “index 0”, “index 1”, osv.

**Fil:** `js/app.js`  
**Konstant:** `BLOOM_FILL_ORDER`

Rækkefølgen i arrayet = animeringsrækkefølge. Første farve = index 0 (kommer først), sidste = index 6 (kommer sidst).

```javascript
const BLOOM_FILL_ORDER = ['#FFC8A1', '#B0CAE3', '#B3E7CB', '#B3E8D0', '#FEEFAE', '#B0F0F2', '#FEB5E2'];
```

- **Ændre rækkefølge:** Flyt farverne (hex-værdierne) rundt i arrayet. Den, du vil have først, skal stå først i listen.
- **Bemærk:** Alle syv farver skal stadig være med; det er kun rækkefølgen du ændrer.

### 2. CSS: forsinkelse for hvert index (valgfrit)

**Fil:** `css/styles.css`  
**Klasser:** `.bloom-petal-0` … `.bloom-petal-6`

Her styrer du **hvornår** hver del starter (animation-delay). Index 0 skal typisk have `0s`; de andre kan justeres, så tiden mellem hver del passer til dig.

```css
.diagram-svg path.bloom-petal-0 { animation-delay: 0s; }
.diagram-svg path.bloom-petal-1 { animation-delay: 0.15s; }
.diagram-svg path.bloom-petal-2 { animation-delay: 0.3s; }
/* ... osv. (hele animationen ~1,3 s) */
```

- **Ændre timing:** Sæt f.eks. `0.1s`, `0.15s`, `0.3s` – lavere tal = tidligere start.
- **Længere mellemrum:** Brug større forskel mellem tallene (f.eks. 0s, 0.25s, 0.5s, 0.75s …).

---

## Oversigt: farve → region

| Hex       | Region                         |
|-----------|--------------------------------|
| `#B3E8D0` | Sprog i EUD (centrum)         |
| `#FEEFAE` | Fagsprog                      |
| `#B0F0F2` | Hverdagssprog                 |
| `#FEB5E2` | Akademisk sprog               |
| `#FFC8A1` | Fag- og akademisk sprog       |
| `#B0CAE3` | Hverdags- og akademisk sprog  |
| `#B3E7CB` | Fag- og hverdagssprog        |

Ændr kun **rækkefølgen** i `BLOOM_FILL_ORDER` i `js/app.js` for at bestemme, hvad der animeres først og sidst. Forsinkelserne i CSS bruges til at finjustere *tidspunktet* for hver del.
