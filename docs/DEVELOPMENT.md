# RankBoard Development Documentation

## Overview

RankBoard is a web-based platform for managing challenges, submissions, scoring, and leaderboards. It features a React frontend with a Node.js/Express backend using SQLite3, deployed via Docker.

## Project Structure

```
rankboard/
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── config/         # Database, session, logger, swagger configs
│   │   ├── controllers/    # API route handlers
│   │   ├── middleware/     # Auth, validation, file upload, error handling
│   │   ├── models/         # Database models (empty - using direct SQL)
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic layer
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utilities (seed script)
│   │   └── server.ts       # Application entry point
│   ├── database/           # SQLite database files
│   ├── uploads/            # File storage (avatars, submissions)
│   ├── Dockerfile          # Backend container config
│   └── jest.config.js      # Testing configuration
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components (ui, layout, pages)
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # API client, utilities
│   │   ├── pages/          # Route components
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main application component
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend container config
│   └── nginx.conf          # Nginx reverse proxy config
├── docs/                   # Documentation
└── docker-compose.yml      # Production deployment config
```

## Detailed API Endpoints

### Authentication Endpoints

#### `POST /api/auth/login`

Login user or admin.

**Request Body:**

```json
{
  "email": "string",
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

#### `POST /api/auth/logout`

Logout current user.

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### `GET /api/auth/session`

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

### User Management Endpoints (Admin Only)

#### `GET /api/users`

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

#### `POST /api/users`

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

#### `GET /api/users/:id`

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

#### `PUT /api/users/:id`

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

#### `DELETE /api/users/:id`

Delete user (admin only, cannot delete self).

**Response (200):**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### `POST /api/users/:id/avatar`

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

#### `DELETE /api/users/:id/avatar`

Delete avatar image.

**Response (200):**

```json
{
  "success": true,
  "message": "Avatar deleted successfully"
}
```

### Challenge Endpoints

#### `GET /api/challenges`

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

#### `POST /api/challenges`

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

#### `GET /api/challenges/:id`

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

#### `PUT /api/challenges/:id`

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

#### `DELETE /api/challenges/:id`

Delete challenge (admin only, requires confirmation).

**Response (200):**

```json
{
  "success": true,
  "message": "Challenge deleted successfully"
}
```

### Submission Endpoints

#### `GET /api/challenges/:challengeId/submissions`

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

#### `POST /api/challenges/:challengeId/submissions`

Submit file for challenge (user only, one submission per challenge).

**Form Data:**

- `submission`: PDF file (filename must only contain letters, numbers, dots, underscores, and hyphens [A-Za-z0-9._-])

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

#### `PUT /api/challenges/:challengeId/submissions`

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

#### `GET /api/submissions/:id/download`

Download submission file (admin sees all, user sees own).

**Response:** PDF file stream

### Score Endpoints

#### `GET /api/challenges/:challengeId/scores`

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

#### `POST /api/submissions/:submissionId/scores`

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

#### `GET /api/submissions/:submissionId/scores/me`

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

### Error Response Format

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

## Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended: 20.x or 22.x)
- npm 9+
- Docker & Docker Compose (for production deployment)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

The backend server will start on `http://localhost:3000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend URL
npm run dev
```

The frontend will start on `http://localhost:5173`

### Database Seeding (Optional)

```bash
cd backend
npm run seed
```

This will create sample data for development.

## Testing Strategy

### Backend Testing

#### Unit Tests

- **Services**: Test each service method
- **Controllers**: Test request handling
- **Middleware**: Test auth and validation
- **Utils**: Test helper functions

#### Integration Tests

- **API Endpoints**: Test all routes
- **Database**: Test CRUD operations
- **File Upload**: Test file handling
- **Authentication**: Test login/logout flow

#### Test Framework

- **Jest** + **ts-jest** for test runner and assertion
- **Supertest** for API testing
- **SQLite in-memory** for test database

### Frontend Testing

#### Unit Tests

- **Components**: Test rendering and interactions
- **Hooks**: Test custom hooks
- **Utils**: Test utility functions
- **Contexts**: Test state management

#### Integration Tests

- **Pages**: Test page flows
- **Forms**: Test form submission
- **API Client**: Test API calls (mocked)

#### Test Framework

- **Vitest** (Vite-native)
- **React Testing Library**
- **Mock Service Worker** (MSW) for API mocking

### Test Coverage Goals

- **Backend**: 70%+ coverage
- **Frontend**: 60%+ coverage
- **Critical paths**: 90%+ coverage (auth, scoring, file upload)

### Running Backend Tests

