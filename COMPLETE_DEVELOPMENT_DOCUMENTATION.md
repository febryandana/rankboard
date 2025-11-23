# RankBoard: Challenges Scoring & Leaderboard Platform

## Complete Development Documentation

---

# Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Design System](#4-design-system)
5. [Database Schema](#5-database-schema)
6. [API Specification](#6-api-specification)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [UI/UX Design Specifications](#8-uiux-design-specifications)
9. [Frontend Implementation Guide](#9-frontend-implementation-guide)
10. [Backend Implementation Guide](#10-backend-implementation-guide)
11. [File Upload & Storage](#11-file-upload--storage)
12. [Theme Implementation](#12-theme-implementation)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment Guide](#14-deployment-guide)
15. [Development Workflow](#15-development-workflow)

---

# 1. Project Overview

## 1.1 Purpose

RankBoard is a web-based platform designed for managing challenges, submissions, scoring, and real-time leaderboards. It supports multiple administrators (judges) who can score submissions independently, with aggregate scoring for final rankings.

## 1.2 Core Features

### Authentication

- No public registration (admin-only user creation)
- Role-based access control (Admin/User)
- Root admin account via environment variables
- Session-based authentication

### Administrator Features

- Create/edit/delete challenges
- Manage user and admin accounts
- Score submissions with feedback
- View all submissions and leaderboards
- Switch to user view

### User Features

- View assigned challenges
- Submit PDF files (single submission per challenge)
- View individual feedback from each judge
- View aggregate scores and leaderboard
- Profile management

### Shared Features

- Dark/light/auto theme switching
- Challenge browsing
- Profile editing (username, email, password, avatar)
- Responsive design

---

# 2. Technology Stack

## 2.1 Frontend

- **Framework**: React 18+
- **Build Tool**: Vite 5+
- **UI Library**: Shadcn UI (Radix UI primitives)
- **Styling**: Tailwind CSS
- **State Management**: React Context API + Hooks
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Charts**: Recharts (for leaderboard visualization)
- **Forms**: React Hook Form + Zod validation

## 2.2 Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4+
- **Database**: SQLite3
- **Authentication**: Express-session + bcrypt
- **File Upload**: Multer
- **Validation**: Zod
- **CORS**: cors middleware

## 2.3 Development Tools

- **TypeScript**: For type safety
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Docker**: Production deployment
- **Docker Compose**: Multi-service orchestration

---

# 3. Project Structure

```
rankboard/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    # Shadcn UI components
│   │   │   ├── layout/                # Layout components
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── MainLayout.tsx
│   │   │   ├── auth/                  # Auth components
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── challenge/             # Challenge components
│   │   │   │   ├── ChallengeCard.tsx
│   │   │   │   ├── ChallengeList.tsx
│   │   │   │   ├── ChallengeForm.tsx
│   │   │   │   └── SubmissionForm.tsx
│   │   │   ├── leaderboard/           # Leaderboard components
│   │   │   │   ├── LeaderboardChart.tsx
│   │   │   │   └── LeaderboardTable.tsx
│   │   │   ├── admin/                 # Admin components
│   │   │   │   ├── UserManagement.tsx
│   │   │   │   ├── AccountForm.tsx
│   │   │   │   └── ScoringTable.tsx
│   │   │   └── profile/               # Profile components
│   │   │       ├── ProfileForm.tsx
│   │   │       └── AvatarUpload.tsx
│   │   ├── pages/
│   │   │   ├── Landing.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── AdminChallenge.tsx
│   │   │   ├── UserChallenge.tsx
│   │   │   ├── AdminProfile.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   └── ChallengeContext.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useTheme.ts
│   │   │   └── useChallenges.ts
│   │   ├── lib/
│   │   │   ├── api.ts                  # API client
│   │   │   ├── utils.ts                # Utility functions
│   │   │   └── constants.ts            # Constants
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── components.json                 # Shadcn UI config
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts             # SQLite configuration
│   │   │   └── session.ts              # Session configuration
│   │   ├── middleware/
│   │   │   ├── auth.ts                 # Authentication middleware
│   │   │   ├── errorHandler.ts         # Error handling
│   │   │   ├── upload.ts               # File upload middleware
│   │   │   └── validation.ts           # Request validation
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Challenge.ts
│   │   │   ├── Submission.ts
│   │   │   └── Score.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── challenges.ts
│   │   │   ├── submissions.ts
│   │   │   └── scores.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── challengeController.ts
│   │   │   ├── submissionController.ts
│   │   │   └── scoreController.ts
│   │   ├── services/
│   │   │   ├── userService.ts
│   │   │   ├── challengeService.ts
│   │   │   ├── submissionService.ts
│   │   │   └── scoreService.ts
│   │   ├── utils/
│   │   │   ├── fileHelper.ts
│   │   │   ├── validation.ts
│   │   │   └── seed.ts                 # Database seeding
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts                   # Entry point
│   ├── database/
│   │   └── rankboard.db                # SQLite database (generated)
│   ├── uploads/
│   │   ├── avatars/                    # Avatar images
│   │   └── submissions/                # Challenge submissions
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

---

# 4. Design System

## 4.1 Color Palette

### Light Theme

- **Background**: `hsl(0 0% 100%)` - White
- **Foreground**: `hsl(222.2 84% 4.9%)` - Near Black
- **Primary**: `hsl(221.2 83.2% 53.3%)` - Blue
- **Primary Foreground**: `hsl(210 40% 98%)`
- **Secondary**: `hsl(210 40% 96.1%)`
- **Secondary Foreground**: `hsl(222.2 47.4% 11.2%)`
- **Muted**: `hsl(210 40% 96.1%)`
- **Muted Foreground**: `hsl(215.4 16.3% 46.9%)`
- **Accent**: `hsl(210 40% 96.1%)`
- **Accent Foreground**: `hsl(222.2 47.4% 11.2%)`
- **Destructive**: `hsl(0 84.2% 60.2%)` - Red
- **Destructive Foreground**: `hsl(210 40% 98%)`
- **Border**: `hsl(214.3 31.8% 91.4%)`
- **Card**: `hsl(0 0% 100%)`
- **Card Foreground**: `hsl(222.2 84% 4.9%)`

### Dark Theme

- **Background**: `hsl(222.2 84% 4.9%)` - Near Black
- **Foreground**: `hsl(210 40% 98%)` - Near White
- **Primary**: `hsl(217.2 91.2% 59.8%)` - Light Blue
- **Primary Foreground**: `hsl(222.2 47.4% 11.2%)`
- **Secondary**: `hsl(217.2 32.6% 17.5%)`
- **Secondary Foreground**: `hsl(210 40% 98%)`
- **Muted**: `hsl(217.2 32.6% 17.5%)`
- **Muted Foreground**: `hsl(215 20.2% 65.1%)`
- **Accent**: `hsl(217.2 32.6% 17.5%)`
- **Accent Foreground**: `hsl(210 40% 98%)`
- **Destructive**: `hsl(0 62.8% 30.6%)` - Dark Red
- **Destructive Foreground**: `hsl(210 40% 98%)`
- **Border**: `hsl(217.2 32.6% 17.5%)`
- **Card**: `hsl(222.2 84% 4.9%)`
- **Card Foreground**: `hsl(210 40% 98%)`

## 4.2 Typography

### Font Family

- **Primary**: Inter, system-ui, sans-serif
- **Monospace**: "Fira Code", monospace (for code/filenames)

### Font Sizes

- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)

### Font Weights

- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700

## 4.3 Spacing Scale

- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

## 4.4 Border Radius

- **sm**: 0.125rem (2px)
- **DEFAULT**: 0.25rem (4px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **full**: 9999px

## 4.5 Shadows

- **sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **DEFAULT**: `0 1px 3px 0 rgb(0 0 0 / 0.1)`
- **md**: `0 4px 6px -1px rgb(0 0 0 / 0.1)`
- **lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1)`
- **xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1)`

## 4.6 Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

---

# 5. Database Schema

## 5.1 Entity Relationship Diagram

```
Users (1) ──────< (N) Submissions
  │                      │
  │                      │
  └────< (N) Scores ────┘
            │
            │
          (N) ↓
       Challenges
```

## 5.2 Table Definitions

### `users` Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK(role IN ('admin', 'user')),
    avatar_filename VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

**Columns:**

- `id`: Unique identifier
- `username`: Unique username (3-50 characters)
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password
- `role`: Either "admin" or "user"
- `avatar_filename`: Filename of avatar image (nullable)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### `challenges` Table

```sql
CREATE TABLE challenges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    created_at DATETIME NOT NULL,
    deadline DATETIME NOT NULL,
    created_by_admin_id INTEGER NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_admin_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_challenges_created_at ON challenges(created_at DESC);
CREATE INDEX idx_challenges_deadline ON challenges(deadline);
```

**Columns:**

- `id`: Unique identifier
- `title`: Challenge title (max 200 characters)
- `description`: Detailed description (markdown supported)
- `created_at`: Challenge creation timestamp (editable by admin)
- `deadline`: Submission deadline (editable by admin)
- `created_by_admin_id`: ID of admin who created the challenge
- `updated_at`: Last update timestamp

### `submissions` Table

```sql
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    challenge_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    filename VARCHAR(255) NOT NULL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(challenge_id, user_id)
);

CREATE INDEX idx_submissions_challenge ON submissions(challenge_id);
CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE UNIQUE INDEX idx_submissions_challenge_user ON submissions(challenge_id, user_id);
```

**Columns:**

- `id`: Unique identifier
- `challenge_id`: Reference to challenge
- `user_id`: Reference to user
- `filename`: Stored PDF filename (must not contain spaces)
- `submitted_at`: Submission timestamp
- `updated_at`: Last update timestamp (for resubmissions)

**Constraints:**

- One submission per user per challenge

### `scores` Table

```sql
CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    submission_id INTEGER NOT NULL,
    admin_id INTEGER NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(submission_id, admin_id)
);

CREATE INDEX idx_scores_submission ON scores(submission_id);
CREATE INDEX idx_scores_admin ON scores(admin_id);
CREATE UNIQUE INDEX idx_scores_submission_admin ON scores(submission_id, admin_id);
```

**Columns:**

- `id`: Unique identifier
- `submission_id`: Reference to submission
- `admin_id`: Reference to admin who scored
- `score`: Numeric score (integer)
- `feedback`: Text feedback from admin (nullable)
- `created_at`: Score creation timestamp
- `updated_at`: Last update timestamp

**Constraints:**

- One score per admin per submission

## 5.3 Database Initialization

### Root Admin Creation

The first admin account is created from environment variables:

- `ROOT_ADMIN_USERNAME`
- `ROOT_ADMIN_EMAIL`
- `ROOT_ADMIN_PASSWORD`

### Seed Data (Optional)

For development, include sample data:

- 1 root admin account
- 2-3 additional admin accounts
- 5-7 user accounts
- 3-4 sample challenges
- Sample submissions and scores

---

# 6. API Specification

## 6.1 Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

## 6.2 Authentication Endpoints

### `POST /api/auth/login`

Login user or admin.

**Request Body:**

```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "avatar_filename": "avatar_123.jpg"
    }
  }
}
```

**Error (401):**

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### `POST /api/auth/logout`

Logout current user.

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### `GET /api/auth/session`

Get current session information.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "avatar_filename": "avatar_123.jpg"
    }
  }
}
```

## 6.3 User Management Endpoints (Admin Only)

### `GET /api/users`

Get all users (admin only).

**Query Parameters:**

- `role`: Filter by role ("admin" or "user")

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "avatar_filename": "avatar_1.jpg",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### `POST /api/users`

Create new user or admin (admin only).

**Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "admin" | "user"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "username": "new_user",
    "email": "new@example.com",
    "role": "user",
    "avatar_filename": null
  }
}
```

### `GET /api/users/:id`

Get user by ID.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "avatar_filename": "avatar_1.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### `PUT /api/users/:id`

Update user information (admin can update anyone, user can update self).

**Request Body:**

```json
{
  "username": "string (optional)",
  "email": "string (optional)",
  "password": "string (optional)",
  "role": "admin" | "user" (optional, admin only)
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "updated_username",
    "email": "updated@example.com",
    "role": "user"
  }
}
```

### `DELETE /api/users/:id`

Delete user (admin only, cannot delete self).

**Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### `POST /api/users/:id/avatar`

Upload avatar image (multipart/form-data).

**Form Data:**

- `avatar`: Image file (JPG, PNG, GIF, max 5MB)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "avatar_filename": "avatar_123_1234567890.jpg"
  }
}
```

