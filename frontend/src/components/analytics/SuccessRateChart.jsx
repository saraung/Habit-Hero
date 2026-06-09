import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

/**
 * Consistency label is driven entirely by success_rate %.
 *
 * ≥ 80% → 🎉 Excellent consistency!   (you're rarely missing days)
 * ≥ 60% → 👍 Good consistency!         (occasional skips, still solid)
 * ≥ 40% → 💪 Keep it up!               (skipping more than half — room to grow)
 *  < 40% → 📈 Room to improve          (missing most expected check-ins)
 *
 * Why this works when streak resets:
 *   Skipping one day → streak → 0/1,  but success_rate also drops
 *   (e.g. 3 actual / 5 expected = 60% → label changes to "Good consistency!")
 *   So the label is always honest and consistent with the number shown.
 */

const getConsistencyLabel = (rate) => {
  if (rate >= 80) return '🎉 Excellent consistency!';
  if (rate >= 60) return '👍 Good consistency!';
  if (rate >= 40) return '💪 Keep it up!';
  return '📈 Room to improve';
};

const getColor = (rate) => {
  if (rate >= 80) return '#10b981'; // green
  if (rate >= 60) return '#6366f1'; // indigo
  if (rate >= 40) return '#f59e0b'; // amber
  return '#ef4444';                 // red
};

const SuccessRateChart = ({ successRate = 0 }) => {
  const rate = Math.min(Math.max(Number(successRate) || 0, 0), 100);
  const color = getColor(rate);

  const data = [
    { name: 'Background', value: 100, fill: '#e2e8f0' },
    { name: 'Completed',  value: rate, fill: color },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="100%"
            barSize={14}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar background dataKey="value" />
            <Tooltip contentStyle={{ display: 'none' }} />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold" style={{ color }}>
            {rate.toFixed(0)}%
          </span>
          <span className="text-xs text-slate-400 mt-0.5">success</span>
        </div>
      </div>

      {/* Consistency message — changes automatically when success_rate changes */}
      <p className="mt-3 text-sm text-slate-500 text-center">
        {getConsistencyLabel(rate)}
      </p>
    </div>
  );
};

export default SuccessRateChart;
