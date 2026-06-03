# Poročilo Testov — Upravljanje Modulov

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
| `StudentModules` | Stran modulov za učenca — vpisi in javni katalog |
| `ProfessorModules` | Stran modulov za učitelja — CRUD in upravljanje objave |
| `moduleApi.ts` | HTTP odjemalec za vse klice na API modulov in vpisov |

---

## Statistika

| Testna datoteka | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `StudentModules.test.tsx` | 8 | 6 | 2 | 0 |
| `ProfessorModules.test.tsx` | 11 | 11 | 0 | 0 |
| `moduleApi.test.ts` | 13 | 13 | 0 | 0 |
| **Skupaj** | **32** | **30** | **2** | **0** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — prazni vpisi, vsi moduli vpisani |
| ❌ **Napačen primer** | Napačni vhodi ali kršitev pravil |

---

## StudentModules.test.tsx

> Testi pokrivajo stran modulov za učenca. Preverja se ločevanje vpisanih modulov od ostalih, iskanje in interakcija z modalnim oknom za vpis. MSW strežnik simulira `GET /moduli` in `GET /vpisi/moji`. Komponenti `Topbar` in `JoinModuleModal` sta nadomeščeni z `mock` različicami — `Topbar` upodobi `actions` prop, da je gumb za vpis dostopen.

---

### `renders the MY MODULES section` — ✅ Pravilen primer
> **Cilj:** Preveriti da je sekcija vpisanih modulov prisotna.

| | |
|---|---|
| **Vhod** | En modul v vpisih, dva javna modula |
| **Pričakovan rezultat** | Naslov "MY MODULES" je v DOM-u |

---

### `renders the ALL MODULES section` — ✅ Pravilen primer
> **Cilj:** Preveriti da je sekcija vseh javnih modulov prisotna.

| | |
|---|---|
| **Vhod** | En modul v vpisih, dva javna modula |
| **Pričakovan rezultat** | Naslov "ALL MODULES" je v DOM-u |

---

### `places enrolled module under MY MODULES section` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vpisani modul upodobi v sekciji MY MODULES in ne v ALL MODULES.

| | |
|---|---|
| **Vhod** | `vpisi/moji` vrne vpis za "Math Basics", `/moduli` vrne oba modula |
| **Pričakovan rezultat** | "Math Basics" se pojavi v DOM-u pred "ALL MODULES" elementom |

---

### `places non-enrolled module under ALL MODULES section` — ✅ Pravilen primer
> **Cilj:** Preveriti da se nevpisani modul upodobi v sekciji ALL MODULES.

| | |
|---|---|
| **Vhod** | `vpisi/moji` vrne samo vpis za "Math Basics" |
| **Pričakovan rezultat** | "Physics 101" se pojavi v DOM-u za "ALL MODULES" elementom |

---

### `search filters both sections simultaneously` — ✅ Pravilen primer
> **Cilj:** Preveriti da iskalni vnos filtrira module v obeh sekcijah hkrati.

| | |
|---|---|
| **Vhod** | Vnos "Physics" v iskalno polje |
| **Pričakovan rezultat** | "Math Basics" ni v DOM-u, "Physics 101" je v DOM-u |

---

### `shows "No other modules available" when all public modules are enrolled` — ⚠️ Robni primer
> **Cilj:** Preveriti prikaz praznega stanja, ko je učenec vpisan v vse razpoložljive module.

| | |
|---|---|
| **Vhod** | `/moduli` vrne samo "Math Basics", `vpisi/moji` vrne vpis za isti modul |
| **Pričakovan rezultat** | Sporočilo "No other modules available" je v DOM-u |

---

### `shows empty enrolled state when student has no enrollments` — ⚠️ Robni primer
> **Cilj:** Preveriti prikaz praznega stanja v MY MODULES, ko učenec ni vpisan v noben modul.

| | |
|---|---|
| **Vhod** | `vpisi/moji` vrne prazen seznam `[]` |
| **Pričakovan rezultat** | Sporočilo "haven't enrolled in any modules" je v DOM-u |

---

### `clicking JOIN MODULE WITH CODE button opens the join modal` — ✅ Pravilen primer
> **Cilj:** Preveriti da klik na gumb za vpis s kodo odpre modalno okno.

| | |
|---|---|
| **Vhod** | Klik na gumb "JOIN MODULE WITH CODE" |
| **Pričakovan rezultat** | Element z `data-testid="join-modal"` je v DOM-u |

---

## ProfessorModules.test.tsx

> Testi pokrivajo stran modulov za učitelja — nalaganje kartic, iskanje, upravljanje objave ter CRUD operacije z modalnimi okni. MSW simulira `GET /moduli/moji` in `DELETE /moduli/:id`. Komponenti `EditModuleModal` in `NewModuleModal` sta nadomeščeni z `mock` različicami. `Topbar` upodobi `actions` prop, da je gumb "+ NEW MODULE" dostopen.

---

### `renders YOUR MODULES section heading` — ✅ Pravilen primer
> **Cilj:** Preveriti da je naslov sekcije lastnih modulov prisoten.

