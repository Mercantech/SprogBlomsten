# Analyse: SprogBlomstenClean.svg – selvstændige elementer

SVG-filen er et **Venn-diagram** med tre ovaler (sprogtyper) og deres overlap. Her er de selvstændige elementtyper og deres rolle.

---

## 1. Overblik

| Egenskab | Værdi |
|----------|--------|
| **Størrelse** | 846 × 879 px (viewBox) |
| **Rod-element** | `<svg>` med `fill="none"` |
| **Antal &lt;path&gt;** | 31 |
| **Antal &lt;mask&gt;** | 4 |
| **Antal &lt;rect&gt;** | 1 (baggrund, fjernes i app) |

---

## 2. Baggrund

| Element | Beskrivelse |
|---------|-------------|
| **&lt;rect&gt;** | Fuldt dækkende rektangel `fill="#1E1E1E"`. Bruges som mørk baggrund i design, men **fjernes i JavaScript** (`setupSvg`) så diagrammet får sideens baggrund. |

---

## 3. De tre hovedovaler (kronblade)

Hver oval er bygget af **3 path-elementer**: ét med **fyld** (farve) og to med **stroke** (kontur).

### 3.1 Fagsprog (gul)

| # | Type | Farve/attribut | Rolle |
|---|------|----------------|--------|
| 1 | path | `fill="#FEEFAE"` | Ovalens fyld |
| 2 | path | `stroke="black"` | Hovedkontur |
| 3 | path | `stroke="black" stroke-opacity="0.2"` | Blød kontur |

**Placering i diagrammet:** Nederste oval (højre).

### 3.2 Hverdagssprog (lys blå/cyan)

| # | Type | Farve/attribut | Rolle |
|---|------|----------------|--------|
| 1 | path | `fill="#B0F0F2"` | Ovalens fyld |
| 2 | path | `stroke="black"` | Hovedkontur |
| 3 | path | `stroke="black" stroke-opacity="0.2"` | Blød kontur |

**Placering:** Øverste oval (højre).

### 3.3 Akademisk sprog (lys pink)

| # | Type | Farve/attribut | Rolle |
|---|------|----------------|--------|
| 1 | path | `fill="#FEB5E2"` | Ovalens fyld |
| 2 | path | `stroke="black"` | Hovedkontur |
| 3 | path | `stroke="black" stroke-opacity="0.2"` | Blød kontur |

**Placering:** Venstre oval.

---

## 4. Overlap-regioner (med masker)

De tre overlap-områder bruger **&lt;mask&gt;** til at skære formen præcist. Hver region har: 1 mask (med path indeni) + 1 path med fyld (+ evt. stroke-path).

### 4.1 Fag- og akademisk sprog

| Element | Id/attribut | Rolle |
|---------|-------------|--------|
| &lt;mask&gt; | `path-4-inside-1_7_2` | Definérer overlap-formen |
| path (i mask) | (uden fill i masken) | Form til masken |
| path | `fill="#FFC8A1" fill-opacity="0.8"` | Fyld (orange/lyserød) |
| path(er) | stroke | Kontur (samme mønster som ovenfor) |

### 4.2 Hverdags- og akademisk sprog

| Element | Id/attribut | Rolle |
|---------|-------------|--------|
| &lt;mask&gt; | `path-6-inside-2_7_2` | Overlap-form |
| path | `fill="#B0CAE3" fill-opacity="0.78"` | Fyld (lys blå) |

### 4.3 Fag- og hverdagssprog

| Element | Id/attribut | Rolle |
|---------|-------------|--------|
| &lt;mask&gt; | `path-8-inside-3_7_2` | Overlap-form |
| path | `fill="#B3E7CB" fill-opacity="0.88"` | Fyld (lys grøn) |

### 4.4 Centrum – Sprog i EUD

| Element | Id/attribut | Rolle |
|---------|-------------|--------|
| &lt;mask&gt; | `path-10-inside-4_7_2` | Centrum-form (alle tre ovaler overlap) |
| path | `fill="#B3E8D0"` | Fyld (lys mint/grøn) – **klikbar** i appen (viser/skjuler forløb) |

---

## 5. Tekstlabels (blomstens tekster)

Efter de farvede regioner kommer en række **path-elementer** der udgør **tekst konverteret til outlines** (glyphs):

- **Fyld:** mørk (`black`, `#000`, `#231F20`, `#2d3748` osv.)
- **Form:** komplekse `d="..."` med koordinater for bogstaver
- **Rolle:** Labels som f.eks. "Fagsprog", "Hverdagssprog", "Akademisk sprog", "Sprog i EUD" og andre tekster i diagrammet.

I appen får disse paths klassen **`svg-label`** (og **`bloom-label`** til animation), så de kan styles (fx lys tekst i mørk tema) og fade ind efter de farvede regioner.

---

## 6. Sammenfatning: selvstændige elementgrupper

| Gruppe | Antal elementer | Beskrivelse |
|--------|------------------|-------------|
| **Baggrund** | 1 rect | Mørk ramme (fjernes i JS) |
| **Tre kronblade** | 9 path (3 × 3) | Fyld + 2 konturer pr. oval |
| **Fire overlap/centrum** | 4 mask + 4+ path | Masker + fyld (+ konturer) for overlap og centrum |
| **Tekst** | 8+ path | Labels med mørk fyld |
| **I alt** | 1 rect, 4 mask, 31 path | |

---

## 7. Farve → region (reference)

| Hex | Region |
|-----|--------|
| `#FEEFAE` | Fagsprog |
| `#B0F0F2` | Hverdagssprog |
| `#FEB5E2` | Akademisk sprog |
| `#FFC8A1` | Fag- og akademisk sprog |
| `#B0CAE3` | Hverdags- og akademisk sprog |
| `#B3E7CB` | Fag- og hverdagssprog |
| `#B3E8D0` | Sprog i EUD (centrum) |

---

## 8. Brug i appen

- **Klikbare regioner:** Paths med disse fyld-farver får klassen `clickable` og `data-regionKey` (eller `center-toggle` for centrum).
- **Bloom-animation:** Samme paths får `bloom-petal` og `bloom-petal-0` … `bloom-petal-6` efter rækkefølgen i `BLOOM_FILL_ORDER`.
- **Tekst:** Paths med mørk fyld (black/#000/…) får `svg-label` og `bloom-label` til styling og animation.
