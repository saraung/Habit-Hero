import { Smile, Meh, Frown, Sparkles } from 'lucide-react';

const moodConfig = {
  positive: {
    icon: Smile,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    label: 'Positive',
    bar: 'bg-green-500',
  },
  neutral: {
    icon: Meh,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'Neutral',
    bar: 'bg-amber-400',
  },
  negative: {
    icon: Frown,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    label: 'Negative',
    bar: 'bg-red-500',
  },
};

/**
 * NoteAnalysisResult
 * Displays the mood, score and recommendation returned by POST /ai/analyze-note
 *
 * Props:
 *   result  — { mood: string, score: number, recommendation: string }
 */
const NoteAnalysisResult = ({ result }) => {
  if (!result) return null;

  const config = moodConfig[result.mood] || moodConfig.neutral;
  const Icon = config.icon;

  // score is -1 to 1 → normalise to 0–100 for progress bar
  const pct = Math.round(((result.score + 1) / 2) * 100);

  return (
    <div
      className={`rounded-lg border p-4 flex flex-col gap-3 ${config.bg} ${config.border}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={14} className={config.color} />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          AI Mood Analysis
        </span>
      </div>

      {/* Mood badge + score */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Icon size={20} className={config.color} />
          <span className={`font-semibold text-sm ${config.color}`}>
            {config.label}
          </span>
        </div>
        <span className="text-xs text-slate-400 tabular-nums">
          score: {result.score.toFixed(2)}
        </span>
      </div>

      {/* Score bar */}
      <div className="w-full h-1.5 bg-white/70 rounded-full overflow-hidden border border-white">
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Recommendation */}
      <p className="text-xs text-slate-600 leading-relaxed">
        💡 {result.recommendation}
      </p>
    </div>
  );
};

export default NoteAnalysisResult;
