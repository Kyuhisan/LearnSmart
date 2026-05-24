# Poročilo Testov — Upravljanje Modulov (Predmeti)

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
| `PredmetService` | Poslovna logika za upravljanje modulov |
| `PredmetMapper` | Pretvorba med JPA entitetami in DTO objekti |
| `PredmetController` | REST endpointi za CRUD operacije nad moduli |

---

## Statistika

| Razred | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `PredmetServiceTest` | 16 | 6 | 2 | 8 |
| `PredmetMapperTest` | 3 | 2 | 1 | 0 |
| `PredmetControllerTest` | 11 | 6 | 0 | 5 |
| **Skupaj** | **30** | **14** | **3** | **13** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — prazni seznami, null profil |
| ❌ **Napačen primer** | Napačen lastnik, neobstoječ ID, kršitev avtorizacije |

---

## PredmetServiceTest

> Testi pokrivajo vso poslovno logiko v `PredmetService` — pridobivanje, ustvarjanje, urejanje, brisanje in objavo modulov. Posebna pozornost je namenjena preverjanju lastništva in obstoja modulov.

---

### `getPublished_returnsPublishedModules` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda pravilno filtrira in vrne samo objavljene module.

| | |
|---|---|
| **Vhod** | En objavljen modul v repozitoriju |
| **Pričakovan rezultat** | Seznam z 1 elementom, naziv = `"Mathematics"` |

---

### `getPublished_skipsUnpublishedModules` — ⚠️ Robni primer
> **Cilj:** Preveriti da neobjavljeni moduli niso izpostavljeni javnosti.

| | |
|---|---|
| **Vhod** | En neobjavljen modul (`jeObjavljen = false`) |
| **Pričakovan rezultat** | Prazen seznam |

---

### `getById_returnsModule` — ✅ Pravilen primer
> **Cilj:** Preveriti da metoda vrne točno določen modul po ID-ju.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula |
| **Pričakovan rezultat** | DTO z ustreznim nazivom |

---

### `getById_throwsWhenNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako, ko zahtevani modul ne obstaja v bazi.

| | |
|---|---|
| **Vhod** | Neobstoječi UUID modula |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `create_savesModule` — ✅ Pravilen primer
> **Cilj:** Preveriti da se nov modul pravilno shrani v repozitorij z vsemi zahtevanimi polji.

| | |
|---|---|
| **Vhod** | `PredmetRequestDTO` z nazivom, opisom, kodo vpisa, težavnostjo |
| **Pričakovan rezultat** | Vrnjeni DTO z nazivom `"Physics"`, `save()` klican enkrat |

---

### `update_updatesModule` — ✅ Pravilen primer
> **Cilj:** Preveriti da lastnik modula uspešno posodobi vse spremenljive podatke.

| | |
|---|---|
| **Vhod** | Veljavni UUID, posodobljeni DTO, ujemajoči `uciteljId` |
| **Pričakovan rezultat** | Posodobljeni DTO, `save()` klican enkrat |

---

### `update_throwsWhenWrongOwner` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem prepreči urejanje modula s strani nepooblaščenega učitelja.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula, drug `uciteljId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `update_throwsWhenNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri poskusu urejanja neobstoječega modula.

| | |
|---|---|
| **Vhod** | Neobstoječi UUID modula |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `delete_deletesModule` — ✅ Pravilen primer
> **Cilj:** Preveriti da lastnik modula uspešno izbriše modul iz repozitorija.

| | |
|---|---|
| **Vhod** | Veljavni UUID, ujemajoči `uciteljId` |
| **Pričakovan rezultat** | `delete()` klican enkrat na repozitoriju |

---

### `delete_throwsWhenWrongOwner` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem prepreči brisanje modula s strani nepooblaščenega učitelja.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula, drug `uciteljId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `delete_throwsWhenNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri poskusu brisanja neobstoječega modula.

| | |
|---|---|
| **Vhod** | Neobstoječi UUID modula |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `publish_setsPublished` — ✅ Pravilen primer
> **Cilj:** Preveriti da lastnik modula uspešno objavi modul in se status pravilno posodobi.

| | |
|---|---|
| **Vhod** | Neobjavljen modul, ujemajoči `uciteljId` |
| **Pričakovan rezultat** | Modul shranjen z `jeObjavljen = true` |

---

### `publish_throwsWhenWrongOwner` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem prepreči objavo modula s strani nepooblaščenega učitelja.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula, drug `uciteljId` |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `publish_throwsWhenNotFound` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem vrže napako pri objavi neobstoječega modula.

| | |
|---|---|
| **Vhod** | Neobstoječi UUID modula |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `getMyModules_returnsTeacherModules` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj dobi seznam samo svojih modulov, ne vseh.

