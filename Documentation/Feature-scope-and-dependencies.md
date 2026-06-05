# Scope of Features and Dependencies

## Scope of Features

### User Authentication and Authorization

The system supports secure user authentication using Google OAuth through Supabase Authentication.

Features include:

- User registration and login using Google accounts
- JWT-based authentication
- Session management
- Role-based access control
- Secure API access

---

### Course Management

Teachers can create and manage learning subjects and educational resources.

Features include:

- Subject creation and management
- Learning material organization
- File upload functionality
- Resource categorization

---

### File Processing and Content Extraction

The system accepts multiple file formats and extracts educational content automatically.

Supported file types:

- PDF documents
- Audio recordings
- Video recordings

Features include:

- PDF text extraction
- Audio transcription
- Video audio extraction
- Speech-to-text conversion
- Combined transcript generation

---

### AI-Based Learning Material Generation

LearnSmart uses artificial intelligence to transform uploaded educational materials into personalized learning resources.

Features include:

- Learning content generation
- Personalized content adaptation
- Automatic summarization
- Content restructuring
- Learning pack creation

---

### Learning Material Management

Teachers can review and modify generated learning materials before they are presented to students.

Features include:

- Reviewing generated learning content
- Editing reading-based learning materials
- Editing kinesthetic learning materials
- Regenerating learning content when necessary
- Managing learning resources after generation

---

### VARK Learning Style Support

The system generates learning materials according to the VARK learning model.

Supported learning styles:

- Visual
- Auditory
- Read/Write
- Kinesthetic

Generated content is adapted to improve learning effectiveness for each user.

---

### Quiz and Assessment Generation

The platform automatically generates assessment materials from educational content.

Features include:

- Interactive quizzes
- Knowledge validation
- Automated question generation
- Learning progress support

---

### Gamification System

The platform incorporates gamification elements to increase learner engagement and motivation.

Features include:

- Experience point (XP) rewards for completed quizzes
- Achievement badge system
- Learning streak tracking
- Three-day streak rewards
- Recognition of learning accomplishments

---

### Auditory Content Generation

The system can generate audio-based learning materials.

Features include:

- Narration script generation
- Text-to-speech conversion
- Audio file generation
- Audio content storage

---

### Cloud Storage Integration

Educational resources and generated content are stored using cloud infrastructure.

Features include:

- File storage
- Audio storage
- Resource retrieval
- Secure access control

---

## External Dependencies

### Core Technologies

| Component | Technology |
|------------|------------|
| Frontend | React 19 |
| Programming Language | TypeScript |
| Build Tool | Vite |
| Backend | Spring Boot 4 |
| Programming Language | Java 21 |
| Database | PostgreSQL |

---

### Authentication Services

#### Supabase Authentication

Used for:

- Google OAuth login
- JWT generation
- Session management
- User authentication

---

### Artificial Intelligence Services

The application relies on external AI services for content generation, speech transcription and audio synthesis.

- Google Gemini API
- OpenAI Whisper API
- Google Text-to-Speech API

---

### Multimedia Processing Tools

#### FFmpeg and FFprobe

Used for:

- Video processing
- Audio extraction
- Media conversion
- Media inspection
- Audio stream detection

---

### Storage Services

#### Supabase Storage

Used for:

- File storage
- Audio storage
- Resource management

---

## Constraints and Limitations

The current implementation has the following limitations:

- Internet connectivity is required for AI functionality.
- AI-generated content quality depends on source material quality.
- External API availability may affect processing times.
- Supported input formats are currently limited to PDF, audio, and video files.
- AI service usage may incur operational costs.
