# Poročilo Testov — Vpisi

| | |
|---|---|
| **Issue** | S5-01 |
| **Datum** | 3. 6. 2026 |
| **Framework** | JUnit 5 + Mockito |
| **Avtor** | Tilen Brunec |

---

## Pokrite komponente

| Razred | Vloga |
|---|---|
| `VpisService` | Poslovna logika za vpis, odjavo, posodobitev časa in statistike učencev |
| `VpisController` | REST endpointi za upravljanje vpisov |

---

## Statistika

| Razred | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `VpisServiceTest` | 18 | 9 | 3 | 6 |
| `VpisControllerTest` | 16 | 9 | 3 | 4 |
| **Skupaj** | **34** | **18** | **6** | **10** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — prazni seznami, null vrednosti |
| ❌ **Napačen primer** | Neobstoječi ID, napačna koda, dvojni vpis |

---

## VpisServiceTest

> Testi pokrivajo vso poslovno logiko v `VpisService` — vpis z kodo, odjavo, posodabljanje časa na modulu, štetje vpisov, stil mix učencev ter pridobivanje učencev po modulih.

---

### `vpisZKodo_enrollsStudent` — ✅ Pravilen primer
> **Cilj:** Preveriti da se učenec uspešno vpiše v modul z veljavno kodo.

| | |
|---|---|
| **Vhod** | Veljavna koda `"ABC123"`, veljaven `ucenecId` |
| **Pričakovan rezultat** | `VpisResponseDTO` vrnjen, `save()` klican enkrat |

---

### `vpisZKodo_throwsWhenInvalidCode` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri vpisu z napačno kodo.

| | |
|---|---|
| **Vhod** | Neobstoječa koda `"WRONG"` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `vpisZKodo_throwsWhenAlreadyEnrolled` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri dvojnem vpisu.

| | |
|---|---|
| **Vhod** | Učenec že aktiven vpisan v modul |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `vpisZKodo_reactivatesInactiveEnrollment` — ⚠️ Robni primer
> **Cilj:** Preveriti da se neaktiven vpis reaktivira namesto ustvarjanja novega.

| | |
|---|---|
| **Vhod** | Učenec z neaktivnim vpisom, veljavna koda |
| **Pričakovan rezultat** | `save()` klican enkrat, vpis reaktiviran |

---

### `vpisZKodo_sendsNotificationToProfessor` — ✅ Pravilen primer
> **Cilj:** Preveriti da se ob vpisu pošlje obvestilo profesorju.

| | |
|---|---|
| **Vhod** | Veljavna koda, veljaven `ucenecId` |
| **Pričakovan rezultat** | `ustvari()` klican enkrat z vlogo `"MODULE"` |

---

### `getMojiVpisi_returnsEnrollments` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne vse aktivne vpise učenca.

| | |
|---|---|
| **Vhod** | Učenec z enim aktivnim vpisom |
| **Pričakovan rezultat** | Seznam z 1 elementom, `predmetId` ustreza |

---

### `getMojiVpisi_returnsEmptyWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko učenec nima vpisov.

| | |
|---|---|
| **Vhod** | `ucenecId` brez vpisov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `posodobiCas_updatesTime` — ✅ Pravilen primer
> **Cilj:** Preveriti da se čas na modulu pravilno posodobi.

| | |
|---|---|
| **Vhod** | Veljavni `predmetId`, `ucenecId`, `cas = 120` |
| **Pričakovan rezultat** | `save()` klican enkrat, DTO vrnjen |

---

### `posodobiCas_throwsWhenNotEnrolled` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri posodabljanju časa brez vpisa.

| | |
|---|---|
| **Vhod** | `ucenecId` brez aktivnega vpisa |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `steviloVpisanih_returnsCount` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne pravilno število vpisanih učencev.

| | |
|---|---|
| **Vhod** | `predmetId` s 5 vpisanimi učenci |
| **Pričakovan rezultat** | `5` |

---

### `steviloVpisanih_returnsZeroWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne 0, ko ni vpisanih učencev.

| | |
|---|---|
| **Vhod** | `predmetId` brez vpisov |
| **Pričakovan rezultat** | `0` |

---

### `getStilMix_returnsStyleCounts` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne pravilno porazdelitev učnih stilov učencev.

| | |
|---|---|
| **Vhod** | Učitelj z enim modulom, en učenec z stilom `"visual"` |
| **Pričakovan rezultat** | Mapa z ključi `visual`, `_total` |

---

### `getStilMix_returnsEmptyWhenNoModules` — ❌ Napačen primer
> **Cilj:** Preveriti da metoda vrne prazno mapo, ko učitelj nima modulov.

| | |
|---|---|
| **Vhod** | `uciteljId` brez modulov |
| **Pričakovan rezultat** | Prazna mapa |

---

### `getStudenti_returnsStudents` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne seznam učencev za profesorja.

| | |
|---|---|
| **Vhod** | Učitelj z enim modulom in enim vpisanim učencem |
| **Pričakovan rezultat** | Seznam z 1 elementom, ime = `"Test Student"` |

---

### `getStudenti_returnsEmptyWhenNoModules` — ❌ Napačen primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko učitelj nima modulov.

