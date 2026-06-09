import { Flame } from 'lucide-react';

const StreakCard = ({ streak = 0 }) => {
  const level =
    streak >= 30
      ? { label: 'Legendary', color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' }
      : streak >= 14
      ? { label: 'On Fire', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' }
      : streak >= 7
      ? { label: 'Great', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' }
      : { label: 'Building', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };

  return (
    <div className={`flex flex-col items-center gap-2 p-5 rounded-xl border ${level.bg} ${level.border}`}>
      <Flame size={32} className={level.color} />
      <div className="text-4xl font-bold text-slate-800">{streak}</div>
      <div className="text-sm text-slate-500">
        day{streak !== 1 ? 's' : ''} streak
      </div>
      <span
        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${level.bg} ${level.color} border ${level.border}`}
      >
        {level.label}
      </span>
    </div>
  );
};

export default StreakCard;