### `DELETE /api/users/:id/avatar`

Delete avatar image.

**Response (200):**

```json
{
  "success": true,
  "message": "Avatar deleted successfully"
}
```

## 6.4 Challenge Endpoints

### `GET /api/challenges`

Get all challenges (sorted by created_at DESC).

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Challenge 1",
      "description": "Description here",
      "created_at": "2024-01-01T00:00:00.000Z",
      "deadline": "2024-01-31T23:59:59.000Z",
      "created_by_admin_id": 1
    }
  ]
}
```

### `POST /api/challenges`

Create new challenge (admin only).

**Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "created_at": "ISO 8601 datetime",
  "deadline": "ISO 8601 datetime"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "New Challenge",
    "description": "Description",
    "created_at": "2024-01-15T10:00:00.000Z",
    "deadline": "2024-02-15T23:59:59.000Z",
    "created_by_admin_id": 1
  }
}
```

### `GET /api/challenges/:id`

Get challenge by ID.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Challenge 1",
    "description": "Description here",
    "created_at": "2024-01-01T00:00:00.000Z",
    "deadline": "2024-01-31T23:59:59.000Z",
    "created_by_admin_id": 1
  }
}
```

### `PUT /api/challenges/:id`

Update challenge (admin only).

**Request Body:**

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "created_at": "ISO 8601 datetime (optional)",
  "deadline": "ISO 8601 datetime (optional)"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Updated Challenge",
    "description": "Updated description",
    "created_at": "2024-01-01T00:00:00.000Z",
    "deadline": "2024-02-28T23:59:59.000Z"
  }
}
```

### `DELETE /api/challenges/:id`

Delete challenge (admin only, requires confirmation).

**Response (200):**

```json
{
  "success": true,
  "message": "Challenge deleted successfully"
}
```

## 6.5 Submission Endpoints

### `GET /api/challenges/:challengeId/submissions`

Get all submissions for a challenge (admin sees all, user sees own).

**Response (200) - Admin:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "challenge_id": 1,
      "user_id": 2,
      "user": {
        "id": 2,
        "username": "john_doe",
        "avatar_filename": "avatar_2.jpg"
      },
      "filename": "submission_john_challenge1.pdf",
      "submitted_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### `POST /api/challenges/:challengeId/submissions`

Submit file for challenge (user only, one submission per challenge).

**Form Data:**

- `submission`: PDF file (filename must not contain spaces)

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "challenge_id": 1,
    "user_id": 2,
    "filename": "submission_2_1_1234567890.pdf",
    "submitted_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### `PUT /api/challenges/:challengeId/submissions`

Update submission (replace file, user only).

**Form Data:**

- `submission`: PDF file

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "challenge_id": 1,
    "user_id": 2,
    "filename": "submission_2_1_1234567891.pdf",
    "updated_at": "2024-01-16T09:00:00.000Z"
  }
}
```

### `GET /api/submissions/:id/download`

Download submission file (admin sees all, user sees own).

**Response:** PDF file stream

## 6.6 Score Endpoints

### `GET /api/challenges/:challengeId/scores`

Get all scores for a challenge (with aggregation).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "user_id": 2,
        "username": "john_doe",
        "avatar_filename": "avatar_2.jpg",
        "submission_id": 1,
        "scores": [
          {
            "admin_id": 1,
            "admin_username": "admin1",
            "score": 85,
            "feedback": "Great work!"
          },
          {
            "admin_id": 3,
            "admin_username": "admin2",
            "score": 90,
            "feedback": "Excellent!"
          }
        ],
        "total_score": 175,
        "rank": 1
      }
    ]
  }
}
```

### `POST /api/submissions/:submissionId/scores`

Create or update score for submission (admin only).

**Request Body:**

```json
{
  "score": 85,
  "feedback": "Great work! Consider improving..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "submission_id": 1,
    "admin_id": 1,
    "score": 85,
    "feedback": "Great work!",
    "created_at": "2024-01-16T10:00:00.000Z",
    "updated_at": "2024-01-16T10:00:00.000Z"
  }
}
```

### `GET /api/submissions/:submissionId/scores/me`

Get scores for current user's submission (user sees own feedback).

**Response (200):**

```json
{
  "success": true,
  "data": {
    "submission_id": 1,
    "scores": [
      {
        "admin_id": 1,
        "admin_username": "admin1",
        "score": 85,
        "feedback": "Great work!"
      }
    ],
    "total_score": 85
  }
}
```

## 6.7 Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here",
  "details": "Optional detailed error information"
}
```

**HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate unique field)
- `500`: Internal Server Error

---

# 7. Authentication & Authorization

## 7.1 Session Management

### Configuration

- **Session Store**: SQLite-based session store or memory store (development)
- **Session Duration**: 7 days
- **Cookie Name**: `rankboard.sid`
- **Cookie Settings**:
  - `httpOnly`: true
  - `secure`: true (production only)
  - `sameSite`: 'lax'
  - `maxAge`: 7 days

### Session Data Structure

```typescript
interface SessionData {
  userId: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}
