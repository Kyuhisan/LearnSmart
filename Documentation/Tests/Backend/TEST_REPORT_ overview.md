# Poročilo Testov — LearnSmart Backend

| | |
|---|---|
| **Issue** | S5-01 |
| **Datum** | 23. 5. 2026 |
| **Framework** | JUnit 5 + Mockito |# Pregled Testov — LearnSmart Backend

| | |
|---|---|
| **Issue** | S5-01 |
| **Datum** | 23. 5. 2026 |
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
| `LearnSmartApplicationTests` | 1 | 1 | 0 | 0 | — |
| **Skupaj** | **48** | **21** | **9** | **18** | |

---

## Statistika po vrsti testov

```
Skupaj testov:    48
✅ Pravilen:      21  (44%)
⚠️ Robni:         9  (19%)
❌ Napačen:       18  (37%)
```

---

## Statistika po področjih

| Področje | Testov | Delež |
|---|:---:|:---:|
| Upravljanje modulov | 30 | 63% |
| Avtentikacija in registracija | 7 | 15% |
| AI klasifikacija | 10 | 21% |
| Aplikacijski test | 1 | 2% |

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

---

## Podrobna poročila

- 📄 [TEST_REPORT_predmeti.md](TEST_REPORT_predmeti.md) — Moduli, mapper, controller
- 📄 [TEST_REPORT_auth.md](TEST_REPORT_auth.md) — Avtentikacija, registracija, učni stil
- 📄 [TEST_REPORT_ai.md](TEST_REPORT_ai.md) — Gemini AI klasifikacija

| **Ciljna pokritost** | ≥ 80% |
| **Avtor** | Tilen Brunec |

---

## Povzetek

> Testi so implementirani z **Mockito** — brez pravih povezav na bazo. Vse klice na repozitorije simuliramo z `when().thenReturn()`, kar zagotavlja hitro in zanesljivo testiranje brez stranskih učinkov na produkcijsko ali testno bazo.

| Razred | Število testov | ✅ Uspešni | ❌ Neuspešni |
|---|:---:|:---:|:---:|
| `PredmetServiceTest` | 16 | 16 | 0 |
| `PredmetMapperTest` | 3 | 3 | 0 |
| `PredmetControllerTest` | 11 | 11 | 0 |
| **Skupaj** | **30** | **30** | **0** |

---

## PredmetServiceTest

Testi pokrivajo vso poslovno logiko v `PredmetService` — od pridobivanja modulov do ustvarjanja, urejanja, brisanja in objave.

---

### `getPublished_returnsPublishedModules`
> Preveri da metoda vrne samo objavljene module.

| | |
|---|---|
| **Vhod** | En objavljen modul v repozitoriju |
| **Pričakovan rezultat** | Seznam z 1 elementom, naziv = `"Mathematics"` |

---

### `getPublished_skipsUnpublishedModules`
> Preveri da neobjavljeni moduli niso vključeni v rezultat.

| | |
|---|---|
| **Vhod** | En neobjavljen modul (`jeObjavljen = false`) |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getById_returnsModule`
> Preveri da metoda vrne modul po ID-ju.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula |
| **Pričakovan rezultat** | DTO z ustreznim nazivom |

---

### `getById_throwsWhenNotFound`
> Preveri da je izjema vržena, ko modul ne obstaja.

| | |
|---|---|
| **Vhod** | Neobstoječi UUID modula |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `create_savesModule`
> Preveri da se nov modul shrani v repozitorij.

| | |
|---|---|
| **Vhod** | `PredmetRequestDTO` z nazivom, opisom, kodo vpisa, težavnostjo |
| **Pričakovan rezultat** | Vrnjeni DTO z nazivom `"Physics"`, `save()` klican enkrat |

---

### `update_updatesModule`
> Preveri da lastnik uspešno posodobi modul.

| | |
|---|---|
| **Vhod** | Veljavni UUID, posodobljeni DTO, ujemajoči `uciteljId` |
| **Pričakovan rezultat** | Posodobljeni DTO, `save()` klican enkrat |

---

### `update_throwsWhenWrongOwner`
> Preveri da neuporabnik ne more urejati modula.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula, drug `uciteljId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `update_throwsWhenNotFound`
> Preveri da je izjema vržena pri urejanju neobstoječega modula.

| | |
|---|---|
| **Vhod** | Neobstoječi UUID modula |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `delete_deletesModule`
> Preveri da lastnik uspešno izbriše modul.

| | |
|---|---|
| **Vhod** | Veljavni UUID, ujemajoči `uciteljId` |
| **Pričakovan rezultat** | `delete()` klican enkrat na repozitoriju |

---

