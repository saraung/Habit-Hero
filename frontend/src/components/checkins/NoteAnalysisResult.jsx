import { useEffect, useRef } from 'react';
import { Smile, Meh, Frown, Sparkles, TrendingUp } from 'lucide-react';

const moodConfig = {
  positive: {
    icon: Smile,
    emoji: '😊',
    color: 'text-emerald-600',
    bg: 'from-emerald-50 to-green-50',
    border: 'border-emerald-300',
    glow: 'shadow-emerald-100',
    label: 'Feeling Positive!',
    tagBg: 'bg-emerald-100 text-emerald-700',
    bar: 'bg-gradient-to-r from-emerald-400 to-green-500',
    barBg: 'bg-emerald-100',
    accent: 'text-emerald-500',
  },
  neutral: {
    icon: Meh,
    emoji: '😐',
    color: 'text-amber-600',
    bg: 'from-amber-50 to-yellow-50',
    border: 'border-amber-300',
    glow: 'shadow-amber-100',
    label: 'Feeling Neutral',
    tagBg: 'bg-amber-100 text-amber-700',
    bar: 'bg-gradient-to-r from-amber-400 to-yellow-400',
    barBg: 'bg-amber-100',
    accent: 'text-amber-500',
  },
  negative: {
    icon: Frown,
    emoji: '😔',
    color: 'text-rose-600',
    bg: 'from-rose-50 to-red-50',
    border: 'border-rose-300',
    glow: 'shadow-rose-100',
    label: 'Feeling Low',
    tagBg: 'bg-rose-100 text-rose-700',
    bar: 'bg-gradient-to-r from-rose-400 to-red-400',
    barBg: 'bg-rose-100',
    accent: 'text-rose-500',
  },
};

/**
 * NoteAnalysisResult — Animated mood analysis card
 * Props: result { mood, score, recommendation }
 */
const NoteAnalysisResult = ({ result }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (panelRef.current) {
      // Trigger slide-in animation
      panelRef.current.style.opacity = '0';
      panelRef.current.style.transform = 'translateY(12px)';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (panelRef.current) {
            panelRef.current.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            panelRef.current.style.opacity = '1';
            panelRef.current.style.transform = 'translateY(0)';
          }
        });
      });
    }
  }, [result]);

  if (!result) return null;

  const config = moodConfig[result.mood] || moodConfig.neutral;
  const Icon = config.icon;

  // score is -1 to 1 → normalise to 0–100
  const pct = Math.round(((result.score + 1) / 2) * 100);
  const scoreLabel = pct >= 70 ? 'High' : pct >= 40 ? 'Medium' : 'Low';

  return (
    <div
      ref={panelRef}
      className={`rounded-xl border-2 ${config.border} bg-gradient-to-br ${config.bg}
        shadow-lg ${config.glow} overflow-hidden`}
      style={{ willChange: 'opacity, transform' }}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${config.bar}`} />

      <div className="p-4 flex flex-col gap-3">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center
                ${config.tagBg} border ${config.border}`}
            >
              <Sparkles size={13} className={config.accent} />
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              AI Mood Analysis
            </span>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${config.tagBg}`}
          >
            {config.label}
          </span>
        </div>

        {/* Big emoji + mood label */}
        <div className="flex items-center gap-3">
          <span
            className="text-4xl leading-none select-none"
            role="img"
            aria-label={config.label}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
          >
            {config.emoji}
          </span>
          <div className="flex-1">
            <p className={`text-lg font-bold ${config.color}`}>{config.label}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TrendingUp size={12} className={config.accent} />
              <span className="text-xs text-slate-500">
                Sentiment score: <strong>{pct}%</strong> ({scoreLabel})
              </span>
            </div>
          </div>
        </div>

        {/* Animated score bar */}
        <div>
          <div className={`w-full h-2.5 rounded-full ${config.barBg} overflow-hidden`}>
            <div
              className={`h-full rounded-full ${config.bar}`}
              style={{
                width: `${pct}%`,
                transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-slate-400">Low</span>
            <span className="text-[10px] text-slate-400">High</span>
          </div>
        </div>

        {/* Recommendation */}
        <div
          className="rounded-lg bg-white/70 border border-white/80 px-3 py-2.5 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">
            💡 Recommendation
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {result.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteAnalysisResult;
