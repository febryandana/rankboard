import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  users as usersApi,
  scores as scoresApi,
  submissions as submissionsApi,
} from '../../lib/api';
import { getAvatarUrl } from '../../lib/utils';
import { User, Download, Save } from 'lucide-react';

interface ScoringTableProps {
  challengeId: number;
  onScoreUpdate?: () => void;
}

export default function ScoringTable({ challengeId, onScoreUpdate }: ScoringTableProps) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [scores, setScores] = useState<{ [key: string]: { score: number; feedback: string } }>({});
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [challengeId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const usersRes = await usersApi.getAll('user');
      if (usersRes.success && usersRes.data) {
        setUsers(usersRes.data);
      }

      const submissionsRes = await submissionsApi.getByChallengeId(challengeId);
      if (submissionsRes.success && submissionsRes.data) {
        setSubmissions(submissionsRes.data);
      }

      const leaderboardRes = await scoresApi.getByChallengeId(challengeId);
      if (leaderboardRes.success && leaderboardRes.data) {
        const scoresData: any = {};
        leaderboardRes.data.leaderboard.forEach((entry: any) => {
          entry.scores.forEach((score: any) => {
            if (currentUser && score.admin_id === currentUser.id) {
              const key = `${entry.submission_id}_${currentUser.id}`;
              scoresData[key] = {
                score: score.score,
                feedback: score.feedback || '',
              };
            }
          });
        });
        setScores(scoresData);
      }
    } catch (error) {
      console.error('Failed to load scoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreChange = (submissionId: number, value: string) => {
    const key = `${submissionId}_${currentUser?.id}`;
    const numValue = value === '' ? 0 : parseInt(value, 10);
    setScores((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        score: isNaN(numValue) ? 0 : numValue,
      },
    }));
  };

  const handleFeedbackChange = (submissionId: number, value: string) => {
    const key = `${submissionId}_${currentUser?.id}`;
    setScores((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        feedback: value,
      },
    }));
  };

  const handleSave = async (submissionId: number) => {
    const key = `${submissionId}_${currentUser?.id}`;
    const scoreData = scores[key] || { score: 0, feedback: '' };

    setSaving((prev) => ({ ...prev, [key]: true }));

    try {
      await scoresApi.createOrUpdate(submissionId, scoreData);
      if (onScoreUpdate) {
        onScoreUpdate();
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleDownload = async (submissionId: number, filename: string) => {
    try {
      const blob = await submissionsApi.download(submissionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download submission:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">User</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                Submission
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                Your Score
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                Your Feedback
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((userRow) => {
              const submission = submissions.find((s) => s.user_id === userRow.id);
              const key = submission ? `${submission.id}_${currentUser?.id}` : '';
              const scoreData = scores[key] || { score: 0, feedback: '' };
              const isSaving = saving[key] || false;

              return (
                <tr key={userRow.id} className="border-b last:border-0">
                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {userRow.avatar_filename ? (
                        <img
                          src={getAvatarUrl(userRow.avatar_filename)}
                          alt={userRow.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <span className="font-medium">{userRow.username}</span>
                    </div>
                  </td>

                  {/* Submission */}
                  <td className="px-4 py-3 text-center">
                    {submission ? (
                      <button
                        onClick={() => handleDownload(submission.id, submission.filename)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-md hover:bg-primary/20 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    ) : (
                      <span className="text-muted-foreground text-sm">No submission</span>
                    )}
                  </td>

                  {/* Score input */}
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      value={scoreData.score}
                      onChange={(e) =>
                        submission && handleScoreChange(submission.id, e.target.value)
                      }
                      disabled={!submission}
                      className="w-24 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-center disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </td>

                  {/* Feedback textarea */}
                  <td className="px-4 py-3">
                    <textarea
                      value={scoreData.feedback}
                      onChange={(e) =>
                        submission && handleFeedbackChange(submission.id, e.target.value)
                      }
                      disabled={!submission}
                      rows={2}
                      placeholder="Enter feedback..."
                      className="w-full min-w-[200px] px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-y disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </td>

                  {/* Save button */}
                  <td className="px-4 py-3 text-center">
                    {submission && (
                      <button
                        onClick={() => handleSave(submission.id)}
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No users available</div>
      )}
    </div>
  );
}
