import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import { Menu, Sun, Moon, Laptop, User, LogOut, Settings } from 'lucide-react';
import { getAvatarUrl } from '../../lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Menu button for mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-accent rounded-md"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* App title */}
        <div className="flex-1 flex items-center justify-center lg:justify-start">
          <h1 className="text-xl font-bold text-foreground">RankBoard</h1>
        </div>

        {/* User menu */}
        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <button
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded ${theme === 'light' ? 'bg-accent' : 'hover:bg-accent/50'}`}
              aria-label="Light theme"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded ${theme === 'dark' ? 'bg-accent' : 'hover:bg-accent/50'}`}
              aria-label="Dark theme"
            >
              <Moon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme('auto')}
              className={`p-1.5 rounded ${theme === 'auto' ? 'bg-accent' : 'hover:bg-accent/50'}`}
              aria-label="Auto theme"
            >
              <Laptop className="h-4 w-4" />
            </button>
          </div>

          {/* User dropdown */}
          <div className="flex items-center gap-2 border rounded-md p-2">
            {user?.avatar_filename ? (
              <img
                src={getAvatarUrl(user.avatar_filename)}
                alt={user.username}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
          </div>

          {/* Profile button */}
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-accent rounded-md"
            aria-label="Profile"
          >
            <Settings className="h-5 w-5" />
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-md"
            aria-label="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
