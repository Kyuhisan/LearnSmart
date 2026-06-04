# Poročilo Testov — Izvorne Datoteke

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
| `IzvornaDatotekaService` | Poslovna logika za brisanje datotek in izračun SHA-256 hash vrednosti |
| `IzvornaDatotekaController` | REST endpointi za upravljanje izvornih datotek in nalaganje |

---

## Statistika

| Razred | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `IzvornaDatotekaServiceTest` | 7 | 4 | 1 | 2 |
| `IzvornaDatotekaControllerTest` | 13 | 7 | 2 | 4 |
| **Skupaj** | **20** | **11** | **3** | **6** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — prazna datoteka, prazen seznam |
| ❌ **Napačen primer** | Neobstoječa datoteka, napačen lastnik, duplikat |

---

## IzvornaDatotekaServiceTest

> Testi pokrivajo poslovno logiko v `IzvornaDatotekaService` — brisanje datotek z preverjanjem lastništva ter izračun SHA-256 hash vrednosti za preverjanje duplikatov.

---

### `deleteFile_deletesSuccessfully` — ✅ Pravilen primer
> **Cilj:** Preveriti da se datoteka uspešno izbriše iz shrambe in repozitorija.

| | |
|---|---|
| **Vhod** | Veljavni `fileId`, `profesorId` ki je lastnik datoteke |
| **Pričakovan rezultat** | `deleteFile()` in `deleteById()` klicana enkrat |

---

### `deleteFile_throwsWhenFileNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako, ko datoteka ne obstaja.

| | |
|---|---|
| **Vhod** | Neobstoječi `fileId` |
| **Pričakovan rezultat** | `IllegalArgumentException`, `deleteFile()` nikoli klican |

---

### `deleteFile_throwsWhenWrongOwner` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako, ko profesor ni lastnik datoteke.

| | |
|---|---|
| **Vhod** | Veljaven `fileId`, napačen `profesorId` |
| **Pričakovan rezultat** | `IllegalArgumentException`, `deleteFile()` nikoli klican |

---

### `calculateHash_returnsSha256Hash` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne veljavni SHA-256 hash (64 znakov).

| | |
|---|---|
| **Vhod** | Datoteka z vsebino `"hello world"` |
| **Pričakovan rezultat** | Hash dolžine 64 znakov |

---

### `calculateHash_returnsSameHashForSameContent` — ✅ Pravilen primer
> **Cilj:** Preveriti da dve datoteki z enako vsebino dobita enak hash.

| | |
|---|---|
| **Vhod** | Dve datoteki z enako vsebino `"same content"` |
| **Pričakovan rezultat** | `hash1 == hash2` |

---

### `calculateHash_returnsDifferentHashForDifferentContent` — ✅ Pravilen primer
> **Cilj:** Preveriti da dve datoteki z različno vsebino dobita različen hash.

| | |
|---|---|
| **Vhod** | Datoteka z `"content A"` in datoteka z `"content B"` |
| **Pričakovan rezultat** | `hash1 != hash2` |

---

### `calculateHash_handlesEmptyFile` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda pravilno obdela prazno datoteko.

| | |
|---|---|
| **Vhod** | Prazna datoteka (0 bajtov) |
| **Pričakovan rezultat** | Hash dolžine 64 znakov |

---

## IzvornaDatotekaControllerTest

> Testi pokrivajo vse REST endpointe v `IzvornaDatotekaController` — pridobivanje datotek, nalaganje z avtorizacijo, filtriranje vizualne vsebine in brisanje.

---

### `getMoje_returnsFiles` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne vse datoteke učitelja.

| | |
|---|---|
| **Vhod** | JWT učitelja z eno datoteko |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom, ime = `"test.pdf"` |

---

### `getMoje_returnsEmptyWhenNoFiles` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint vrne prazen seznam, ko učitelj nima datotek.

| | |
|---|---|
| **Vhod** | JWT učitelja brez datotek |
| **Pričakovan rezultat** | HTTP 200, prazen seznam |

---

### `upload_uploadsPdfFile` — ✅ Pravilen primer
> **Cilj:** Preveriti da se PDF datoteka uspešno naloži.

| | |
|---|---|
| **Vhod** | JWT lastnika, PDF datoteka, veljaven `predmetId` |
| **Pričakovan rezultat** | HTTP 200, `isSuccess() = true` |

---

### `upload_returnsErrorWhenModuleNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da endpoint vrne napako, ko modul ne obstaja.

| | |
|---|---|
| **Vhod** | JWT učitelja, neobstoječi `predmetId` |
| **Pričakovan rezultat** | HTTP 400, `isSuccess() = false` |

---

### `upload_returns403WhenWrongOwner` — ❌ Napačen primer
> **Cilj:** Preveriti da endpoint vrne 403, ko učitelj ni lastnik modula.

| | |
|---|---|
| **Vhod** | JWT napačnega učitelja |
| **Pričakovan rezultat** | HTTP 403, `isSuccess() = false` |

---

### `upload_returnsErrorWhenDuplicateFile` — ❌ Napačen primer
> **Cilj:** Preveriti da endpoint vrne napako pri nalaganju duplikata.

| | |
|---|---|
| **Vhod** | Datoteka z istim hash-om kot obstoječa |
| **Pričakovan rezultat** | HTTP 400, `isSuccess() = false` |

---

### `upload_detectsVideoType` — ✅ Pravilen primer
> **Cilj:** Preveriti da se video datoteka pravilno zazna in naloži.

| | |
|---|---|
| **Vhod** | MP4 datoteka z `video/mp4` MIME tipom |
| **Pričakovan rezultat** | HTTP 200, `isSuccess() = true` |

---

### `upload_detectsAudioType` — ✅ Pravilen primer
> **Cilj:** Preveriti da se audio datoteka pravilno zazna in naloži.

| | |
|---|---|
| **Vhod** | MP3 datoteka z `audio/mpeg` MIME tipom |
| **Pričakovan rezultat** | HTTP 200, `isSuccess() = true` |

---

### `getVisualContent_returnsImgAndVideo` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne samo IMG in VIDEO datoteke.

| | |
|---|---|
| **Vhod** | Modul z IMG, VIDEO in PDF datoteko |
| **Pričakovan rezultat** | HTTP 200, seznam z 2 elementoma (brez PDF) |

---

### `getVisualContent_returnsEmptyWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint vrne prazen seznam, ko ni datotek.

| | |
|---|---|
| **Vhod** | `predmetId` brez datotek |
| **Pričakovan rezultat** | HTTP 200, prazen seznam |

---

### `getVisualContent_filtersPdfOut` — ❌ Napačen primer
> **Cilj:** Preveriti da PDF datoteke niso vključene v vizualno vsebino.

| | |
|---|---|
| **Vhod** | Modul samo s PDF datoteko |
| **Pričakovan rezultat** | HTTP 200, prazen seznam |

---

### `delete_deletesFile` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint uspešno izbriše datoteko.

| | |
|---|---|
| **Vhod** | JWT lastnika, veljaven `fileId` |
| **Pričakovan rezultat** | HTTP 204, `deleteFile()` klican enkrat |

---

### `delete_returns500OnError` — ❌ Napačen primer
> **Cilj:** Preveriti da endpoint vrne 500 ob napaki pri brisanju.

| | |
|---|---|
| **Vhod** | `fileId` ki sproži napako v storitvi |
| **Pričakovan rezultat** | HTTP 500 |