import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import LoginForm from '../components/auth/LoginForm';
import { Sun, Moon, Laptop } from 'lucide-react';

export default function Landing() {
  const { isAuthenticated, loading } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      {/* Theme switcher - top right */}
      <div className="absolute top-4 right-4 flex items-center gap-1 border rounded-md p-1 bg-card">
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded ${theme === 'light' ? 'bg-accent' : 'hover:bg-accent/50'}`}
          aria-label="Light theme"
          title="Light"
        >
          <Sun className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded ${theme === 'dark' ? 'bg-accent' : 'hover:bg-accent/50'}`}
          aria-label="Dark theme"
          title="Dark"
        >
          <Moon className="h-4 w-4" />
        </button>
        <button
          onClick={() => setTheme('auto')}
          className={`p-2 rounded ${theme === 'auto' ? 'bg-accent' : 'hover:bg-accent/50'}`}
          aria-label="Auto theme"
          title="Auto"
        >
          <Laptop className="h-4 w-4" />
        </button>
      </div>

      {/* Login form - centered */}
      <LoginForm />
    </div>
  );
}
