# RankBoard Backend

The backend API for the RankBoard challenges scoring and leaderboard platform, built with Node.js, Express.js, and SQLite3.

## Overview

RankBoard Backend is a RESTful API server that powers the challenges scoring platform. It provides:

- **Authentication**: Session-based login with role-based access control
- **User Management**: Admin creation and management of users
- **Challenge Management**: CRUD operations for challenges with deadlines
- **Submission Handling**: PDF file uploads with one-submission-per-challenge limit
- **Scoring System**: Multiple admin scoring with feedback and aggregate rankings
- **File Storage**: Secure handling of avatars and submission files
- **Real-time Leaderboards**: Calculated from individual admin scores

## Architecture

### Core Components

```
backend/
├── src/
│   ├── config/          # Database, session, and app configuration
│   ├── middleware/      # Authentication, validation, and error handling
│   ├── controllers/     # Request/response handling
│   ├── services/        # Business logic layer
│   ├── repositories/    # Data access layer
│   ├── routes/          # API route definitions
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Helper functions and utilities
│   └── __tests__/       # Test suites
├── database/            # SQLite database files
├── uploads/             # File storage for avatars and submissions
└── package.json
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4
- **Database**: SQLite3 with custom repository pattern
- **Authentication**: Express-session with bcrypt password hashing
- **File Uploads**: Multer for multipart form data
- **Validation**: Zod schemas for request validation
- **Documentation**: Swagger/OpenAPI integration
- **Logging**: Winston for structured logging
- **Testing**: Jest + ts-jest with comprehensive coverage

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+

### Installation

1. **Clone and navigate**:

   ```bash
   cd rankboard/backend
   npm install
   ```

2. **Environment setup**:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database initialization**:

   ```bash
   npm run seed  # Creates sample data
   ```

4. **Development server**:
   ```bash
   npm run dev  # Starts with hot reload on port 3000
   ```

### Key Scripts

```bash
npm run dev        # Development server with ts-node
npm run build      # Compile TypeScript to JavaScript
npm start          # Production server from dist/
npm run seed       # Populate database with sample data
npm test           # Run Jest test suite with coverage
```

## API Overview

### Base URL

- Development: `http://localhost:3000/api`
- Production: `https://your-domain.com/api`

### Authentication Endpoints

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/api/auth/login`   | User authentication  |
| POST   | `/api/auth/logout`  | Destroy session      |
| GET    | `/api/auth/session` | Current session info |

### User Management (Admin Only)

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| GET    | `/api/users`            | List all users with filtering |
| POST   | `/api/users`            | Create new user/admin         |
| GET    | `/api/users/:id`        | Get user details              |
| PUT    | `/api/users/:id`        | Update user information       |
| DELETE | `/api/users/:id`        | Delete user account           |
| POST   | `/api/users/:id/avatar` | Upload avatar image           |
| DELETE | `/api/users/:id/avatar` | Remove avatar                 |

### Challenge Management

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| GET    | `/api/challenges`     | List all challenges          |
| POST   | `/api/challenges`     | Create new challenge (admin) |
| GET    | `/api/challenges/:id` | Get challenge details        |
| PUT    | `/api/challenges/:id` | Update challenge (admin)     |
| DELETE | `/api/challenges/:id` | Delete challenge (admin)     |

### Submissions & Scoring

| Method | Endpoint                          | Description                     |
| ------ | --------------------------------- | ------------------------------- |
| GET    | `/api/challenges/:id/submissions` | List submissions for challenge  |
| POST   | `/api/challenges/:id/submissions` | Submit PDF file                 |
| PUT    | `/api/challenges/:id/submissions` | Update submission file          |
| GET    | `/api/submissions/:id/download`   | Download submission file        |
| GET    | `/api/challenges/:id/scores`      | Get leaderboard with all scores |
| POST   | `/api/submissions/:id/scores`     | Add/update score (admin)        |
| GET    | `/api/submissions/:id/scores/me`  | Get user's individual feedback  |

## Database Schema

### Core Tables

```
users (id, username, email, password_hash, role, avatar_filename, created_at, updated_at)
challenges (id, title, description, created_at, deadline, created_by_admin_id, updated_at)
submissions (id, challenge_id, user_id, filename, submitted_at, updated_at)
scores (id, submission_id, admin_id, score, feedback, created_at, updated_at)
```

### Relationships

- Users ↔ Challenges (1:N via created_by_admin_id)
- Users ↔ Submissions (1:N)
- Challenges ↔ Submissions (1:N)
- Submissions ↔ Scores (1:N)

### Constraints

- One submission per user per challenge
- One score per admin per submission
- Foreign key constraints with cascading deletes

## Authentication & Authorization

### Session Management

- **Store**: SQLite-backed sessions
- **Duration**: 7 days
- **Security**: Regenerated on login to prevent fixation attacks

### Password Security

- **Hashing**: bcrypt with 10 salt rounds
- **Validation**: Minimum 8 characters (configurable)

### Role-Based Access

- **Admin**: Full system access (user management, scoring, challenge CRUD)
- **User**: Limited to own submissions and profile management

### Route Protection

```typescript
// Require authentication
app.use('/api/protected', requireAuth);

