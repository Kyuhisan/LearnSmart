# Poročilo Testov — UI Primitivne Komponente

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
| `ComicBtn` | Primitivni gumb — osnova za vse interaktivne elemente v aplikaciji |
| `Bar` | Naprednica — vizualni prikaz deleža z nastavljivo barvo in višino |
| `StatCard` | Statistična kartica — prikaz ene metrike z oznako, vrednostjo in podnapisom |
| `WakeBackend` | Ovitek za čakanje na zaledni sistem — anketa zdravstvenega preverjanja ob zagonu |

---

## Statistika

| Testna datoteka | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `ComicBtn.test.tsx` | 8 | 6 | 1 | 1 |
| `Bar.test.tsx` | 8 | 6 | 2 | 0 |
| `StatCard.test.tsx` | 9 | 9 | 0 | 0 |
| `WakeBackend.test.tsx` | 6 | 4 | 1 | 1 |
| **Skupaj** | **31** | **25** | **4** | **2** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — vrednost 0, prekoračitev, stanje čakanja |
| ❌ **Napačen primer** | Onemogočeni elementi, napaka zunanjega sistema |

---

## ComicBtn.test.tsx

> Testi pokrivajo osnovno vedenje gumba `ComicBtn` — upodobitev vsebine, klikanje, onemogočeno stanje in stilske različice (`sm`, `dark`, `color`). Testi so čisti komponentni testi brez MSW ali kontekstnih odvisnosti.

---

### `renders its children` — ✅ Pravilen primer
> **Cilj:** Preveriti da gumb upodobi vsebino, ki mu je bila posredovana.

| | |
|---|---|
| **Vhod** | `<ComicBtn>Click me</ComicBtn>` |
| **Pričakovan rezultat** | Gumb z besedilom "Click me" je v DOM-u |

---

### `calls onClick when clicked` — ✅ Pravilen primer
> **Cilj:** Preveriti da klik na gumb sproži podano funkcijo.

| | |
|---|---|
| **Vhod** | `onClick` mock funkcija, klik na gumb |
| **Pričakovan rezultat** | `onClick` je bila poklicana enkrat |

---

### `does not call onClick when disabled` — ❌ Napačen primer
> **Cilj:** Preveriti da onemogočen gumb ne sproži klicnega dogodka.

| | |
|---|---|
| **Vhod** | `<ComicBtn disabled onClick={mock}>`, klik na gumb |
| **Pričakovan rezultat** | `onClick` ni bila poklicana |

---

### `renders a disabled button when disabled prop is true` — ⚠️ Robni primer
> **Cilj:** Preveriti da je HTML atribut `disabled` prisoten na gumbu.

| | |
|---|---|
| **Vhod** | `<ComicBtn disabled>Save</ComicBtn>` |
| **Pričakovan rezultat** | Gumb ima atribut `disabled` |

---

### `applies smaller padding when sm prop is set` — ✅ Pravilen primer
> **Cilj:** Preveriti da različica `sm` nastavi manjšo velikost pisave kot privzeta.

| | |
|---|---|
| **Vhod** | Navadni gumb in gumb z `sm` prop vzporedno v DOM-u |
| **Pričakovan rezultat** | `style.fontSize` gumba `sm` se razlikuje od normalnega |

---

### `renders a white label when dark prop is set` — ✅ Pravilen primer
> **Cilj:** Preveriti da različica `dark` nastavi belo barvo besedila.

| | |
|---|---|
| **Vhod** | `<ComicBtn dark>Dark</ComicBtn>` |
| **Pričakovan rezultat** | `style.color` gumba je `rgb(255, 255, 255)` |

---

### `uses the provided color as background` — ✅ Pravilen primer
> **Cilj:** Preveriti da prop `color` nastavi ozadje gumba.

| | |
|---|---|
| **Vhod** | `<ComicBtn color="rgb(200, 100, 50)">` |
| **Pričakovan rezultat** | `style.background` gumba je `rgb(200, 100, 50)` |

---

### `renders type="submit" when type prop is submit` — ✅ Pravilen primer
> **Cilj:** Preveriti da gumb dobi HTML atribut `type="submit"` za uporabo v formah.

| | |
|---|---|
| **Vhod** | `<ComicBtn type="submit">Submit</ComicBtn>` |
| **Pričakovan rezultat** | Gumb ima atribut `type="submit"` |

---

## Bar.test.tsx

> Testi pokrivajo izračun in prikaz naprednice `Bar` — delež polnjenja, barvo in višino. Notranja struktura DOM-a je preverjena neposredno prek stilov na elementih. Testi so čisti komponentni testi brez MSW.