| | |
|---|---|
| **Vhod** | En modul, ki pripada učitelju |
| **Pričakovan rezultat** | Seznam z 1 elementom |

---

### `getMyModules_returnsEmptyListForNewTeacher` — ⚠️ Robni primer
> **Cilj:** Preveriti da nov učitelj brez ustvarjenih modulov dobi prazen seznam brez napake.

| | |
|---|---|
| **Vhod** | `uciteljId` brez povezanih modulov |
| **Pričakovan rezultat** | Prazen seznam |

---

## PredmetMapperTest

> Testi pokrivajo pretvorbo med JPA entitetami in DTO objekti v obe smeri.

---

### `toResponse_mapsAllFields` — ✅ Pravilen primer
> **Cilj:** Preveriti da mapper pravilno preslika vsa polja iz entitete v DTO, vključno z imenom učitelja iz profila.

| | |
|---|---|
| **Vhod** | `Predmet` entiteta z vsemi polji, `Profil` z imenom |
| **Pričakovan rezultat** | DTO vsebuje pravilen naziv, kodo vpisa, ime učitelja, status objave |

---

### `toResponse_returnsUnknownWhenProfileNull` — ⚠️ Robni primer
> **Cilj:** Preveriti da mapper ne pade, ko profil učitelja ni na voljo, temveč vrne nadomestno vrednost.

| | |
|---|---|
| **Vhod** | `Predmet` entiteta, `profil = null` |
| **Pričakovan rezultat** | `uciteljImePriimek = "Neznan"` |

---

### `toEntity_mapsAllFields` — ✅ Pravilen primer
> **Cilj:** Preveriti da mapper pravilno preslika DTO v entiteto in nastavi čas ustvarjanja.

| | |
|---|---|
| **Vhod** | `PredmetRequestDTO` z nazivom, opisom, kodo, težavnostjo in `uciteljId` |
| **Pričakovan rezultat** | Entiteta z ustreznimi vrednostmi in nastavljenim `ustvarjenOb` |

---

## PredmetControllerTest

> Testi pokrivajo vse REST endpointe in preverjanje vlog (`ucitelj` / `ucenec`). Vsak zaščiten endpoint je testiran z obema vlogama.

---

### `getPublished_returnsModuleList` — ✅ Pravilen primer
> **Cilj:** Preveriti da javni endpoint brez avtentikacije vrne seznam objavljenih modulov.

| | |
|---|---|
| **Vhod** | Brez avtentikacije |
| **Pričakovan rezultat** | HTTP 200, seznam z 1 elementom |

---

### `getById_returnsModule` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint vrne posamezen modul po ID-ju.

| | |
|---|---|
| **Vhod** | Veljavni UUID modula |
| **Pričakovan rezultat** | HTTP 200, modul z ustreznim nazivom |

---

### `getMyModules_returns403WithoutRole` — ❌ Napačen primer
> **Cilj:** Preveriti da sistem zavrne dostop, ko uporabnik nima profila v bazi.

| | |
|---|---|
| **Vhod** | JWT z veljavnim `subject`, brez ujemajočega profila |
| **Pričakovan rezultat** | HTTP 403 |

---

### `getMyModules_returnsTeacherModules` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno dobi seznam svojih modulov.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj` |
| **Pričakovan rezultat** | HTTP 200, seznam modulov |

---

### `create_teacherCreatesModule` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno ustvari nov modul.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljaven `PredmetRequestDTO` |
| **Pričakovan rezultat** | HTTP 200, ustvarjeni modul |

---

### `create_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more ustvariti modula — kršitev avtorizacijskih pravil.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `delete_teacherDeletes` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno izbriše svoj modul.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljavni UUID modula |
| **Pričakovan rezultat** | HTTP 204 No Content |

---

### `delete_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more brisati modulov — kršitev avtorizacijskih pravil.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `update_teacherUpdatesModule` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno posodobi podatke svojega modula.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljavni UUID, posodobljeni DTO |
| **Pričakovan rezultat** | HTTP 200, posodobljeni modul |

---

### `update_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more urejati modulov — kršitev avtorizacijskih pravil.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |

---

### `publish_teacherPublishes` — ✅ Pravilen primer
> **Cilj:** Preveriti da učitelj uspešno objavi modul.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucitelj`, veljavni UUID modula |
| **Pričakovan rezultat** | HTTP 200, objavljen modul |

---

### `publish_studentGets403` — ❌ Napačen primer
> **Cilj:** Preveriti da učenec ne more objavljati modulov — kršitev avtorizacijskih pravil.

| | |
|---|---|
| **Vhod** | JWT z vlogo `ucenec` |
| **Pričakovan rezultat** | HTTP 403 |
