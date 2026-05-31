# Poročilo Testov — Obvestila in Vpisi

| | |
|---|---|
| **Issue** | S4-10 |
| **Datum** | 31. 5. 2026 |
| **Framework** | JUnit 5 + Mockito |
| **Avtor** | Tilen Brunec |

---

## Pokrite komponente

| Razred | Vloga |
|---|---|
| `ObvestiloService` | Poslovna logika za ustvarjanje, pridobivanje in označevanje obvestil |
| `ObvestiloController` | REST endpointi za upravljanje obvestil |
| `VpisService` | Poslovna logika za vpis učencev v module |

---

## Statistika

| Razred | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `ObvestiloServiceTest` | 10 | 6 | 4 | 0 |
| `ObvestiloControllerTest` | 6 | 4 | 2 | 0 |
| `VpisServiceTest` | 12 | 6 | 2 | 4 |
| **Skupaj** | **28** | **16** | **8** | **4** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — prazni seznami, null vrednosti |
| ❌ **Napačen primer** | Napačni vhodi, neobstoječi zapisi |

---

## ObvestiloServiceTest

> Testi pokrivajo vso poslovno logiko v `ObvestiloService` — ustvarjanje obvestil, pridobivanje, štetje neprebranih ter označevanje kot prebrano.

---

### `ustvari_savesNotification` — ✅ Pravilen primer
> **Cilj:** Preveriti da se obvestilo pravilno shrani v repozitorij.

| | |
|---|---|
| **Vhod** | Veljavni `uporabnikId`, tip, naslov, sporočilo, povezava |
| **Pričakovan rezultat** | `save()` klican enkrat |

---

### `ustvari_savesWithCorrectFields` — ✅ Pravilen primer
> **Cilj:** Preveriti da so vsa polja pravilno nastavljena pri shranjevanju.

| | |
|---|---|
| **Vhod** | Tip `MODULE`, naslov, sporočilo |
| **Pričakovan rezultat** | Shranjeno obvestilo ima pravilne vrednosti, `jePrebrano = false` |

---

### `getMoja_returnsNotifications` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne seznam obvestil za uporabnika.

| | |
|---|---|
| **Vhod** | Veljavni `uporabnikId` z enim obvestilom |
| **Pričakovan rezultat** | Seznam z 1 elementom, naslov = `"Test notification"` |

---

### `getMoja_returnsEmptyWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne prazen seznam ko ni obvestil.

| | |
|---|---|
| **Vhod** | `uporabnikId` brez obvestil |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getStevilo_returnsCount` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne pravilno število neprebranih obvestil.

| | |
|---|---|
| **Vhod** | `uporabnikId` s 3 neprebranimi |
| **Pričakovan rezultat** | `3` |

---

### `getStevilo_returnsZeroWhenAllRead` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne 0 ko so vsa obvestila prebrana.

| | |
|---|---|
| **Vhod** | `uporabnikId` brez neprebranih |
| **Pričakovan rezultat** | `0` |

---

### `oznaciPrebrano_marksAsRead` — ✅ Pravilen primer
> **Cilj:** Preveriti da se obvestilo uspešno označi kot prebrano.

| | |
|---|---|
| **Vhod** | Veljavni `obvestiloId` z `jePrebrano = false` |
| **Pričakovan rezultat** | `save()` klican, `jePrebrano = true` |

---

### `oznaciPrebrano_doesNothingWhenNotFound` — ⚠️ Robni primer
> **Cilj:** Preveriti da sistem ne pade ko obvestilo ne obstaja.

| | |
|---|---|
| **Vhod** | Neobstoječi `obvestiloId` |
| **Pričakovan rezultat** | Brez napake, `save()` nikoli klican |

---

### `oznaciVsePrebrano_marksAllAsRead` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vsa obvestila označijo kot prebrana.

| | |
|---|---|
| **Vhod** | `uporabnikId` z dvema neprebranima obvestiloma |
| **Pričakovan rezultat** | `save()` klican dvakrat |

---

### `oznaciVsePrebrano_doesNothingWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda ne pade ko ni obvestil.

| | |
|---|---|
| **Vhod** | `uporabnikId` brez obvestil |
| **Pričakovan rezultat** | Brez napake, `save()` nikoli klican |

---

## ObvestiloControllerTest

> Testi pokrivajo vse REST endpointe za obvestila.

---

### `getMoja_returnsNotifications` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne seznam obvestil za prijavljenega uporabnika.

| | |
|---|---|
| **Vhod** | JWT z veljavnim `subject` |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `getMoja_returnsEmptyList` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint vrne prazen seznam ko ni obvestil.