```

## 7.2 Password Security

- **Hashing Algorithm**: bcrypt
- **Salt Rounds**: 10
- **Password Requirements**:
  - Minimum length: 8 characters
  - No maximum length (reasonable limit: 128)
  - No complexity requirements (admin decides during account creation)

## 7.3 Authorization Middleware

### `requireAuth` Middleware

Ensures user is authenticated.

```typescript
// Pseudo-code
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }
  next();
}
```

### `requireAdmin` Middleware

Ensures user is an admin.

```typescript
// Pseudo-code
function requireAdmin(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }
  if (req.session.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }
  next();
}
```

## 7.4 Route Protection Matrix

| Endpoint                               | Public | User     | Admin |
| -------------------------------------- | ------ | -------- | ----- |
| `POST /api/auth/login`                 | ✓      | ✓        | ✓     |
| `POST /api/auth/logout`                | ✗      | ✓        | ✓     |
| `GET /api/auth/session`                | ✓      | ✓        | ✓     |
| `GET /api/users`                       | ✗      | ✗        | ✓     |
| `POST /api/users`                      | ✗      | ✗        | ✓     |
| `GET /api/users/:id`                   | ✗      | Own only | ✓     |
| `PUT /api/users/:id`                   | ✗      | Own only | ✓     |
| `DELETE /api/users/:id`                | ✗      | ✗        | ✓     |
| `POST /api/users/:id/avatar`           | ✗      | Own only | ✓     |
| `GET /api/challenges`                  | ✗      | ✓        | ✓     |
| `POST /api/challenges`                 | ✗      | ✗        | ✓     |
| `PUT /api/challenges/:id`              | ✗      | ✗        | ✓     |
| `DELETE /api/challenges/:id`           | ✗      | ✗        | ✓     |
| `GET /api/challenges/:id/submissions`  | ✗      | Own only | ✓     |
| `POST /api/challenges/:id/submissions` | ✗      | ✓        | ✗     |
| `POST /api/submissions/:id/scores`     | ✗      | ✗        | ✓     |
| `GET /api/submissions/:id/scores/me`   | ✗      | Own only | ✗     |

---

# 8. UI/UX Design Specifications

## 8.1 Landing/Login Page

### Layout

```
┌─────────────────────────────────────────────────┐
│                                    [🌙 Theme]   │
│                                                 │
│              ┌───────────────┐                  │
│              │   RankBoard   │                  │
│              │   Logo/Title  │                  │
│              └───────────────┘                  │
│                                                 │
│         ┌─────────────────────────┐             │
│         │  Username              │             │
│         │  [________________]    │             │
│         │                         │             │
│         │  Password              │             │
│         │  [________________]    │             │
│         │                         │             │
│         │  [     Login     ]     │             │
│         └─────────────────────────┘             │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Components

- Centered login card
- Theme switcher button (top right)
- Logo/branding at top
- Username input field
- Password input field (with show/hide toggle)
- Login button
- Error message display area

### Behavior

- Auto-focus username field on load
- Enter key submits form
- Loading state on button during authentication
- Error messages display below button
- Redirect to home page on success

## 8.2 Home Page

### Layout

```
┌─────────────────────────────────────────────────┐
│ [☰] Home        RankBoard      [Avatar] User ▼ │
├──────┬──────────────────────────────────────────┤
│      │                                          │
│ Home │        Welcome, [Username]!             │
│      │                                          │
│ Chal │   ┌──────┐  ┌──────┐  ┌──────┐         │
│ leng │   │ Chal │  │ Chal │  │ Chal │         │
│  1   │   │  1   │  │  2   │  │  3   │         │
│      │   └──────┘  └──────┘  └──────┘         │
│ Chal │                                          │
│  2   │   ┌──────┐  ┌──────┐                    │
│      │   │ Chal │  │ Chal │                    │
│ Chal │   │  4   │  │  5   │                    │
│  3   │   └──────┘  └──────┘                    │
│      │                                          │
│ ...  │                                          │
│      │                                          │
│[👤]  │                                          │
│Admin │                                          │
└──────┴──────────────────────────────────────────┘
```

### Components

- **Header**: Logo/title (center), account menu (right)
- **Sidebar** (left):
  - Home button (icon + text)
  - Challenge list (scrollable)
  - Admin/User switch button (bottom, admin only)
- **Main Content**:
  - Welcome message with user's name
  - Challenge grid (responsive: 3 cols on desktop, 2 on tablet, 1 on mobile)

### Challenge Card

- Title
- Deadline countdown
- Status indicator (submitted/not submitted)
- Hover effect
- Click to navigate to challenge detail

## 8.3 Administrator Challenge Page

### Layout

```
┌─────────────────────────────────────────────────┐
│ [☰] Admin       RankBoard      [Avatar] Admin ▼│
├──────┬──────────────────────────────────────────┤
│      │ [✏️ Edit] [💾 Save] [View as User] [🗑️]  │
│ Home │                                          │
│      │ Challenge Title: [Editable Input]       │
│[+New]│ Created: [Date Picker]                   │
│      │ Deadline: [Date Picker]                  │
│ Chal │                                          │
│  1   │ Description:                             │
│  •   │ [Editable Text Area]                     │
│ Chal │                                          │
│  2   │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│      │                                          │
│ Chal │ Submissions & Scores                     │
│  3   │                                          │
│      │ ┌────────┬────────┬────────┬──────────┐ │
│ ...  │ │ User   │ Submit │ Admin1 │ Admin2  │ │
│      │ │        │ Link   │[Score] │[Score]  │ │
│[👤]  │ │        │        │[Feed]  │[Feed]   │ │
│User  │ ├────────┼────────┼────────┼──────────┤ │
└──────┴─└────────┴────────┴────────┴──────────┘ │
```

### Components

- **Action Bar**:
  - Edit mode toggle
  - Save button
  - "View as User" button
  - Delete challenge button (red, right)
- **Challenge Info Section** (editable in edit mode):
  - Title input
  - Created date picker
  - Deadline date picker
  - Description textarea (markdown support)
- **Submissions Table**:
  - Column: User (avatar + username)
  - Column: Submission link (download button)
  - Column per Admin: Score input + Feedback textarea
  - Row per user (shows all users, even without submission)

### Behavior

- Edit mode enables inline editing
- Save button commits changes
- Delete shows confirmation dialog
- Submission links open PDF in new tab
- Score inputs auto-save on blur
- Feedback textareas expand with content

## 8.4 User Challenge Page

### Layout

```
┌─────────────────────────────────────────────────┐
│ [☰] User        RankBoard      [Avatar] User ▼ │
├──────┬──────────────────────────────────────────┤
│      │                                          │
│ Home │ Challenge Title                          │
│      │ Created: Jan 1, 2024                     │
│ Chal │ Deadline: Jan 31, 2024 (5 days left)    │
│  1   │                                          │
│  •   │ Description:                             │
│ Chal │ [Challenge description text...]          │
│  2   │                                          │
│      │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│ Chal │                                          │
│  3   │ Your Submission                          │
│      │ ┌─────────────────────────────────────┐ │
│ ...  │ │ [📄] submission.pdf                 │ │
│      │ │ [Choose File] [Upload]              │ │
│      │ └─────────────────────────────────────┘ │
│      │                                          │
│      │ Your Feedback & Scores                   │
│      │ ┌─────────────────────────────────────┐ │
│      │ │ Admin1: 85/100                      │ │
│      │ │ "Great work! Consider..."           │ │
│      │ │                                      │ │
│      │ │ Admin2: 90/100                      │ │
│      │ │ "Excellent submission!"             │ │
│      │ └─────────────────────────────────────┘ │
│      │                                          │
│      │ Leaderboard                              │
│      │ [Bar Chart showing scores]               │
│      │                                          │
│      │ ┌────┬──────┬────────┬────────┬──────┐ │
│      │ │ #  │ User │ Admin1 │ Admin2 │Total│ │
│      │ ├────┼──────┼────────┼────────┼──────┤ │
│      │ │🥇1 │ John │   85   │   90   │ 175 │ │
│      │ │🥈2 │ Jane │   80   │   85   │ 165 │ │
│      │ │🥉3 │ Bob  │   75   │   80   │ 155 │ │
│      │ └────┴──────┴────────┴────────┴──────┘ │
└──────┴──────────────────────────────────────────┘
```

### Components

- **Challenge Header**:
  - Title (read-only)
  - Created date (read-only)
  - Deadline + countdown timer
- **Description Section**:
  - Markdown-rendered description (read-only)
- **Submission Section**:
  - Current submission display (if exists)
  - File upload form
  - Upload/Replace button
  - File validation message
- **Feedback Section** (only for current user):
  - Score cards per admin
  - Admin name
  - Score value
  - Feedback text
- **Leaderboard Section**:
  - Bar chart visualization (Recharts)
  - Data table
  - Columns: Rank, User, Score per Admin, Total
  - Medals for top 3 (🥇🥈🥉)
  - Current user's row highlighted

### Behavior

- File upload validates:
  - PDF format only
  - No spaces in filename
  - Max 50MB
- Leaderboard auto-refreshes when scores change
- Feedback section shows loading state
- Download button for own submission

## 8.5 Profile Pages (Admin & User)

### Layout

```
┌─────────────────────────────────────────────────┐
│ [☰] Profile     RankBoard      [Avatar] User ▼ │
├──────┬──────────────────────────────────────────┤
│      │                                          │
│ Home │ Edit Profile                             │
│      │                                          │
│ ...  │ ┌──────────────────────────────────────┐│
│      │ │                                      ││
│      │ │         [   Avatar   ]               ││
│      │ │      [Change] [Remove]               ││
│      │ │                                      ││
│      │ │ Username:                            ││
│      │ │ [________________]                   ││
│      │ │                                      ││
│      │ │ Email:                               ││
│      │ │ [________________]                   ││
│      │ │                                      ││
│      │ │ New Password:                        ││
│      │ │ [________________]                   ││
│      │ │                                      ││
│      │ │ Confirm Password:                    ││
│      │ │ [________________]                   ││
│      │ │                                      ││
│      │ │     [Cancel]  [Save Changes]         ││
│      │ └──────────────────────────────────────┘│
└──────┴──────────────────────────────────────────┘
```

### Components

- Avatar display (circular)
- Avatar upload/change button
- Avatar remove button
- Username input
- Email input
- New password input (optional)
- Confirm password input (required if password filled)
- Cancel button
- Save button