| | |
|---|---|
| **Vhod** | `uciteljId` brez modulov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getStudenti_returnsEmptyWhenNoEnrollments` — ❌ Napačen primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko moduli nimajo vpisanih učencev.

| | |
|---|---|
| **Vhod** | Modul brez vpisov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getStudentiPoModulih_returnsGrouped` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne učence grupirane po modulih.

| | |
|---|---|
| **Vhod** | Učitelj z enim modulom in enim vpisanim učencem |
| **Pričakovan rezultat** | Seznam z 1 elementom, naziv = `"Test Module"` |

---

### `getStudentiPoModulih_returnsEmptyWhenNoModules` — ❌ Napačen primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko učitelj nima modulov.

| | |
|---|---|
| **Vhod** | `uciteljId` brez modulov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `odjava_deactivatesEnrollment` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vpis pravilno deaktivira ob odjavi.

| | |
|---|---|
| **Vhod** | Veljavni `predmetId` in `ucenecId` z aktivnim vpisom |
| **Pričakovan rezultat** | `save()` klican enkrat |

---

### `odjava_throwsWhenNotEnrolled` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri odjavi brez aktivnega vpisa.

| | |
|---|---|
| **Vhod** | `ucenecId` brez aktivnega vpisa |
| **Pričakovan rezultat** | `RuntimeException` |

---

## VpisControllerTest

> Testi pokrivajo vse REST endpointe v `VpisController`.

---

### `vpisZKodo_enrollsStudent` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint uspešno vpiše učenca z veljavno kodo.

| | |
|---|---|
| **Vhod** | JWT učenca, koda `"ABC123"` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `vpisZKodo_throwsWhenInvalidCode` — ❌ Napačen primer
> **Cilj:** Preveriti da endpoint vrže napako pri napačni kodi.

| | |
|---|---|
| **Vhod** | JWT učenca, koda `"WRONG"` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `getMojiVpisi_returnsEnrollments` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne vse aktivne vpise učenca.

| | |
|---|---|
| **Vhod** | JWT učenca |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `getMojiVpisi_returnsEmptyList` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint vrne prazen seznam, ko učenec nima vpisov.

| | |
|---|---|
| **Vhod** | JWT učenca brez vpisov |
| **Pričakovan rezultat** | HTTP 200, prazen seznam |

---

### `posodobiCas_updatesTime` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint uspešno posodobi čas na modulu.

| | |
|---|---|
| **Vhod** | JWT učenca, `predmetId`, `cas = 120` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `posodobiCas_throwsWhenNotEnrolled` — ❌ Napačen primer
> **Cilj:** Preveriti da endpoint vrže napako pri posodabljanju časa brez vpisa.

| | |
|---|---|
| **Vhod** | JWT učenca brez aktivnega vpisa |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `steviloVpisanih_returnsCount` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne pravilno število vpisanih učencev.

| | |
|---|---|
| **Vhod** | Veljaven `predmetId` s 5 učenci |
| **Pričakovan rezultat** | HTTP 200, vrednost = `5` |

---

### `steviloVpisanih_returnsZero` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint vrne 0, ko ni vpisanih učencev.

| | |
|---|---|
| **Vhod** | `predmetId` brez vpisov |
| **Pričakovan rezultat** | HTTP 200, vrednost = `0` |

---

### `stilMix_returnsStyleCounts` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne porazdelitev učnih stilov.

| | |
|---|---|
| **Vhod** | JWT učitelja |
| **Pričakovan rezultat** | HTTP 200, mapa z `_total = 6` |

---

### `stilMix_returnsEmptyWhenNoModules` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint vrne prazno mapo, ko učitelj nima modulov.

| | |
|---|---|
| **Vhod** | JWT učitelja brez modulov |
| **Pričakovan rezultat** | HTTP 200, prazna mapa |

---

### `studenti_returnsStudentList` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne seznam učencev profesorja.

| | |
|---|---|
| **Vhod** | JWT učitelja |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `studenti_returnsEmptyWhenNoStudents` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint vrne prazen seznam, ko ni učencev.

| | |
|---|---|
| **Vhod** | JWT učitelja brez učencev |
| **Pričakovan rezultat** | HTTP 200, prazen seznam |

---

### `moduliStudenti_returnsGroupedStudents` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne učence grupirane po modulih.

| | |
|---|---|
| **Vhod** | JWT učitelja |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `moduliStudenti_returnsEmptyWhenNoModules` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint vrne prazen seznam, ko ni modulov.

| | |
|---|---|
| **Vhod** | JWT učitelja brez modulov |
| **Pričakovan rezultat** | HTTP 200, prazen seznam |

---

### `odjava_returnsNoContent` — ✅ Pravilen primer
> **Cilj:** Preveriti da se učenec uspešno odjavi iz modula.

| | |
|---|---|
| **Vhod** | JWT učenca, veljaven `predmetId` |
| **Pričakovan rezultat** | HTTP 204 |

---

### `odjava_throwsWhenNotEnrolled` — ❌ Napačen primer
> **Cilj:** Preveriti da endpoint vrže napako pri odjavi brez aktivnega vpisa.

| | |
|---|---|
| **Vhod** | JWT učenca brez aktivnega vpisa |
| **Pričakovan rezultat** | `RuntimeException` |