# RankBoard: Challenges Scoring & Leaderboard Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-%E2%9C%93-blue)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/typescript-%E2%9C%93-blue)](https://www.typescriptlang.org/)

RankBoard is a comprehensive web-based platform designed for managing coding challenges, collecting submissions, and facilitating independent scoring by multiple judges. It provides real-time leaderboards, user management, and a seamless experience for both administrators and participants.

## Table of Contents

- [Introduction](#introduction)
- [Project Overview](#project-overview)
- [Features](#features)
- [Requirements & Limitations](#requirements--limitations)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Introduction

RankBoard addresses the complex needs of coding competitions and challenge-based assessments where multiple judges need to independently score submissions while maintaining fairness and transparency. The platform supports both admin and user roles, with admins managing challenges, accounts, and scoring, while users can participate by submitting work and tracking their performance.

The application is built with modern web technologies, featuring a React frontend with a Node.js/Express backend, SQLite database, and Docker containerization for easy deployment.

## Project Overview

### Architecture

RankBoard follows a microservices-inspired architecture with clear separation of concerns:

- **Frontend**: React 18 SPA built with Vite, using TypeScript for type safety
- **Backend**: Node.js 18+ Express API server with TypeScript
- **Database**: SQLite3 for data persistence and session storage
- **File Storage**: Local filesystem for user uploads (avatars, PDF submissions)
- **Deployment**: Docker Compose orchestration with Nginx reverse proxy

### Technology Stack

| Component            | Technology               | Version        | Purpose                           |
| -------------------- | ------------------------ | -------------- | --------------------------------- |
| **Frontend**         | React 18 + TypeScript    | 18.3.1 / 5.6.2 | User interface and interactions   |
| **Backend**          | Node.js + Express.js     | 18+ / 4.21.2   | API server and business logic     |
| **Database**         | SQLite3                  | 5.1.7          | Data persistence                  |
| **Build Tool**       | Vite                     | 5.4.11         | Frontend development and bundling |
| **Styling**          | Tailwind CSS + Shadcn UI | 3.4.17         | Modern, responsive design         |
| **State Management** | React Context API        | -              | Client-side state management      |
| **Deployment**       | Docker + Docker Compose  | Latest         | Containerized deployment          |

## Features

### 🔐 Authentication & Authorization

- **Role-based access control**: Admin and User roles with distinct permissions
- **Session-based authentication**: Secure HTTP-only cookies with configurable timeout
- **No public registration**: Admin-only user account creation
- **Password security**: bcrypt hashing with configurable salt rounds

### 👥 User Management (Admin Only)

- **Account creation**: Create admin or user accounts with email validation
- **Profile management**: Users can update username, email, password, and avatar
- **Avatar upload**: Image upload with validation (JPEG/PNG/GIF, 5MB max)
- **Account deletion**: Safe deletion with cascade handling
- **User overview**: List and filter users by role

### 🎯 Challenge Management

- **Challenge lifecycle**: Create, edit, delete challenges with rich descriptions
- **Flexible scheduling**: Set creation date and submission deadlines
- **Markdown support**: Rich text descriptions for challenge details
- **Challenge browsing**: Sorted by creation date with deadline indicators
- **Status tracking**: Visual indicators for submission status

### 📄 Submission System

- **PDF submissions**: Single submission per challenge per user
- **File validation**: Strict PDF format checking and filename sanitization
- **Submission replacement**: Update submissions before deadline
- **File size limits**: 50MB maximum per submission
- **Secure storage**: Files stored outside web root with access controls

### 🏆 Scoring & Leaderboards

- **Independent scoring**: Multiple admins can score each submission
- **Feedback system**: Text feedback accompanies numerical scores
- **Aggregate scoring**: Automatic calculation of total and average scores
- **Real-time leaderboards**: Dynamic ranking with medal indicators
- **Score visualization**: Bar charts showing individual admin scores
- **Ranking system**: Top 3 highlighted with 🥇🥈🥉 medals

### 🎨 User Experience

- **Theme switching**: Light, dark, and auto (system preference) modes
- **Responsive design**: Mobile-first approach with adaptive layouts
- **Loading states**: Skeleton loaders and progress indicators
- **Error handling**: User-friendly error messages and recovery options
- **Accessibility**: ARIA labels and keyboard navigation support

### 🔧 Admin Features

- **Challenge administration**: Full CRUD operations on challenges
- **Scoring interface**: Dedicated table view for efficient scoring
- **User mode switching**: Admins can view the platform as users
- **Account management**: Comprehensive user administration
- **Data oversight**: View all submissions and leaderboard data

## Requirements & Limitations

### System Requirements

| Component   | Minimum | Recommended | Notes                                   |
| ----------- | ------- | ----------- | --------------------------------------- |
| **CPU**     | 1 core  | 2+ cores    | For concurrent user handling            |
| **RAM**     | 1GB     | 2GB+        | Database operations and file processing |
| **Storage** | 5GB     | 20GB+       | Database, uploads, and logs             |
| **Network** | 1Mbps   | 10Mbps+     | File uploads and API calls              |

### Software Prerequisites

- **Operating System**: Linux (Ubuntu 20.04+, Debian 11+), macOS 12+, Windows 10+
- **Docker**: Docker Engine 20.0+, Docker Compose v2.0+
- **Node.js**: 18.0+ LTS (for manual setup)
- **Browser**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Current Limitations

#### Technical Limitations

- **Database**: SQLite suitable for < 100 concurrent users; consider PostgreSQL for larger scale
- **File Storage**: Local filesystem storage; cloud storage recommended for multi-server deployments
- **Session Storage**: File-based sessions; Redis recommended for horizontal scaling
- **Real-time Updates**: No WebSocket implementation; page refresh required for updates

#### Functional Limitations

- **User Registration**: No self-registration; all accounts created by admins
- **Challenge Types**: Currently supports PDF submissions only
- **Scoring Scale**: Numeric scores only; no rubric-based or multi-criteria scoring
- **Notifications**: No email notifications or real-time alerts
- **Backup**: Manual backup process; automated backups recommended for production

#### Performance Considerations

- **Concurrent Users**: Optimized for 10-100 simultaneous users
- **File Upload**: 50MB limit per PDF; consider CDN for large files
- **Database Queries**: Simple queries; complex analytics may require optimization
- **Memory Usage**: Minimal caching; consider Redis for session and data caching

## Quick Start

### Docker Compose Deployment (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd rankboard
   ```

2. **Configure environment (optional)**

   ```bash
   cp .env.example .env
   # Edit .env with your desired settings
   ```

3. **Deploy with Docker Compose**

   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: `http://localhost:8080` or `http://your-domain.com`
   - API: `http://localhost:3000/api`

5. **Default admin credentials**
   - Username: `admin`
   - Password: `Admin123!` (or as configured in `.env`)

### Manual Development Setup

1. **Backend setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm run dev
   ```

2. **Frontend setup** (new terminal)

   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Access development servers**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3000/api`

### Production Deployment

For production deployment with SSL, custom domain, and advanced configuration, see the [Deployment Guide](docs/DEPLOYMENT.md).

## Documentation

RankBoard includes comprehensive documentation in the `docs/` folder:

### 📖 Project Documentation

- **[Development Guide](docs/DEVELOPMENT.md)** - Complete development setup, API endpoints, and contribution guidelines
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment with Docker and manual setup instructions
- **[Software Bill of Materials](docs/SBOM.md)** - Complete technology stack and component details

### 🧪 Testing Documentation

- **[Backend Testing](docs/BACKEND-TEST.md)** - Backend testing strategy and test suites
- **[Frontend Testing](docs/FRONTEND-TEST.md)** - Frontend testing strategy and test suites

### 📋 Additional Resources

- **API Documentation**: Available at `/api-docs` when running the backend
- **Environment Variables**: See `.env.example` files for configuration options
- **Troubleshooting**: Check the troubleshooting sections in each guide

## Contributing

We welcome contributions to RankBoard! Please follow these guidelines:

### Development Workflow

1. **Fork the repository** and create a feature branch
2. **Follow the existing code style** (ESLint, Prettier configured)
3. **Write tests** for new features and bug fixes
4. **Update documentation** when adding features or changing APIs
5. **Submit a pull request** with a clear description

### Code Quality Standards

- **TypeScript**: Strict mode enabled, proper typing required
- **Testing**: Maintain test coverage (70%+ backend, 60%+ frontend)
- **Documentation**: Update relevant docs for code changes
- **Commits**: Use conventional commit format (`feat:`, `fix:`, `docs:`, etc.)

### Areas for Contribution

- **New Features**: Email notifications, advanced scoring rubrics, challenge categories
- **Performance**: Database optimization, caching implementation, CDN integration
- **Security**: Additional authentication methods, audit logging, rate limiting
- **Testing**: Additional test coverage, E2E testing with Playwright
- **Documentation**: API docs, user guides, deployment tutorials

See the [Development Guide](docs/DEVELOPMENT.md) for detailed setup and contribution instructions.

## Support

### Getting Help

- **Documentation**: Check the [docs/](docs/) folder first
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions and general discussion
- **Troubleshooting**: See troubleshooting sections in each documentation file

### Common Issues

- **Authentication problems**: Check session configuration and cookie settings
- **File upload failures**: Verify file permissions and size limits
- **Database errors**: Ensure proper SQLite permissions and disk space
- **Container issues**: Check Docker logs with `docker-compose logs`

### Community Resources

- **GitHub Repository**: Main project repository
- **Issues Board**: Bug reports and feature requests
- **Discussions**: Community Q&A and knowledge sharing

## License

RankBoard is open source software licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 RankBoard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

**RankBoard** - Empowering fair and transparent challenge-based assessments with modern web technology.

For more information, see our [complete documentation](docs/README.md).
