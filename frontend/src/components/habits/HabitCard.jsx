import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Calendar, RefreshCw } from 'lucide-react';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { CATEGORY_BADGE_COLORS, FREQUENCY_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/dateUtils';

const HabitCard = ({ habit, onDelete }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const badgeClass =
    CATEGORY_BADGE_COLORS[habit.category] || 'bg-slate-100 text-slate-600';

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(habit.id);
    setDeleting(false);
    setShowModal(false);
  };

  return (
    <>
      <Card className="flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 text-base leading-snug truncate">
              {habit.name}
            </h3>
          </div>
          <span
            className={`shrink-0 text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeClass}`}
          >
            {habit.category}
          </span>
        </div>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <RefreshCw size={13} className="text-slate-400" />
            <span>{FREQUENCY_LABELS[habit.frequency] || habit.frequency}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-slate-400" />
            <span>Started {formatDate(habit.start_date)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/habits/${habit.id}`)}
          >
            <Eye size={14} />
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleDelete}
        title="Delete Habit"
        message={`Are you sure you want to delete "${habit.name}"? This will also remove all associated check-ins.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  );
};

export default HabitCard;
