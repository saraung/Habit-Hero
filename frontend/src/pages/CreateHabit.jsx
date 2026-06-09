import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { createHabit } from '../api/habitsApi';
import HabitForm from '../components/habits/HabitForm';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const CreateHabit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await createHabit(formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to create habit. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={14} />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Create Habit</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Start a new habit to track your progress
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Form Card */}
      <Card>
        <HabitForm onSubmit={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
};

export default CreateHabit;
