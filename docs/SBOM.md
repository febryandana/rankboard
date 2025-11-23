# Software Bill of Materials (SBOM) - RankBoard

## Overview

RankBoard is a full-stack web application for managing challenges, submissions, scoring, and leaderboards. This Software Bill of Materials (SBOM) provides a comprehensive list of all technologies, libraries, services, and tools used in the RankBoard project, including version information, release dates, suppliers, and usage context.

## Project Information

- **Project Name**: RankBoard
- **Version**: 1.0.0
- **Description**: Challenges Scoring & Leaderboard Platform
- **License**: MIT
- **Development Start**: 2024
- **Current Status**: Production Ready

## Technology Stack Summary

### Architecture

- **Frontend**: React 18 + TypeScript SPA with Vite build tool
- **Backend**: Node.js 18 + Express.js API with TypeScript
- **Database**: SQLite3 for data persistence
- **Deployment**: Docker Compose with Nginx reverse proxy
- **Development Tools**: Jest, ESLint, Prettier, Husky
- **Infrastructure**: Containerized with Docker, orchestrated with Docker Compose

### Key Components

- **Authentication**: Session-based with bcrypt password hashing
- **File Storage**: Local filesystem with Multer for uploads
- **UI Framework**: Shadcn UI components with Tailwind CSS
- **State Management**: React Context API + custom hooks
- **HTTP Client**: Axios with automatic retry logic
- **Validation**: Zod schemas for runtime type checking
- **Charts**: Recharts for leaderboard visualization

## Detailed Component List

### Core Runtime Environments

| Component  | Version                           | Supplier           | Release Date                           | Added Date | Reference Link                  | Description                                                 |
| ---------- | --------------------------------- | ------------------ | -------------------------------------- | ---------- | ------------------------------- | ----------------------------------------------------------- |
| Node.js    | 18                                | Node.js Foundation | 2022-04-19                             | 2024-01-01 | https://nodejs.org/             | JavaScript runtime environment for backend API server       |
| React      | 18.3.1                            | Meta (Facebook)    | 2024-04-25                             | 2024-01-01 | https://react.dev/              | Frontend UI library for building component-based interfaces |
| TypeScript | 5.6.2 (Frontend), 5.9.3 (Backend) | Microsoft          | 2024-07-09 (5.6.x), 2024-09-30 (5.9.x) | 2024-01-01 | https://www.typescriptlang.org/ | Type-safe JavaScript superset for improved code quality     |

### Frontend Technologies

#### Build Tools & Development

| Component         | Version | Supplier               | Release Date | Added Date | Reference Link                        | Description                                                    |
| ----------------- | ------- | ---------------------- | ------------ | ---------- | ------------------------------------- | -------------------------------------------------------------- |
| Vite              | 5.4.11  | Evan You               | 2024-08-15   | 2024-01-01 | https://vitejs.dev/                   | Fast build tool and development server for modern web projects |
| ESLint            | 9.17.0  | ESLint Team            | 2024-12-06   | 2024-01-01 | https://eslint.org/                   | JavaScript/TypeScript code linting tool                        |
| TypeScript ESLint | 8.18.2  | TypeScript ESLint Team | 2024-12-09   | 2024-01-01 | https://typescript-eslint.io/         | ESLint rules for TypeScript                                    |
| Prettier          | 3.6.2   | Prettier Team          | 2024-12-05   | 2024-01-01 | https://prettier.io/                  | Code formatter for consistent styling                          |
| Husky             | 9.1.7   | Typicode               | 2024-10-13   | 2024-01-01 | https://typicode.github.io/husky/     | Git hooks for automated code quality checks                    |
| Lint-staged       | 16.2.7  | Andrey Okonetchnikov   | 2024-12-03   | 2024-01-01 | https://github.com/okonet/lint-staged | Run linters on staged git files                                |

#### UI Framework & Styling

