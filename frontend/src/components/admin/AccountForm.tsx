import { useState } from 'react';
import { type User, type CreateUserData, type UpdateUserData, type UserRole } from '../../types';
import { Save, X } from 'lucide-react';

interface AccountFormProps {
  user?: User;
  onSave: (data: CreateUserData | UpdateUserData) => Promise<void>;
  onCancel: () => void;
}

export default function AccountForm({ user, onSave, onCancel }: AccountFormProps) {
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(user?.role || 'user');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isEdit && !password) {
      setError('Password is required for new accounts');
      return;
    }

    if (password && password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);

    try {
      const data: any = {
        username,
        email,
        role,
      };

      if (password) {
        data.password = password;
      }

      await onSave(data);
    } catch (err: any) {
      setError(err.message || 'Failed to save account');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-lg p-6 max-w-md w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {isEdit ? 'Edit Account' : 'Create Account'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-accent rounded-md transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-foreground">
              Username <span className="text-destructive">*</span>
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={50}
              required
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter username"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter email"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password {!isEdit && <span className="text-destructive">*</span>}
              {isEdit && (
                <span className="text-xs text-muted-foreground ml-2">
                  (leave blank to keep current)
                </span>
              )}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={128}
              required={!isEdit}
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={isEdit ? 'Enter new password (optional)' : 'Enter password'}
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium text-foreground">
              Role <span className="text-destructive">*</span>
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              required
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEdit ? 'Update' : 'Create'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
