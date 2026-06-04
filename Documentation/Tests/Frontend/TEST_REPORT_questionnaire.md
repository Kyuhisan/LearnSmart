# Poročilo Testov — VARK Vprašalnik

| | |
|---|---|
| **Issue** | S5-01 |
| **Datum** | 3. 6. 2026 |
| **Framework** | Vitest + React Testing Library |
| **Avtor** | Tilen Brunec |

---

## Pokrite komponente

| Komponenta | Vloga |
|---|---|
| `QuestionnaireWizard` | Večkoračni čarovnik za določitev učnega stila (VARK) |

---

## Statistika

| Testna datoteka | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `QuestionnaireWizard.test.tsx` | 6 | 5 | 1 | 0 |
| **Skupaj** | **6** | **5** | **1** | **0** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — onemogočen prehod brez izbire |
| ❌ **Napačen primer** | Napačni vhodi ali napake API klica |

---

## QuestionnaireWizard.test.tsx

> Testi pokrivajo uvodni zaslon vprašalnika in začetne interakcije — prikaz elementov, prehod na prvo vprašanje ter upravljanje stanja gumba NEXT. Kontekst `useAuth` je nadomeščen z `mock` objektom s privzetimi vrednostmi.

---

### `renders the intro screen with START ASSESSMENT button` — ✅ Pravilen primer
> **Cilj:** Preveriti da je gumb za začetek ocenjevanja prisoten na uvodnem zaslonu.

| | |
|---|---|
| **Vhod** | Privzeta upodobitev `QuestionnaireWizard` |
| **Pričakovan rezultat** | Gumb "START ASSESSMENT" je v DOM-u |

---

### `shows the HOW DO YOU LEARN? heading on the intro screen` — ✅ Pravilen primer
> **Cilj:** Preveriti da je uvodni naslov vprašalnika prikazan.

| | |
|---|---|
| **Vhod** | Privzeta upodobitev |
| **Pričakovan rezultat** | Element z vlogo `heading` in besedilom "HOW DO YOU LEARN?" je v DOM-u |

---

### `shows the VARK ASSESSMENT tag` — ✅ Pravilen primer
> **Cilj:** Preveriti da je identifikacijska oznaka vprašalnika prikazana.

| | |
|---|---|
| **Vhod** | Privzeta upodobitev |
| **Pričakovan rezultat** | Oznaka "VARK ASSESSMENT" je v DOM-u |

---

### `transitions to the first question after clicking START ASSESSMENT` — ✅ Pravilen primer
> **Cilj:** Preveriti da klik na START ASSESSMENT prikaže prvo vprašanje.

| | |
|---|---|
| **Vhod** | Klik na gumb "START ASSESSMENT" |
| **Pričakovan rezultat** | Indikator prvega vprašanja "Q01" je v DOM-u |

---

### `NEXT button is disabled when no option is selected` — ⚠️ Robni primer
> **Cilj:** Preveriti da ni mogoče napredovati brez izbire možnosti odgovora.

| | |
|---|---|
| **Vhod** | Prvo vprašanje odprto, nobena možnost ni izbrana |
| **Pričakovan rezultat** | Gumb "NEXT" ima atribut `disabled` |

---

### `NEXT button becomes enabled after selecting an option` — ✅ Pravilen primer
> **Cilj:** Preveriti da se gumb NEXT aktivira po izbiri možnosti.

| | |
|---|---|
| **Vhod** | Klik na eno od možnosti odgovorov |
| **Pričakovan rezultat** | Gumb "NEXT" nima atributa `disabled` |
