import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Challenge, UpdateChallengeData } from '../types';
import { challenges as challengesApi } from '../lib/api';
import { formatDate } from '../lib/utils';
import ChallengeForm from '../components/challenge/ChallengeForm';
import ScoringTable from '../components/admin/ScoringTable';
import { FormSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Edit, Eye, Trash2, X, AlertCircle } from 'lucide-react';

export default function AdminChallenge() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const challengeId = parseInt(id || '0', 10);

  const loadChallenge = async () => {
    if (!challengeId) return;

    setLoading(true);
    setError('');

    try {
      const response = await challengesApi.getById(challengeId);
      if (response.success && response.data) {
        setChallenge(response.data);
      } else {
        setError(response.error || 'Challenge not found');
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || error.message || 'Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = challenge?.title
      ? `Admin: ${challenge.title} - RankBoard`
      : 'Admin Challenge - RankBoard';
  }, [challenge?.title]);

  useEffect(() => {
    loadChallenge();
  }, [challengeId]);

  const handleSave = async (data: UpdateChallengeData) => {
    try {
      const response = await challengesApi.update(challengeId, data);
      if (response.success && response.data) {
        setChallenge(response.data);
        setEditMode(false);
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      throw new Error(error.response?.data?.error || error.message || 'Failed to save challenge');
    }
  };

  const handleDelete = async () => {
    try {
      await challengesApi.delete(challengeId);
      navigate('/');
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || error.message || 'Failed to delete challenge');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <FormSkeleton />
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Challenge not found"
        description={error || 'The challenge you are looking for does not exist'}
        action={{
          label: 'Back to Home',
          onClick: () => navigate('/'),
        }}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Action bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold text-foreground">Admin: Manage Challenge</h1>

        <div className="flex items-center gap-2">
          {editMode ? (
            <button
              onClick={() => setEditMode(false)}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel Edit
            </button>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => navigate(`/challenges/${challengeId}`)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View as User
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Challenge info */}
      {editMode ? (
        <ChallengeForm
          challenge={challenge}
          onSave={handleSave}
          onCancel={() => setEditMode(false)}
        />
      ) : (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">{challenge.title}</h2>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>{' '}
              <span className="font-medium">{formatDate(challenge.created_at)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Deadline:</span>{' '}
              <span className="font-medium">{formatDate(challenge.deadline)}</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Description</h3>
            <p className="text-foreground whitespace-pre-wrap">{challenge.description}</p>
          </div>
        </div>
      )}

      {/* Submissions & Scoring section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Submissions & Scores</h2>
        <ScoringTable challengeId={challengeId} onScoreUpdate={loadChallenge} />
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Challenge?"
        description="This will permanently delete the challenge and all associated submissions and scores. This action cannot be undone."
        confirmLabel="Delete Challenge"
        cancelLabel="Cancel"
        variant="destructive"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
