# Poročilo Testov — AI Klasifikacija Učnega Stila

| | |
|---|---|
| **Issue** | S5-01 |
| **Datum** | 23. 5. 2026 |
| **Framework** | JUnit 5 + Mockito |
| **Avtor** | Tilen Brunec |

---

## Pokrite komponente

| Razred | Vloga |
|---|---|
| `GeminiService` | Klasifikacija učnega stila z Gemini AI + rezervna logika |
| `AiController` | REST endpoint za klasifikacijo, shranjevanje rezultata |

---

## Statistika

| Razred | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `GeminiServiceTest` | 6 | 3 | 2 | 1 |
| `AiControllerTest` | 4 | 2 | 2 | 0 |
| **Skupaj** | **10** | **5** | **4** | **1** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — prazen seznam, anonimni uporabnik, napaka servisa |
| ❌ **Napačen primer** | Neveljavni vhodi ali napačna struktura odgovora |

---

## GeminiServiceTest

> Testi pokrivajo klasifikacijo učnih stilov z Gemini AI in rezervni mehanizem štetja odgovorov (`countFallback`). Ker API klic na Gemini v testnem okolju ni dosegljiv, se testi osredotočajo na rezervno logiko in pomožne metode.

---

### `classify_fallsBackToCountWhenGeminiUnavailable` — ⚠️ Robni primer
> **Cilj:** Preveriti da servis ob nedosegljivosti Gemini API-ja pravilno preklopi na rezervno klasifikacijo na podlagi štetja odgovorov.

| | |
|---|---|
| **Vhod** | Odgovori `["visual", "visual", "reading", "kinesthetic"]` |
| **Pričakovan rezultat** | Stil `"visual"` (najpogostejši odgovor) |

---

### `classify_returnsCorrectDominantStyle` — ✅ Pravilen primer
> **Cilj:** Preveriti da rezervna klasifikacija pravilno identificira prevladujoči učni stil iz seznama odgovorov.

| | |
|---|---|
| **Vhod** | Odgovori `["kinesthetic", "kinesthetic", "kinesthetic", "visual"]` |
| **Pričakovan rezultat** | Stil `"kinesthetic"` |

---

### `classify_handlesEmptyAnswers` — ⚠️ Robni primer
> **Cilj:** Preveriti da servis ne pade pri praznem seznamu odgovorov — npr. ko uporabnik ne odgovori na nobeno vprašanje.

| | |
|---|---|
| **Vhod** | Prazen seznam `[]` |
| **Pričakovan rezultat** | Vrnjeni objekt ni `null` |

---

### `extractText_returnsTextFromValidBody` — ✅ Pravilen primer
> **Cilj:** Preveriti da pomožna metoda pravilno izvleče besedilo iz veljavnega Gemini API odgovora.

| | |
|---|---|
| **Vhod** | Veljavna mapa z `candidates → content → parts → text` strukturo |
| **Pričakovan rezultat** | `"VISUAL"` |

---

### `extractText_returnsUncategorizedOnInvalidBody` — ❌ Napačen primer
> **Cilj:** Preveriti da pomožna metoda ne pade pri neveljavnem ali praznem telesu odgovora.

| | |
|---|---|
| **Vhod** | Prazna mapa `{}` |
| **Pričakovan rezultat** | `"UNCATEGORIZED"` |

---

### `countFallback_returnsCorrectConfidence` — ✅ Pravilen primer
> **Cilj:** Preveriti da rezervna klasifikacija pravilno izračuna zaupanje na podlagi razmerja odgovorov.

| | |
|---|---|
| **Vhod** | Odgovori `["visual", "visual", "visual", "reading"]` |
| **Pričakovan rezultat** | Stil `"visual"`, zaupanje > `0.5` |

---

## AiControllerTest

> Testi pokrivajo `POST /ai/classify-style` endpoint. Posebna pozornost je namenjena shranjevanju rezultata v profil in odpornosti ob napakah v `UserService`.

---

### `classifyStyle_returnsLearningStyle` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint uspešno vrne klasificiran učni stil iz `GeminiService`.

| | |
|---|---|
| **Vhod** | Seznam odgovorov `["visual", "visual", "reading"]`, brez JWT |
| **Pričakovan rezultat** | HTTP 200, stil `"visual"` |

---

### `classifyStyle_persistsStyleWhenJwtPresent` — ✅ Pravilen primer
> **Cilj:** Preveriti da se učni stil shrani v uporabnikov profil, ko je JWT prisoten.

| | |
|---|---|
| **Vhod** | Odgovori `["kinesthetic", "kinesthetic"]`, JWT z `subject = "user-123"` |
| **Pričakovan rezultat** | `updateLearningStyle()` klican enkrat z `"user-123"` in `"kinesthetic"` |

---

### `classifyStyle_skipsPersistedWhenJwtNull` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint deluje brez shranjevanja, ko JWT ni prisoten — anonimni uporabnik.

| | |
|---|---|
| **Vhod** | Odgovori `["reading"]`, `jwt = null` |
| **Pričakovan rezultat** | `updateLearningStyle()` ni klican |

---

### `classifyStyle_continuesWhenUserServiceFails` — ⚠️ Robni primer
> **Cilj:** Preveriti da napaka pri shranjevanju ne prekine klasifikacije — rezultat se vrne kljub napaki v `UserService`.

| | |
|---|---|
| **Vhod** | Odgovori `["visual"]`, JWT prisoten, `UserService` vrže `RuntimeException` |
| **Pričakovan rezultat** | HTTP 200, klasifikacija uspešno vrnjena kljub napaki |