| | |
|---|---|
| **Vhod** | JWT z veljavnim `subject`, brez obvestil |
| **Pričakovan rezultat** | HTTP 200, prazen seznam |

---

### `getStevilo_returnsCount` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne pravilno število neprebranih obvestil.

| | |
|---|---|
| **Vhod** | JWT z veljavnim `subject` |
| **Pričakovan rezultat** | HTTP 200, vrednost `5` |

---

### `getStevilo_returnsZero` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint vrne 0 ko ni neprebranih obvestil.

| | |
|---|---|
| **Vhod** | JWT z veljavnim `subject` |
| **Pričakovan rezultat** | HTTP 200, vrednost `0` |

---

### `oznaciPrebrano_returns200` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint označi obvestilo kot prebrano in vrne 200.

| | |
|---|---|
| **Vhod** | Veljavni `obvestiloId` |
| **Pričakovan rezultat** | HTTP 200, service metoda klicana enkrat |

---

### `oznaciVsePrebrano_returns200` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint označi vsa obvestila kot prebrana in vrne 200.

| | |
|---|---|
| **Vhod** | JWT z veljavnim `subject` |
| **Pričakovan rezultat** | HTTP 200, service metoda klicana enkrat |

---

## VpisServiceTest

> Testi pokrivajo vso poslovno logiko v `VpisService` — vpis z kodo, pridobivanje vpisov, posodobitev časa, odjavo in obvestila.

---

### `vpisZKodo_enrollsStudent` — ✅ Pravilen primer
> **Cilj:** Preveriti da se učenec uspešno vpiše v modul z veljavno kodo.

| | |
|---|---|
| **Vhod** | Veljavna koda vpisa `"TST-001"`, `ucenecId` |
| **Pričakovan rezultat** | DTO uspešno vrnjen, `save()` klican enkrat |

---

### `vpisZKodo_throwsWhenInvalidCode` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri napačni kodi vpisa.

| | |
|---|---|
| **Vhod** | Neveljavna koda `"INVALID"` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `vpisZKodo_throwsWhenAlreadyEnrolled` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem prepreči dvojni vpis učenca v isti modul.

| | |
|---|---|
| **Vhod** | Veljavna koda, učenec je že vpisan |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `vpisZKodo_sendsNotificationToProfessor` — ✅ Pravilen primer
> **Cilj:** Preveriti da profesor dobi obvestilo ob vpisu novega učenca.

| | |
|---|---|
| **Vhod** | Veljavna koda, nov učenec |
| **Pričakovan rezultat** | `ObvestiloService.ustvari()` klican za profesorja z tipom `MODULE` |

---

### `getMojiVpisi_returnsEnrollments` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne aktivne vpise učenca.

| | |
|---|---|
| **Vhod** | `ucenecId` z enim aktivnim vpisom |
| **Pričakovan rezultat** | Seznam z 1 elementom |

---

### `getMojiVpisi_returnsEmptyWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne prazen seznam ko učenec ni vpisan nikamor.

| | |
|---|---|
| **Vhod** | `ucenecId` brez vpisov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `posodobiCas_updatesCas` — ✅ Pravilen primer
> **Cilj:** Preveriti da se čas na modulu pravilno posodobi.

| | |
|---|---|
| **Vhod** | Veljaven vpis, `cas = 60` |
| **Pričakovan rezultat** | `save()` klican enkrat |

---

### `posodobiCas_throwsWhenNotEnrolled` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako ko vpis ne obstaja.

| | |
|---|---|
| **Vhod** | `ucenecId` ki ni vpisan |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `steviloVpisanih_returnsCount` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne pravilno število vpisanih učencev.

| | |
|---|---|
| **Vhod** | `predmetId` s 5 vpisanimi |
| **Pričakovan rezultat** | `5` |

---

### `steviloVpisanih_returnsZeroWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne 0 ko ni vpisanih učencev.

| | |
|---|---|
| **Vhod** | `predmetId` brez vpisanih |
| **Pričakovan rezultat** | `0` |

---

### `odjava_deactivatesEnrollment` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vpis uspešno deaktivira ob odjavi.

| | |
|---|---|
| **Vhod** | Veljavni `predmetId` in `ucenecId` |
| **Pričakovan rezultat** | `save()` klican, `jeAktiven = false` |

---

### `odjava_throwsWhenNotEnrolled` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri odjavi neobstoječega vpisa.

| | |
|---|---|
| **Vhod** | `ucenecId` ki ni vpisan |
| **Pričakovan rezultat** | `RuntimeException` |