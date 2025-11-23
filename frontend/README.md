# RankBoard Frontend

A modern React single-page application for the RankBoard challenges scoring and leaderboard platform, built with TypeScript, Vite, and Shadcn UI.

## Overview

RankBoard Frontend provides a responsive web interface for managing challenges, submissions, and real-time leaderboards. It supports both administrator and user roles with distinct feature sets and views.

## Features

### Core Functionality

- **Authentication**: Secure login with session management
- **Challenge Management**: Browse, create, edit, and manage challenges
- **File Submissions**: PDF upload with validation and replacement
- **Scoring System**: Multi-admin scoring with individual feedback
- **Real-time Leaderboards**: Visual charts and detailed score tables
- **User Management**: Profile editing and avatar uploads (admin user creation)
- **Theme Support**: Light/dark/auto theme switching

### User Experience

- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Theme System**: System preference detection with manual override
- **Offline Detection**: Network status awareness with user notifications
- **Loading States**: Skeleton screens and progress indicators
- **Error Boundaries**: Graceful error handling with fallback UI
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## Architecture

### Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Shadcn UI primitives
│   │   ├── layout/          # Layout components
│   │   ├── auth/            # Authentication forms
│   │   ├── challenge/       # Challenge-related components
│   │   ├── leaderboard/     # Chart and table components
│   │   ├── admin/           # Admin-specific components
│   │   └── profile/         # User profile components
│   ├── pages/               # Page-level components
│   ├── contexts/            # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities and API client
│   ├── types/               # TypeScript definitions
│   ├── test/                # Test utilities and setup
│   └── styles/              # Global styles and animations
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

### Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5 for fast development and optimized builds
- **UI Library**: Shadcn UI (Radix UI primitives) + Tailwind CSS
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context API + custom hooks
- **HTTP Client**: Axios with retry logic and interceptors
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for leaderboard visualizations
- **Icons**: Lucide React icon library
- **Notifications**: Sonner toast notifications
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Backend API server running (see backend README)

### Installation

1. **Clone and navigate**:

   ```bash
   cd rankboard/frontend
   npm install
   ```

2. **Environment setup**:

   ```bash
   cp .env.example .env
   # Configure VITE_API_URL to point to backend
   ```

3. **Development server**:
   ```bash
   npm run dev  # Starts on http://localhost:5173
   ```

### Key Scripts

```bash
npm run dev         # Start development server
npm run build       # Production build
npm run preview     # Preview production build
npm run lint        # Run ESLint
npm run test        # Run test suite
npm run test:ui     # Interactive test runner
npm run test:coverage  # Generate coverage report
```

## Application Structure

### Routing Architecture

```
/login                 # Public login page
/                      # Protected home/dashboard
/challenges/:id        # User challenge view
/profile               # User profile management
/admin/challenges/new  # Admin challenge creation
/admin/challenges/:id  # Admin challenge management
/admin/accounts        # Admin user management
```

### Context Providers

- **ThemeProvider**: Manages light/dark/auto theme state
- **AuthProvider**: Handles authentication state and API calls
- **ChallengeProvider**: Caches challenge list and provides CRUD operations

### Custom Hooks

- **useAuth**: Access authentication state and methods
- **useTheme**: Theme management utilities
- **useChallenges**: Challenge data and operations
- **useOnlineStatus**: Network connectivity detection

## Component Organization

### UI Components (Shadcn)

Primitive components from Shadcn UI:

- Button, Input, Label, Card, Dialog, Table, Form, etc.
- Consistent design system with theme-aware styling
- Accessible by default with proper ARIA attributes

### Layout Components

- **MainLayout**: Responsive sidebar + header layout
- **Header**: App branding, user menu, theme switcher
- **Sidebar**: Navigation menu with challenge list

### Page Components

- **Landing**: Login form with theme switcher
- **Home**: Challenge grid with status indicators
- **UserChallenge**: Challenge details, submission form, leaderboard
- **AdminChallenge**: Challenge editor, scoring table
- **ProfilePage**: User profile editing with avatar upload
- **AccountManagement**: User CRUD interface (admin only)

### Feature Components

- **ChallengeCard**: Challenge preview with deadline countdown
- **SubmissionForm**: PDF upload with validation
- **LeaderboardChart**: Bar chart visualization
- **LeaderboardTable**: Detailed scores with ranking
- **ScoringTable**: Admin score input interface
- **UserManagement**: Admin user table with actions

## API Integration

### API Client (`src/lib/api.ts`)

Centralized HTTP client with:

- Axios instance configured for session cookies
- Automatic retry logic for network failures
- Response interceptors for authentication errors
- Organized by resource type (auth, users, challenges, etc.)

### Request/Response Handling

```typescript
// API client methods
const api = {
  auth: {
    login: (credentials) => post('/auth/login', credentials),
    logout: () => post('/auth/logout'),
    getSession: () => get('/auth/session'),
  },
  challenges: {
    getAll: () => get('/challenges'),
    create: (data) => post('/challenges', data),
    update: (id, data) => put(`/challenges/${id}`, data),
  },
  // ... more methods
};
```

### Error Handling

