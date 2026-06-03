# Poročilo Testov — Upravljanje Kvizov

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
| `QuizService` | Poslovna logika za generiranje, upravljanje, reševanje kvizov ter statistike napredka |
| `QuizController` | REST endpointi za CRUD operacije nad kvizi, vprašanji ter dashboard statistike |

---

## Statistika

| Razred | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `QuizServiceTest` | 45 | 24 | 8 | 13 |
| `QuizControllerTest` | 31 | 17 | 0 | 14 |
| **Skupaj** | **76** | **41** | **8** | **27** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — prazni seznami, prazen kviz, brez transkripta |
| ❌ **Napačen primer** | Neobstoječi ID, kršitev avtorizacije, napačni odgovori |

---

## QuizServiceTest

> Testi pokrivajo vso poslovno logiko v `QuizService` — generiranje vprašanj z AI, upravljanje banke vprašanj, ustvarjanje in objavo kvizov, shranjevanje rezultatov, lestvico najboljših učencev ter statistike napredka in tedenske aktivnosti.

---

### `generiraj_returnsQuestions` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda uspešno generira vprašanja za obstoječ modul s transkriptom.

| | |
|---|---|
| **Vhod** | Veljaven `predmetId`, število vprašanj = 5, težavnost = `"MEDIUM"` |
| **Pričakovan rezultat** | Seznam z 1 vprašanjem, besedilo = `"Q1"` |

---

### `generiraj_throwsWhenModuleNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako, ko zahtevani modul ne obstaja.

| | |
|---|---|
| **Vhod** | Neobstoječi `predmetId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `generiraj_throwsWhenNoTranscript` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako, ko modul nima transkripta (`null`).

| | |
|---|---|
| **Vhod** | `predmetId` z `zdruzenTranscript = null` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `generiraj_throwsWhenBlankTranscript` — ⚠️ Robni primer
> **Cilj:** Preveriti da sistem vrže napako, ko je transkript prazen oz. samo presledki.

| | |
|---|---|
| **Vhod** | `predmetId` z `zdruzenTranscript = "   "` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `shraniVBanko_savesQuestion` — ✅ Pravilen primer
> **Cilj:** Preveriti da se odobreno vprašanje pravilno shrani v banko brez dodelitve kviza.

| | |
|---|---|
| **Vhod** | Veljavni `predmetId`, eno vprašanje |
| **Pričakovan rezultat** | Seznam z 1 elementom, `save()` klican enkrat |

---

### `shraniVBanko_throwsWhenModuleNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri shranjevanju v banko za neobstoječ modul.

| | |
|---|---|
| **Vhod** | Neobstoječi `predmetId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `shraniVBanko_savesMultipleQuestions` — ✅ Pravilen primer
> **Cilj:** Preveriti da se več vprašanj hkrati pravilno shrani v banko.

| | |
|---|---|
| **Vhod** | Veljavni `predmetId`, dve vprašanji |
| **Pričakovan rezultat** | Seznam z 2 elementoma, `save()` klican dvakrat |

---

### `getBanka_returnsQuestions` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne vsa vprašanja iz banke za določen modul.

| | |
|---|---|
| **Vhod** | Veljavni `predmetId` z enim vprašanjem v banki |
| **Pričakovan rezultat** | Seznam z 1 elementom, besedilo = `"What is 2+2?"` |

---

### `getBanka_returnsEmptyWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko banka ne vsebuje vprašanj.

| | |
|---|---|
| **Vhod** | `predmetId` brez vprašanj v banki |
| **Pričakovan rezultat** | Prazen seznam |

---

### `ustvari_createsQuiz` — ✅ Pravilen primer
> **Cilj:** Preveriti da se nov kviz pravilno ustvari z izbranimi vprašanji iz banke.

| | |
|---|---|
| **Vhod** | Veljavni `predmetId`, naziv, čas izvajanja, seznam ID-jev vprašanj |
| **Pričakovan rezultat** | DTO z nazivom `"Test Quiz"`, `save()` klican na kvizu |

---

### `ustvari_throwsWhenModuleNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri ustvarjanju kviza za neobstoječ modul.

