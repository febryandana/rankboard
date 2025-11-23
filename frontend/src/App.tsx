import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { WifiOff } from 'lucide-react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChallengeProvider } from './contexts/ChallengeContext';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/ErrorBoundary';

const Landing = lazy(() => import('./pages/Landing'));
const Home = lazy(() => import('./pages/Home'));
const UserChallenge = lazy(() => import('./pages/UserChallenge'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NewChallenge = lazy(() => import('./pages/NewChallenge'));
const AdminChallenge = lazy(() => import('./pages/AdminChallenge'));
const AccountManagement = lazy(() => import('./pages/AccountManagement'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { resolvedTheme } = useTheme();
  const isOnline = useOnlineStatus();

  return (
    <>
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-destructive text-destructive-foreground py-2 px-4 text-center z-50">
          <WifiOff className="inline-block mr-2 h-4 w-4" />
          You are currently offline. Some features may not work.
        </div>
      )}
      <Toaster theme={resolvedTheme} position="bottom-right" richColors closeButton />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Landing />} />

          {/* Protected routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="challenges/:id" element={<UserChallenge />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Admin-only routes */}
            <Route
              path="admin/challenges/new"
              element={
                <AdminRoute>
                  <NewChallenge />
                </AdminRoute>
              }
            />
            <Route
              path="admin/challenges/:id"
              element={
                <AdminRoute>
                  <AdminChallenge />
                </AdminRoute>
              }
            />
            <Route
              path="admin/accounts"
              element={
                <AdminRoute>
                  <AccountManagement />
                </AdminRoute>
              }
            />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ChallengeProvider>
              <AppContent />
            </ChallengeProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