| | |
|---|---|
| **Vhod** | Privzeti MSW handler za `/moduli/moji` |
| **Pričakovan rezultat** | Besedilo "YOUR MODULES" je v DOM-u |

---

### `renders loaded module cards` — ✅ Pravilen primer
> **Cilj:** Preveriti da se kartice modulov prikažejo po naložitvi.

| | |
|---|---|
| **Vhod** | `/moduli/moji` vrne modul z nazivom "Math Basics" |
| **Pričakovan rezultat** | Besedilo "Math Basics" je v DOM-u |

---

### `shows module DRAFT/LIVE status stamp` — ✅ Pravilen primer
> **Cilj:** Preveriti da neobjavljeni modul prikazuje žig statusa.

| | |
|---|---|
| **Vhod** | `/moduli/moji` vrne modul z `jeObjavljen: false` |
| **Pričakovan rezultat** | Besedilo "DRAFT" je v DOM-u |

---

### `shows PUBLISH button for a draft module` — ✅ Pravilen primer
> **Cilj:** Preveriti da neobjavljeni modul prikazuje gumb za objavo.

| | |
|---|---|
| **Vhod** | `/moduli/moji` vrne modul z `jeObjavljen: false` |
| **Pričakovan rezultat** | Gumb "PUBLISH" je v DOM-u |

---

### `shows UNPUBLISH button for a published module` — ✅ Pravilen primer
> **Cilj:** Preveriti da objavljeni modul prikazuje gumb za umik.

| | |
|---|---|
| **Vhod** | `/moduli/moji` vrne modul z `jeObjavljen: true` |
| **Pričakovan rezultat** | Gumb "UNPUBLISH" je v DOM-u |

---

### `search input filters visible modules` — ✅ Pravilen primer
> **Cilj:** Preveriti da iskalno polje filtrira prikaz učiteljevih modulov.

| | |
|---|---|
| **Vhod** | Dva modula ("Math Basics", "Physics 101"), vnos "Physics" v iskalno polje |
| **Pričakovan rezultat** | "Math Basics" ni v DOM-u, "Physics 101" je v DOM-u |

---

### `clicking DELETE shows the confirm dialog` — ✅ Pravilen primer
> **Cilj:** Preveriti da klik na DELETE prikaže potrditveni dialog z gumboma DELETE in CANCEL.

| | |
|---|---|
| **Vhod** | Klik na gumb "DELETE" na kartici modula |
| **Pričakovan rezultat** | Vidno je sporočilo "Are you sure you want to delete" ter gumba DELETE in CANCEL |

---

### `CANCEL in the confirm dialog closes it without calling the API` — ✅ Pravilen primer
> **Cilj:** Preveriti da klik CANCEL zapre dialog in ne sproži klica na API.

| | |
|---|---|
| **Vhod** | Odprt potrditveni dialog, klik na gumb "CANCEL" |
| **Pričakovan rezultat** | Dialog izgine, `DELETE /moduli/:id` ni bil klican |

---

### `confirming DELETE calls the delete API` — ✅ Pravilen primer
> **Cilj:** Preveriti da klik DELETE v dialogu sproži klic na brisanje modula.

| | |
|---|---|
| **Vhod** | Odprt potrditveni dialog, klik na potrditveni gumb "DELETE" |
| **Pričakovan rezultat** | `DELETE /moduli/mod-1` je bil klican |

---

### `clicking + NEW MODULE opens the new module modal` — ✅ Pravilen primer
> **Cilj:** Preveriti da gumb za nov modul odpre modalno okno za ustvarjanje.

| | |
|---|---|
| **Vhod** | Klik na gumb "+ NEW MODULE" |
| **Pričakovan rezultat** | Element z `data-testid="new-modal"` je v DOM-u |

---

### `clicking EDIT opens the edit module modal` — ✅ Pravilen primer
> **Cilj:** Preveriti da gumb EDIT odpre modalno okno za urejanje.

| | |
|---|---|
| **Vhod** | Klik na gumb "EDIT" na kartici modula |
| **Pričakovan rezultat** | Element z `data-testid="edit-modal"` je v DOM-u |

---

## moduleApi.test.ts

> Testi pokrivajo vse HTTP funkcije v `moduleApi.ts`. Vsak test ujame dejansko HTTP zahtevo z MSW in preveri pravilnost metode, URL-ja, glave `Authorization` ter telesa zahtevka. Testi ne preverjajo upodobitve — testirajo izključno HTTP sloj.

---

### `getModuliJavni — GET /moduli (no auth)` — ✅ Pravilen primer
> **Cilj:** Preveriti da javni seznam modulov ne pošlje avtorizacijske glave.

| | |
|---|---|
| **Vhod** | Klic `getModuliJavni()` brez tokena |
| **Pričakovan rezultat** | Zahtevek na `GET /moduli`, brez glave `Authorization` |

---