---

### `renders an inner fill div` — ✅ Pravilen primer
> **Cilj:** Preveriti da komponenta upodobi notranji element za polnjenje.

| | |
|---|---|
| **Vhod** | `<Bar value={50} />` |
| **Pričakovan rezultat** | Notranji `div` za polnjenje obstaja v DOM-u |

---

### `sets inner width to value% of max (default 100)` — ✅ Pravilen primer
> **Cilj:** Preveriti da je širina polnjenja izračunana kot delež privzetega maksimuma (100).

| | |
|---|---|
| **Vhod** | `<Bar value={75} />` |
| **Pričakovan rezultat** | `style.width` notranjega elementa je `75%` |

---

### `uses value/max ratio when max is specified` — ✅ Pravilen primer
> **Cilj:** Preveriti da je širina izračunana glede na podani maksimum.

| | |
|---|---|
| **Vhod** | `<Bar value={3} max={4} />` |
| **Pričakovan rezultat** | `style.width` je `75%` (3/4 = 75%) |

---

### `clamps fill width at 100% when value exceeds max` — ⚠️ Robni primer
> **Cilj:** Preveriti da vrednost, ki presega maksimum, ne povzroči prepolnjenja.

| | |
|---|---|
| **Vhod** | `<Bar value={150} max={100} />` |
| **Pričakovan rezultat** | `style.width` je `100%` |

---

### `shows 0% fill when value is 0` — ⚠️ Robni primer
> **Cilj:** Preveriti prikaz naprednice pri vrednosti nič.

| | |
|---|---|
| **Vhod** | `<Bar value={0} />` |
| **Pričakovan rezultat** | `style.width` notranjega elementa je `0%` |

---

### `applies the provided color to the inner fill div` — ✅ Pravilen primer
> **Cilj:** Preveriti da prop `color` nastavi ozadje notranjega elementa.

| | |
|---|---|
| **Vhod** | `<Bar value={50} color={C.green} />` |
| **Pričakovan rezultat** | `style.background` notranjega elementa je `rgb(133, 184, 143)` |

---

### `applies a numeric height in px` — ✅ Pravilen primer
> **Cilj:** Preveriti da numerična višina doda enoto `px`.

| | |
|---|---|
| **Vhod** | `<Bar value={50} height={12} />` |
| **Pričakovan rezultat** | `style.height` zunanjega elementa je `12px` |

---

### `applies a string height directly` — ✅ Pravilen primer
> **Cilj:** Preveriti da se niz za višino neposredno prenese v stil.

| | |
|---|---|
| **Vhod** | `<Bar value={50} height="1.5rem" />` |
| **Pričakovan rezultat** | `style.height` zunanjega elementa je `1.5rem` |

---

## StatCard.test.tsx

> Testi pokrivajo upodobitev statistične kartice — prikaz besedila, prisotnost CSS razredov in barvo ozadja. Testi so čisti komponentni testi brez MSW.

---

### `renders the label` — ✅ Pravilen primer
> **Cilj:** Preveriti da je oznaka kartice prikazana.

| | |
|---|---|
| **Vhod** | `<StatCard label="AVG SCORE" value="82%" sub="across all quizzes" />` |
| **Pričakovan rezultat** | Besedilo "AVG SCORE" je v DOM-u |

---

### `renders the value` — ✅ Pravilen primer
> **Cilj:** Preveriti da je vrednost kartice prikazana.

| | |
|---|---|
| **Vhod** | `<StatCard label="AVG SCORE" value="82%" sub="..." />` |
| **Pričakovan rezultat** | Besedilo "82%" je v DOM-u |

---

### `renders the sub-text` — ✅ Pravilen primer
> **Cilj:** Preveriti da je podbesedilo kartice prikazano.

| | |
|---|---|
| **Vhod** | `<StatCard label="..." value="..." sub="across all quizzes" />` |
| **Pričakovan rezultat** | Besedilo "across all quizzes" je v DOM-u |

---

### `renders a numeric value` — ✅ Pravilen primer
> **Cilj:** Preveriti da prop `value` sprejme številčni tip.

| | |
|---|---|
| **Vhod** | `<StatCard label="TOTAL" value={42} sub="quizzes" />` |
| **Pričakovan rezultat** | Besedilo "42" je v DOM-u |

---

### `applies the stat-card-label CSS class to the label element` — ✅ Pravilen primer
> **Cilj:** Preveriti da ima element z oznako prisoten CSS razred `stat-card-label`.