| | |
|---|---|
| **Vhod** | Neobstoječi `predmetId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `ustvari_createsQuizWithNoQuestions` — ⚠️ Robni primer
> **Cilj:** Preveriti da se kviz lahko ustvari tudi brez vprašanj (prazen seznam).

| | |
|---|---|
| **Vhod** | Veljavni `predmetId`, prazen seznam `vprasanjaIds` |
| **Pričakovan rezultat** | DTO uspešno vrnjen, `save()` na vprašanjih nikoli klican |

---

### `dodaj_addsQuestionToQuiz` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vprašanje iz banke pravilno doda na kviz.

| | |
|---|---|
| **Vhod** | Veljavni `kvizId` in `vprasanjeId` |
| **Pričakovan rezultat** | `save()` klican enkrat na vprašanju |

---

### `dodaj_throwsWhenQuizNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri dodajanju vprašanja na neobstoječ kviz.

| | |
|---|---|
| **Vhod** | Neobstoječi `kvizId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `dodaj_doesNothingWhenQuestionNotFound` — ⚠️ Robni primer
> **Cilj:** Preveriti da sistem ne pade, ko vprašanje za dodajanje ne obstaja.

| | |
|---|---|
| **Vhod** | Veljavni `kvizId`, neobstoječi `vprasanjeId` |
| **Pričakovan rezultat** | Brez napake, `save()` nikoli klican |

---

### `odstrani_removesQuestionFromQuiz` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vprašanje uspešno odstrani iz kviza in vrne v banko.

| | |
|---|---|
| **Vhod** | Veljavni `vprasanjeId` z dodeljenim kvizom |
| **Pričakovan rezultat** | `save()` klican, kviz nastavljen na `null` |

---

### `odstrani_doesNothingWhenNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem ne pade pri odstranjevanju neobstoječega vprašanja.

| | |
|---|---|
| **Vhod** | Neobstoječi `vprasanjeId` |
| **Pričakovan rezultat** | Brez napake, `save()` nikoli klican |

---

### `objavi_setsPublished` — ✅ Pravilen primer
> **Cilj:** Preveriti da se status kviza pravilno spremeni na `PUBLISHED`.

| | |
|---|---|
| **Vhod** | Veljavni `kvizId` s statusom `DRAFT` |
| **Pričakovan rezultat** | `save()` klican, DTO uspešno vrnjen |

---

### `objavi_throwsWhenQuizNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri objavi neobstoječega kviza.

| | |
|---|---|
| **Vhod** | Neobstoječi `kvizId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `objavi_sendsNotificationsToStudents` — ✅ Pravilen primer
> **Cilj:** Preveriti da se ob objavi kviza pošljejo obvestila vsem vpisanim učencem.

| | |
|---|---|
| **Vhod** | Veljavni `kvizId`, en vpisani učenec |
| **Pričakovan rezultat** | `ustvari()` klican enkrat z vlogo `"QUIZ"` |

---

### `getKviziZaPredmet_returnsQuizzes` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne vse kvize za določen modul.

| | |
|---|---|
| **Vhod** | Veljavni `predmetId` z enim kvizom |
| **Pričakovan rezultat** | Seznam z 1 elementom, naziv = `"Test Quiz"` |

---

### `getKviziZaPredmet_returnsEmptyWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko modul nima kvizov.

| | |
|---|---|
| **Vhod** | `predmetId` brez kvizov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `izbrisi_deletesQuestion` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vprašanje uspešno izbriše iz repozitorija.

| | |
|---|---|
| **Vhod** | Veljavni `vprasanjeId` |
| **Pričakovan rezultat** | `deleteById()` klican enkrat |

---

### `getVprasanja_returnsQuestions` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne vsa vprašanja za določen kviz.

| | |
|---|---|
| **Vhod** | Veljavni `kvizId` z enim vprašanjem |
| **Pričakovan rezultat** | Seznam z 1 elementom, besedilo = `"What is 2+2?"` |

---

### `getVprasanja_returnsEmptyWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko kviz nima vprašanj.

