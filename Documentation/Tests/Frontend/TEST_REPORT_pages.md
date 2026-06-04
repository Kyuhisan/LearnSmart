# Poročilo Testov — Strani (Prijava, Registracija, Nadzorna plošča)

| | |
|---|---|
| **Issue** | S5-01 |
| **Datum** | 3. 6. 2026 |
| **Framework** | Vitest + React Testing Library |
| **Avtor** | Tilen Brunec |

---

## Pokrite komponente

| Komponenta | Vloga |
|---|---|
| `LoginPage` | Stran za prijavo z Google OAuth |
| `DashboardPage` | Vstopna stran — razvejitvena točka med vlogama |
| `RegisterPage` | Registracijska forma za nove uporabnike |

---

## Statistika

| Testna datoteka | Skupaj | ✅ Pravilen | ⚠️ Robni | ❌ Napačen |
|---|:---:|:---:|:---:|:---:|
| `LoginPage.test.tsx` | 5 | 4 | 1 | 0 |
| `DashboardPage.test.tsx` | 3 | 2 | 1 | 0 |
| `RegisterPage.test.tsx` | 8 | 3 | 1 | 4 |
| **Skupaj** | **16** | **9** | **3** | **4** |

### Legenda

| Oznaka | Pomen |
|---|---|
| ✅ **Pravilen primer** | Normalen potek — vse deluje kot pričakovano |
| ⚠️ **Robni primer** | Mejni pogoji — stanje nalaganja, prijavljena seja |
| ❌ **Napačen primer** | Napačni vhodi ali napake API klica |

---

## LoginPage.test.tsx

> Testi pokrivajo upodobitev prijavne strani in interakcijo z Google OAuth gumbom. Kontekst `useAuth` je nadomešten z `mock` objektom, ki simulira različna stanja seje.

---

### `renders the "Continue with Google" button` — ✅ Pravilen primer
> **Cilj:** Preveriti da je OAuth gumb prisoten pri nalaganju strani.

| | |
|---|---|
| **Vhod** | Prijavna stran brez aktivne seje (`session: null`) |
| **Pričakovan rezultat** | Gumb z besedilom "Continue with Google" je v DOM-u |

---

### `renders the "Welcome back!" heading` — ✅ Pravilen primer
> **Cilj:** Preveriti da je naslov dobrodošlice prikazan.

| | |
|---|---|
| **Vhod** | Prijavna stran brez aktivne seje |
| **Pričakovan rezultat** | Naslov "Welcome back!" je v DOM-u |

---

### `renders the "NEW HERE?" info box` — ✅ Pravilen primer
> **Cilj:** Preveriti da informacijska sekcija za nove uporabnike je prikazana.

| | |
|---|---|
| **Vhod** | Prijavna stran brez aktivne seje |
| **Pričakovan rezultat** | Element z besedilom "NEW HERE?" je v DOM-u |

---

### `calls signInWithGoogle when the button is clicked` — ✅ Pravilen primer
> **Cilj:** Preveriti da klik na OAuth gumb sproži funkcijo za prijavo.

| | |
|---|---|
| **Vhod** | Klik na gumb "Continue with Google" |
| **Pričakovan rezultat** | `signInWithGoogle` je bila poklicana enkrat |

---

### `does not render the sign-in button when a session exists` — ⚠️ Robni primer
> **Cilj:** Preveriti da prijavni gumb ni prikazan, ko je uporabnik že prijavljen.

| | |
|---|---|
| **Vhod** | Aktivna seja (`session: { access_token: "..." }`) |
| **Pričakovan rezultat** | Gumb "Continue with Google" ni v DOM-u |

---

## DashboardPage.test.tsx

> Testi pokrivajo razvejitveno logiko nadzorne plošče — prikaz nalagalnika med preverjanjem profila ter upodobitev pravilne vsebine glede na vlogo. Komponente `StudentDashboard`, `ProfessorDashboard`, `AppHeader` in `Sidebar` so nadomeščene z `mock` različicami.

---

### `shows a loading indicator when profil is null` — ⚠️ Robni primer
> **Cilj:** Preveriti da se nalagalnik prikaže, dokler profil še ni naložen.

| | |
|---|---|
| **Vhod** | `profil: null` v `useAuth` kontekstu |
| **Pričakovan rezultat** | Element z razredom `.page-loader` je v DOM-u |