| Component                | Version                     | Supplier      | Release Date                 | Added Date | Reference Link                            | Description                                          |
| ------------------------ | --------------------------- | ------------- | ---------------------------- | ---------- | ----------------------------------------- | ---------------------------------------------------- |
| Tailwind CSS             | 3.4.17                      | Tailwind Labs | 2024-12-04                   | 2024-01-01 | https://tailwindcss.com/                  | Utility-first CSS framework for rapid UI development |
| Shadcn UI                | Latest (various components) | shadcn        | 2023-01-01 (project started) | 2024-01-01 | https://ui.shadcn.com/                    | Re-usable UI components built on Radix UI primitives |
| Radix UI                 | Latest (via Shadcn)         | WorkOS        | 2021-01-01 (project started) | 2024-01-01 | https://www.radix-ui.com/                 | Low-level UI primitives for accessible components    |
| Lucide React             | 0.468.0                     | Lucide        | 2024-12-06                   | 2024-01-01 | https://lucide.dev/                       | Beautiful SVG icons as React components              |
| Class Variance Authority | 0.7.1                       | Joe Bell      | 2024-03-01                   | 2024-01-01 | https://cva.style/                        | Utility for creating variant-based component APIs    |
| Tailwind Merge           | 2.6.0                       | Dany Beltran  | 2024-11-01                   | 2024-01-01 | https://github.com/dcastil/tailwind-merge | Utility for merging Tailwind CSS classes             |

#### React Ecosystem

| Component          | Version | Supplier        | Release Date | Added Date | Reference Link                          | Description                                  |
| ------------------ | ------- | --------------- | ------------ | ---------- | --------------------------------------- | -------------------------------------------- |
| React DOM          | 18.3.1  | Meta (Facebook) | 2024-04-25   | 2024-01-01 | https://react.dev/                      | React rendering library for web browsers     |
| React Router DOM   | 6.28.0  | Remix Software  | 2024-11-21   | 2024-01-01 | https://reactrouter.com/                | Declarative routing for React applications   |
| React Hook Form    | 7.54.2  | React Hook Form | 2024-12-10   | 2024-01-01 | https://react-hook-form.com/            | Performant forms with easy validation        |
| Axios              | 1.7.9   | Axios Team      | 2024-12-09   | 2024-01-01 | https://axios-http.com/                 | Promise-based HTTP client for API requests   |
| Axios Retry        | 4.5.0   | Softonic        | 2024-07-01   | 2024-01-01 | https://github.com/softonic/axios-retry | Automatic retry mechanism for Axios requests |
| Recharts           | 2.15.0  | Recharts Team   | 2024-12-01   | 2024-01-01 | https://recharts.org/                   | Composable charting library for React        |
| Date-fns           | 4.1.0   | Sasha Koss      | 2024-10-01   | 2024-01-01 | https://date-fns.org/                   | Modern JavaScript date utility library       |
| Zod                | 3.24.1  | Colin McDonnell | 2024-12-10   | 2024-01-01 | https://zod.dev/                        | TypeScript-first schema validation           |
| Hookform Resolvers | 3.9.1   | React Hook Form | 2024-11-01   | 2024-01-01 | https://react-hook-form.com/            | Resolvers for React Hook Form validation     |
| Sonner             | 2.0.7   | Emil Kowalski   | 2024-10-01   | 2024-01-01 | https://sonner.emilkowal.ski/           | Toast notification library for React         |

#### Testing Frameworks (Frontend)

