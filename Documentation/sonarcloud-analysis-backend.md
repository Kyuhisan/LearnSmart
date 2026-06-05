# Poročilo SonarCloud analize – Backend

## Pregled

Backend komponenta sistema LearnSmart je bila analizirana z uporabo orodja SonarCloud za ocenjevanje kakovosti kode, vzdrževanosti, zanesljivosti in varnosti. Analiza je bila izvedena na Spring Boot backend aplikaciji, razviti v programskem jeziku Java 21.

---

## Stanje Quality Gate

Quality Gate v orodju SonarCloud je trenutno označen kot neuspešen. Neuspešen rezultat je povezan z metriko pokritosti kode, ki je prikazana kot 0,0 %, kljub temu da je SonarCloud zaznal 206 uspešno izvedenih enotnih testov. Kategorije varnosti, zanesljivosti in vzdrževanosti so dosegle najvišjo oceno (A), kar nakazuje, da je razlog za neuspešen rezultat povezan s poročanjem pokritosti kode in ne s kakovostjo same implementacije.

Backend je dosegel naslednje rezultate:

- Varnostna ocena: A
- Ocena zanesljivosti: A
- Ocena vzdrževanosti: A
- Podvojena koda: 0,0 %

Neuspešen rezultat Quality Gate poudarja potrebo po ustrezni integraciji poročil o pokritosti kode in ne težav v sami implementaciji.

---

## Analiza varnosti

Backend je dosegel najvišjo možno varnostno oceno.

| Metrika | Vrednost |
|----------|----------|
| Varnostna ocena | A |
| Varnostne težave | 0 |
| Varnostna opozorila (Hotspots) | 0 |

Med analizo niso bile zaznane nobene varnostne ranljivosti. Prav tako niso bila zaznana nobena varnostna opozorila, ki bi zahtevala ročni pregled.

---

## Analiza zanesljivosti

Backend je dosegel oceno zanesljivosti A.

| Metrika | Vrednost |
|----------|----------|
| Ocena zanesljivosti | A |
| Težave z zanesljivostjo | 35 |

Vse zaznane težave z zanesljivostjo so bile klasificirane kot informativne in ne predstavljajo kritičnih napak, ki bi lahko pomembno vplivale na delovanje aplikacije.

Rezultati kažejo, da je backend implementacija na splošno stabilna in zanesljiva.

---

## Analiza vzdrževanosti

Backend je dosegel oceno vzdrževanosti A.

| Metrika | Vrednost |
|----------|----------|
| Ocena vzdrževanosti | A |
| Težave z vzdrževanostjo | 192 |

Večina ugotovitev na področju vzdrževanosti predstavlja priporočila za izboljšanje kakovosti kode, kot so:

- izboljšanje berljivosti kode,
- zmanjševanje kompleksnosti kode,
- refaktoriranje podvojene logike,
- poenostavljanje implementacij metod,
- izboljšanje doslednosti poimenovanja.

Kljub relativno velikemu številu priporočil ostaja vzdrževanost sistema v najvišji ocenjevalni kategoriji.

---

## Podvajanje kode

Analiza ni zaznala podvojene kode.

| Metrika | Vrednost |
|----------|----------|
| Podvojena koda | 0,0 % |

Rezultat kaže, da backend koda uspešno preprečuje nepotrebno podvajanje in sledi dobrim praksam ponovne uporabe kode.

---

## Pokritost s testi

SonarCloud poroča o 0,0 % pokritosti kode s testi, kljub temu da je zaznal 206 uspešno izvedenih enotnih testov.

| Metrika | Vrednost |
|----------|----------|
| Enotni testi | 206 |
| Uspešnost testov | 100 % |
| Pokritost s testi | 0,0 % |

Razlika med številom zaznanih testov in prikazano pokritostjo nakazuje, da podatki o pokritosti kode med postopkom analize niso bili uspešno uvoženi v SonarCloud. Čeprav so podatki o izvedbi testov na voljo, platforma ni prejela ustreznih poročil o pokritosti, zato dejanskega odstotka pokrite kode ni mogla izračunati.

Prihodnje izboljšave bi morale vključevati pravilno integracijo poročil JaCoCo s SonarCloud, kar bi omogočilo natančno merjenje pokritosti kode in pravilno ocenjevanje Quality Gate.

---

## Povzetek

Analiza SonarCloud kaže, da backend sistema LearnSmart dosega visoko raven varnosti, zanesljivosti in vzdrževanosti. Analiza ni zaznala nobenih varnostnih ranljivosti ali podvojene kode, vse glavne kategorije kakovosti pa so dosegle najvišjo oceno (A).

Glavno področje za izboljšave predstavlja integracija poročil o pokritosti kode s SonarCloud. Čeprav backend vsebuje 206 uspešno izvedenih enotnih testov, se podatki o pokritosti trenutno ne odražajo v rezultatih analize. Odprava te težave bi omogočila natančnejše meritve kakovosti in izboljšala ocenjevanje v okviru Quality Gate.