### Behavior

- Avatar preview updates immediately
- Password fields optional (only fill to change)
- Username/email validates for duplicates
- Success message on save
- Redirect option after save

## 8.6 Admin Account Management Page

### Layout

```
┌─────────────────────────────────────────────────┐
│ [☰] Accounts    RankBoard      [Avatar] Admin ▼│
├──────┬──────────────────────────────────────────┤
│      │ [+ Create Account] [Filter: All ▼]      │
│ Home │                                          │
│      │ ┌────────────────────────────────────┐  │
│Accts │ │ Search: [________________] 🔍      │  │
│  •   │ └────────────────────────────────────┘  │
│      │                                          │
│ Chal │ ┌───────┬──────────┬────────┬────────┐ │
│  1   │ │Avatar │ Username │ Email  │Actions│ │
│      │ ├───────┼──────────┼────────┼────────┤ │
│ Chal │ │  👤   │ john_doe │john@.. │[✏️][🗑️]│ │
│  2   │ │  👤   │ jane_doe │jane@.. │[✏️][🗑️]│ │
│      │ └───────┴──────────┴────────┴────────┘ │
└──────┴──────────────────────────────────────────┘
```

### Components

- Create account button (primary)
- Filter dropdown (All/Admins/Users)
- Search input
- Accounts table:
  - Avatar column
  - Username column
  - Email column
  - Role column
  - Actions column (Edit/Delete)

### Create/Edit Account Dialog

- Modal dialog
- Avatar upload
- Username input
- Email input
- Password input
- Role selector (Admin/User)
- Cancel/Save buttons

### Behavior

- Create opens modal
- Edit opens modal with pre-filled data
- Delete shows confirmation
- Real-time search filtering
- Role filter updates table

## 8.7 Common UI Components

### Header Component

- Left: Hamburger menu (mobile) or logo/title
- Center: Page title or app name
- Right: Avatar + username dropdown
  - Profile option
  - Theme switcher
  - Logout option

### Sidebar Component

- Home button (🏠)
- "Create Challenge" button (admin only)
- Challenge list (scrollable)
  - Sorted by created_at DESC
  - Active challenge highlighted
  - Click to navigate
- Bottom section:
  - Admin/User mode switcher (admin only)

### Challenge Card Component (Grid View)

- Title (truncated)
- Deadline badge
- Status badge (Submitted/Pending)
- Hover effect (lift + shadow)

### Leaderboard Table Component

- Responsive design
- Sticky header
- Medal icons for top 3
- Current user highlighted
- Sortable columns

### Leaderboard Chart Component

- Horizontal bar chart
- Color-coded by rank
- Tooltips on hover
- Legend for admin scores

---

# 9. Frontend Implementation Guide

## 9.1 Project Setup

### Initialize Vite Project

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

### Install Dependencies

```bash
# Core dependencies
npm install react-router-dom
npm install axios
npm install recharts
npm install date-fns
npm install clsx
npm install class-variance-authority
npm install lucide-react

# Shadcn UI setup
npx shadcn-ui@latest init

# Form handling
npm install react-hook-form @hookform/resolvers zod

# Dev dependencies
npm install -D @types/node
npm install -D tailwindcss-animate
```

### Configure Shadcn UI

Follow prompts:

- TypeScript: Yes
- Style: Default
- Base color: Blue
- CSS variables: Yes

### Install Shadcn Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add table
npx shadcn-ui@latest add form
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add scroll-area
npx shadcn-ui@latest add separator
```

## 9.2 Type Definitions

Create `src/types/index.ts`:

```typescript
export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  avatar_filename: string | null;
  created_at: string;
  updated_at?: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  created_at: string;
  deadline: string;
  created_by_admin_id: number;
  updated_at?: string;
}

export interface Submission {
  id: number;
  challenge_id: number;
  user_id: number;
  filename: string;
  submitted_at: string;
  updated_at?: string;
}

export interface Score {
  id: number;
  submission_id: number;
  admin_id: number;
  admin_username?: string;
  score: number;
  feedback: string | null;
  created_at: string;
  updated_at?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: number;
  username: string;
  avatar_filename: string | null;
  submission_id: number | null;
  scores: Score[];
  total_score: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}
```

## 9.3 Context Providers

### AuthContext (`src/contexts/AuthContext.tsx`)

**Purpose**: Manage authentication state globally

**State**:

- `user`: Current user object or null
- `loading`: Boolean for initial auth check
- `isAuthenticated`: Computed boolean

**Methods**:

- `login(username, password)`: Authenticate user
- `logout()`: Clear session
- `updateUser(userData)`: Update current user data
- `checkSession()`: Verify session validity

**Implementation Notes**:

- Use `useState` for user and loading
- Use `useEffect` to check session on mount
- Store user in context, not localStorage (security)
- Provide context via provider pattern

### ThemeContext (`src/contexts/ThemeContext.tsx`)

**Purpose**: Manage theme state (light/dark/auto)

**State**:

- `theme`: 'light' | 'dark' | 'auto'
- `resolvedTheme`: 'light' | 'dark' (computed from auto)

**Methods**:

- `setTheme(theme)`: Update theme preference

**Implementation Notes**:

- Store preference in localStorage
- Listen to system theme changes for 'auto' mode
- Apply theme class to document root
- Default to 'auto'

### ChallengeContext (`src/contexts/ChallengeContext.tsx`)

**Purpose**: Manage challenges list globally

**State**:

- `challenges`: Array of challenges
- `loading`: Boolean
- `error`: Error message or null

**Methods**:

- `fetchChallenges()`: Load all challenges
- `createChallenge(data)`: Create new challenge
- `updateChallenge(id, data)`: Update challenge
- `deleteChallenge(id)`: Delete challenge
- `refreshChallenges()`: Reload challenges list

**Implementation Notes**:

- Fetch on mount and after mutations
- Sort by created_at DESC
- Cache in state, refresh on demand

## 9.4 Custom Hooks

### `useAuth()` Hook

- Access AuthContext
- Returns user, loading, isAuthenticated, login, logout
- Throw error if used outside provider

### `useTheme()` Hook

- Access ThemeContext
- Returns theme, resolvedTheme, setTheme
- Throw error if used outside provider

### `useChallenges()` Hook

- Access ChallengeContext
- Returns challenges, loading, error, methods
- Throw error if used outside provider

### `useProtectedRoute()` Hook

- Check authentication
- Redirect to login if not authenticated
- Used in protected page components

### `useAdminRoute()` Hook

- Check admin role
- Redirect if not admin
- Used in admin-only pages

## 9.5 API Client (`src/lib/api.ts`)

**Purpose**: Centralized API communication

**Configuration**:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Interceptors**:

- Response interceptor for error handling
- Redirect to login on 401
- Show toast notifications on errors

**Methods**:

- `auth.login(username, password)`
- `auth.logout()`
- `auth.getSession()`
- `users.getAll(role?)`
- `users.getById(id)`
- `users.create(data)`
- `users.update(id, data)`
- `users.delete(id)`
- `users.uploadAvatar(id, file)`
- `users.deleteAvatar(id)`
- `challenges.getAll()`
- `challenges.getById(id)`
- `challenges.create(data)`
- `challenges.update(id, data)`
- `challenges.delete(id)`
- `submissions.getByChallengeId(challengeId)`
- `submissions.create(challengeId, file)`
- `submissions.update(challengeId, file)`
- `submissions.download(submissionId)`
- `scores.getByChallengeId(challengeId)`
- `scores.createOrUpdate(submissionId, data)`
- `scores.getMyScores(submissionId)`

## 9.6 Routing Structure (`src/App.tsx`)

```typescript
<BrowserRouter>
  <Routes>
    {/* Public route */}
    <Route path="/login" element={<Landing />} />

    {/* Protected routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="challenges/:id" element={<ChallengePage />} />
        <Route path="profile" element={<ProfilePage />} />

        {/* Admin-only routes */}
        <Route element={<AdminRoute />}>
          <Route path="admin/challenges/:id" element={<AdminChallenge />} />
          <Route path="admin/accounts" element={<AccountManagement />} />
        </Route>
      </Route>
    </Route>

    {/* Catch-all redirect */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
</BrowserRouter>
```

## 9.7 Component Implementation Tasks

### Layout Components

#### `MainLayout.tsx`

- Render Header and Sidebar
- Provide outlet for nested routes
- Handle responsive sidebar (mobile drawer)
- Manage sidebar open/close state

#### `Header.tsx`

- Display app title/logo (center)
- Render account dropdown (right)
- Show avatar and username
- Dropdown items:
  - Profile link
  - Theme switcher
  - Logout button

#### `Sidebar.tsx`

- Home button (always visible)
- "Create Challenge" button (admin only)
- Scrollable challenge list
- Active challenge highlighted
- Admin/User mode switcher (bottom, admin only)
- Responsive: Drawer on mobile, fixed on desktop

### Authentication Components

#### `LoginForm.tsx`

- Username input
- Password input (with show/hide)
- Login button
- Form validation (required fields)
- Error display
- Loading state on submit
- Use React Hook Form + Zod

### Challenge Components

#### `ChallengeCard.tsx`

- Display title
- Show deadline with countdown
- Status badge (submitted/pending)
- Hover effect
- Click handler to navigate

#### `ChallengeList.tsx`

- Grid layout (responsive)
- Map challenges to ChallengeCard
- Empty state message
- Loading skeleton

#### `ChallengeForm.tsx` (Admin)

- Title input
- Description textarea (markdown editor)
- Created date picker
- Deadline date picker
- Save/Cancel buttons
- Validation
- Use React Hook Form + Zod

#### `SubmissionForm.tsx` (User)

- File input (PDF only)
- Current submission display
- Upload/Replace button
- File validation
- Progress indicator
- Success/Error messages

### Leaderboard Components

#### `LeaderboardTable.tsx`

- Responsive table
- Columns: Rank, User, Admin Scores, Total
- Medal icons for top 3
- Current user highlighted
- Sortable columns (optional)
- Use Shadcn Table component

#### `LeaderboardChart.tsx`

- Horizontal bar chart using Recharts
- X-axis: Score
- Y-axis: Username
- Color-coded bars
- Tooltips on hover
- Responsive sizing

### Admin Components

#### `ScoringTable.tsx`

- Users list with submissions
- Score inputs per admin
- Feedback textareas per admin
- Auto-save on blur
- Validation (numeric scores)
- Loading states

#### `UserManagement.tsx`

- Users table (avatar, username, email, role, actions)
- Search input
- Role filter dropdown
- Create button
- Edit/Delete actions per row
- Pagination (optional)

#### `AccountForm.tsx`

- Modal dialog for create/edit
- Avatar upload
- Username input
- Email input
- Password input
- Role selector (admin/user)
- Validation
- Submit handler

### Profile Components

#### `ProfileForm.tsx`

- Avatar display and upload
- Username input
- Email input
- New password input (optional)
- Confirm password input
- Save/Cancel buttons
- Validation
- Success feedback

#### `AvatarUpload.tsx`

- Circular avatar preview
- Change button (file input trigger)
- Remove button
- Image cropping (optional)
- Preview update
- File validation (image types, size)

## 9.8 Page Implementation Tasks

### `Landing.tsx`

- Centered layout
- Theme switcher (top right)
- LoginForm component
- Redirect if already authenticated

### `Home.tsx`

- Welcome message with username
- ChallengeList component
- Empty state if no challenges

### `ChallengePage.tsx` (User View)

- Fetch challenge by ID from route params
- Display challenge details (title, dates, description)
- SubmissionForm component
- Feedback section (fetch user's scores)
- LeaderboardTable and LeaderboardChart
- Loading/Error states

### `AdminChallenge.tsx` (Admin View)

- Fetch challenge by ID
- Editable challenge form (inline or modal)
- ScoringTable component
- "View as User" button (navigate to user view)
- Delete button with confirmation dialog
- Save button

### `ProfilePage.tsx`

- Fetch current user data
- ProfileForm component
- Success/Error messages
- Redirect option after save

### `AccountManagement.tsx` (Admin)

- UserManagement component
- Create/Edit/Delete functionality
- Search and filter
- Pagination (if needed)

## 9.9 Utility Functions (`src/lib/utils.ts`)

- `cn(...classes)`: Merge Tailwind classes (using clsx)
- `formatDate(date)`: Format ISO date to readable format
- `getTimeRemaining(deadline)`: Calculate time until deadline
- `validateFilename(filename)`: Check for spaces in filename
- `getAvatarUrl(filename)`: Generate avatar URL
- `getSubmissionUrl(filename)`: Generate submission URL

## 9.10 Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

---

# 10. Backend Implementation Guide

## 10.1 Project Setup

### Initialize Node.js Project

```bash
mkdir backend
cd backend
npm init -y
```

### Install Dependencies

```bash
# Core dependencies
npm install express
npm install sqlite3
npm install bcrypt
npm install express-session
npm install connect-sqlite3
npm install multer
npm install cors
npm install dotenv
npm install zod

# TypeScript dependencies
npm install -D typescript
npm install -D @types/node
npm install -D @types/express
npm install -D @types/bcrypt
npm install -D @types/express-session
npm install -D @types/multer
npm install -D @types/cors
npm install -D ts-node
npm install -D nodemon
```

### TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Package Scripts

Update `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "seed": "ts-node src/utils/seed.ts"
  }
}
```

## 10.2 Database Setup

### Database Configuration (`src/config/database.ts`)

**Purpose**: Initialize SQLite database and create tables

**Tasks**:

1. Import sqlite3
2. Create database connection
3. Enable foreign keys
4. Define schema creation functions
5. Export database instance

**Key Functions**:

- `initDatabase()`: Create all tables if not exist
- `getDatabase()`: Return database instance

**Tables to Create**:

- users
- challenges
- submissions
- scores

**Implementation Notes**:

- Use `PRAGMA foreign_keys = ON`
- Use `AUTOINCREMENT` for primary keys
- Create indexes for foreign keys
- Run initialization on server start

### Session Store Configuration (`src/config/session.ts`)

**Purpose**: Configure session management

**Tasks**:

1. Import connect-sqlite3 and express-session
2. Create SQLiteStore instance
3. Configure session middleware
4. Export session middleware

**Configuration**:

```typescript
const SQLiteStore = connectSqlite3(session);

