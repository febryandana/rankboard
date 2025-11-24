import { useState, useEffect, useMemo } from 'react';
import { User, CreateUserData, UpdateUserData } from '../../types';
import { users as usersApi } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../lib/utils';
import AccountForm from './AccountForm';
import { TableSkeleton } from '../ui/LoadingSkeleton';
import EmptyState from '../ui/EmptyState';
import ConfirmDialog from '../ui/ConfirmDialog';
import { Plus, Search, Edit, Trash2, User as UserIcon, Users } from 'lucide-react';

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | undefined>(undefined);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await usersApi.getAll();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let filtered = users;

    if (roleFilter !== 'all') {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (u) => u.username.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    }

    // Sort by username (ascending)
    return filtered.sort((a, b) => a.username.localeCompare(b.username));
  }, [users, searchQuery, roleFilter]);

  const handleCreate = async (data: CreateUserData) => {
    try {
      const response = await usersApi.create(data);
      if (response.success) {
        await loadUsers();
        setShowForm(false);
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      throw new Error(error.response?.data?.error || error.message || 'Failed to create user');
    }
  };

  const handleUpdate = async (data: UpdateUserData) => {
    if (!editingUser) return;

    try {
      const response = await usersApi.update(editingUser.id, data);
      if (response.success) {
        await loadUsers();
        setEditingUser(undefined);
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      throw new Error(error.response?.data?.error || error.message || 'Failed to update user');
    }
  };

  const handleDelete = async (userId: number) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account');
      return;
    }

    try {
      await usersApi.delete(userId);
      await loadUsers();
      setDeletingUserId(null);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      alert(error.response?.data?.error || error.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with create button */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">Account Management</h1>
        <button
          onClick={() => {
            setEditingUser(undefined);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Account
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4">
        <div className="flex gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username or email..."
                className="w-full pl-10 pr-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
            className="px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins Only</option>
            <option value="user">Users Only</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={searchQuery || roleFilter !== 'all' ? Search : Users}
          title={searchQuery || roleFilter !== 'all' ? 'No users found' : 'No users yet'}
          description={
            searchQuery || roleFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first user account to get started'
          }
          action={
            !searchQuery && roleFilter === 'all'
              ? {
                  label: 'Create User',
                  onClick: () => setShowForm(true),
                }
              : undefined
          }
        />
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                    Role
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-accent/50">
                    {/* User */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar_filename ? (
                          <img
                            src={getAvatarUrl(user.avatar_filename)}
                            alt={user.username}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-3 text-foreground">{user.email}</td>

                    {/* Role */}
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowForm(true);
                          }}
                          className="p-2 hover:bg-accent rounded-md transition-colors"
                          aria-label="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeletingUserId(user.id)}
                          disabled={user.id === currentUser?.id}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit form modal */}
      {showForm && (
        <AccountForm
          user={editingUser}
          onSave={(data) =>
            editingUser
              ? handleUpdate(data as UpdateUserData)
              : handleCreate(data as CreateUserData)
          }
          onCancel={() => {
            setShowForm(false);
            setEditingUser(undefined);
          }}
        />
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={deletingUserId !== null}
        title="Delete User?"
        description="This will permanently delete the user account and all associated data. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={() => deletingUserId && handleDelete(deletingUserId)}
        onCancel={() => setDeletingUserId(null)}
      />
    </div>
  );
}
