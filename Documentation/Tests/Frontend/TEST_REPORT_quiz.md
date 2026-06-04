# Poročilo Testov — Kvizi

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
| `StudentQuiz` | Vozlišče kviznov — seznam razpoložljivih kviznov in zgodovina |
| `QuizSession` | Seja reševanja kviza — uvod, vprašanja, rezultat |

---

## Statistika

| Testna datoteka | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `StudentQuiz.test.tsx` | 8 | 6 | 2 | 0 |
| `QuizSession.test.tsx` | 7 | 6 | 1 | 0 |
| **Skupaj** | **15** | **12** | **3** | **0** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — stanje nalaganja, prazen seznam, mejna vrednost poskusov |
| ❌ **Napačen primer** | Napačni vhodi ali napake API klica |

---

## StudentQuiz.test.tsx

> Testi pokrivajo vozlišče kviznov — prikaz statistik, seznam razpoložljivih kviznov in zgodovino reševanja. Komponenta `QuizSession` je nadomeščena z `mock` različico, da se prepreči zagon celotnega toka reševanja. MSW simulira `GET /kvizi/moji` in `GET /kvizi/rezultati/moji`.

---

### `renders the stat cards panel` — ✅ Pravilen primer
> **Cilj:** Preveriti da so statistične kartice prisotne pri upodobitvi.

| | |
|---|---|
| **Vhod** | Privzeta MSW konfiguracija (prazni kvizi in rezultati) |
| **Pričakovan rezultat** | Kartice z naslovi "AVG SCORE", "BEST SCORE" in "COMPLETED" so v DOM-u |

---

### `renders the AVAILABLE QUIZZES panel` — ✅ Pravilen primer
> **Cilj:** Preveriti da je plošča razpoložljivih kviznov prisotna.

| | |
|---|---|
| **Vhod** | Privzeta MSW konfiguracija |
| **Pričakovan rezultat** | Naslov "AVAILABLE QUIZZES" je v DOM-u |

---

### `renders the QUIZ HISTORY panel` — ✅ Pravilen primer
> **Cilj:** Preveriti da je plošča zgodovine kviznov prisotna.

| | |
|---|---|
| **Vhod** | Privzeta MSW konfiguracija |
| **Pričakovan rezultat** | Naslov "QUIZ HISTORY" je v DOM-u |

---

### `shows "No quizzes available yet" when the quizzes list is empty` — ⚠️ Robni primer
> **Cilj:** Preveriti prikaz praznega stanja, ko učenec nima razpoložljivih kviznov.

| | |
|---|---|
| **Vhod** | `GET /kvizi/moji` vrne prazen seznam `[]` |
| **Pričakovan rezultat** | Sporočilo "No quizzes available yet" je v DOM-u |

---

### `displays a published quiz card with START button on first attempt` — ✅ Pravilen primer
> **Cilj:** Preveriti da se objavljeni kviz prikaže z gumbom START pri prvem poskusu.

| | |
|---|---|
| **Vhod** | `/kvizi/moji` vrne objavljen kviz "Algebra Quiz", `/kvizi/rezultati/moji` vrne `[]` |
| **Pričakovan rezultat** | Besedilo "Algebra Quiz" in gumb "START" sta v DOM-u |

---

### `shows RETRY button and best score after one completed attempt` — ✅ Pravilen primer
> **Cilj:** Preveriti da se po enem opravljenem poskusu gumb preimenuje v RETRY in prikaže najboljši rezultat.

| | |
|---|---|
| **Vhod** | En rezultat za kviz "quiz-1" z `odstotek: 80` |
| **Pričakovan rezultat** | Gumb "RETRY" in oznaka "BEST: 80%" sta v DOM-u |

---

### `shows "0 XP ON RETRY" tag after 3 or more attempts` — ⚠️ Robni primer
> **Cilj:** Preveriti da se po 3 ali več poskusih prikaže opozorilo o odsotnosti nagrade XP.