const sessionMiddleware = session({
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: './database',
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
});
```

## 10.3 Middleware Implementation

### `auth.ts` - Authentication Middleware

#### `requireAuth` Middleware

- Check if `req.session.userId` exists
- If not, return 401 error
- If yes, continue to next middleware

#### `requireAdmin` Middleware

- First check authentication
- Then check if `req.session.role === 'admin'`
- If not admin, return 403 error
- If admin, continue

#### `optionalAuth` Middleware

- Attach user info to request if authenticated
- Don't block unauthenticated requests
- Use for endpoints that work differently for auth/unauth users

### `errorHandler.ts` - Error Handling

**Purpose**: Global error handler middleware

**Tasks**:

1. Catch all errors
2. Log errors (console or logger)
3. Format error response
4. Send appropriate status code

**Implementation**:

```typescript
function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
```

### `upload.ts` - File Upload Middleware

**Purpose**: Configure multer for file uploads

**Avatar Upload Configuration**:

```typescript
const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: './uploads/avatars',
    filename: (req, file, cb) => {
      const uniqueName = `avatar_${req.session.userId}_${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF allowed.'));
    }
  },
});
```

**Submission Upload Configuration**:

```typescript
const submissionUpload = multer({
  storage: multer.diskStorage({
    destination: './uploads/submissions',
    filename: (req, file, cb) => {
      // Check for spaces in filename
      if (file.originalname.includes(' ')) {
        return cb(new Error('Filename must not contain spaces'));
      }

      const uniqueName = `submission_${req.session.userId}_${req.params.challengeId}_${Date.now()}.pdf`;
      cb(null, uniqueName);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files allowed'));
    }
  },
});
```

### `validation.ts` - Request Validation

**Purpose**: Validate request data using Zod schemas

**Schemas to Define**:

```typescript
// User validation
const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['admin', 'user']),
});

// Challenge validation
const createChallengeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string(),
  created_at: z.string().datetime(),
  deadline: z.string().datetime(),
});

// Score validation
const createScoreSchema = z.object({
  score: z.number().int().min(0),
  feedback: z.string().optional(),
});
```

**Middleware Function**:

```typescript
function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }
  };
}
```

## 10.4 Models/Services Implementation

### User Service (`src/services/userService.ts`)

**Methods**:

#### `createUser(data)`

- Hash password with bcrypt
- Insert user into database
- Return user object (without password hash)

#### `getUserById(id)`

- Query user by ID
- Return user object (without password hash)
- Return null if not found

#### `getUserByUsername(username)`

- Query user by username
- Return user object (without password hash)
- Return null if not found

#### `getUserByEmail(email)`

- Query user by email
- Return user object (without password hash)
- Return null if not found

#### `updateUser(id, data)`

- Hash password if provided
- Update user record
- Return updated user object

#### `deleteUser(id)`

- Delete user and cascade related records
- Return success boolean

#### `getAllUsers(roleFilter?)`

- Query all users
- Optional filter by role
- Return array of user objects

#### `verifyPassword(plainPassword, hashedPassword)`

- Use bcrypt to compare
- Return boolean

#### `updateAvatar(id, filename)`

- Delete old avatar file if exists
- Update avatar_filename in database
- Return updated user

#### `deleteAvatar(id)`

- Delete avatar file from filesystem
- Set avatar_filename to null
- Return updated user

### Challenge Service (`src/services/challengeService.ts`)

**Methods**:

#### `createChallenge(data, adminId)`

- Insert challenge record
- Set created_by_admin_id
- Return challenge object

#### `getChallengeById(id)`

- Query challenge by ID
- Return challenge object
- Return null if not found

#### `getAllChallenges()`

- Query all challenges
- Order by created_at DESC
- Return array of challenge objects

#### `updateChallenge(id, data)`

- Update challenge record
- Return updated challenge

#### `deleteChallenge(id)`

- Delete challenge and cascade (submissions, scores)
- Delete all submission files
- Return success boolean

### Submission Service (`src/services/submissionService.ts`)

**Methods**:

#### `createSubmission(challengeId, userId, filename)`

- Check if submission already exists
- If exists, delete old file and update
- Insert or update submission record
- Return submission object

#### `getSubmissionById(id)`

- Query submission by ID
- Return submission object
- Return null if not found

#### `getSubmissionByChallengeAndUser(challengeId, userId)`

- Query by challenge_id and user_id
- Return submission object
- Return null if not found

#### `getSubmissionsByChallenge(challengeId)`

- Query all submissions for challenge
- Join with users table (username, avatar)
- Return array of submission objects

#### `updateSubmission(submissionId, filename)`

- Delete old file
- Update filename
- Update updated_at
- Return updated submission

#### `deleteSubmission(id)`

- Delete submission record
- Delete file from filesystem
- Return success boolean

### Score Service (`src/services/scoreService.ts`)

**Methods**:

#### `createOrUpdateScore(submissionId, adminId, score, feedback)`

- Check if score exists
- Insert or update score record
- Return score object

#### `getScoresBySubmission(submissionId)`

- Query all scores for submission
- Join with users table (admin username)
- Return array of score objects

#### `getLeaderboard(challengeId)`

- Query all users
- Left join submissions for challenge
- Left join scores
- Group by user
- Calculate total scores
- Sort by total score DESC
- Assign ranks
- Return leaderboard array

#### `getUserScores(submissionId, userId)`

- Query scores for user's submission
- Join with admin info
- Return array of scores with feedback

## 10.5 Controller Implementation

### Auth Controller (`src/controllers/authController.ts`)

#### `login(req, res)`

1. Extract username and password from req.body
2. Find user by username
3. Verify password
4. Create session
5. Return user data

#### `logout(req, res)`

1. Destroy session
2. Clear cookie
3. Return success message

#### `getSession(req, res)`

1. Check if session exists
2. Return user data if authenticated
3. Return not authenticated status

### User Controller (`src/controllers/userController.ts`)

#### `getAll(req, res)`

- Call userService.getAllUsers()
- Apply role filter if provided
- Return users array

#### `getById(req, res)`

- Extract id from params
- Call userService.getUserById()
- Return user or 404

#### `create(req, res)`

- Validate request body
- Call userService.createUser()
- Return created user

#### `update(req, res)`

- Extract id from params
- Check permissions (admin or own account)
- Call userService.updateUser()
- Return updated user

#### `delete(req, res)`

- Extract id from params
- Check admin permission
- Prevent self-deletion
- Call userService.deleteUser()
- Return success message

#### `uploadAvatar(req, res)`

- Get uploaded file from multer
- Call userService.updateAvatar()
- Return avatar filename

#### `deleteAvatar(req, res)`

- Extract id from params
- Call userService.deleteAvatar()
- Return success message

### Challenge Controller (`src/controllers/challengeController.ts`)

#### `getAll(req, res)`

- Call challengeService.getAllChallenges()
- Return challenges array

#### `getById(req, res)`

- Extract id from params
- Call challengeService.getChallengeById()
- Return challenge or 404

#### `create(req, res)`

- Validate request body
- Call challengeService.createChallenge()
- Return created challenge

#### `update(req, res)`

- Extract id from params
- Validate request body
- Call challengeService.updateChallenge()
- Return updated challenge

#### `delete(req, res)`

- Extract id from params
- Call challengeService.deleteChallenge()
- Return success message

### Submission Controller (`src/controllers/submissionController.ts`)

#### `getByChallengeId(req, res)`

- Extract challengeId from params
- If user: return only own submission
- If admin: return all submissions
- Call submissionService.getSubmissionsByChallenge()
- Return submissions array

#### `create(req, res)`

- Get uploaded file from multer
- Extract challengeId from params
- Get userId from session
- Call submissionService.createSubmission()
- Return created submission

#### `update(req, res)`

- Get uploaded file from multer
- Extract challengeId from params
- Get userId from session
- Find existing submission
- Call submissionService.updateSubmission()
- Return updated submission

#### `download(req, res)`

- Extract submissionId from params
- Get submission record
- Check permissions (admin or own submission)
- Stream file to response

### Score Controller (`src/controllers/scoreController.ts`)

#### `getByChallengeId(req, res)`

- Extract challengeId from params
- Call scoreService.getLeaderboard()
- Return leaderboard data

#### `createOrUpdate(req, res)`

- Extract submissionId from params
- Get adminId from session
- Validate request body
- Call scoreService.createOrUpdateScore()
- Return score object

#### `getMyScores(req, res)`

- Extract submissionId from params
- Get userId from session
- Call scoreService.getUserScores()
- Return user's scores with feedback

## 10.6 Routes Definition

### Auth Routes (`src/routes/auth.ts`)

```typescript
POST   /api/auth/login       -> authController.login
POST   /api/auth/logout      -> requireAuth -> authController.logout
GET    /api/auth/session     -> authController.getSession
```

### User Routes (`src/routes/users.ts`)

```typescript
GET    /api/users            -> requireAdmin -> userController.getAll
POST   /api/users            -> requireAdmin -> validate -> userController.create
GET    /api/users/:id        -> requireAuth -> userController.getById
PUT    /api/users/:id        -> requireAuth -> validate -> userController.update
DELETE /api/users/:id        -> requireAdmin -> userController.delete
POST   /api/users/:id/avatar -> requireAuth -> avatarUpload -> userController.uploadAvatar
DELETE /api/users/:id/avatar -> requireAuth -> userController.deleteAvatar
```

### Challenge Routes (`src/routes/challenges.ts`)

```typescript
GET    /api/challenges       -> requireAuth -> challengeController.getAll
POST   /api/challenges       -> requireAdmin -> validate -> challengeController.create
GET    /api/challenges/:id   -> requireAuth -> challengeController.getById
PUT    /api/challenges/:id   -> requireAdmin -> validate -> challengeController.update
DELETE /api/challenges/:id   -> requireAdmin -> challengeController.delete
```

### Submission Routes (`src/routes/submissions.ts`)

```typescript
GET    /api/challenges/:challengeId/submissions
       -> requireAuth -> submissionController.getByChallengeId

POST   /api/challenges/:challengeId/submissions
       -> requireAuth -> submissionUpload -> submissionController.create

PUT    /api/challenges/:challengeId/submissions
       -> requireAuth -> submissionUpload -> submissionController.update

GET    /api/submissions/:id/download
       -> requireAuth -> submissionController.download
```

### Score Routes (`src/routes/scores.ts`)

```typescript
GET    /api/challenges/:challengeId/scores
       -> requireAuth -> scoreController.getByChallengeId

POST   /api/submissions/:submissionId/scores
       -> requireAdmin -> validate -> scoreController.createOrUpdate

GET    /api/submissions/:submissionId/scores/me
       -> requireAuth -> scoreController.getMyScores
```

## 10.7 Server Setup (`src/server.ts`)

**Implementation Steps**:

1. **Import Dependencies**
   - Express, cors, dotenv, path, fs
   - Database config
   - Session middleware
   - All route modules

2. **Load Environment Variables**

   ```typescript
   dotenv.config();
   ```

3. **Initialize Express App**

   ```typescript
   const app = express();
   const PORT = process.env.PORT || 3000;
   ```

4. **Apply Middleware**
   - CORS (with credentials)
   - express.json()
   - express.urlencoded()
   - Session middleware
   - Static file serving for uploads

5. **Mount Routes**
   - `/api/auth` -> authRoutes
   - `/api/users` -> userRoutes
   - `/api/challenges` -> challengeRoutes
   - `/api/submissions` -> submissionRoutes
   - `/api/scores` -> scoreRoutes

6. **Error Handling**
   - 404 handler for unknown routes
   - Global error handler middleware

7. **Database Initialization**
   - Call initDatabase()
   - Create root admin if not exists

8. **Create Upload Directories**
   - Create ./uploads/avatars
   - Create ./uploads/submissions
   - Create ./database

9. **Start Server**
   ```typescript
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

## 10.8 Database Seeding (`src/utils/seed.ts`)

**Purpose**: Populate database with sample data for development

**Tasks**:

1. Create root admin from env variables
2. Create 2-3 additional admin accounts
3. Create 5-7 user accounts
4. Create 3-4 sample challenges
5. Create sample submissions (some users)
6. Create sample scores (some admins)

**Implementation**:

- Check if data exists before seeding
- Use services to create records
- Log progress
- Handle errors gracefully

**Run Command**:

```bash
npm run seed
```

## 10.9 Environment Variables

Create `.env` file:

```env
# Server
PORT=3000
NODE_ENV=development

# Session
SESSION_SECRET=your-secret-key-change-in-production

# Root Admin
ROOT_ADMIN_USERNAME=admin
ROOT_ADMIN_EMAIL=admin@example.com
ROOT_ADMIN_PASSWORD=Admin123!
```

Create `.env.example` (without secrets):

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=
ROOT_ADMIN_USERNAME=
ROOT_ADMIN_EMAIL=
ROOT_ADMIN_PASSWORD=
```

---

# 11. File Upload & Storage

## 11.1 Storage Structure

```
backend/
  uploads/
    avatars/
      avatar_1_1234567890.jpg
      avatar_2_1234567891.png
      ...
    submissions/
      submission_2_1_1234567890.pdf
      submission_3_1_1234567891.pdf
      ...
```

## 11.2 Naming Conventions

### Avatar Files

- Pattern: `avatar_${userId}_${timestamp}.${ext}`
- Example: `avatar_5_1704110400000.jpg`
- Allowed extensions: `.jpg`, `.jpeg`, `.png`, `.gif`

### Submission Files

- Pattern: `submission_${userId}_${challengeId}_${timestamp}.pdf`
- Example: `submission_3_2_1704110400000.pdf`
- Extension: `.pdf` only

## 11.3 File Validation

### Avatar Images

- **Type**: JPEG, PNG, GIF
- **Max Size**: 5MB
- **Validation**: MIME type check
- **Security**: Rename on upload, store outside public folder

### Submission PDFs

- **Type**: PDF only
- **Max Size**: 50MB
- **Filename Check**: No spaces allowed in original filename
- **Validation**: MIME type check
- **Security**: Rename on upload, access control via API

## 11.4 File Serving

### Avatar URLs

- Endpoint: `GET /uploads/avatars/:filename`
- Access: Public (all authenticated users)
- Headers: Set appropriate content-type
- Caching: Enable browser caching

### Submission Downloads

- Endpoint: `GET /api/submissions/:id/download`
- Access: Admin (all) or owner (own only)
- Response: Stream file with PDF content-type
- Filename: Set Content-Disposition header

## 11.5 File Cleanup

### On User Deletion

- Delete avatar file from filesystem
- Delete all user's submission files

### On Challenge Deletion

- Delete all submission files for that challenge

### On Submission Update

- Delete old file before saving new one

### On Avatar Update

- Delete old avatar before saving new one

### Orphan File Cleanup (Optional)

- Scheduled job to find files without DB records
- Delete orphaned files

## 11.6 Security Considerations

1. **Filename Sanitization**: Always rename uploaded files
2. **Path Traversal Prevention**: Validate filenames, don't use user input
3. **MIME Type Validation**: Check file type, don't trust extensions
4. **Size Limits**: Enforce max file sizes
5. **Access Control**: Check permissions before serving files
6. **Storage Location**: Store outside public web directory
7. **Virus Scanning**: (Optional) Integrate antivirus for uploaded files

---

# 12. Theme Implementation

## 12.1 Theme System Overview

**Modes**:

- `light`: Light theme
- `dark`: Dark theme
- `auto`: System preference (default)

**Implementation**: CSS variables + Tailwind

## 12.2 CSS Variables

Define in `src/index.css`:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* ... more variables ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... more variables ... */
  }
}
```

## 12.3 Theme Provider Implementation

### ThemeContext (`src/contexts/ThemeContext.tsx`)

**State**:

```typescript
const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
```

**Initialization**:

1. Load theme from localStorage
2. If 'auto', detect system preference
3. Apply theme class to document root

**System Theme Detection**:

```typescript
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