```bash
cd backend
npm test                    # Run all tests with coverage
npx jest src/__tests__/services/userService.test.ts  # Run single test
```

### Test Commands Summary

- `npm test` - Execute all tests with coverage thresholds enforced
- `npx jest <file>` - Run a single test suite
- Jest thresholds: branches/functions/lines/statements >= 70%

## Deployment Guide

### Local Development

1. Set up backend and frontend as described in Development Setup
2. Access frontend at `http://localhost:5173`
3. API docs available at `http://localhost:3000/api-docs`

### Production Deployment (Docker)

#### Build and Run

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

#### Access Application

- Frontend: `http://localhost:8080` or `http://your-domain.com`
- Backend API: `http://localhost:3000/api` or `http://your-domain.com/api`
- API Docs: `http://localhost:3000/api-docs`

### Docker Configuration Overview

#### Backend Container

- **Base Image**: `node:18-alpine`
- **Build Steps**: Install deps, build TypeScript, create directories
- **Ports**: 3000
- **Environment**: Production settings, session secrets
- **Volumes**: Persistent uploads and database
- **Healthcheck**: API session endpoint

#### Frontend Container

- **Build Stage**: `node:24-alpine` for building
- **Production Stage**: `nginx:alpine` for serving
- **Build Steps**: Install deps, build React app, copy to nginx
- **Ports**: 80 (mapped to 8080 externally)
- **Environment**: API URL for backend
- **Nginx Config**: Reverse proxy for API and uploads, SPA routing

#### Docker Compose Features

- **Network**: Isolated bridge network for service communication
- **Volumes**: Persistent storage for database and uploads
- **Dependencies**: Frontend waits for backend
- **Healthchecks**: Automated service monitoring

## Security Audit Practices

### Authentication & Authorization

- **Session Management**: Secure cookie settings, proper session timeout
- **Password Security**: bcrypt hashing with salt rounds of 10
- **Role-based Access**: Strict admin/user permissions
- **CORS Configuration**: Restricted origins, credentials enabled

### Input Validation & Sanitization

- **Zod Schemas**: Comprehensive request validation
- **File Upload Security**: MIME type checking, filename sanitization
- **SQL Injection Prevention**: Parameterized queries
- **XSS Prevention**: Proper content-type headers, input escaping

### File Security

- **Storage Location**: Files stored outside web root
- **Access Control**: Permission checks before serving files
- **Naming Convention**: Unique, unpredictable filenames
- **Size Limits**: Enforced file size restrictions

### Infrastructure Security

- **Container Security**: Non-root user execution where possible
- **Network Isolation**: Docker network segmentation
- **Health Monitoring**: Automated service health checks
- **Environment Variables**: Sensitive config via env vars

### Code Security Practices

- **Dependency Management**: Regular security updates
- **Error Handling**: No sensitive information in errors
- **Logging**: Secure logging without exposing secrets
- **API Security**: Rate limiting, proper HTTP methods

### Security Checklist

- [ ] All endpoints require authentication where appropriate
- [ ] Admin-only routes protected with role checks
- [ ] File uploads validated for type and size
- [ ] Passwords properly hashed
- [ ] Session cookies secure and httpOnly
- [ ] CORS properly configured
- [ ] Input validation on all user inputs
- [ ] SQL injection prevented with parameterized queries
- [ ] XSS prevented with proper content handling
- [ ] Error messages don't leak sensitive information
- [ ] Files served with proper access controls
- [ ] Dependencies kept up to date
- [ ] Security headers applied (helmet.js recommended)
- [ ] Rate limiting implemented (future enhancement)

## Integration Testing

### End-to-End Test Scenarios

1. **User Registration & Login**
   - Admin creates user account
   - User logs in successfully
   - Session persists across page refreshes

2. **Challenge Management**
   - Admin creates new challenge
   - Challenge appears in list
   - Admin edits challenge details
   - Challenge updates reflect correctly

3. **File Submission**
   - User uploads PDF file
   - File validation works (type, size, filename)
   - Submission appears in user's view
   - Admin can download submission

4. **Scoring System**
   - Admin assigns scores with feedback
   - Scores appear in leaderboard
   - User can view their scores and feedback
   - Aggregate scoring works correctly

5. **Leaderboard Functionality**
   - Scores calculate correctly
   - Ranking updates automatically
   - Chart displays properly
   - Medal system works (top 3)

6. **Admin/User Role Switching**
   - Admin switches to user view
   - User view shows appropriate content
   - Admin view shows management features

### API Integration Tests

- All endpoints return correct response formats
- Authentication middleware works
- Authorization checks prevent unauthorized access
- File upload/download works end-to-end
- Error handling returns proper status codes

