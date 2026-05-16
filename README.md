# LearnSmart

![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.6-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

AI-powered adaptive learning platform that personalises content, quizzes, and resources to each student's VARK learning style.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite |
| Backend | Spring Boot 4, Java 21 |
| Database | PostgreSQL |
| Auth | Supabase (Google OAuth + JWT) |
| AI | Google Gemini API |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Architecture

```
LearnSmart/
├── Frontend/   # React + Vite SPA
│   ├── src/
│   │   ├── pages/       # Route shells (Sidebar + role switch only)
│   │   ├── features/    # Page content — one folder per route
│   │   ├── components/  # Shared UI primitives (ComicBox, ComicBtn, …)
│   │   ├── context/     # AuthContext (Supabase session + user profile)
│   │   └── styles/      # Design tokens + per-page CSS
│   └── vercel.json
└── Backend/    # Spring Boot REST API
    └── src/main/java/com/learnSmart/
```

Auth flow: user logs in via Supabase Google OAuth → Supabase issues a JWT → frontend sends it as `Authorization: Bearer <token>` → backend validates via JWK URI.

---

## Prerequisites

- **Node.js** ≥ 20 and npm
- **Java** 21 (JDK)
- **PostgreSQL** database (local or hosted)
- **Git**
- A **Supabase** project (for OAuth + JWT)
- A **Google Gemini** API key

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Kyuhisan/LearnSmart.git
cd LearnSmart
```

### 2. Backend

```bash
cd Backend
```

Create `src/main/resources/application-local.properties` (see [Environment Variables](#environment-variables) below), then run:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
# Windows: mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
```

The API will be available at `http://localhost:8081`.

### 3. Frontend

```bash
cd Frontend
```

Create a `.env` file (see [Environment Variables](#environment-variables) below), then run:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Frontend — `Frontend/.env`

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_API_URL=http://localhost:8081
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL (Settings → API) |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key (Settings → API) |
| `VITE_API_URL` | Backend base URL |

### Backend — `Backend/src/main/resources/application-local.properties`

```properties
DB_URL=jdbc:postgresql://localhost:5432/learnsmart
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
GEMINI_API_KEY=your_gemini_api_key
JWT_JWK_URI=https://<your-project>.supabase.co/auth/v1/.well-known/jwks.json
```

| Variable | Description |
|----------|-------------|
| `DB_URL` | PostgreSQL JDBC connection string |
| `DB_USERNAME` | Database username |
| `DB_PASSWORD` | Database password |
| `GEMINI_API_KEY` | Google Gemini API key |
| `JWT_JWK_URI` | Supabase JWK endpoint for JWT validation |

---

## Git Workflow

```
main
└── development
    └── feature/S<sprint>-<issue>-<short-description>
```

| Branch | Purpose | Who pushes |
|--------|---------|------------|
| `main` | Production — merged from `development` only | Nobody directly |
| `development` | Active integration branch | Via Pull Request only |
| `feature/functionality-name` | One branch per issue | Every team member |

### Working on a new feature

```bash
# 1. Update local development
git checkout development
git pull origin development

# 2. Create feature branch
git checkout -b feature/functionality-name

# 3. Develop, commit
git add .
git commit -m "commit-message"

# 4. Push
git push origin feature/...

# 5. Open Pull Request on GitHub
base: development 
compare: feature/functionality-name
Add "Closes #<issue-number>" in the PR description
Assign a reviewer

# 6. After merge — clean up
git checkout development
git pull origin development
git branch -d feature/functionality-name
```