useEffect(() => {
  const handleChange = () => {
    if (theme === 'auto') {
      setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
    }
  };

  mediaQuery.addEventListener('change', handleChange);
  return () => mediaQuery.removeEventListener('change', handleChange);
}, [theme]);
```

**Apply Theme**:

```typescript
useEffect(() => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolvedTheme);
}, [resolvedTheme]);
```

**Persist Preference**:

```typescript
const updateTheme = (newTheme: 'light' | 'dark' | 'auto') => {
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
};
```

## 12.4 Theme Switcher Component

**UI Options**:

1. Dropdown menu with three options
2. Toggle button cycling through modes
3. Radio group in dropdown

**Recommended**: Dropdown in account menu

**Example**:

```typescript
<DropdownMenu>
  <DropdownMenuTrigger>
    {resolvedTheme === 'dark' ? <Moon /> : <Sun />}
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onClick={() => setTheme('light')}>
      <Sun className="mr-2" /> Light
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme('dark')}>
      <Moon className="mr-2" /> Dark
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setTheme('auto')}>
      <Laptop className="mr-2" /> Auto
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## 12.5 Theme-Aware Components

Use Shadcn UI components - they automatically respect theme variables.

For custom components, use Tailwind's theme utilities:

- `bg-background`
- `text-foreground`
- `border-border`
- etc.

