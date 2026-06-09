import { useState } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useHabits from '../hooks/useHabits';
import HabitList from '../components/habits/HabitList';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const { habits, loading, error, refresh, removeHabit } = useHabits();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id) => {
    try {
      setDeleteError(null);
      await removeHabit(id);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete habit. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {loading ? 'Loading…' : `${habits.length} habit${habits.length !== 1 ? 's' : ''} tracked`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/habits/new')}
          >
            <Plus size={14} />
            Create Habit
          </Button>
        </div>
      </div>

      {/* Error alerts */}
      {(error || deleteError) && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error || deleteError}</p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <Loader message="Loading your habits…" />
      ) : (
        <HabitList habits={habits} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Dashboard;