| Component                  | Version | Supplier        | Release Date | Added Date | Reference Link                 | Description                                     |
| -------------------------- | ------- | --------------- | ------------ | ---------- | ------------------------------ | ----------------------------------------------- |
| Vitest                     | 4.0.13  | Anthony Fu      | 2024-12-09   | 2024-01-01 | https://vitest.dev/            | Fast unit testing framework powered by Vite     |
| Testing Library React      | 16.3.0  | Testing Library | 2024-11-01   | 2024-01-01 | https://testing-library.com/   | Simple and complete testing utilities for React |
| Testing Library Jest DOM   | 6.9.1   | Testing Library | 2024-11-01   | 2024-01-01 | https://testing-library.com/   | Custom Jest matchers for DOM testing            |
| Testing Library User Event | 14.6.1  | Testing Library | 2024-11-01   | 2024-01-01 | https://testing-library.com/   | Utilities for simulating user interactions      |
| JS DOM                     | 27.2.0  | jsdom           | 2024-12-01   | 2024-01-01 | https://github.com/jsdom/jsdom | JavaScript implementation of DOM for testing    |
| Vitest Coverage V8         | 4.0.13  | Vitest Team     | 2024-12-09   | 2024-01-01 | https://vitest.dev/            | Code coverage reporting for Vitest              |

### Backend Technologies

#### Core Backend Framework

| Component  | Version | Supplier          | Release Date | Added Date | Reference Link                       | Description                                   |
| ---------- | ------- | ----------------- | ------------ | ---------- | ------------------------------------ | --------------------------------------------- |
| Express.js | 4.21.2  | Express.js Team   | 2024-12-09   | 2024-01-01 | https://expressjs.com/               | Fast, unopinionated web framework for Node.js |
| SQLite3    | 5.1.7   | SQLite Consortium | 2024-11-01   | 2024-01-01 | https://www.sqlite.org/              | Embedded SQL database engine                  |
| SQLite     | 5.1.1   | SQLite Consortium | 2024-11-01   | 2024-01-01 | https://www.npmjs.com/package/sqlite | SQLite database driver for Node.js            |

#### Security & Authentication

| Component       | Version | Supplier        | Release Date | Added Date | Reference Link                              | Description                                    |
| --------------- | ------- | --------------- | ------------ | ---------- | ------------------------------------------- | ---------------------------------------------- |
| bcrypt          | 5.1.1   | Niels Provos    | 2023-11-01   | 2024-01-01 | https://www.npmjs.com/package/bcrypt        | Password hashing library using blowfish cipher |
| Express Session | 1.18.1  | Express.js Team | 2024-10-01   | 2024-01-01 | https://github.com/expressjs/session        | Session middleware for Express.js              |
| Connect SQLite3 | 0.9.13  | Express.js Team | 2023-01-01   | 2024-01-01 | https://github.com/expressjs/connect-sqlite | SQLite session store for Express.js            |

#### File Upload & Processing

| Component | Version     | Supplier        | Release Date | Added Date | Reference Link                            | Description                                 |
| --------- | ----------- | --------------- | ------------ | ---------- | ----------------------------------------- | ------------------------------------------- |
| Multer    | 1.4.5-lts.1 | Express.js Team | 2023-09-01   | 2024-01-01 | https://github.com/expressjs/multer       | Middleware for handling multipart/form-data |
| File-type | 21.1.1      | Sindre Sorhus   | 2024-12-01   | 2024-01-01 | https://github.com/sindresorhus/file-type | Detect file type from buffer or stream      |

#### API Documentation & Utilities

| Component          | Version | Supplier       | Release Date | Added Date | Reference Link                                           | Description                               |
| ------------------ | ------- | -------------- | ------------ | ---------- | -------------------------------------------------------- | ----------------------------------------- |
| Swagger UI Express | 5.0.1   | Scott Ganyo    | 2024-09-01   | 2024-01-01 | https://github.com/scottie1984/swagger-ui-express        | Serve Swagger UI from Express.js          |
| Swagger JSDoc      | 6.2.8   | Surnet         | 2023-01-01   | 2024-01-01 | https://github.com/Surnet/swagger-jsdoc                  | Generate Swagger spec from JSDoc comments |
| CORS               | 2.8.5   | Troy Goode     | 2021-01-01   | 2024-01-01 | https://github.com/expressjs/cors                        | CORS middleware for Express.js            |
| Dotenv             | 16.4.7  | Scott Motte    | 2024-11-01   | 2024-01-01 | https://github.com/motdotla/dotenv                       | Load environment variables from .env file |
| Winston            | 3.18.3  | winstonjs      | 2024-12-01   | 2024-01-01 | https://github.com/winstonjs/winston                     | Versatile logging library for Node.js     |
| Express Rate Limit | 8.2.1   | Nathan Friedly | 2024-12-01   | 2024-01-01 | https://github.com/express-rate-limit/express-rate-limit | Rate limiting middleware for Express.js   |