---

# 13. Testing Strategy

## 13.1 Backend Testing

### Unit Tests

- **Services**: Test each service method
- **Controllers**: Test request handling
- **Middleware**: Test auth and validation
- **Utils**: Test helper functions

### Integration Tests

- **API Endpoints**: Test all routes
- **Database**: Test CRUD operations
- **File Upload**: Test file handling
- **Authentication**: Test login/logout flow

### Test Framework

- **Jest** or **Mocha** + **Chai**
- **Supertest** for API testing
- **SQLite in-memory** for test database

## 13.2 Frontend Testing

### Unit Tests

- **Components**: Test rendering and interactions
- **Hooks**: Test custom hooks
- **Utils**: Test utility functions
- **Contexts**: Test state management

### Integration Tests

- **Pages**: Test page flows
- **Forms**: Test form submission
- **API Client**: Test API calls (mocked)

### E2E Tests (Optional)

- **Cypress** or **Playwright**
- Test critical user flows:
  - Login
  - Submit challenge
  - Score submission
  - View leaderboard

### Test Framework

- **Vitest** (Vite-native)
- **React Testing Library**
- **Mock Service Worker** (MSW) for API mocking

## 13.3 Test Coverage Goals

- **Backend**: 70%+ coverage
- **Frontend**: 60%+ coverage
- **Critical paths**: 90%+ coverage (auth, scoring, file upload)

---

# 14. Deployment Guide

## 14.1 Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Server runs on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

Frontend runs on `http://localhost:5173`

### Database Setup

```bash
cd backend
npm run seed  # Create sample data
```

## 14.2 Production Build

### Backend Build

```bash
cd backend
npm install --production
npm run build
```

Output: `backend/dist/`

### Frontend Build

```bash
cd frontend
npm install
npm run build
```

Output: `frontend/dist/`

## 14.3 Docker Deployment

### Project Structure for Docker

```
rankboard/
  docker-compose.yml
  .dockerignore
  frontend/
    Dockerfile
    ...
  backend/
    Dockerfile
    ...
```

### Backend Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Create upload directories
RUN mkdir -p uploads/avatars uploads/submissions database

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.js"]
```

### Frontend Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (`frontend/nginx.conf`)

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        proxy_pass http://backend:3000;
    }
}
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: rankboard-backend
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - PORT=3000
      - SESSION_SECRET=${SESSION_SECRET}
      - ROOT_ADMIN_USERNAME=${ROOT_ADMIN_USERNAME}
      - ROOT_ADMIN_EMAIL=${ROOT_ADMIN_EMAIL}
      - ROOT_ADMIN_PASSWORD=${ROOT_ADMIN_PASSWORD}
    volumes:
      - backend-uploads:/app/uploads
      - backend-database:/app/database
    networks:
      - rankboard-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: rankboard-frontend
    restart: unless-stopped
    ports:
      - '80:80'
    depends_on:
      - backend
    networks:
      - rankboard-network

volumes:
  backend-uploads:
  backend-database:

networks:
  rankboard-network:
    driver: bridge
```

### Environment Variables for Docker

Create `.env` in project root:

```env
SESSION_SECRET=your-production-secret-here
ROOT_ADMIN_USERNAME=admin
ROOT_ADMIN_EMAIL=admin@yourdomain.com
ROOT_ADMIN_PASSWORD=SecurePassword123!
```

### Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Access Application

- Frontend: `http://localhost` or `http://your-domain.com`
- Backend API: `http://localhost/api` or `http://your-domain.com/api`

## 14.4 Production Considerations

### Security

1. Use strong SESSION_SECRET
2. Enable HTTPS (use reverse proxy like Traefik or Nginx)
3. Set secure cookies (secure: true)
4. Implement rate limiting
5. Use helmet.js for security headers
6. Regular security updates

### Performance

1. Enable gzip compression
2. Set up CDN for static assets
3. Optimize images
4. Enable browser caching
5. Database indexing
6. Connection pooling

### Monitoring

1. Logging (Winston, Morgan)
2. Error tracking (Sentry)
3. Uptime monitoring
4. Performance monitoring
5. Backup automation

### Backup Strategy

1. Daily database backups
2. Upload folder backups
3. Automated retention policy
4. Test restore procedures

### SSL/TLS

Using Let's Encrypt with Nginx or Traefik:

```bash
# Example with Certbot
certbot --nginx -d yourdomain.com
```

### Scaling (Future)

1. Separate database service (PostgreSQL or MySQL)
2. Object storage for uploads (S3, MinIO)
3. Redis for sessions
4. Load balancing
5. Container orchestration (Kubernetes)

---

# 15. Development Workflow

## 15.1 Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Production hotfixes

### Commit Convention

```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Example**:

```
feat(auth): add session timeout handling

- Implement session expiry check
- Add auto-logout on timeout
- Display warning before expiry