| | |
|---|---|
| **Vhod** | Trije rezultati za isti kviz v `rezultati/moji` |
| **Pričakovan rezultat** | Oznaka "0 XP ON RETRY" je v DOM-u |

---

### `shows completed quiz results in QUIZ HISTORY` — ✅ Pravilen primer
> **Cilj:** Preveriti da se opravljeni kvizi prikažejo v zgodovini z imenom in rezultatom.

| | |
|---|---|
| **Vhod** | `/kvizi/rezultati/moji` vrne en rezultat z `kvizNaziv: "Algebra Quiz"`, `odstotek: 80` |
| **Pričakovan rezultat** | Besedilo "Algebra Quiz" in vrednost "80%" sta v DOM-u |

---

## QuizSession.test.tsx

> Testi pokrivajo sejo reševanja kviza — uvodnega zaslona, nalaganja vprašanj in prehoda na prvo vprašanje. Komponenta `Topbar` je nadomeščena z `mock` različico, ki upodobi naslov za testiranje. MSW simulira `GET /kvizi/:id/vprasanja`.

---

### `shows the quiz intro screen after questions load` — ✅ Pravilen primer
> **Cilj:** Preveriti da se uvodni zaslon prikaže po uspešni naložitvi vprašanj.

| | |
|---|---|
| **Vhod** | `/kvizi/:id/vprasanja` vrne eno vprašanje |
| **Pričakovan rezultat** | Gumb "START QUIZ" je v DOM-u |

---

### `passes the quiz name (uppercased) to the topbar` — ✅ Pravilen primer
> **Cilj:** Preveriti da se naziv kviza (z velikimi črkami) posreduje v naslovno vrstico.

| | |
|---|---|
| **Vhod** | Kviz z nazivom "Test Quiz" |
| **Pričakovan rezultat** | `Topbar` mock prikazuje naslov "TEST QUIZ" |

---

### `shows question count and time limit on the intro screen` — ✅ Pravilen primer
> **Cilj:** Preveriti da uvodni zaslon prikazuje število vprašanj in časovno omejitev.

| | |
|---|---|
| **Vhod** | Kviz s `casIzvajanja: 15` in enim vprašanjem v odgovoru |
| **Pričakovan rezultat** | Vidna sta "1 QUESTION" in "15 MIN" |

---

### `navigates to the first question after clicking START QUIZ` — ✅ Pravilen primer
> **Cilj:** Preveriti da klik na START QUIZ prikaže prvo vprašanje.

| | |
|---|---|
| **Vhod** | Uvodni zaslon naložen, klik na "START QUIZ" |
| **Pričakovan rezultat** | Besedilo vprašanja "What is 2 + 2?" je v DOM-u |

---

### `calls onClose when BACK is clicked on the intro screen` — ✅ Pravilen primer
> **Cilj:** Preveriti da klik BACK na uvodnem zaslonu pokliče callback za zapiranje seje.

| | |
|---|---|
| **Vhod** | Klik na gumb "BACK" na uvodnem zaslonu |
| **Pričakovan rezultat** | `onClose` mock funkcija je bila poklicana enkrat |

---

### `shows a loading state while questions are fetching` — ⚠️ Robni primer
> **Cilj:** Preveriti da se stanje nalaganja prikaže, medtem ko zahtevek za vprašanja čaka.

| | |
|---|---|
| **Vhod** | `/kvizi/:id/vprasanja` je v stanju čakanja (nikoli ne odgovori) |
| **Pričakovan rezultat** | Stanje nalaganja je v DOM-u (START QUIZ ni prikazan) |

---

### `shows answer options when on the question step` — ✅ Pravilen primer
> **Cilj:** Preveriti da so možnosti odgovorov prikazane po prehodu na vprašanje.

| | |
|---|---|
| **Vhod** | Uvodni zaslon naložen, klik na "START QUIZ" |
| **Pričakovan rezultat** | Vsaj ena možnost odgovora (npr. "3", "4", "5", "6") je v DOM-u |