| | |
|---|---|
| **Vhod** | `kvizId` brez vprašanj |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getKviziZaUcenca_returnsQuizzes` — ✅ Pravilen primer
> **Cilj:** Preveriti da učenec dobi kvize iz vpisanih modulov.

| | |
|---|---|
| **Vhod** | Učenec vpisan v en modul z enim kvizom |
| **Pričakovan rezultat** | Seznam z 1 elementom |

---

### `getKviziZaUcenca_returnsEmptyWhenNoEnrollments` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec brez vpisov dobi prazen seznam.

| | |
|---|---|
| **Vhod** | `ucenecId` brez vpisov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `shraniRezultat_calculatesCorrectScore` — ✅ Pravilen primer
> **Cilj:** Preveriti da sistem pravilno izračuna točke in odstotek pri pravilnih odgovorih.

| | |
|---|---|
| **Vhod** | En pravilen odgovor (indeks 2), 1 vprašanje |
| **Pričakovan rezultat** | `tocke = 1`, `odstotek = 100` |

---

### `shraniRezultat_calculatesZeroWhenAllWrong` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrne 0 točk pri napačnih odgovorih.

| | |
|---|---|
| **Vhod** | Napačen odgovor (indeks 0), pravilen je indeks 2 |
| **Pričakovan rezultat** | `tocke = 0` |

---

### `shraniRezultat_throwsWhenQuizNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri shranjevanju rezultata za neobstoječ kviz.

| | |
|---|---|
| **Vhod** | Neobstoječi `kvizId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `shraniRezultat_handlesEmptyQuiz` — ⚠️ Robni primer
> **Cilj:** Preveriti da sistem pravilno obdela kviz brez vprašanj (0 točk, 0%).

| | |
|---|---|
| **Vhod** | `kvizId` brez vprašanj, prazen seznam odgovorov |
| **Pričakovan rezultat** | `tocke = 0`, `odstotek = 0` |

---

### `getMojiRezultati_returnsResults` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne vse rezultate učenca z pravilno izračunanim odstotkom.

| | |
|---|---|
| **Vhod** | Učenec z enim rezultatom (`tocke = 8`, `skupaj = 10`) |
| **Pričakovan rezultat** | Seznam z 1 elementom, `odstotek = 80` |

---

### `getMojiRezultati_returnsEmptyWhenNone` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko učenec nima rezultatov.

| | |
|---|---|
| **Vhod** | `ucenecId` brez rezultatov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getKviziZaUcitelja_returnsQuizzes` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne vse kvize čez vse module učitelja.

| | |
|---|---|
| **Vhod** | Učitelj z enim modulom in enim kvizom |
| **Pričakovan rezultat** | Seznam z 1 elementom |

---

### `getKviziZaUcitelja_returnsEmptyWhenNoModules` — ❌ Napačen primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko učitelj nima modulov.

| | |
|---|---|
| **Vhod** | `uciteljId` brez modulov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getTopStudents_returnsStudents` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne lestvico najboljših učencev z imenom in kompozitnim rezultatom.

| | |
|---|---|
| **Vhod** | En učenec z enim rezultatom |
| **Pričakovan rezultat** | Seznam z 1 elementom, ime = `"Test Student"` |

---

### `getTopStudents_returnsEmptyWhenNoModules` — ❌ Napačen primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko učitelj nima modulov.

| | |
|---|---|
| **Vhod** | `uciteljId` brez modulov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getTopStudents_returnsEmptyWhenNoQuizzes` — ❌ Napačen primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko moduli nimajo kvizov.

| | |
|---|---|
| **Vhod** | Modul brez kvizov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getTopStudents_returnsEmptyWhenNoResults` — ❌ Napačen primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko kvizi nimajo rešenih poskusov.

| | |
|---|---|
| **Vhod** | Kviz brez rezultatov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getTopStudents_limitsToFive` — ⚠️ Robni primer
> **Cilj:** Preveriti da lestvica vrne največ 5 učencev, tudi če je rezultatov več.

| | |
|---|---|
| **Vhod** | 7 različnih učencev z rezultati |
| **Pričakovan rezultat** | Seznam z največ 5 elementi |

---

### `getProgressStats_returnsStatsForStudent` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne pravilno strukturo napredka za učenca z rezultati.

| | |
|---|---|
| **Vhod** | Učenec z enim rezultatom danes, `xpZasluzen = 100` |
| **Pričakovan rezultat** | 14 dni biweekly XP, 35 dni calendar, streak ≥ 0 |