| | |
|---|---|
| **Vhod** | `<StatCard label="LABEL" value="V" sub="S" />` |
| **Pričakovan rezultat** | Element z razredom `.stat-card-label` vsebuje besedilo "LABEL" |

---

### `applies the stat-card-value CSS class to the value element` — ✅ Pravilen primer
> **Cilj:** Preveriti da ima element z vrednostjo prisoten CSS razred `stat-card-value`.

| | |
|---|---|
| **Vhod** | `<StatCard label="L" value="VALUE" sub="S" />` |
| **Pričakovan rezultat** | Element z razredom `.stat-card-value` vsebuje besedilo "VALUE" |

---

### `applies the stat-card-sub CSS class to the sub element` — ✅ Pravilen primer
> **Cilj:** Preveriti da ima element s podbesedilom prisoten CSS razred `stat-card-sub`.

| | |
|---|---|
| **Vhod** | `<StatCard label="L" value="V" sub="SUB TEXT" />` |
| **Pričakovan rezultat** | Element z razredom `.stat-card-sub` vsebuje besedilo "SUB TEXT" |

---

### `uses paper as the default background` — ✅ Pravilen primer
> **Cilj:** Preveriti da je privzeto ozadje kartice barva `paper` iz oblikovnih žetonov.

| | |
|---|---|
| **Vhod** | `<StatCard label="L" value="V" sub="S" />` (brez `bg` prop) |
| **Pričakovan rezultat** | `style.background` korenske komponente je `rgb(255, 253, 249)` (`C.paper`) |

---

### `accepts a custom background color` — ✅ Pravilen primer
> **Cilj:** Preveriti da prop `bg` nastavi barvo ozadja kartice.

| | |
|---|---|
| **Vhod** | `<StatCard label="L" value="V" sub="S" bg={C.cyanLt} />` |
| **Pričakovan rezultat** | `style.background` korenske komponente je `rgb(219, 238, 242)` (`C.cyanLt`) |

---

## WakeBackend.test.tsx

> Testi pokrivajo ovitek `WakeBackend`, ki anketa zdravstveni endpoint zalednega sistema ob zagonu aplikacije. MSW simulira `GET /health` z različnimi odgovori in stanjem čakanja za testiranje prehodov med stanji.

---

### `shows CONNECTING… while the first health check is in flight` — ⚠️ Robni primer
> **Cilj:** Preveriti da se začetno stanje preverjanja prikaže, dokler zahtevek čaka.

| | |
|---|---|
| **Vhod** | `GET /health` je v stanju čakanja (nikoli ne odgovori) |
| **Pričakovan rezultat** | Besedilo "CONNECTING…" je v DOM-u |

---

### `renders children immediately when health returns 200` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vsebina aplikacije prikaže, ko zaledni sistem odgovori z 200.

| | |
|---|---|
| **Vhod** | `GET /health` vrne status 200 |
| **Pričakovan rezultat** | Otroška komponenta (npr. `<div>App ready</div>`) je v DOM-u |

---

### `transitions to WAKING UP… when the first health check fails` — ❌ Napačen primer
> **Cilj:** Preveriti da se ob napaki zalednega sistema prikaže sporočilo o buđenju.

| | |
|---|---|
| **Vhod** | `GET /health` vrne status 503 |
| **Pričakovan rezultat** | Besedilo "WAKING UP…" je v DOM-u |

---

### `shows the speech bubble message while waking` — ✅ Pravilen primer
> **Cilj:** Preveriti da se sporočilo maskote BIT prikaže med buđenjem.

| | |
|---|---|
| **Vhod** | `GET /health` vrne 503, prehod v stanje buđenja |
| **Pričakovan rezultat** | Besedilo govorne oblačke (npr. "Waking up the server...") je v DOM-u |

---

### `shows elapsed seconds counter while in waking state` — ✅ Pravilen primer
> **Cilj:** Preveriti da se prikaže števec preteklih sekund med buđenjem.

| | |
|---|---|
| **Vhod** | Stanje buđenja po neuspešnem zdravstvenem preverjanju |
| **Pričakovan rezultat** | Besedilo s priponko "s" za sekunde je v DOM-u |

---

### `eventually renders children after polling succeeds` — ✅ Pravilen primer
> **Cilj:** Preveriti celoten prehod stanj: preverjanje → buđenje → pripravljeno.

| | |
|---|---|
| **Vhod** | `GET /health` najprej vrne 503, nato 200 pri ponovnem preverjanju |
| **Pričakovan rezultat** | Otroška komponenta je vidna po uspešnem ponovnem zdravstvenem preverjanju |
