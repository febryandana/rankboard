import { useAuth } from '../hooks/useAuth';
import { useChallenges } from '../hooks/useChallenges';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import ChallengeCard from '../components/challenge/ChallengeCard';
import { ChallengeCardSkeleton } from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/ui/EmptyState';
import { FolderOpen } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { challenges, loading } = useChallenges();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Home - RankBoard';
  }, []);

  const handleChallengeClick = (challengeId: number) => {
    if (user?.role === 'admin') {
      navigate(`/admin/challenges/${challengeId}`);
    } else {
      navigate(`/challenges/${challengeId}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome message */}
      <div className="animate-slide-in-up">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.username}!</h1>
        <p className="text-muted-foreground">
          {user?.role === 'admin'
            ? 'Manage challenges and score submissions'
            : 'View challenges and submit your work'}
        </p>
      </div>

      {/* Challenge grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ChallengeCardSkeleton key={i} />
          ))}
        </div>
      ) : challenges.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No challenges available yet"
          description={
            user?.role === 'admin'
              ? 'Create your first challenge to get started'
              : 'Challenges will appear here once they are created by administrators'
          }
          action={
            user?.role === 'admin'
              ? {
                  label: 'Create Challenge',
                  onClick: () => navigate('/admin/challenges/new'),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className="animate-slide-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ChallengeCard
                challenge={challenge}
                onClick={() => handleChallengeClick(challenge.id)}
                isSubmitted={false} // TODO: Check if user has submitted
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
