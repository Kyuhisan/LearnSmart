# Poročilo Testov — Avtentikacija in Registracija

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
| `AuthControler` | REST endpointi za identiteto in registracijo uporabnika |
| `UserService` | Servis za posodabljanje učnega stila v Supabase |

---

## Statistika

| Razred | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `AuthControlerTest` | 5 | 1 | 2 | 2 |
| `UserServiceTest` | 2 | 0 | 0 | 2 |
| **Skupaj** | **7** | **1** | **2** | **4** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — null vrednosti, manjkajoči podatki |
| ❌ **Napačen primer** | Napačni vhodi ali nedosegljivi zunanji sistemi |

---

## AuthControlerTest

> Testi pokrivajo tri endpointe: `GET /api/me`, `GET /api/me/status` in `POST /api/me/complete-registration`. Ker endpointa `/status` in `/complete-registration` kličeta Supabase REST API, testi preverjajo obnašanje ob nedosegljivosti zunanjega sistema.

---

### `getCurrentUser_returnsUserData` — ✅ Pravilen primer
> **Cilj:** Preveriti da endpoint pravilno vrne identiteto prijavljenega uporabnika iz JWT zahtevkov.

| | |
|---|---|
| **Vhod** | JWT z `subject`, `email` in `user_metadata.full_name` |
| **Pričakovan rezultat** | Mapa z `id`, `email`, `name` |

---

### `getCurrentUser_handlesNullMetadata` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint ne pade, ko `user_metadata` ni prisoten v JWT — npr. pri OAuth prijavi brez profila.

| | |
|---|---|
| **Vhod** | JWT brez `user_metadata` (`null`) |
| **Pričakovan rezultat** | `name = ""` |

---

### `getCurrentUser_handlesNullEmail` — ⚠️ Robni primer
> **Cilj:** Preveriti da endpoint ne pade, ko e-poštni naslov ni prisoten v JWT.

| | |
|---|---|
| **Vhod** | JWT brez `email` zahtevka (`null`) |
| **Pričakovan rezultat** | `email = ""` |

---

### `getUserStatus_throwsWhenSupabaseUnavailable` — ❌ Napačen primer
> **Cilj:** Preveriti da endpoint vrže napako, ko Supabase ni dosegljiv.

| | |
|---|---|
| **Vhod** | JWT z veljavnim `subject`, nedosegljivi Supabase |
| **Pričakovan rezultat** | `Exception` |

---

### `completeRegistration_throwsWhenSupabaseUnavailable` — ❌ Napačen primer
> **Cilj:** Preveriti da registracijski endpoint vrže napako, ko Supabase ni dosegljiv.

| | |
|---|---|
| **Vhod** | JWT z veljavnim `subject`, `username` in `vloga`, nedosegljivi Supabase |
| **Pričakovan rezultat** | `Exception` |

---

## UserServiceTest

> Testi pokrivajo servis za posodabljanje učnega stila uporabnika. Ker servis neposredno komunicira s Supabase REST API-jem, testi preverjajo odpornost na napake zunanje storitve.

---

### `updateLearningStyle_throwsWhenSupabaseUnavailable` — ❌ Napačen primer
> **Cilj:** Preveriti da servis vrže `RuntimeException`, ko Supabase ni dosegljiv.

| | |
|---|---|
| **Vhod** | Veljavni `userId`, stil `"VISUAL"`, nedosegljivi Supabase |
| **Pričakovan rezultat** | `RuntimeException` |

---

### `updateLearningStyle_throwsWithInvalidUrl` — ❌ Napačen primer
> **Cilj:** Preveriti da servis ustrezno obravnava neveljavno URL konfiguracijo v `application.properties`.

| | |
|---|---|
| **Vhod** | Neveljavni Supabase URL `"invalid-url"` |
| **Pričakovan rezultat** | `RuntimeException` |