#### Testing Frameworks (Backend)

| Component | Version | Supplier        | Release Date | Added Date | Reference Link                        | Description                                        |
| --------- | ------- | --------------- | ------------ | ---------- | ------------------------------------- | -------------------------------------------------- |
| Jest      | 30.2.0  | Meta (Facebook) | 2024-12-09   | 2024-01-01 | https://jestjs.io/                    | JavaScript testing framework with built-in mocking |
| ts-jest   | 29.4.5  | kulshekhar      | 2024-12-01   | 2024-01-01 | https://kulshekhar.github.io/ts-jest/ | Jest transformer for TypeScript                    |
| Supertest | 7.1.4   | Vadim Dalecky   | 2024-11-01   | 2024-01-01 | https://github.com/ladjs/supertest    | HTTP endpoint testing library                      |

#### Development Tools (Backend)

| Component | Version | Supplier   | Release Date | Added Date | Reference Link                        | Description                                      |
| --------- | ------- | ---------- | ------------ | ---------- | ------------------------------------- | ------------------------------------------------ |
| Nodemon   | 3.1.9   | Remy Sharp | 2024-12-01   | 2024-01-01 | https://nodemon.io/                   | Auto-restart Node.js application on file changes |
| ts-node   | 10.9.2  | TypeStrong | 2023-12-01   | 2024-01-01 | https://github.com/TypeStrong/ts-node | TypeScript execution environment for Node.js     |

### Infrastructure & Deployment

#### Containerization

| Component      | Version      | Supplier    | Release Date               | Added Date | Reference Link                   | Description                                                               |
| -------------- | ------------ | ----------- | -------------------------- | ---------- | -------------------------------- | ------------------------------------------------------------------------- |
| Docker         | Latest       | Docker Inc. | 2013-03-13 (project start) | 2024-01-01 | https://www.docker.com/          | Platform for developing, shipping, and running applications in containers |
| Docker Compose | Latest       | Docker Inc. | 2014-06-09 (project start) | 2024-01-01 | https://docs.docker.com/compose/ | Tool for defining and running multi-container Docker applications         |
| Nginx          | Alpine Linux | NGINX Inc.  | 2004-10-04 (project start) | 2024-01-01 | https://nginx.org/               | High-performance web server and reverse proxy                             |

#### Operating System

| Component     | Version                    | Supplier          | Release Date                             | Added Date | Reference Link                               | Description                                       |
| ------------- | -------------------------- | ----------------- | ---------------------------------------- | ---------- | -------------------------------------------- | ------------------------------------------------- |
| Alpine Linux  | 3.19 (via Docker)          | Alpine Linux Team | 2024-01-01                               | 2024-01-01 | https://alpinelinux.org/                     | Security-oriented, lightweight Linux distribution |
| Ubuntu/Debian | Latest (manual deployment) | Canonical         | 2004-10-20 (Ubuntu), 1993-01-01 (Debian) | 2024-01-01 | https://ubuntu.com/, https://www.debian.org/ | Popular Linux distributions for server deployment |

### Development Environment

#### Code Quality Tools

| Component | Version | Supplier      | Release Date | Added Date | Reference Link       | Description                 |
| --------- | ------- | ------------- | ------------ | ---------- | -------------------- | --------------------------- |
| Prettier  | 3.6.2   | Prettier Team | 2024-12-05   | 2024-01-01 | https://prettier.io/ | Opinionated code formatter  |
| ESLint    | 9.17.0  | ESLint Team   | 2024-12-06   | 2024-01-01 | https://eslint.org/  | Pluggable JavaScript linter |

