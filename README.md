# LearnSmart

## Git Workflow & Navodila za Prispevanje

## Struktura vej
 
```
main
└── development
    ├── feature/S1-01-google-oauth
    ├── feature/S1-02-jwt-validacija
    └── feature/S2-01-crud-moduli
```
 
| Veja | Namen | Kdo pusha |
|------|--------|-----------|
| `main` | Produkcijska koda — samo merge iz `development` | Nihče direktno |
| `development` | Aktivna razvojna veja — integracija sprintov | Samo preko Pull Requesta |
| `feature/...` | Ena veja = en issue | Vsak član |
 
---

## Postopek dela na novi funkcionalnosti
 
### 1. Posodobi lokalni `development`
```
git checkout development
git pull origin development
```
 
### 2. Ustvari feature vejo
 
Poimenuj jo po številki issue-a in kratkem opisu:
 
```
git checkout -b feature/S1-01-google-oauth
```
 
Primeri:
```
feature/S1-03-ai-vprasalnik
feature/S2-05-supabase-storage
feature/S3-02-quiz-submit-endpoint
```
 
### 3. Razvoj & Commit
```
git add .
git commit -m "Dodaj Google OAuth prijavo"
```

### 4. Pushaj na GitHub
```
git push origin feature/S1-01-google-oauth
```
 
### 5. Odpri Pull Request
1. Pojdi na [github.com/Kyuhisan/LearnSmart](https://github.com/Kyuhisan/LearnSmart)
2. Klikni **"Compare & pull request"**
3. Nastavi: **base: `development`** ← **compare: `feature/S1-01-google-oauth`**
4. V opis PR-ja dodaj `Closes #1` (številka issue-a)
5. Dodaj reviewerja (enega od članov ekipe)
6. Klikni **"Create pull request"**
   
### 6. Po mergu
Ko je Pull Request sprejet in mergan:
```
git checkout development
git pull origin development
git branch -d feature/S1-01-google-oauth
```
