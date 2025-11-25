import { useState } from 'react';
import { type User, type UpdateUserData } from '../../types';
import { users as usersApi } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import AvatarUpload from './AvatarUpload';
import { Save, Check } from 'lucide-react';

interface ProfileFormProps {
  user: User;
  onUpdate?: () => void;
}

export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const { updateUser } = useAuth();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAvatarUpload = async (file: File) => {
    try {
      const response = await usersApi.uploadAvatar(user.id, file);
      if (response.success && response.data) {
        updateUser({ avatar_filename: response.data.avatar_filename });
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Upload failed');
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await usersApi.deleteAvatar(user.id);
      updateUser({ avatar_filename: null });
      if (onUpdate) {
        onUpdate();
      }
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.message || 'Remove failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (newPassword.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
    }

    setSaving(true);

    try {
      const updateData: UpdateUserData = {};

      if (username !== user.username) {
        updateData.username = username;
      }

      if (email !== user.email) {
        updateData.email = email;
      }

      if (newPassword) {
        updateData.password = newPassword;
      }

      if (Object.keys(updateData).length === 0) {
        setError('No changes to save');
        setSaving(false);
        return;
      }

      const response = await usersApi.update(user.id, updateData);

      if (response.success && response.data) {
        updateUser(response.data);
        setSuccess('Profile updated successfully!');
        setNewPassword('');
        setConfirmPassword('');

        if (onUpdate) {
          onUpdate();
        }
      } else {
        setError(response.error || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-card border rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Edit Profile</h2>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm p-3 rounded-md border border-green-200 dark:border-green-800 flex items-center gap-2">
          <Check className="h-4 w-4" />
          {success}
        </div>
      )}

      {/* Avatar section */}
      <div className="py-4 border-b">
        <AvatarUpload
          currentAvatar={user.avatar_filename}
          onUpload={handleAvatarUpload}
          onRemove={handleAvatarRemove}
        />
      </div>

      {/* Profile form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-foreground">
            Username
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
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* New password */}
        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-sm font-medium text-foreground">
            New Password (optional)
          </label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            maxLength={128}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Leave blank to keep current password"
          />
        </div>

        {/* Confirm password */}
        {newPassword && (
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              maxLength={128}
              required
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Re-enter new password"
            />
          </div>
        )}

        {/* Submit button */}
        <div className="flex gap-3 justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