---

### `getProgressStats_returnsEmptyWhenNoResults` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne pravilno strukturo tudi brez rezultatov.

| | |
|---|---|
| **Vhod** | Učenec brez rezultatov |
| **Pričakovan rezultat** | 14 dni XP, 35 dni calendar, streak = 0, streakBest = 0 |

---

### `getProgressStats_calculatesStreakCorrectly` — ✅ Pravilen primer
> **Cilj:** Preveriti da se streak pravilno izračuna pri zaporednih dnevih aktivnosti.

| | |
|---|---|
| **Vhod** | Dva rezultata — danes in včeraj |
| **Pričakovan rezultat** | streak ≥ 2 |

---

### `getProgressStats_calendarHasFutureDays` — ⚠️ Robni primer
> **Cilj:** Preveriti da calendar pravilno označuje prihodnje dni.

| | |
|---|---|
| **Vhod** | Učenec brez rezultatov |
| **Pričakovan rezultat** | Število prihodnjih dni ≥ 0 |

---

### `getWeeklyStats_returnsSevenDays` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne statistiko za točno 7 dni za učitelja.

| | |
|---|---|
| **Vhod** | Učitelj z modulom, kvizom in rezultatom danes |
| **Pričakovan rezultat** | Seznam z 7 elementi |

---

### `getWeeklyStats_returnsEmptyWeekWhenNoModules` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne prazen teden (vse 0), ko učitelj nima modulov.

| | |
|---|---|
| **Vhod** | `uciteljId` brez modulov |
| **Pričakovan rezultat** | 7 dni, vsi `xpSum = 0` |

---

### `getWeeklyStats_returnsEmptyWeekWhenNoQuizzes` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne prazen teden, ko moduli nimajo kvizov.

| | |
|---|---|
| **Vhod** | Modul brez kvizov |
| **Pričakovan rezultat** | 7 dni, vsi `xpSum = 0` |

---

### `getWeeklyStats_filtersByPredmetId` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda pravilno filtrira po izbranem predmetu.

| | |
|---|---|
| **Vhod** | Specifični `predmetId`, rezultat danes |
| **Pričakovan rezultat** | 7 dni statistike za izbrani predmet |

---

### `getWeeklyStats_dayNamesAreCorrect` — ✅ Pravilen primer
> **Cilj:** Preveriti da so imena dni pravilna in v pravem vrstnem redu (MON–SUN).

| | |
|---|---|
| **Vhod** | Učitelj z modulom brez rezultatov |
| **Pričakovan rezultat** | `["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]` |

---

### `getActivity_returnsActivities` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne aktivnosti profesorja (objavljeni kvizi + rezultati učencev).

| | |
|---|---|
| **Vhod** | Objavljeni kviz, en rezultat učenca |
| **Pričakovan rezultat** | Neprazen seznam aktivnosti |

---

### `getActivity_returnsEmptyWhenNoModules` — ❌ Napačen primer
> **Cilj:** Preveriti da metoda vrne prazen seznam, ko učitelj nima modulov.

