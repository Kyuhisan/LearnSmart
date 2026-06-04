# Pregled Testov — LearnSmart Frontend

| | |
|---|---|
| **Issue** | S5-01 |
| **Datum** | 3. 6. 2026 |
| **Framework** | Vitest + React Testing Library |
| **Ciljna pokritost** | ≥ 80% |
| **Avtor** | Tilen Brunec |

---

## Metodologija testiranja

Vsi testi so implementirani kot **komponentni in integracijski testi** z uporabo **Vitest** ogrodja in **React Testing Library**. HTTP klici so prestreženi z **MSW (Mock Service Worker)**. To pomeni:

- ✅ Brez pravih klicev na zaledni sistem — vse je simulirano z MSW strežnikom
- ✅ Testi so neodvisni drug od drugega — MSW se ponastavi po vsakem testu
- ✅ Komponente se upodabljajo v JSDOM okolju, ki simulira brskalnik
- ✅ Realni konteksti (AuthContext, TopbarContext) so zamenljivi z `mock` različicami
- ✅ Čisto testno okolje — brez stranske učinke na produkcijsko bazo

---

## Skupna statistika

| Testna datoteka | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen | Poročilo |
|---|:---:|:---:|:---:|:---:|---|
| `LoginPage.test.tsx` | 5 | 4 | 1 | 0 | [TEST_REPORT_pages.md](TEST_REPORT_pages.md) |
| `DashboardPage.test.tsx` | 3 | 2 | 1 | 0 | [TEST_REPORT_pages.md](TEST_REPORT_pages.md) |
| `RegisterPage.test.tsx` | 8 | 3 | 1 | 4 | [TEST_REPORT_pages.md](TEST_REPORT_pages.md) |
| `QuestionnaireWizard.test.tsx` | 6 | 5 | 1 | 0 | [TEST_REPORT_questionnaire.md](TEST_REPORT_questionnaire.md) |
| `WakeBackend.test.tsx` | 6 | 4 | 1 | 1 | [TEST_REPORT_components.md](TEST_REPORT_components.md) |
| `StatCard.test.tsx` | 9 | 9 | 0 | 0 | [TEST_REPORT_components.md](TEST_REPORT_components.md) |
| `Bar.test.tsx` | 8 | 6 | 2 | 0 | [TEST_REPORT_components.md](TEST_REPORT_components.md) |
| `ComicBtn.test.tsx` | 8 | 6 | 1 | 1 | [TEST_REPORT_components.md](TEST_REPORT_components.md) |
| `StudentQuiz.test.tsx` | 8 | 6 | 2 | 0 | [TEST_REPORT_quiz.md](TEST_REPORT_quiz.md) |
| `QuizSession.test.tsx` | 7 | 6 | 1 | 0 | [TEST_REPORT_quiz.md](TEST_REPORT_quiz.md) |
| `StudentModules.test.tsx` | 8 | 6 | 2 | 0 | [TEST_REPORT_modules.md](TEST_REPORT_modules.md) |
| `ProfessorModules.test.tsx` | 11 | 11 | 0 | 0 | [TEST_REPORT_modules.md](TEST_REPORT_modules.md) |
| `moduleApi.test.ts` | 13 | 13 | 0 | 0 | [TEST_REPORT_modules.md](TEST_REPORT_modules.md) |
| **Skupaj** | **100** | **81** | **13** | **6** | |

---

## Statistika po vrsti testov
```
Skupaj testov:    100
✅ Pravilen:       81  (81%)
⚠️ Robni:          13  (13%)
❌ Napačen:         6   (6%)
```

---

## Statistika po področjih

| Področje | Testov | Delež |
|---|:---:|:---:|
| Strani (pages) | 16 | 16% |
| Upravljanje modulov | 32 | 32% |
| Kvizi | 15 | 15% |
| Vprašalnik (VARK) | 6 | 6% |
| UI komponente | 31 | 31% |

---

## Legenda vrst testov

| Oznaka | Pomen | Primer |
|---|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano | Stran se upodobi, gumb kliče API |
| ⚠️ **Robni primer** | Mejni pogoji — prazni podatki, stanja nalaganja | Nov učenec brez vpisov dobi prazno stanje |
| ❌ **Napačen primer** | Napačni vhodi ali napake strežnika | Vnos prekratkega uporabniškega imena → sporočilo o napaki |

---

## Pokrita tveganja

| Tveganje | Pokrito | Kako |
|---|:---:|---|
| Napačna vloga prikaže napačno stran | ✅ | `DashboardPage` testi za `ucenec` in `ucitelj` |
| Prikazovanje brez naloženih podatkov profila | ✅ | Loading state testi v `DashboardPage`, `RegisterPage` |
| Validacija registracijske forme | ✅ | 4 negativni testi v `RegisterPage` |
| Napaka registracijskega API-ja (409) | ✅ | `shows error message when API returns an error` |
| Nedosegljiv zaledni sistem ob zagonu | ✅ | `WakeBackend` testi za stanja preverjanja in buđenja |
| Prazni seznami kviznov | ✅ | `StudentQuiz` empty state test |
| Kviz s 3+ poskusi (brez XP nagrade) | ✅ | `shows "0 XP ON RETRY" after 3 or more attempts` |
| Brisanje modula brez potrditve | ✅ | `ProfessorModules` confirm dialog test |
| Manjkajoča avtorizacijska glava v API klicih | ✅ | `moduleApi` testi za `Authorization: Bearer` |
| Napačna HTTP metoda ali pot | ✅ | Vsi `moduleApi` testi preverjajo metodo in URL |
| Prazni vpisi učenca | ✅ | `StudentModules` empty enrollment state test |
| Prekoračitev vrednosti naprednice (Bar) | ✅ | `clamps fill width at 100%` test |
| Onemogočen gumb ne sproži klicanega dogodka | ✅ | `ComicBtn disabled` test |

---

## Podrobna poročila

- 📄 [TEST_REPORT_pages.md](TEST_REPORT_pages.md) — Prijava, registracija, nadzorna plošča
- 📄 [TEST_REPORT_modules.md](TEST_REPORT_modules.md) — Moduli (učenec, učitelj), API odjemalec
- 📄 [TEST_REPORT_quiz.md](TEST_REPORT_quiz.md) — Seja kviza, vozlišče kviznov
- 📄 [TEST_REPORT_questionnaire.md](TEST_REPORT_questionnaire.md) — VARK vprašalnik
- 📄 [TEST_REPORT_components.md](TEST_REPORT_components.md) — UI primitivne komponente
