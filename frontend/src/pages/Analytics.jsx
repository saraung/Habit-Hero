import {
  Activity,
  CheckSquare,
  Flame,
  CalendarDays,
  AlertCircle,
  RefreshCw,
  Download,
} from 'lucide-react';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
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

  const exportPDF = () => {
    if (!analytics) return;

    try {
      const doc = new jsPDF();

      // Report Header
      doc.setFontSize(20);
      doc.setTextColor(30, 58, 138); // indigo-900
      doc.text('Habit Hero - Progress Report', 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(100, 116, 139); // slate-500
      const dateStr = new Date().toLocaleDateString();
      doc.text(`Generated on: ${dateStr}`, 14, 30);

      // Section: Summary Stats
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('Summary Overview', 14, 45);

      const statsData = [
        ['Total Habits', analytics.total_habits],
        ['Total Check-ins', analytics.total_checkins],
        ['Current Streak', `${analytics.current_streak ?? 0} Days`],
        ['Success Rate', `${Number(analytics.success_rate ?? 0).toFixed(1)}%`],
        ['Best Day', analytics.best_day || 'N/A'],
      ];

      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Value']],
        body: statsData,
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] }, // indigo-600
        styles: { fontSize: 11 },
      });

      // Section: Category Distribution
      const finalY = doc.lastAutoTable.finalY || 50;
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text('Category Distribution', 14, finalY + 15);

      const categoryData = Object.entries(analytics.category_distribution || {}).map(([cat, count]) => [
        cat,
        count,
      ]);

      if (categoryData.length > 0) {
        autoTable(doc, {
          startY: finalY + 20,
          head: [['Category', 'Active Habits']],
          body: categoryData,
          theme: 'grid',
          headStyles: { fillColor: [79, 70, 229] },
          styles: { fontSize: 11 },
        });
      } else {
        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        doc.text('No category data available.', 14, finalY + 22);
      }

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Habit Hero Analytics Report', 14, pageHeight - 10);

      doc.save('habit-hero-report.pdf');
    } catch (err) {
      console.error('Failed to export PDF report', err);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

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
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button variant="primary" size="sm" onClick={exportPDF} disabled={loading || !analytics}>
            <Download size={14} />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
        </div>
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
        <div id="analytics-content" className="flex flex-col gap-6 p-1 bg-gray-50/50 rounded-xl">
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
        </div>
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
