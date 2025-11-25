import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChallenges } from '../hooks/useChallenges';
import { type CreateChallengeData } from '../types';
import { toast } from 'sonner';
import DateTimeInput from '../components/ui/DateTimeInput';
import { Save, X, FileText } from 'lucide-react';

export default function NewChallenge() {
  const navigate = useNavigate();
  const { createChallenge } = useChallenges();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdAt, setCreatedAt] = useState(new Date().toISOString());
  const [deadline, setDeadline] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // Default: 2 weeks from now
    return date.toISOString();
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data: CreateChallengeData = {
        title,
        description,
        created_at: createdAt,
        deadline: deadline,
      };

      const newChallenge = await createChallenge(data);

      toast.success('Challenge created successfully!');

      navigate(`/admin/challenges/${newChallenge.id}`);
    } catch (err) {
      const error = err as { message?: string };
      toast.error(error.message || 'Failed to create challenge');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Create New Challenge</h1>
        <p className="text-muted-foreground">
          Create a new challenge for users to submit their work
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            Challenge Title <span className="text-destructive">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            required
            placeholder="Enter a clear, descriptive title"
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
          <p className="text-xs text-muted-foreground">Maximum 200 characters</p>
        </div>

        {/* Created Date */}
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
            rows={12}
            placeholder="Describe the challenge requirements, objectives, and any special instructions..."
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>Markdown formatting is supported (bold, italic, lists, code blocks, etc.)</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
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
                <span>Creating...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Create Challenge</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
