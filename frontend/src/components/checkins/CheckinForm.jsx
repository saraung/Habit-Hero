import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Button from '../common/Button';
import NoteAnalysisResult from './NoteAnalysisResult';
import { analyzeNote } from '../../api/aiApi';
import { getTodayString } from '../../utils/dateUtils';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition';

const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

const CheckinForm = ({ habitId, onSubmit, loading = false }) => {
  const [form, setForm] = useState({
    habit_id: habitId,
    checkin_date: getTodayString(),
    note: '',
  });
  const [errors, setErrors] = useState({});

  // AI analysis state
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.checkin_date) errs.checkin_date = 'Check-in date is required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    // clear previous analysis when note changes
    if (name === 'note') {
      setAnalysisResult(null);
      setAnalysisError('');
    }
  };

  const handleAnalyze = async () => {
    const trimmed = form.note.trim();
    if (!trimmed) {
      setAnalysisError('Please write a note before analyzing.');
      return;
    }
    if (trimmed.length > 1000) {
      setAnalysisError('Note must be under 1000 characters.');
      return;
    }
    setAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult(null);
    try {
      const result = await analyzeNote(trimmed);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisError(err.message || 'Failed to analyze note. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Check-in Date */}
      <div>
        <label htmlFor="checkin-date" className={labelClass}>
          Check-in Date <span className="text-red-500">*</span>
        </label>
        <input
          id="checkin-date"
          name="checkin_date"
          type="date"
          value={form.checkin_date}
          onChange={handleChange}
          className={`${inputClass} ${errors.checkin_date ? 'border-red-400 focus:ring-red-200' : ''}`}
        />
        {errors.checkin_date && (
          <p className="mt-1 text-xs text-red-500">{errors.checkin_date}</p>
        )}
      </div>

      {/* Note + Analyze button */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="checkin-note" className="text-sm font-medium text-slate-700">
            Note{' '}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !form.note.trim()}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Sparkles size={12} />
            {analyzing ? 'Analyzing…' : 'Analyze mood'}
          </button>
        </div>

        <textarea
          id="checkin-note"
          name="note"
          rows={3}
          value={form.note}
          onChange={handleChange}
          placeholder="How did it go? Any thoughts…"
          maxLength={1000}
          className={`${inputClass} resize-none`}
        />

        {/* Character count */}
        {form.note.length > 0 && (
          <p className="mt-1 text-xs text-slate-400 text-right">
            {form.note.length}/1000
          </p>
        )}

        {/* Analysis error */}
        {analysisError && (
          <p className="mt-1 text-xs text-red-500">{analysisError}</p>
        )}
      </div>

      {/* AI Result card — shown after analysis */}
      {analysisResult && <NoteAnalysisResult result={analysisResult} />}

      <Button type="submit" variant="primary" loading={loading}>
        {loading ? 'Saving…' : 'Add Check-in'}
      </Button>
    </form>
  );
};

export default CheckinForm;
