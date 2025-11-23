import { memo, useMemo } from 'react';
import { LeaderboardEntry } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl, cn } from '../../lib/utils';
import { User, Trophy } from 'lucide-react';

interface LeaderboardTableProps {
  leaderboard: LeaderboardEntry[];
}

const getMedalIcon = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return null;
};

const LeaderboardTable = memo(function LeaderboardTable({ leaderboard }: LeaderboardTableProps) {
  const { user } = useAuth();

  // Memoize expensive admin list calculation
  const admins = useMemo(() => {
    return Array.from(
      new Set(
        leaderboard.flatMap((entry) =>
          entry.scores.map((score) => ({
            id: score.admin_id,
            username: score.admin_username,
          }))
        )
      )
    ).reduce(
      (acc, admin) => {
        if (!acc.find((a) => a.id === admin.id)) {
          acc.push(admin);
        }
        return acc;
      },
      [] as Array<{ id: number; username: string }>
    );
  }, [leaderboard]);

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground sticky left-0 bg-muted/50">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Rank
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">User</th>
              {admins.map((admin) => (
                <th
                  key={admin.id}
                  className="px-4 py-3 text-center text-sm font-semibold text-foreground"
                >
                  {admin.username}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-sm font-semibold text-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry) => {
              const isCurrentUser = user?.id === entry.user_id;
              const hasSubmission = entry.submission_id !== null;

              return (
                <tr
                  key={entry.user_id}
                  className={cn(
                    'border-b last:border-0 transition-colors',
                    isCurrentUser && 'bg-primary/5',
                    !hasSubmission && 'opacity-60'
                  )}
                >
                  {/* Rank */}
                  <td className="px-4 py-3 sticky left-0 bg-card">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMedalIcon(entry.rank)}</span>
                      <span className="font-semibold">{entry.rank}</span>
                    </div>
                  </td>

                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {entry.avatar_filename ? (
                        <img
                          src={getAvatarUrl(entry.avatar_filename)}
                          alt={entry.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <span
                        className={cn('font-medium', isCurrentUser && 'text-primary font-bold')}
                      >
                        {entry.username}
                        {isCurrentUser && ' (You)'}
                      </span>
                    </div>
                  </td>

                  {/* Admin scores */}
                  {admins.map((admin) => {
                    const score = entry.scores.find((s) => s.admin_id === admin.id);
                    return (
                      <td key={admin.id} className="px-4 py-3 text-center">
                        {score ? (
                          <span className="font-semibold">{score.score}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Total score */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        'font-bold text-lg',
                        entry.total_score > 0 ? 'text-primary' : 'text-muted-foreground'
                      )}
                    >
                      {entry.total_score || '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No submissions yet</div>
      )}
    </div>
  );
});

export default LeaderboardTable;
