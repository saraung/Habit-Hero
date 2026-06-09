import { CATEGORY_COLORS } from './constants';

/**
 * Transform category distribution object into Recharts pie data
 * Input:  { "Health": 3, "Work": 2, ... }
 * Output: [{ name: "Health", value: 3, fill: "#..." }, ...]
 */
export const buildCategoryPieData = (distribution = {}) => {
  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value,
    fill: CATEGORY_COLORS[name] || '#94a3b8',
  }));
};

/**
 * Build a simple bar-chart-friendly array from analytics data
 */
export const buildSuccessRateData = (successRate = 0) => {
  const rate = Math.min(Math.max(successRate, 0), 100);
  return [
    { name: 'Completed', value: rate, fill: '#6366f1' },
    { name: 'Missed', value: 100 - rate, fill: '#e2e8f0' },
  ];
};
