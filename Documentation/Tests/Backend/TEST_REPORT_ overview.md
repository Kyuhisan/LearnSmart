# Pregled Testov — LearnSmart Backend

| | |
|---|---|
| **Issue** | S5-01 |
| **Datum** | 29. 5. 2026 |
| **Framework** | JUnit 5 + Mockito |
| **Ciljna pokritost** | ≥ 80% |
| **Avtor** | Tilen Brunec |

---

## Metodologija testiranja

Vsi testi so implementirani kot **unit testi** z uporabo **Mockito** ogrodja. To pomeni:

- ✅ Brez pravih povezav na bazo — vse je simulirano z `mock` objekti
- ✅ Testi so neodvisni drug od drugega
- ✅ Hitro izvajanje — ni odvisnosti od zunanjih storitev
- ✅ Baza in podatki ostanejo nedotaknjeni

---

## Skupna statistika

| Razred | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen | Poročilo |
|---|:---:|:---:|:---:|:---:|---|
| `PredmetServiceTest` | 16 | 6 | 2 | 8 | [TEST_REPORT_predmeti.md](TEST_REPORT_predmeti.md) |
| `PredmetMapperTest` | 3 | 2 | 1 | 0 | [TEST_REPORT_predmeti.md](TEST_REPORT_predmeti.md) |
| `PredmetControllerTest` | 11 | 6 | 0 | 5 | [TEST_REPORT_predmeti.md](TEST_REPORT_predmeti.md) |
| `AuthControlerTest` | 5 | 1 | 2 | 2 | [TEST_REPORT_auth.md](TEST_REPORT_auth.md) |
| `UserServiceTest` | 2 | 0 | 0 | 2 | [TEST_REPORT_auth.md](TEST_REPORT_auth.md) |
| `GeminiServiceTest` | 6 | 3 | 2 | 1 | [TEST_REPORT_ai.md](TEST_REPORT_ai.md) |
| `AiControllerTest` | 4 | 2 | 2 | 0 | [TEST_REPORT_ai.md](TEST_REPORT_ai.md) |
| `QuizServiceTest` | 32 | 16 | 4 | 12 | [TEST_REPORT_quiz.md](TEST_REPORT_quiz.md) |
| `QuizControllerTest` | 24 | 12 | 0 | 12 | [TEST_REPORT_quiz.md](TEST_REPORT_quiz.md) |
| `LearnSmartApplicationTests` | 1 | 1 | 0 | 0 | — |
| **Skupaj** | **104** | **49** | **13** | **42** | |

---

## Statistika po vrsti testov

```
Skupaj testov:    104
✅ Pravilen:      49  (47%)
⚠️ Robni:         13  (13%)
❌ Napačen:       42  (40%)
```

---

## Statistika po področjih

| Področje | Testov | Delež |
|---|:---:|:---:|
| Upravljanje modulov | 30 | 29% |
| Avtentikacija in registracija | 7 | 7% |
| AI klasifikacija | 10 | 10% |
| Upravljanje kvizov | 56 | 54% |
| Aplikacijski test | 1 | 1% |

---

## Legenda vrst testov

| Oznaka | Pomen | Primer |
|---|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano | Učitelj ustvari modul, API vrne 200 |
| ⚠️ **Robni primer** | Mejni pogoji — prazni podatki, null vrednosti | Nov učitelj brez modulov dobi prazen seznam |
| ❌ **Napačen primer** | Napačni vhodi ali kršitev pravil | Učenec poskusi ustvariti modul → 403 |

---

## Pokrita tveganja

| Tveganje | Pokrito | Kako |
|---|:---:|---|
| Nepooblaščen dostop do modulov | ✅ | Testi za vsak endpoint z vlogo `ucenec` |
| Urejanje tujega modula | ✅ | `update/delete/publish_throwsWhenWrongOwner` |
| Neobstoječ modul | ✅ | `*_throwsWhenNotFound` testi |
| Nedosegljiv Supabase | ✅ | `UserService` in `AuthControler` testi |
| Napaka Gemini API | ✅ | `classify_fallsBackToCount*` testi |
| Null vrednosti v JWT | ✅ | `getCurrentUser_handlesNull*` testi |
| Anonimni AI klic | ✅ | `classifyStyle_skipsPersistedWhenJwtNull` |
| Generiranje brez transkripta | ✅ | `generiraj_throwsWhenNoTranscript` |
| Nepooblaščen dostop do kvizov | ✅ | Testi za vsak endpoint z vlogo `ucenec` |
| Napačni odgovori v kvizu | ✅ | `shraniRezultat_calculatesZeroWhenAllWrong` |
| Kviz brez vprašanj | ✅ | `shraniRezultat_handlesEmptyQuiz` |
| Prekoračitev lestvice | ✅ | `getTopStudents_limitsToFive` |

---

## Podrobna poročila

- 📄 [TEST_REPORT_predmeti.md](TEST_REPORT_predmeti.md) — Moduli, mapper, controller
- 📄 [TEST_REPORT_auth.md](TEST_REPORT_auth.md) — Avtentikacija, registracija, učni stil
- 📄 [TEST_REPORT_ai.md](TEST_REPORT_ai.md) — Gemini AI klasifikacija
- 📄 [TEST_REPORT_quiz.md](TEST_REPORT_quiz.md) — Kvizi, vprašanja, rezultati