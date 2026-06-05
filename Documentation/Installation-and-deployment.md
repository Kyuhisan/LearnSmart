# Installation and Deployment

## System Requirements

The LearnSmart application follows a client-server architecture consisting of a React frontend and a Spring Boot backend. To deploy and run the system, the following software components are required:

- Java Development Kit (JDK) 21
- Node.js 20 or newer
- npm package manager
- PostgreSQL database
- Git version control system
- FFmpeg and FFprobe multimedia tools
- Internet access for communication with external AI services

The application also requires access to several external cloud services:

- Supabase Authentication
- Supabase Storage
- Google Gemini API
- OpenAI Whisper API
- Google Text-to-Speech API

## Backend Installation

The backend component is implemented using Spring Boot and Java 21.

The source code is obtained by cloning the project repository:

```bash
git clone https://github.com/Kyuhisan/LearnSmart.git
cd LearnSmart/Backend
```

The backend configuration is stored in the file:

```text
src/main/resources/application-local.properties
```

The following configuration parameters must be provided:

- PostgreSQL database URL
- PostgreSQL username
- PostgreSQL password
- Supabase project URL
- Supabase service key
- Supabase anonymous key
- Supabase JWT JWK endpoint
- Google Gemini API key
- OpenAI API key
- Google Text-to-Speech API key
- Frontend application URL
- SMTP email configuration

After configuration, the backend can be started using Maven:

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

The REST API becomes available on port 8081.

## Frontend Installation

The frontend is implemented using React, TypeScript and Vite.

Navigate to the frontend directory:

```bash
cd LearnSmart/Frontend
```

Create the environment configuration file and provide the required variables:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=
```

Install project dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

The frontend application becomes available on port 5173.

## Database Configuration

LearnSmart uses PostgreSQL as the primary relational database.

Before running the application, a PostgreSQL database instance must be created. The backend connects to the database through the JDBC connection string defined in the application configuration.

Database schema generation is handled automatically by the Spring Boot application during startup.

## External Service Configuration

Several external services are integrated into the application.

### Supabase

Supabase provides:

- Google OAuth authentication
- JWT token generation
- User session management
- Cloud file storage

The backend validates JWT tokens using the Supabase JWK endpoint.

### Google Gemini API

Gemini is used to generate personalized learning materials based on uploaded educational content and the learner's preferred VARK learning style.

### OpenAI Whisper API

Whisper is used for automatic speech-to-text transcription of uploaded audio and video files.

### Google Text-to-Speech API

Google TTS converts generated narration scripts into audio recordings used in auditory learning packs.

### FFmpeg

FFmpeg and FFprobe are used to process uploaded video files. Audio tracks are extracted from videos before transcription is performed through Whisper.

## Deployment Architecture

The production deployment consists of the following components:

- Frontend hosted on Vercel
- Backend hosted on Render
- PostgreSQL database
- Supabase Authentication and Storage services
- External AI services (Gemini, Whisper, Google TTS)

The frontend communicates with the backend through REST APIs secured using JWT authentication. The backend interacts with the database, cloud storage and AI services to generate adaptive educational content.

## Verification

After deployment, the following checks should be performed:

1. Verify successful user authentication through Google OAuth.
2. Upload a PDF, audio or video file.
3. Confirm successful transcript generation.
4. Confirm generation of personalized learning materials.
5. Verify generation of auditory content and audio playback.
6. Verify correct storage of generated content within the database.

Successful completion of these tests confirms that the deployment has been completed correctly.