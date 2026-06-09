import {
  Activity,
  CheckSquare,
  Flame,
  CalendarDays,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import useAnalytics from '../hooks/useAnalytics';
import Loader from '../components/common/Loader';
import Card, { CardHeader, CardTitle, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import CategoryChart from '../components/analytics/CategoryChart';
import SuccessRateChart from '../components/analytics/SuccessRateChart';
import StreakCard from '../components/analytics/StreakCard';

const StatCard = ({ icon: Icon, label, value, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green:  'bg-green-50 text-green-600',
    amber:  'bg-amber-50 text-amber-600',
    sky:    'bg-sky-50 text-sky-600',
  };

  return (
    <Card className="flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.indigo}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
      </div>
    </Card>
  );
};

const Analytics = () => {
  const { analytics, loading, error, refresh } = useAnalytics();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Overview of your habit performance
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <Loader message="Loading analytics…" />
      ) : analytics ? (
        <>
          {/* ── Top 4 stat cards ──────────────────────────────────────── */}
          {/* Success Rate removed — shown once only in the gauge below   */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={Activity}
              label="Total Habits"
              value={analytics.total_habits}
              color="indigo"
            />
            <StatCard
              icon={CheckSquare}
              label="Total Check-ins"
              value={analytics.total_checkins}
              color="green"
            />
            <StatCard
              icon={Flame}
              label="Current Streak"
              value={`${analytics.current_streak ?? 0}d`}
              color="amber"
            />
            <StatCard
              icon={CalendarDays}
              label="Best Day"
              value={analytics.best_day ?? '—'}
              color="sky"
            />
          </div>

          {/* ── Charts row ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Success Rate — single source of truth */}
            <Card className="flex flex-col items-center">
              <CardHeader className="w-full">
                <CardTitle>Success Rate</CardTitle>
              </CardHeader>
              <CardBody>
                <SuccessRateChart successRate={analytics.success_rate} />
              </CardBody>
            </Card>

            {/* Streak */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Current Streak</CardTitle>
              </CardHeader>
              <CardBody className="flex items-center justify-center flex-1">
                <StreakCard streak={analytics.current_streak} />
              </CardBody>
            </Card>

            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardBody>
                <CategoryChart
                  distribution={analytics.category_distribution || {}}
                />
              </CardBody>
            </Card>
          </div>
        </>
      ) : (
        !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Activity size={36} className="text-slate-300 mb-3" />
            <p className="text-slate-500">No analytics data available yet.</p>
            <p className="text-sm text-slate-400 mt-1">
              Create habits and add check-ins to see your stats.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default Analytics;