Closes #123
```

## 15.2 Development Steps

### Phase 1: Project Setup

1. Initialize repositories
2. Set up project structure
3. Configure development tools
4. Set up version control
5. Create development environment

### Phase 2: Backend Core

1. Database schema implementation
2. Express server setup
3. Authentication system
4. User management endpoints
5. Testing setup

### Phase 3: Backend Features

1. Challenge CRUD operations
2. Submission handling
3. Scoring system
4. File upload implementation
5. Leaderboard calculation

### Phase 4: Frontend Core

1. Vite + React setup
2. Shadcn UI configuration
3. Routing structure
4. Context providers
5. API client setup

### Phase 5: Frontend Pages

1. Landing/Login page
2. Home page
3. Challenge pages (user/admin)
4. Profile pages
5. Admin account management

### Phase 6: Integration

1. Connect frontend to backend
2. File upload integration
3. Real-time updates (if needed)
4. Error handling
5. Loading states

### Phase 7: Polish

1. Theme implementation
2. Responsive design
3. Accessibility
4. Performance optimization
5. User experience refinements

### Phase 8: Testing

1. Unit tests
2. Integration tests
3. E2E tests
4. User acceptance testing
5. Bug fixes

### Phase 9: Deployment

1. Production environment setup
2. Docker configuration
3. CI/CD pipeline (optional)
4. Monitoring setup
5. Documentation

### Phase 10: Launch

1. Final testing
2. Data migration (if needed)
3. User training
4. Go-live
5. Post-launch monitoring

## 15.3 Code Review Checklist

### General

- [ ] Code follows project conventions
- [ ] No console.logs in production code
- [ ] No commented-out code
- [ ] Proper error handling
- [ ] Input validation

### Backend

- [ ] Database queries optimized
- [ ] Proper authorization checks
- [ ] File uploads validated
- [ ] SQL injection prevention
- [ ] XSS prevention

### Frontend

- [ ] Components are reusable
- [ ] Proper prop types
- [ ] Accessibility attributes
- [ ] Responsive design
- [ ] Loading states implemented

### Security

- [ ] Passwords hashed
- [ ] Sessions secure
- [ ] CORS configured
- [ ] File upload restrictions
- [ ] SQL injection prevented

## 15.4 Common Issues & Solutions

### Issue: CORS errors

**Solution**: Configure CORS in backend with correct origin and credentials:true

### Issue: Session not persisting

**Solution**: Ensure withCredentials:true in frontend API client and sameSite:'lax' in backend

### Issue: File upload fails

**Solution**: Check file size limits, MIME type validation, and filename restrictions

### Issue: Database locked

**Solution**: Use WAL mode in SQLite, handle concurrent access properly

### Issue: Theme not applying

**Solution**: Ensure CSS variables are defined and theme class is applied to root element

### Issue: Images not loading

**Solution**: Check path serving in Express, ensure uploads directory exists

---

# 16. Project Completion Checklist

## Core Functionality

- [ ] User authentication (login/logout)
- [ ] Session management
- [ ] Root admin creation from env
- [ ] Admin account creation
- [ ] User account creation
- [ ] Profile editing (username, email, password, avatar)
- [ ] Challenge creation
- [ ] Challenge editing (title, dates, description)
- [ ] Challenge deletion
- [ ] Challenge listing (sorted by date)
- [ ] File submission (PDF, no spaces)
- [ ] Submission update/replacement
- [ ] Score submission (multiple admins)
- [ ] Feedback submission
- [ ] Leaderboard calculation
- [ ] Leaderboard display (chart + table)
- [ ] Individual feedback viewing
- [ ] Admin/User view switching

## UI/UX

- [ ] Landing/Login page
- [ ] Home page
- [ ] User challenge page
- [ ] Admin challenge page
- [ ] Profile pages
- [ ] Admin account management page
- [ ] Sidebar navigation
- [ ] Header with account menu
- [ ] Theme switcher (light/dark/auto)
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Loading states
- [ ] Error messages
- [ ] Success messages
- [ ] Confirmation dialogs
- [ ] Empty states

## Security

- [ ] Password hashing (bcrypt)
- [ ] Session security
- [ ] CORS configuration
- [ ] File upload validation
- [ ] Path traversal prevention
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Authorization checks
- [ ] Admin-only routes protected
- [ ] User-only routes protected

## Performance

- [ ] Database indexing
- [ ] File serving optimized
- [ ] Images optimized
- [ ] Lazy loading (if needed)
- [ ] Code splitting (if needed)
- [ ] Caching headers

## Testing

- [ ] Backend unit tests
- [ ] Backend integration tests
- [ ] Frontend unit tests
- [ ] Frontend integration tests
- [ ] E2E tests (critical paths)
- [ ] Manual testing

## Documentation

- [ ] README.md
- [ ] API documentation
- [ ] Setup instructions
- [ ] Environment variables documented
- [ ] Deployment guide
- [ ] User guide (optional)
- [ ] Admin guide (optional)

## Deployment

- [ ] Backend Dockerfile
- [ ] Frontend Dockerfile
- [ ] Docker Compose configuration
- [ ] Environment variables configured
- [ ] Database initialization
- [ ] Upload directories created
- [ ] Production build tested
- [ ] SSL/TLS configured (production)

## Polish

- [ ] Consistent styling
- [ ] Proper typography
- [ ] Spacing and alignment
- [ ] Color consistency
- [ ] Icon consistency
- [ ] Animation/transitions
- [ ] Accessibility (ARIA labels)
- [ ] Keyboard navigation
- [ ] Tab order

---

# 17. Future Enhancements

## Features

- [ ] Email notifications
- [ ] Challenge categories/tags
- [ ] Challenge search
- [ ] Advanced filtering
- [ ] Challenge templates
- [ ] Bulk user import
- [ ] Export data (CSV/Excel)
- [ ] Challenge statistics
- [ ] Admin activity log
- [ ] User activity log
- [ ] Challenge comments
- [ ] File version history
- [ ] Challenge archives
- [ ] Multiple file submissions
- [ ] Rich text editor for descriptions
- [ ] Markdown preview

## Technical

- [ ] PostgreSQL/MySQL support
- [ ] Redis for sessions
- [ ] Object storage (S3)
- [ ] WebSocket for real-time updates
- [ ] GraphQL API (alternative)
- [ ] API rate limiting
- [ ] API versioning
- [ ] Database migrations tool
- [ ] Automated backups
- [ ] Health check endpoint
- [ ] Metrics endpoint
- [ ] Logging infrastructure
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment
- [ ] Horizontal scaling

## Security

- [ ] Two-factor authentication
- [ ] Password reset via email
- [ ] Account lockout after failed attempts
- [ ] Security audit logging
- [ ] CAPTCHA on login
- [ ] API key authentication (for integrations)
- [ ] OAuth support
- [ ] LDAP/AD integration

## UX

- [ ] Drag and drop file upload
- [ ] Image cropping for avatars
- [ ] Real-time leaderboard updates
- [ ] Push notifications
- [ ] Dark mode animations
- [ ] Skeleton loaders
- [ ] Infinite scroll
- [ ] Advanced data visualization
- [ ] Customizable dashboard
- [ ] Keyboard shortcuts
- [ ] Tour/onboarding
- [ ] Help documentation

---

# Appendix A: Technology References

## React

- Official Docs: https://react.dev/
- React Router: https://reactrouter.com/

## Vite

- Official Docs: https://vitejs.dev/

## Shadcn UI

- Official Docs: https://ui.shadcn.com/
- Components: https://ui.shadcn.com/docs/components

## Tailwind CSS

- Official Docs: https://tailwindcss.com/docs

## Express.js

- Official Docs: https://expressjs.com/

## SQLite

- Official Docs: https://www.sqlite.org/docs.html
- Node SQLite3: https://github.com/TryGhost/node-sqlite3

## Zod

- Official Docs: https://zod.dev/

## Recharts

- Official Docs: https://recharts.org/

## Docker

- Official Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/

---

# Appendix B: File Templates

## Filename: `backend/.env.example`

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Session Configuration
SESSION_SECRET=change-this-to-a-random-secret

# Root Administrator
ROOT_ADMIN_USERNAME=admin
ROOT_ADMIN_EMAIL=admin@example.com
ROOT_ADMIN_PASSWORD=ChangeThisPassword123!
```

## Filename: `frontend/.env.example`

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
```

## Filename: `.gitignore`

```
# Dependencies
node_modules/
.pnp/
.pnp.js

# Testing
coverage/

# Production
dist/
build/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Database
*.db
*.db-journal

# Uploads
backend/uploads/avatars/*
backend/uploads/submissions/*
!backend/uploads/avatars/.gitkeep
!backend/uploads/submissions/.gitkeep

# Logs
logs/
*.log
npm-debug.log*

# Docker
.docker/
```

## Filename: `README.md`

````markdown
# RankBoard

Challenges Scoring & Leaderboard Platform

## Features

- Multi-admin scoring system
- Challenge management
- File submissions
- Real-time leaderboards
- User/Admin role management
- Dark/Light theme

## Tech Stack

- Frontend: React + Vite + Shadcn UI
- Backend: Express.js + SQLite3
- Deployment: Docker

## Quick Start

### Development

1. Clone repository
2. Set up backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env
   npm run dev
   ```
````

3. Set up frontend:
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

### Production (Docker)

```bash
docker-compose up -d
```

## Documentation

See full documentation in `DEVELOPMENT.md`

## License

MIT

```

---

# Final Notes

This comprehensive documentation covers all aspects of the RankBoard project from planning to deployment. Use it as a reference throughout the development process.

**Key Reminders**:
1. Always validate user input
2. Implement proper error handling
3. Test thoroughly before deployment
4. Follow security best practices
5. Keep dependencies updated
6. Document as you code
7. Use version control effectively
8. Test in production-like environment
9. Monitor after deployment
10. Iterate based on feedback

**Success Criteria**:
- All core features implemented
- Secure authentication and authorization
- Responsive and accessible UI
- Smooth user experience
- Production-ready deployment
- Comprehensive testing
- Clear documentation

This document is **AI-friendly** and structured for Claude or other coding agents to understand and implement the system step by step. Each section provides enough context and detail to generate working code without hallucination.
```