---

### `renders StudentDashboard for the ucenec role` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vsebina za učenca upodobi ob vlogi `ucenec`.

| | |
|---|---|
| **Vhod** | `profil.vloga = "ucenec"` |
| **Pričakovan rezultat** | `StudentDashboard` mock je upodobljen |

---

### `renders ProfessorDashboard for the ucitelj role` — ✅ Pravilen primer
> **Cilj:** Preveriti da se vsebina za učitelja upodobi ob vlogi `ucitelj`.

| | |
|---|---|
| **Vhod** | `profil.vloga = "ucitelj"` |
| **Pričakovan rezultat** | `ProfessorDashboard` mock je upodobljen |

---

## RegisterPage.test.tsx

> Testi pokrivajo celoten tok registracije — preverjanje statusa novega uporabnika, prikaz forme, validacijo vnosa in oddajo zahtevka. `useNavigate` iz react-router-dom je nadomeščen z `mock` funkcijo za preverjanje preusmeritev. Klic `supabase.auth.getSession()` je prav tako nadomešten.

---

### `shows loading state while checking user status` — ⚠️ Robni primer
> **Cilj:** Preveriti da se nalagalnik prikaže med čakanjem na odgovor `/api/me/status`.

| | |
|---|---|
| **Vhod** | Zahtevek `/api/me/status` je v stanju čakanja (nikoli ne odgovori) |
| **Pričakovan rezultat** | Element z razredom `.page-loader` je v DOM-u |

---

### `renders the registration form once status check passes` — ✅ Pravilen primer
> **Cilj:** Preveriti da se registracijska forma prikaže po uspešnem preverjanju statusa.

| | |
|---|---|
| **Vhod** | `/api/me/status` vrne `{ isNewUser: true }` |
| **Pričakovan rezultat** | Vidno je vnosno polje s primerkom "e.g. johndoe" ter gumba `STUDENT` in `TEACHER` |

---

### `shows an error when username is empty` — ❌ Napačen primer
> **Cilj:** Preveriti da validacija zavrne prazno uporabniško ime.

| | |
|---|---|
| **Vhod** | Oddaja forme z praznim poljem za ime |
| **Pričakovan rezultat** | Sporočilo "Please enter a username!" je v DOM-u |

---

### `shows an error when username is shorter than 3 chars` — ❌ Napačen primer
> **Cilj:** Preveriti da validacija zavrne ime, krajše od 3 znakov.

| | |
|---|---|
| **Vhod** | Vnos "ab" v polje za ime, oddaja forme |
| **Pričakovan rezultat** | Sporočilo "Username must be at least 3 characters!" je v DOM-u |

---

### `shows an error when username contains invalid characters` — ❌ Napačen primer
> **Cilj:** Preveriti da validacija zavrne ime s prepovedanimi znaki (presledki, posebni znaki).

| | |
|---|---|
| **Vhod** | Vnos "bad name!" v polje za ime, oddaja forme |
| **Pričakovan rezultat** | Sporočilo z besedilom "only contain letters" je v DOM-u |

---

### `clicking TEACHER changes the submit button label` — ✅ Pravilen primer
> **Cilj:** Preveriti da izbira vloge `TEACHER` posodobi besedilo potrditvenega gumba.

| | |
|---|---|
| **Vhod** | Klik na možnost `TEACHER` |
| **Pričakovan rezultat** | Gumb z besedilom "Start Teaching" je prisoten |

---

### `navigates to /questionnaire after successful student registration` — ✅ Pravilen primer
> **Cilj:** Preveriti da se po uspešni registraciji učenca izvede preusmeritev na vprašalnik.

| | |
|---|---|
| **Vhod** | Veljavno ime, `/api/me/complete-registration` vrne `{ vloga: "ucenec" }` |
| **Pričakovan rezultat** | `navigate("/questionnaire")` je bila poklicana |

---

### `shows error message when API returns an error` — ❌ Napačen primer
> **Cilj:** Preveriti da se sporočilo iz napake API klica prikaže uporabniku.

| | |
|---|---|
| **Vhod** | `/api/me/complete-registration` vrne `{ message: "Username already taken." }` s statusom 409 |
| **Pričakovan rezultat** | Sporočilo "Username already taken." je v DOM-u |
