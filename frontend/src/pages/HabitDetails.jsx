import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  CheckSquare,
  Calendar,
  RefreshCw,
  Tag,
} from 'lucide-react';
import { getHabitById } from '../api/habitsApi';
import useCheckins from '../hooks/useCheckins';
import Card, { CardHeader, CardTitle, CardBody } from '../components/common/Card';
import CheckinForm from '../components/checkins/CheckinForm';
import CheckinHistory from '../components/checkins/CheckinHistory';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import { CATEGORY_BADGE_COLORS, FREQUENCY_LABELS } from '../utils/constants';
import { formatDate } from '../utils/dateUtils';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
      <Icon size={15} className="text-slate-500" />
    </div>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-700">{value}</p>
    </div>
  </div>
);

const HabitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [habit, setHabit] = useState(null);
  const [habitLoading, setHabitLoading] = useState(true);
  const [habitError, setHabitError] = useState(null);
  const [checkinError, setCheckinError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const { checkins, loading: checkinsLoading, submitting, addCheckin } = useCheckins(id);

  useEffect(() => {
    const load = async () => {
      setHabitLoading(true);
      setHabitError(null);
      try {
        const data = await getHabitById(id);
        setHabit(data);
      } catch (err) {
        setHabitError(err.message || 'Failed to load habit details');
      } finally {
        setHabitLoading(false);
      }
    };
    load();
  }, [id]);

  const handleCheckin = async (formData) => {
    setCheckinError(null);
    setSuccessMsg('');
    try {
      await addCheckin(formData);
      setSuccessMsg('Check-in recorded successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setCheckinError(err.message || 'Failed to add check-in. Please try again.');
    }
  };

  if (habitLoading) return <Loader fullPage message="Loading habit details…" />;

  if (habitError) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertCircle size={36} className="text-red-400" />
        <p className="text-slate-600">{habitError}</p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Button>
      </div>
    );
  }

  const badgeClass =
    CATEGORY_BADGE_COLORS[habit?.category] || 'bg-slate-100 text-slate-600';

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="secondary" size="sm" onClick={() => navigate('/')}>
          <ArrowLeft size={14} />
          Back
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-800 truncate">
              {habit?.name}
            </h1>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${badgeClass}`}>
              {habit?.category}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {checkins.length} check-in{checkins.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Habit Info */}
          <Card>
            <CardHeader>
              <CardTitle>Habit Information</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
              <InfoRow icon={Tag} label="Category" value={habit?.category} />
              <InfoRow
                icon={RefreshCw}
                label="Frequency"
                value={FREQUENCY_LABELS[habit?.frequency] || habit?.frequency}
              />
              <InfoRow
                icon={Calendar}
                label="Start Date"
                value={formatDate(habit?.start_date)}
              />
            </CardBody>
          </Card>

          {/* Check-in Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Check-in</CardTitle>
            </CardHeader>
            <CardBody>
              {successMsg && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                  <CheckSquare size={15} />
                  {successMsg}
                </div>
              )}
              {checkinError && (
                <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  {checkinError}
                </div>
              )}
              <CheckinForm
                habitId={Number(id)}
                onSubmit={handleCheckin}
                loading={submitting}
              />
            </CardBody>
          </Card>
        </div>

        {/* Right column — History */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Check-in History</CardTitle>
            </CardHeader>
            <CardBody>
              {checkinsLoading ? (
                <Loader message="Loading check-ins…" />
              ) : (
                <CheckinHistory checkins={checkins} />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;
