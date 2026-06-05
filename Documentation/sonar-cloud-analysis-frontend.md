# Poročilo SonarCloud analize – Frontend

## Pregled

Frontend komponenta sistema LearnSmart je bila analizirana z uporabo orodja SonarCloud za ocenjevanje kakovosti kode, vzdrževanosti, zanesljivosti, varnosti in pokritosti s testi. Analiza je bila izvedena na frontend aplikaciji, razviti z uporabo React in TypeScript tehnologij.

---

## Stanje Quality Gate

Quality Gate v orodju SonarCloud je trenutno označen kot neuspešen.

Tri kakovostni pogoji niso bili izpolnjeni:

- Ocena zanesljivosti je pod zahtevanim pragom.
- Pokritost kode s testi je pod zahtevanim pragom.
- Delež podvojene kode presega dovoljeno mejo.

| Metrika | Vrednost |
|----------|----------|
| Quality Gate | Neuspešen |
| Število neizpolnjenih pogojev | 3 |

Kljub navedenim težavam frontend ohranja visoko stopnjo vzdrževanosti in ne vsebuje nerešenih varnostnih opozoril.

---

## Analiza varnosti

Frontend je dosegel varnostno oceno B.

| Metrika | Vrednost |
|----------|----------|
| Varnostna ocena | B |
| Varnostne težave | 2 |
| Varnostna opozorila (Hotspots) | 0 |

Analiza je zaznala dve varnostni težavi nizke stopnje resnosti. Prav tako niso bila zaznana nobena nerešena varnostna opozorila, ki bi zahtevala ročni pregled.

---

## Analiza zanesljivosti

Frontend je dosegel oceno zanesljivosti C.

| Metrika | Vrednost |
|----------|----------|
| Ocena zanesljivosti | C |
| Težave z zanesljivostjo | 117 |

Ugotovljene težave z zanesljivostjo so večinoma povezane z dostopnostjo, obravnavo uporabniških interakcij in upoštevanjem najboljših praks pri razvoju React aplikacij. Primeri vključujejo manjkajočo podporo za dogodke tipkovnice pri elementih, ki jih je mogoče klikniti, ter uporabo nenativnih interaktivnih elementov brez ustreznih atributov za dostopnost.

Čeprav te težave ne povzročajo kritičnih napak v delovanju aplikacije, bi njihova odprava izboljšala uporabniško izkušnjo, skladnost z dostopnostnimi smernicami in splošno zanesljivost frontend aplikacije.

Izboljšanje zanesljivosti ostaja eno izmed pomembnejših področij za nadaljnji razvoj.

---

## Analiza vzdrževanosti

Frontend je dosegel najvišjo oceno vzdrževanosti.

| Metrika | Vrednost |
|----------|----------|
| Ocena vzdrževanosti | A |
| Težave z vzdrževanostjo | 396 |

Večina ugotovljenih težav z vzdrževanostjo predstavlja priporočila za izboljšanje kakovosti kode ter upoštevanje najboljših praks pri razvoju aplikacij React in TypeScript. Med najpogostejšimi primeri so:

- zmanjševanje kognitivne kompleksnosti obsežnih funkcij,
- izboljšanje berljivosti pogojnih izrazov,
- izogibanje uporabi indeksov tabel kot React ključev,
- označevanje lastnosti komponent kot nespremenljivih (readonly),
- poenostavitev implementacije komponent in izboljšanje konsistentnosti kode.

Čeprav je bilo zaznanih relativno veliko priporočil za izboljšave, gre večinoma za opozorila tipa »code smell« in ne za kritične napake. Zaradi tega je frontend kljub temu dosegel najvišjo oceno vzdrževanosti (A).

---

## Podvajanje kode

Analiza je zaznala podvojene dele kode znotraj frontend aplikacije.

| Metrika | Vrednost |
|----------|----------|
| Podvojena koda | 4,6 % |

Delež podvojene kode presega nastavljeno mejo kakovosti 3,0 %, kar prispeva k neuspešnemu rezultatu Quality Gate.

---

## Pokritost s testi

SonarCloud poroča o 0,0 % pokritosti kode s testi.

| Metrika | Vrednost |
|----------|----------|
| Pokritost s testi | 0,0 % |

Čeprav projekt vsebuje poročila o izvedenih frontend testih, podatki o pokritosti kode trenutno niso prikazani v SonarCloud analizi. To nakazuje, da podatki o pokritosti med postopkom analize niso bili uspešno uvoženi.

Pravilna integracija orodij za merjenje pokritosti kode s SonarCloud bi omogočila natančnejše merjenje pokritosti in izboljšala ocenjevanje v okviru Quality Gate.

---

## Povzetek

Analiza SonarCloud kaže, da frontend aplikacija LearnSmart dosega odlično stopnjo vzdrževanosti in na splošno dobro raven varnosti, brez zaznanih nerešenih varnostnih opozoril.

Prihodnje izboljšave naj se osredotočijo na zmanjšanje podvojene kode, odpravljanje težav z zanesljivostjo ter integracijo poročil o pokritosti kode s testi v SonarCloud, kar bo omogočilo natančnejšo oceno kakovosti frontend aplikacije.