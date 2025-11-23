import { memo, useMemo } from 'react';
import { LeaderboardEntry } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';

interface LeaderboardChartProps {
  leaderboard: LeaderboardEntry[];
}

const LeaderboardChart = memo(function LeaderboardChart({ leaderboard }: LeaderboardChartProps) {
  const { resolvedTheme } = useTheme();

  // Memoize filtered data
  const dataWithSubmissions = useMemo(
    () => leaderboard.filter((entry) => entry.submission_id !== null),
    [leaderboard]
  );

  // Memoize chart data transformation
  const chartData = useMemo(() => {
    return dataWithSubmissions.map((entry) => {
      const dataPoint: any = {
        name: entry.username,
        total: entry.total_score,
      };

      entry.scores.forEach((score) => {
        dataPoint[score.admin_username] = score.score;
      });

      return dataPoint;
    });
  }, [dataWithSubmissions]);

  // Memoize admin names extraction
  const adminNames = useMemo(() => {
    return Array.from(
      new Set(
        dataWithSubmissions.flatMap((entry) => entry.scores.map((score) => score.admin_username))
      )
    );
  }, [dataWithSubmissions]);

  if (dataWithSubmissions.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-8 text-center text-muted-foreground">
        No submissions to display
      </div>
    );
  }

  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Score Visualization</h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? 'hsl(var(--border))' : 'hsl(var(--border))'}
          />
          <XAxis
            dataKey="name"
            stroke={isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))'}
            tick={{ fill: isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))' }}
          />
          <YAxis
            stroke={isDark ? 'hsl(var(--muted-foreground))' : 'hsl(var(--muted-foreground))'}
            tick={{ fill: isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? 'hsl(var(--popover))' : 'hsl(var(--popover))',
              border: `1px solid ${isDark ? 'hsl(var(--border))' : 'hsl(var(--border))'}`,
              borderRadius: '0.5rem',
              color: isDark ? 'hsl(var(--popover-foreground))' : 'hsl(var(--popover-foreground))',
            }}
          />
          <Legend
            wrapperStyle={{
              color: isDark ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))',
            }}
          />

          {/* Bar for each admin */}
          {adminNames.map((adminName, index) => (
            <Bar
              key={adminName}
              dataKey={adminName}
              fill={colors[index % colors.length]}
              name={adminName}
            />
          ))}

          {/* Total bar */}
          <Bar dataKey="total" fill="hsl(var(--primary))" name="Total Score" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default LeaderboardChart;