### Database Integration Tests

- CRUD operations work correctly
- Foreign key constraints enforced
- Unique constraints work
- Cascade deletes function properly
- Seed data creates valid state

## Performance Considerations

### Frontend Performance

- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Avatar compression and caching
- **Bundle Analysis**: Monitor bundle size
- **Caching**: Browser caching for static assets
- **Loading States**: Skeleton loaders and spinners

### Backend Performance

- **Database Indexing**: Optimized queries with proper indexes
- **File Serving**: Efficient static file serving
- **Session Storage**: SQLite-based sessions (consider Redis for scale)
- **Error Handling**: Fast error responses
- **Memory Management**: Monitor for memory leaks

### Infrastructure Performance

- **Container Optimization**: Multi-stage Docker builds
- **Network**: Efficient reverse proxy configuration
- **Health Checks**: Automated service monitoring
- **Scaling**: Horizontal scaling considerations

## Troubleshooting Guide

### Common Issues

#### Backend Issues

- **Server won't start**: Check environment variables, database permissions
- **Database errors**: Ensure database directory exists and is writable
- **Session issues**: Check session secret and cookie settings
- **File upload fails**: Verify upload directories exist, check file permissions

#### Frontend Issues

- **API connection fails**: Check API URL in environment variables
- **Authentication issues**: Verify session cookies are being sent
- **File upload fails**: Check CORS settings, file size limits
- **Theme not applying**: Ensure theme context is properly initialized

#### Docker Issues

- **Container won't start**: Check logs with `docker-compose logs`
- **Services can't communicate**: Verify network configuration
- **Volumes not persisting**: Check volume mount permissions
- **Build fails**: Ensure all dependencies are properly defined

### Debug Commands

```bash
# Check running containers
docker-compose ps

# View service logs
docker-compose logs backend
docker-compose logs frontend

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build
```

### Health Check Endpoints

- Backend: `GET /api/health` - Returns server status and timestamp
- Frontend: `GET /health` - Returns "healthy" (nginx level)

## Maintenance Tasks

### Regular Tasks

- **Dependency Updates**: Weekly npm audit and updates
- **Security Patches**: Monitor for security vulnerabilities
- **Database Backups**: Automated backup scripts
- **Log Rotation**: Clean up old log files
- **Performance Monitoring**: Track response times and error rates

### Database Maintenance

- **Vacuum SQLite**: Reclaim space and optimize performance
- **Backup Strategy**: Automated daily backups
- **Data Integrity**: Periodic consistency checks
- **Index Optimization**: Monitor and optimize query performance

### File System Maintenance

- **Cleanup Orphaned Files**: Remove files without database records
- **Storage Monitoring**: Track upload directory sizes
- **Backup Files**: Include uploads in backup strategy
- **Permission Checks**: Ensure proper file permissions

## Contributing Guidelines

### Code Style

- **TypeScript**: Strict mode enabled, proper typing required
- **ESLint**: Code formatting and linting rules enforced
- **Prettier**: Consistent code formatting
- **Imports**: Organize imports properly (external, internal, types)

### Commit Convention

```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, test, chore

### Pull Request Process

1. Create feature branch from develop
2. Implement changes with tests
3. Update documentation if needed
4. Ensure all tests pass
5. Create PR with clear description
6. Code review and approval
7. Merge to main/develop

### Documentation Updates

- Update API docs for endpoint changes
- Update README for setup changes
- Update this development guide for new features
- Keep SBOM current with dependency changes

## Future Enhancements

### Planned Features

- Email notifications system
- Advanced challenge filtering and search
- Challenge templates and categories
- Bulk user import functionality
- Export capabilities (CSV/Excel reports)
- Challenge statistics and analytics
- User activity logging
- Rich text editor for challenge descriptions
- File version history
- Real-time leaderboard updates (WebSocket)

### Technical Improvements

- PostgreSQL/MySQL support for scalability
- Redis for session storage and caching
- Object storage (S3, MinIO) for file uploads
- GraphQL API as alternative to REST
- API rate limiting and throttling
- Automated testing in CI/CD pipeline
- Kubernetes deployment configuration
- Horizontal scaling support

### Security Enhancements

- Two-factor authentication (2FA)
- Password reset via email
- Account lockout after failed attempts
- Security audit logging
- CAPTCHA integration
- API key authentication for integrations
- OAuth integration possibilities

This comprehensive development documentation provides everything needed to understand, develop, test, deploy, and maintain the RankBoard platform. Regular updates should be made as the project evolves.
