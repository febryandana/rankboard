import { useAuth } from '../../hooks/useAuth';
import { useChallenges } from '../../hooks/useChallenges';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, X, UserCog, Users } from 'lucide-react';
import { cn, formatTimeRemaining } from '../../lib/utils';
import { useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const { challenges } = useChallenges();
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'admin' | 'user'>('admin');

  const isAdmin = user?.role === 'admin';

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'admin' ? 'user' : 'admin'));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r transition-transform duration-300 z-40',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Close button (mobile only) */}
          <div className="flex justify-end p-2 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {/* Home button */}
            <button
              onClick={() => handleNavigate('/')}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors',
                location.pathname === '/' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              )}
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </button>

            {/* Create Challenge button (admin only) */}
            {isAdmin && viewMode === 'admin' && (
              <button
                onClick={() => handleNavigate('/admin/challenges/new')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
                <span>New Challenge</span>
              </button>
            )}

            {/* Account Management (admin only) */}
            {isAdmin && viewMode === 'admin' && (
              <button
                onClick={() => handleNavigate('/admin/accounts')}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors',
                  location.pathname === '/admin/accounts'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent'
                )}
              >
                <Users className="h-5 w-5" />
                <span>Accounts</span>
              </button>
            )}

            {/* Divider */}
            <div className="border-t my-4" />

            {/* Challenges list */}
            <div className="space-y-1">
              <h3 className="px-4 py-2 text-sm font-semibold text-muted-foreground">Challenges</h3>
              {challenges.map((challenge) => {
                const challengePath =
                  isAdmin && viewMode === 'admin'
                    ? `/admin/challenges/${challenge.id}`
                    : `/challenges/${challenge.id}`;

                return (
                  <button
                    key={challenge.id}
                    onClick={() => handleNavigate(challengePath)}
                    className={cn(
                      'w-full text-left px-4 py-2 rounded-md transition-colors',
                      location.pathname === challengePath ? 'bg-accent' : 'hover:bg-accent/50'
                    )}
                  >
                    <div className="font-medium text-sm truncate">{challenge.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimeRemaining(challenge.deadline)}
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Bottom section: View mode switcher (admin only) */}
          {isAdmin && (
            <div className="border-t p-4">
              <button
                onClick={toggleViewMode}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-md border hover:bg-accent transition-colors"
              >
                <UserCog className="h-5 w-5" />
                <span>{viewMode === 'admin' ? 'Switch to User View' : 'Switch to Admin View'}</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
