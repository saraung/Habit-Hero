import { CheckCircle2, MessageSquare } from 'lucide-react';
import { formatDate, timeAgo, sortByDateDesc } from '../../utils/dateUtils';

const CheckinHistory = ({ checkins = [] }) => {
  if (checkins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle2 size={36} className="text-slate-300 mb-3" />
        <p className="text-sm text-slate-400">No check-ins yet. Start tracking!</p>
      </div>
    );
  }

  const sorted = sortByDateDesc(checkins, 'checkin_date');

  return (
    <ul className="flex flex-col gap-3">
      {sorted.map((checkin) => (
        <li
          key={checkin.id}
          className="flex gap-3 items-start p-3 rounded-lg bg-slate-50 border border-slate-100
            hover:border-slate-200 hover:bg-white transition-colors duration-150"
        >
          <div className="mt-0.5 shrink-0">
            <CheckCircle2 size={16} className="text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-medium text-slate-700">
                {formatDate(checkin.checkin_date)}
              </span>
              <span className="text-xs text-slate-400">
                {timeAgo(checkin.checkin_date)}
              </span>
            </div>
            {checkin.note && (
              <div className="mt-2 rounded-lg bg-indigo-50/60 border border-indigo-100 px-2.5 py-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageSquare size={11} className="text-indigo-400 shrink-0" />
                  <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wide">
                    Note
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {checkin.note}
                </p>
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CheckinHistory;
