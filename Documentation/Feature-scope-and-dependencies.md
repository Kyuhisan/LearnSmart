# Obseg funkcionalnosti in odvisnosti

## Obseg funkcionalnosti

### Avtentikacija in avtorizacija uporabnikov

Sistem omogoča varno avtentikacijo uporabnikov z uporabo Google OAuth preko storitve Supabase Authentication.

Funkcionalnosti vključujejo:

- Registracijo in prijavo uporabnikov z Google računom
- Avtentikacijo na osnovi JWT žetonov
- Upravljanje uporabniških sej
- Nadzor dostopa na podlagi vlog
- Varen dostop do API-ja

---

### Upravljanje učnih predmetov

Učitelji lahko ustvarjajo in upravljajo učne predmete ter izobraževalne vire.

Funkcionalnosti vključujejo:

- Ustvarjanje in upravljanje predmetov
- Organizacijo učnih gradiv
- Nalaganje datotek
- Kategorizacijo virov

---

### Obdelava datotek in pridobivanje vsebine

Sistem podpira več formatov datotek in samodejno pridobiva izobraževalno vsebino.

Podprte vrste datotek:

- PDF dokumenti
- Zvočni posnetki
- Video posnetki

Funkcionalnosti vključujejo:

- Izvleček besedila iz PDF dokumentov
- Transkripcijo zvočnih posnetkov
- Izločanje zvoka iz video posnetkov
- Pretvorbo govora v besedilo
- Generiranje združenega prepisa

---

### Generiranje učnih gradiv s pomočjo umetne inteligence

LearnSmart uporablja umetno inteligenco za pretvorbo naloženih učnih gradiv v prilagojene učne vire.

Funkcionalnosti vključujejo:

- Generiranje učnih vsebin
- Prilagajanje vsebin posameznemu uporabniku
- Samodejno povzemanje vsebine
- Prestrukturiranje vsebine
- Ustvarjanje učnih paketov

---

### Upravljanje učnih gradiv

Učitelji lahko pregledajo in urejajo generirana učna gradiva, preden so predstavljena študentom.

Funkcionalnosti vključujejo:

- Pregled generiranih učnih vsebin
- Urejanje gradiv za bralni način učenja
- Urejanje gradiv za kinestetični način učenja
- Ponovno generiranje učnih vsebin po potrebi
- Upravljanje učnih virov po generiranju

---

### Podpora učnim stilom VARK

Sistem generira učna gradiva v skladu z modelom VARK.

Podprti učni stili:

- Vizualni
- Avditivni
- Bralno-pisalni
- Kinestetični

Generirana vsebina je prilagojena za izboljšanje učinkovitosti učenja posameznega uporabnika.

---

### Generiranje kvizov in preverjanja znanja

Platforma samodejno ustvarja gradiva za preverjanje znanja na podlagi učnih vsebin.

Funkcionalnosti vključujejo:

- Interaktivne kvize
- Preverjanje znanja
- Samodejno generiranje vprašanj
- Podporo spremljanju učnega napredka

---

### Sistem igrifikacije

Platforma vključuje elemente igrifikacije za povečanje motivacije in angažiranosti uporabnikov.

Funkcionalnosti vključujejo:

- Nagrajevanje z izkustvenimi točkami (XP) za rešene kvize
- Sistem dosežkov in značk
- Spremljanje učnih nizov (streakov)
- Nagrade za tridnevne učne nize
- Prepoznavanje učnih dosežkov

---

### Generiranje zvočnih učnih gradiv

Sistem omogoča ustvarjanje zvočnih učnih gradiv.

Funkcionalnosti vključujejo:

- Generiranje pripovednih scenarijev
- Pretvorbo besedila v govor
- Generiranje zvočnih datotek
- Shranjevanje zvočnih vsebin

---

### Integracija oblačne shrambe

Izobraževalni viri in generirana vsebina se shranjujejo v oblačno infrastrukturo.

Funkcionalnosti vključujejo:

- Shranjevanje datotek
- Shranjevanje zvočnih vsebin
- Pridobivanje virov
- Varen nadzor dostopa

---

## Zunanje odvisnosti

### Osnovne tehnologije

| Komponenta | Tehnologija |
|------------|------------|
| Frontend | React 19 |
| Programski jezik | TypeScript |
| Orodje za gradnjo | Vite |
| Backend | Spring Boot 4 |
| Programski jezik | Java 21 |
| Podatkovna baza | PostgreSQL |

---

### Storitve za avtentikacijo

#### Supabase Authentication

Uporablja se za:

- Prijavo z Google OAuth
- Generiranje JWT žetonov
- Upravljanje uporabniških sej
- Avtentikacijo uporabnikov

---

### Storitve umetne inteligence

Aplikacija uporablja zunanje storitve umetne inteligence za generiranje vsebin, prepis govora in sintezo zvoka.

- Google Gemini API
- OpenAI Whisper API
- Google Text-to-Speech API

---

### Orodja za obdelavo večpredstavnostnih vsebin

#### FFmpeg in FFprobe

Uporabljata se za:

- Obdelavo video posnetkov
- Izločanje zvoka
- Pretvorbo medijskih formatov
- Analizo medijskih datotek
- Zaznavanje zvočnih tokov

---

### Storitve shranjevanja

#### Supabase Storage

Uporablja se za:

- Shranjevanje datotek
- Shranjevanje zvočnih vsebin
- Upravljanje virov

---

## Omejitve in pomanjkljivosti

Trenutna implementacija ima naslednje omejitve:

- Za delovanje funkcionalnosti umetne inteligence je potrebna internetna povezava.
- Kakovost vsebin, generiranih z umetno inteligenco, je odvisna od kakovosti vhodnih gradiv.
- Razpoložljivost zunanjih API storitev lahko vpliva na čas obdelave.
- Trenutno so podprti le formati PDF, zvočne in video datoteke.
- Uporaba storitev umetne inteligence lahko povzroča dodatne stroške delovanja sistema.