| | |
|---|---|
| **Vhod** | `uciteljId` brez modulov |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getActivity_limitsToTen` — ⚠️ Robni primer
> **Cilj:** Preveriti da metoda vrne največ 10 aktivnosti, tudi če je rezultatov več.

| | |
|---|---|
| **Vhod** | 15 rezultatov učencev |
| **Pričakovan rezultat** | Seznam z največ 10 elementi |

---

### `getActivity_isSortedByDateDescending` — ✅ Pravilen primer
> **Cilj:** Preveriti da so aktivnosti razvrščene od najnovejše do najstarejše.

| | |
|---|---|
| **Vhod** | 2 rezultata — pred 1h in pred 2h |
| **Pričakovan rezultat** | Novejši rezultat je prvi v seznamu |

---

## QuizControllerTest

> Testi pokrivajo vse REST endpointe in preverjanje vlog (`ucitelj` / `ucenec`). Vsak zaščiten endpoint je testiran z obema vlogama.

---

### `generiraj_teacherGenerates` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno sproži generiranje vprašanj z AI.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljaven `QuizGenerateRequestDTO` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `generiraj_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more generirati vprašanj.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `shraniVBanko_teacherSaves` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno shrani odobrena vprašanja v banko.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljaven `QuestionSaveRequestDTO` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `shraniVBanko_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more shranjevati vprašanj v banko.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `getBanka_teacherGetsQuestions` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno pridobi seznam vprašanj iz banke.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljaven `predmetId` |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `getBanka_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more dostopati do banke vprašanj.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `ustvari_teacherCreatesQuiz` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno ustvari nov kviz iz izbranih vprašanj.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljaven `QuizCreateRequestDTO` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `ustvari_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more ustvariti kviza.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `dodaj_teacherAddsQuestion` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno doda vprašanje iz banke na kviz.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljavni `kvizId` in `vprasanjeId` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `dodaj_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more dodajati vprašanj na kviz.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `odstrani_teacherRemovesQuestion` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno odstrani vprašanje iz kviza nazaj v banko.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljaven `vprasanjeId` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `odstrani_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more odstranjevati vprašanj iz kviza.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `objavi_teacherPublishes` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno objavi kviz in ga s tem naredi dostopnega učencem.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljaven `kvizId` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `objavi_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more objavljati kvizov.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `getKvizi_returnsQuizzes` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne vse kvize za določen modul brez avtorizacije.

| | |
|---|---|
| **Vhod** | Veljaven `predmetId` |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `izbrisi_teacherDeletes` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno izbriše vprašanje.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljaven `vprasanjeId` |
| **Pričakovan rezultat** | HTTP 204 No Content |

---

### `izbrisi_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more brisati vprašanj.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `getVprasanja_returnsQuestions` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne vsa vprašanja za določen kviz.

| | |
|---|---|
| **Vhod** | Veljaven `kvizId` |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `getMojiKvizi_returnsStudentQuizzes` — ✅ Pravilen primer
> **Cilj:** Preveriti da učenec dobi kvize iz svojih vpisanih modulov.

| | |
|---|---|
| **Vhod** | JWT učenca, kvizi iz vpisanih modulov |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `shraniRezultat_savesResult` — ✅ Pravilen primer
> **Cilj:** Preveriti da učenec uspešno odda in shrani rezultat kviza.

| | |
|---|---|
| **Vhod** | JWT učenca, veljavni `kvizId`, `QuizResultRequestDTO` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `getMojiRezultati_returnsResults` — ✅ Pravilen primer
> **Cilj:** Preveriti da učenec uspešno pridobi zgodovino svojih rezultatov.

| | |
|---|---|
| **Vhod** | JWT učenca |
| **Pričakovan rezultat** | HTTP 200 |

---

### `getKviziUcitelja_teacherGetsQuizzes` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno dobi seznam vseh kvizov čez vse svoje module.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj` |
| **Pričakovan rezultat** | HTTP 200, seznam kvizov |

---

### `getKviziUcitelja_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more dostopati do seznama kvizov učitelja.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `getTopStudents_teacherGetsStudents` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno pridobi lestvico najboljših učencev.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj` |
| **Pričakovan rezultat** | HTTP 200 |

---

### `getTopStudents_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more dostopati do lestvice.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `getProgressStats_studentGets200` — ✅ Pravilen primer
> **Cilj:** Preveriti da učenec uspešno pridobi statistiko svojega napredka.

| | |
|---|---|
| **Vhod** | JWT učenca |
| **Pričakovan rezultat** | HTTP 200, `ProgressStatsDTO` |

---

### `getWeeklyStats_teacherGets200` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno pridobi tedensko statistiko za vse module.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, brez filtra |
| **Pričakovan rezultat** | HTTP 200, `WeeklyStatsDTO` |

---

### `getWeeklyStats_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more dostopati do tedenske statistike.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `getWeeklyStats_teacherFiltersByModule` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno filtrira tedensko statistiko po izbranem modulu.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, specifični `predmetId` |
| **Pričakovan rezultat** | HTTP 200, `getWeeklyStatsZaProfesoria` klican z `predmetId` |

---

### `getProfActivity_teacherGets200` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno pridobi seznam svojih nedavnih aktivnosti.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj` |
| **Pričakovan rezultat** | HTTP 200, seznam `ActivityItemDTO` |

---

### `getProfActivity_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more dostopati do aktivnosti profesorja.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |