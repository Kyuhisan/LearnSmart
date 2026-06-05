# Namestitev in nameščanje sistema

## Sistemske zahteve

Aplikacija LearnSmart uporablja arhitekturo odjemalec–strežnik, ki jo sestavljata React frontend in Spring Boot backend. Za namestitev in zagon sistema so potrebne naslednje programske komponente:

- Java Development Kit (JDK) 21
- Node.js 20 ali novejši
- Upravitelj paketov npm
- Podatkovna baza PostgreSQL
- Sistem za nadzor različic Git
- Večpredstavnostni orodji FFmpeg in FFprobe
- Dostop do interneta za komunikacijo z zunanjimi storitvami umetne inteligence

Aplikacija potrebuje tudi dostop do naslednjih zunanjih oblačnih storitev:

- Supabase Authentication
- Supabase Storage
- Google Gemini API
- OpenAI Whisper API
- Google Text-to-Speech API

## Namestitev zalednega dela (Backend)

Zaledni del sistema je implementiran z uporabo ogrodja Spring Boot in programskega jezika Java 21.

Izvorno kodo pridobimo s kloniranjem repozitorija projekta:

```bash
git clone https://github.com/Kyuhisan/LearnSmart.git
cd LearnSmart/Backend
```

Konfiguracija zalednega dela je shranjena v datoteki:

```text
src/main/resources/application-local.properties
```

Potrebno je nastaviti naslednje konfiguracijske parametre:

- URL povezave do podatkovne baze PostgreSQL
- Uporabniško ime za PostgreSQL
- Geslo za PostgreSQL
- URL projekta Supabase
- Servisni ključ Supabase
- Anonimni ključ Supabase
- Supabase JWT JWK končna točka
- API ključ Google Gemini
- API ključ OpenAI
- API ključ Google Text-to-Speech
- URL frontend aplikacije
- SMTP konfiguracija za elektronsko pošto

Po nastavitvi konfiguracije lahko zaledni del zaženemo z Mavenom:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

REST API bo dostopen na vratih 8081.

## Namestitev čelnega dela (Frontend)

Čelni del sistema je implementiran z uporabo React, TypeScript in Vite.

Premaknemo se v mapo frontend aplikacije:

```bash
cd LearnSmart/Frontend
```

Ustvarimo konfiguracijsko datoteko okolja in nastavimo potrebne spremenljivke:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=
```

Namestimo odvisnosti projekta:

```bash
npm install
```

Zaženemo razvojni strežnik:

```bash
npm run dev
```

Frontend aplikacija bo dostopna na vratih 5173.

## Konfiguracija podatkovne baze

LearnSmart uporablja PostgreSQL kot primarno relacijsko podatkovno bazo.

Pred zagonom aplikacije je potrebno ustvariti instanco podatkovne baze PostgreSQL. Zaledni del se povezuje na podatkovno bazo preko JDBC povezovalnega niza, ki je definiran v konfiguraciji aplikacije.

Generiranje podatkovne sheme se ob zagonu aplikacije izvaja samodejno preko Spring Boot ogrodja.

## Konfiguracija zunanjih storitev

Aplikacija uporablja več zunanjih storitev.

### Supabase

Supabase zagotavlja:

- Avtentikacijo z Google OAuth
- Generiranje JWT žetonov
- Upravljanje uporabniških sej
- Oblačno shranjevanje datotek

Zaledni del preverja JWT žetone preko Supabase JWK končne točke.

### Google Gemini API

Gemini se uporablja za generiranje prilagojenih učnih gradiv na podlagi naloženih izobraževalnih vsebin in uporabnikovega VARK učnega stila.

### OpenAI Whisper API

Whisper se uporablja za samodejno pretvorbo govora v besedilo pri obdelavi zvočnih in video datotek.

### Google Text-to-Speech API

Google TTS pretvarja generirane pripovedne scenarije v zvočne posnetke, ki se uporabljajo v avditivnih učnih paketih.

### FFmpeg

FFmpeg in FFprobe se uporabljata za obdelavo video datotek. Iz video posnetkov se najprej izloči zvočni zapis, ki se nato obdela s storitvijo Whisper.

## Arhitektura nameščanja

Produkcijsko okolje sestavljajo naslednje komponente:

- Frontend gostovan na Vercel
- Backend gostovan na Render
- Podatkovna baza PostgreSQL
- Storitvi Supabase Authentication in Supabase Storage
- Zunanje storitve umetne inteligence (Gemini, Whisper in Google TTS)

Frontend komunicira z backendom preko REST API-jev, zaščitenih z JWT avtentikacijo. Backend komunicira s podatkovno bazo, oblačno shrambo in storitvami umetne inteligence za generiranje prilagojenih učnih vsebin.

## Preverjanje delovanja

Po namestitvi sistema je priporočljivo izvesti naslednja preverjanja:

1. Preveriti uspešno prijavo uporabnika preko Google OAuth.
2. Naložiti PDF, zvočno ali video datoteko.
3. Potrditi uspešno generiranje prepisa vsebine.
4. Potrditi uspešno generiranje prilagojenih učnih gradiv.
5. Preveriti generiranje avditivnih vsebin in predvajanje zvoka.
6. Preveriti pravilno shranjevanje generiranih vsebin v podatkovni bazi.

Uspešna izvedba vseh preverjanj potrjuje pravilno nameščen in delujoč sistem.