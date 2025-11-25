import { useState } from 'react';
import { type Challenge, type CreateChallengeData, type UpdateChallengeData } from '../../types';
import DateTimeInput from '../ui/DateTimeInput';
import { Save, X } from 'lucide-react';

interface ChallengeFormProps {
  challenge?: Challenge;
  onSave: (data: CreateChallengeData | UpdateChallengeData) => Promise<void>;
  onCancel: () => void;
}

export default function ChallengeForm({ challenge, onSave, onCancel }: ChallengeFormProps) {
  const [title, setTitle] = useState(challenge?.title || '');
  const [description, setDescription] = useState(challenge?.description || '');
  const [createdAt, setCreatedAt] = useState(challenge?.created_at || new Date().toISOString());
  const [deadline, setDeadline] = useState(challenge?.deadline || new Date().toISOString());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const data: CreateChallengeData | UpdateChallengeData = {
        title,
        description,
        created_at: createdAt,
        deadline: deadline,
      };

      await onSave(data);
    } catch (err) {
      const error = err as { message?: string };
      setError(error.message || 'Failed to save challenge');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Title <span className="text-destructive">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Enter challenge title"
        />
      </div>

      {/* Created date */}
      <DateTimeInput label="Created Date" value={createdAt} onChange={setCreatedAt} required />

      {/* Deadline */}
      <DateTimeInput label="Deadline" value={deadline} onChange={setDeadline} required />

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={8}
          className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          placeholder="Enter challenge description (Markdown supported)"
        />
        <p className="text-xs text-muted-foreground">Markdown formatting is supported</p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
        >
          <X className="h-4 w-4" />
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
              <span>Save Challenge</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