- **Network Errors**: Retry logic with exponential backoff
- **Authentication Errors**: Automatic redirect to login
- **Validation Errors**: Form-level error display
- **Server Errors**: Toast notifications with user-friendly messages

## State Management

### Context Pattern

```typescript
// AuthContext example
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (username: string, password: string) => {
    const response = await api.auth.login({ username, password });
    setUser(response.data.user);
  };

  // ... more methods

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Custom Hooks

```typescript
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Styling & Theming

### Design System

- **Colors**: CSS custom properties with light/dark variants
- **Typography**: Inter font family with consistent sizing scale
- **Spacing**: Tailwind spacing scale (0.25rem increments)
- **Shadows**: Subtle shadow system for depth
- **Border Radius**: Consistent corner rounding

### Theme Implementation

```css
/* src/index.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  /* ... more variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  /* ... more variables */
}
```

### Utility Classes

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Forms & Validation

### Form Handling

- **Library**: React Hook Form for performant form state
- **Validation**: Zod schemas for type-safe validation
- **Integration**: `@hookform/resolvers/zod` for seamless integration

### Example Form Schema

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;
```

### Form Component

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormData) => {
    // Handle form submission
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* ... more fields */}
      </form>
    </Form>
  );
}
```

## Testing Strategy

### Test Setup

- **Framework**: Vitest with jsdom environment
- **Utilities**: React Testing Library for component testing
- **Matchers**: `@testing-library/jest-dom` for DOM assertions
- **Custom Render**: Wrapper with all context providers

### Test Structure

```typescript
// src/test/test-utils.tsx
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../contexts/ThemeContext';
// ... other providers

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {/* ... other providers */}
          {children}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const customRender = (ui: React.ReactElement, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```

### Component Testing

```typescript
import { render, screen } from '../test/test-utils';

test('LoginForm renders correctly', () => {
  render(<LoginForm />);
  expect(screen.getByLabelText('Username')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
});
```

### API Testing

```typescript
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

test('API client handles login', async () => {
  mockedAxios.post.mockResolvedValue({ data: { user: mockUser } });
  const result = await api.auth.login('user', 'pass');
  expect(result.data.user).toEqual(mockUser);
});
```

## Performance Optimization

### Code Splitting

- **Route-based splitting**: Lazy loading with `React.lazy()`
- **Component splitting**: Large components split by feature
- **Vendor chunks**: Separate third-party libraries

### Build Optimization

- **Vite**: Fast HMR and optimized production builds
- **Tree shaking**: Remove unused code automatically
- **Asset optimization**: Image and font optimization
- **Bundle analysis**: `npm run build:analyze` for insights

### Runtime Performance

- **Memoization**: `React.memo`, `useMemo`, `useCallback`
- **Virtual scrolling**: For large lists (future enhancement)
- **Image optimization**: Lazy loading and proper sizing

## Configuration

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api
```

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

### Tailwind Configuration

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        // ... more theme colors
      },
    },
  },
  plugins: [],
};
```

## Production Deployment

### Build Process

```bash
npm run build    # Creates optimized dist/ directory
npm run preview  # Test production build locally
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] API URL points to production backend
- [ ] Build tested locally
- [ ] Static assets optimized
- [ ] Error boundaries tested
- [ ] HTTPS enabled
- [ ] CDN configured for assets (optional)

## Browser Support

- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers

## Accessibility

### Standards Compliance

- **WCAG 2.1 AA**: Color contrast, keyboard navigation, screen reader support
- **Semantic HTML**: Proper heading hierarchy, landmarks, form labels
- **Focus Management**: Visible focus indicators, logical tab order
- **ARIA Labels**: Screen reader announcements for dynamic content

### Implementation

```typescript
// Accessible form field
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel htmlFor="email">Email Address</FormLabel>
      <FormControl>
        <Input
          id="email"
          type="email"
          aria-describedby="email-error"
          {...field}
        />
      </FormControl>
      <FormMessage id="email-error" />
    </FormItem>
  )}
/>
```

## Troubleshooting

### Common Issues

| Issue                        | Solution                                     |
| ---------------------------- | -------------------------------------------- |
| `API connection failed`      | Check VITE_API_URL and backend server status |
| `Theme not applying`         | Ensure ThemeProvider wraps the app           |
| `Route not found`            | Verify routing configuration and protection  |
| `Form validation errors`     | Check Zod schema and form field names        |
| `Component not re-rendering` | Verify state updates and context usage       |

### Development Tips

- Use React DevTools for component inspection
- Enable "Highlight updates" to identify unnecessary re-renders
- Check browser network tab for API call failures
- Use browser developer tools for responsive testing

## Contributing

### Code Style

- TypeScript with strict mode enabled
- ESLint configuration for code quality
- Prettier for consistent formatting
- Husky pre-commit hooks for quality gates

### Development Workflow

1. **Setup**: Install dependencies and configure environment
2. **Development**: Use `npm run dev` for hot reloading
3. **Testing**: Write tests for new components and features
4. **Building**: Run `npm run build` to verify production build
5. **Code Review**: Ensure tests pass and code follows standards

### Testing Requirements

- New components should have unit tests
- API integration should be tested
- Visual regressions should be minimal
- Accessibility standards must be maintained

## License

MIT License - see LICENSE file for details.