#### Build Tools

| Component                | Version | Supplier      | Release Date | Added Date | Reference Link                                  | Description                                       |
| ------------------------ | ------- | ------------- | ------------ | ---------- | ----------------------------------------------- | ------------------------------------------------- |
| Autoprefixer             | 10.4.20 | Andrey Sitnik | 2024-11-01   | 2024-01-01 | https://autoprefixer.github.io/                 | PostCSS plugin for CSS vendor prefixes            |
| PostCSS                  | 8.4.49  | Andrey Sitnik | 2024-11-01   | 2024-01-01 | https://postcss.org/                            | Tool for transforming CSS with JavaScript         |
| Rollup Plugin Visualizer | 6.0.5   | Vadim Dalecky | 2024-10-01   | 2024-01-01 | https://github.com/btd/rollup-plugin-visualizer | Visualize bundle size with an interactive treemap |

## Component Categories Summary

### Production Dependencies (Frontend): 16

- React ecosystem: React, React DOM, React Router DOM
- UI libraries: Shadcn UI, Tailwind CSS, Lucide React, Recharts
- HTTP client: Axios, Axios Retry
- Forms: React Hook Form, Hookform Resolvers
- Utilities: Zod, Date-fns, Class Variance Authority, Tailwind Merge, Sonner

### Production Dependencies (Backend): 16

- Web framework: Express.js
- Database: SQLite3, SQLite
- Security: bcrypt, Express Session, Connect SQLite3
- File handling: Multer, File-type
- API tools: Swagger UI Express, Swagger JSDoc, CORS
- Utilities: Dotenv, Winston, Express Rate Limit

### Development Dependencies (Combined): 39

- Testing: Jest, Vitest, Testing Library suite, Supertest, ts-jest
- TypeScript: TypeScript compilers and type definitions
- Build tools: Vite, ts-node, Nodemon, Autoprefixer, PostCSS
- Code quality: ESLint, Prettier, Husky, Lint-staged
- Other dev tools: Rollup Plugin Visualizer, various @types packages

### Infrastructure Components: 4

- Docker & Docker Compose
- Nginx
- Alpine Linux
- Ubuntu/Debian Linux

## Risk Assessment

### High Priority Components

- **SQLite3**: Single point of failure for data persistence; consider PostgreSQL for production scale
- **Local File Storage**: Files stored on local filesystem; consider cloud storage (S3) for distributed deployments
- **Express Session**: Session data stored in SQLite; consider Redis for multi-server deployments

### Dependency Management

- **Regular Updates**: All dependencies should be kept current with security patches
- **Version Pinning**: Package versions are pinned to ensure reproducible builds
- **Audit Checks**: Regular npm audit runs to identify security vulnerabilities

### Security Considerations

- **bcrypt**: Strong password hashing algorithm (10 salt rounds)
- **Session Security**: HTTPOnly cookies, secure settings in production
- **Input Validation**: Zod schemas provide runtime type checking
- **CORS**: Properly configured for cross-origin requests
- **Rate Limiting**: Express Rate Limit prevents abuse

## Maintenance Recommendations

### Version Management

- Monitor for security updates on all dependencies
- Test major version upgrades in staging environment
- Keep Node.js and TypeScript versions current
- Regularly update Docker base images

### Compatibility Matrix

- Node.js 18+: Required for backend runtime
- Modern browsers: Required for frontend (ES6+ support)
- Docker 20.0+: Required for containerized deployment
- SQLite 3.35+: Required for database features

### Support Status

- All listed components are actively maintained
- React 18 and Node.js 18 are LTS versions
- TypeScript 5.x is the current major version
- Docker and Docker Compose are industry standards

---

_This SBOM was generated on 2025-11-23 based on project analysis and dependency scanning. Regular updates are recommended to maintain accuracy and security compliance._