### `delete_throwsWhenWrongOwner`
> Preveri da neuporabnik ne more brisati modula.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula, drug `uciteljId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `delete_throwsWhenNotFound`
> Preveri da je izjema vržena pri brisanju neobstoječega modula.

| | |
|---|---|
| **Vhod** | Neobstoječi UUID modula |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `publish_setsPublished`
> Preveri da lastnik uspešno objavi modul.

| | |
|---|---|
| **Vhod** | Neobjavljen modul, ujemajoči `uciteljId` |
| **Pričakovan rezultat** | Modul shranjen z `jeObjavljen = true` |

---

### `publish_throwsWhenWrongOwner`
> Preveri da neuporabnik ne more objaviti modula.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula, drug `uciteljId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `publish_throwsWhenNotFound`
> Preveri da je izjema vržena pri objavi neobstoječega modula.

| | |
|---|---|
| **Vhod** | Neobstoječi UUID modula |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `getMyModules_returnsTeacherModules`
> Preveri da učitelj dobi samo svoje module.

| | |
|---|---|
| **Vhod** | En modul, ki pripada učitelju |
| **Pričakovan rezultat** | Seznam z 1 elementom |

---

### `getMyModules_returnsEmptyListForNewTeacher`
> Preveri da nov učitelj brez modulov dobi prazen seznam.

| | |
|---|---|
| **Vhod** | `uciteljId` brez povezanih modulov |
| **Pričakovan rezultat** | Prazen seznam |

---

## PredmetMapperTest

Testi pokrivajo pretvorbo med entitetami in DTO objekti.

---

### `toResponse_mapsAllFields`
> Preveri da so vsa polja pravilno preslikana iz entitete v DTO.

| | |
|---|---|
| **Vhod** | `Predmet` entiteta z vsemi polji, `Profil` z imenom |
| **Pričakovan rezultat** | DTO vsebuje pravilen naziv, kodo vpisa, ime učitelja, status objave |

---

### `toResponse_returnsUnknownWhenProfileNull`
> Preveri nadomestno vrednost ko profil ni na voljo.

| | |
|---|---|
| **Vhod** | `Predmet` entiteta, `profil = null` |
| **Pričakovan rezultat** | `uciteljImePriimek = "Neznan"` |

---

### `toEntity_mapsAllFields`
> Preveri da so vsa polja pravilno preslikana iz DTO v entiteto.

| | |
|---|---|
| **Vhod** | `PredmetRequestDTO` z nazivom, opisom, kodo, težavnostjo in `uciteljId` |
| **Pričakovan rezultat** | Entiteta z ustreznimi vrednostmi in nastavljenim `ustvarjenOb` |

---

## PredmetControllerTest

Testi pokrivajo vse REST endpointe in preverjanje vlog (`ucitelj` / `ucenec`).

---

### `getPublished_returnsModuleList`
> Preveri da javni endpoint vrne seznam objavljenih modulov.

| | |
|---|---|
| **Vhod** | Brez avtentikacije |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `getById_returnsModule`
> Preveri da endpoint vrne modul po ID-ju.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula |
| **Pričakovan rezultat** | HTTP 200, modul z ustreznim nazivom |

---

### `getMyModules_returns403WithoutRole`
> Preveri da uporabnik brez profila v bazi dobi 403.

| | |
|---|---|
| **Vhod** | JWT z veljavnim `subject`, brez ujemajočega profila |
| **Pričakovan rezultat** | HTTP 403 |

---

### `getMyModules_returnsTeacherModules`
> Preveri da učitelj dobi svoje module.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj` |
| **Pričakovan rezultat** | HTTP 200, seznam modulov |

---

### `create_teacherCreatesModule`
> Preveri da učitelj lahko ustvari nov modul.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljaven `PredmetRequestDTO` |
| **Pričakovan rezultat** | HTTP 200, ustvarjeni modul |

---

### `create_studentGets403`
> Preveri da učenec ne more ustvariti modula.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `delete_teacherDeletes`
> Preveri da učitelj lahko izbriše svoj modul.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljavni UUID modula |
| **Pričakovan rezultat** | HTTP 204 No Content |

---

### `delete_studentGets403`
> Preveri da učenec ne more brisati modula.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `update_teacherUpdatesModule`
> Preveri da učitelj lahko posodobi svoj modul.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljavni UUID, posodobljeni DTO |
| **Pričakovan rezultat** | HTTP 200, posodobljeni modul |

---

### `update_studentGets403`
> Preveri da učenec ne more urejati modula.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `publish_teacherPublishes`
> Preveri da učitelj lahko objavi modul.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljavni UUID modula |
| **Pričakovan rezultat** | HTTP 200, objavljen modul |

---

### `publish_studentGets403`
> Preveri da učenec ne more objaviti modula.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |
