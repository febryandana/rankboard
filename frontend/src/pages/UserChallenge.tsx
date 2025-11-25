import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { type Challenge, type Submission, type LeaderboardEntry } from '../types';
import {
  challenges as challengesApi,
  submissions as submissionsApi,
  scores as scoresApi,
} from '../lib/api';
import { formatDate, formatTimeRemaining } from '../lib/utils';
import SubmissionForm from '../components/challenge/SubmissionForm';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import LeaderboardChart from '../components/leaderboard/LeaderboardChart';
import { Calendar, Clock, FileText } from 'lucide-react';

export default function UserChallenge() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [myScores, setMyScores] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const challengeId = parseInt(id || '0', 10);

  const loadData = async () => {
    if (!challengeId) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const challengeRes = await challengesApi.getById(challengeId);
      if (challengeRes.success && challengeRes.data) {
        setChallenge(challengeRes.data);
      }

      const submissionsRes = await submissionsApi.getByChallengeId(challengeId);
      if (submissionsRes.success && submissionsRes.data) {
        const userSubmission = submissionsRes.data.find((s: any) => s.user_id === user?.id);
        setSubmission(userSubmission || null);

        if (userSubmission) {
          try {
            const scoresRes = await scoresApi.getMyScores(userSubmission.id);
            if (scoresRes.success && scoresRes.data) {
              setMyScores(scoresRes.data);
            }
          } catch (err) {
            setMyScores(null);
          }
        }
      }

      const leaderboardRes = await scoresApi.getByChallengeId(challengeId);
      if (leaderboardRes.success && leaderboardRes.data) {
        setLeaderboard(leaderboardRes.data.leaderboard);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load challenge');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [challengeId, user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error || 'Challenge not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Challenge header */}
      <div className="bg-card border rounded-lg p-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">{challenge.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created: {formatDate(challenge.created_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              Deadline: {formatDate(challenge.deadline)} ({formatTimeRemaining(challenge.deadline)})
            </span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h3 className="text-xl font-semibold text-foreground mb-2">Description</h3>
          <p className="text-foreground whitespace-pre-wrap">{challenge.description}</p>
        </div>
      </div>

      {/* Submission section */}
      <SubmissionForm
        challengeId={challengeId}
        currentSubmission={submission}
        onSubmissionComplete={loadData}
      />

      {/* Feedback section (if user has submitted and been scored) */}
      {myScores && myScores.scores.length > 0 && (
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Feedback & Scores</h3>

          <div className="space-y-4">
            {myScores.scores.map((score: any) => (
              <div key={score.admin_id} className="bg-muted/50 border rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{score.admin_username}</span>
                  <span className="text-2xl font-bold text-primary">{score.score}</span>
                </div>
                {score.feedback && (
                  <div className="text-sm text-muted-foreground mt-2">
                    <FileText className="h-4 w-4 inline mr-2" />
                    {score.feedback}
                  </div>
                )}
              </div>
            ))}

            <div className="bg-primary/10 border border-primary/20 rounded-md p-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Total Score</span>
                <span className="text-3xl font-bold text-primary">{myScores.total_score}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>

        {/* Chart */}
        <LeaderboardChart leaderboard={leaderboard} />

        {/* Table */}
        <LeaderboardTable leaderboard={leaderboard} />
      </div>
    </div>
  );
}