### `getModuliUcitelj — GET /moduli/moji with Bearer token` — ✅ Pravilen primer
> **Cilj:** Preveriti da klic za učiteljeve module vsebuje Bearer token.

| | |
|---|---|
| **Vhod** | Klic `getModuliUcitelj(TOKEN)` |
| **Pričakovan rezultat** | Zahtevek na `GET /moduli/moji` z glavo `Authorization: Bearer test-bearer-token` |

---

### `ustvariModul — POST /moduli with JSON body` — ✅ Pravilen primer
> **Cilj:** Preveriti da ustvarjanje modula pošlje pravilen POST z JSON telesom in avtorizacijo.

| | |
|---|---|
| **Vhod** | Klic `ustvariModul(TOKEN, { naziv, opis, tezavnost })` |
| **Pričakovan rezultat** | `POST /moduli` z `Content-Type: application/json`, Bearer tokenom in pravilnim telesom |

---

### `urediModul — PUT /moduli/:id` — ✅ Pravilen primer
> **Cilj:** Preveriti da urejanje modula pošlje PUT zahtevek na pravilen URL.

| | |
|---|---|
| **Vhod** | Klic `urediModul(TOKEN, "mod-42", { naziv: "Updated" })` |
| **Pričakovan rezultat** | `PUT /moduli/mod-42` z Bearer tokenom |

---

### `izbrisiModul — DELETE /moduli/:id` — ✅ Pravilen primer
> **Cilj:** Preveriti da brisanje modula pošlje DELETE zahtevek z avtorizacijo.

| | |
|---|---|
| **Vhod** | Klic `izbrisiModul(TOKEN, "mod-99")` |
| **Pričakovan rezultat** | `DELETE /moduli/mod-99` z glavo `Authorization: Bearer test-bearer-token` |

---

### `objaviModul — PATCH /moduli/:id/objavi` — ✅ Pravilen primer
> **Cilj:** Preveriti da objava modula pošlje PATCH na pravilen pot.

| | |
|---|---|
| **Vhod** | Klic `objaviModul(TOKEN, "mod-1")` |
| **Pričakovan rezultat** | `PATCH /moduli/mod-1/objavi` |

---

### `umaknjiModul — PATCH /moduli/:id/umakni` — ✅ Pravilen primer
> **Cilj:** Preveriti da umik objave modula pošlje PATCH na pravilen pot.

| | |
|---|---|
| **Vhod** | Klic `umaknjiModul(TOKEN, "mod-1")` |
| **Pričakovan rezultat** | `PATCH /moduli/mod-1/umakni` |

---

### `getMojiVpisi — GET /vpisi/moji with auth` — ✅ Pravilen primer
> **Cilj:** Preveriti da pridobivanje vpisov pošlje Bearer token.

| | |
|---|---|
| **Vhod** | Klic `getMojiVpisi(TOKEN)` |
| **Pričakovan rezultat** | Zahtevek z glavo `Authorization: Bearer test-bearer-token` |

---

### `vpisZKodo — POST /vpisi/vpis with kodaVpisa in body` — ✅ Pravilen primer
> **Cilj:** Preveriti da vpis s kodo pošlje kodo v telesu zahtevka.

| | |
|---|---|
| **Vhod** | Klic `vpisZKodo(TOKEN, "SECRET123")` |
| **Pričakovan rezultat** | `POST /vpisi/vpis` s telesom `{ kodaVpisa: "SECRET123" }` |

---

### `odjavaIzModula — DELETE /vpisi/:predmetId` — ✅ Pravilen primer
> **Cilj:** Preveriti da odjava iz modula pošlje DELETE na pravilen URL.

| | |
|---|---|
| **Vhod** | Klic `odjavaIzModula(TOKEN, "mod-5")` |
| **Pričakovan rezultat** | `DELETE /vpisi/mod-5` |

---

### `getStilMix — GET /vpisi/ucitelj/stilMix` — ✅ Pravilen primer
> **Cilj:** Preveriti da analitični klic za učne stile zadene pravilen URL.

| | |
|---|---|
| **Vhod** | Klic `getStilMix(TOKEN)` |
| **Pričakovan rezultat** | `GET /vpisi/ucitelj/stilMix` |

---

### `getTopStudents — GET /kvizi/ucitelj/topStudents` — ✅ Pravilen primer
> **Cilj:** Preveriti da klic za lestvico najboljših učencev zadene pravilen URL.

| | |
|---|---|
| **Vhod** | Klic `getTopStudents(TOKEN)` |
| **Pričakovan rezultat** | `GET /kvizi/ucitelj/topStudents` |

---

### `getKviziUcitelja — GET /kvizi/ucitelj/vsi` — ✅ Pravilen primer
> **Cilj:** Preveriti da klic za seznam učiteljevih kviznov vsebuje avtorizacijo in pravilen URL.

| | |
|---|---|
| **Vhod** | Klic `getKviziUcitelja(TOKEN)` |
| **Pričakovan rezultat** | `GET /kvizi/ucitelj/vsi` z glavo `Authorization: Bearer test-bearer-token` |