// Require admin role
app.use('/api/admin', requireAdmin);
```

## File Upload & Storage

### Storage Structure

```
uploads/
├── avatars/           # User profile images
│   └── avatar_{userId}_{timestamp}.{ext}
└── submissions/       # Challenge submissions
    └── submission_{userId}_{challengeId}_{timestamp}.pdf
```

### Upload Configuration

- **Avatars**: Max 5MB, JPEG/PNG/GIF, resized to standard dimensions
- **Submissions**: Max 50MB, PDF only, filename validation (no spaces)
- **Naming**: Unique timestamps to prevent collisions
- **Cleanup**: Automatic deletion on updates/deletes

### Security Considerations

- Files stored outside web root
- MIME type validation
- Filename sanitization
- Path traversal protection
- Access control via API endpoints

## Error Handling

### Response Format

```json
{
  "success": false,
  "error": "Error message",
  "details": "Optional detailed information"
}
```

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate data)
- `500`: Internal Server Error

### Custom Error Classes

- `UnauthorizedError`: Authentication failures
- `ForbiddenError`: Authorization failures
- `ValidationError`: Input validation failures
- `NotFoundError`: Resource not found

## Testing Strategy

### Test Coverage

- **Unit Tests**: Services, controllers, middleware, utilities
- **Integration Tests**: API endpoints with database
- **Coverage Goal**: 70%+ across all modules

### Test Structure

```bash
src/__tests__/
├── controllers/       # Controller test suites
├── services/          # Service layer tests
├── middleware/        # Middleware behavior tests
└── setupEnv.ts        # Global test configuration
```

### Running Tests

```bash
npm test              # Run all tests with coverage
npm run test:watch    # Watch mode for development
```

## Configuration

### Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Session
SESSION_SECRET=your-secret-key

# Root Admin (created on startup)
ROOT_ADMIN_USERNAME=admin
ROOT_ADMIN_EMAIL=admin@example.com
ROOT_ADMIN_PASSWORD=Admin123!
```

### Development Features

- SQL query logging in development mode
- Detailed error responses with stack traces
- CORS enabled for frontend development server
- Automatic database seeding with sample data

## API Documentation

Interactive Swagger documentation available at:

```
http://localhost:3000/api-docs
```

## Production Deployment

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Backend will be available on port 3000
# API docs at http://your-domain.com/api-docs
```

### Production Considerations

- Set strong `SESSION_SECRET`
- Enable HTTPS with SSL certificates
- Configure proper CORS origins
- Set up log rotation
- Enable production optimizations
- Set up database backups
- Monitor performance and errors

## Contributing

### Code Style

- TypeScript with strict type checking
- ESLint for code linting
- Prettier for code formatting
- Husky pre-commit hooks

### Development Workflow

1. Create feature branch from `develop`
2. Implement changes with tests
3. Ensure all tests pass with coverage
4. Submit pull request with description
5. Code review and merge

### Testing Requirements

- All new code must have test coverage
- Existing tests must continue to pass
- Minimum 70% coverage maintained
- Integration tests for API changes

## Troubleshooting

### Common Issues

| Issue                      | Solution                                          |
| -------------------------- | ------------------------------------------------- |
| `Database not initialized` | Run `npm run seed` to create database             |
| `Session errors`           | Check `SESSION_SECRET` is set                     |
| `CORS blocked`             | Verify frontend URL in CORS configuration         |
| `File upload fails`        | Check upload directories exist and permissions    |
| `Tests fail`               | Ensure test database is clean, run `npm run seed` |

### Logs

Check logs in console or configured log files for:

- Database connection issues
- Authentication failures
- File upload errors
- API request/response details

## License

MIT License - see LICENSE file for details.
