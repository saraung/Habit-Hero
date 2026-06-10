import { useState, useRef, useEffect } from 'react';
import { Sparkles, Brain, Loader2 } from 'lucide-react';
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
  const [submitted, setSubmitted] = useState(false);

  // Debounce timer ref for live analysis hint
  const debounceRef = useRef(null);
  const [noteHint, setNoteHint] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.checkin_date) errs.checkin_date = 'Check-in date is required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'note') {
      setAnalysisResult(null);
      setAnalysisError('');
      setSubmitted(false);

      // Show the AI hint badge after user types 20+ chars
      clearTimeout(debounceRef.current);
      if (value.trim().length >= 20) {
        debounceRef.current = setTimeout(() => setNoteHint(true), 600);
      } else {
        setNoteHint(false);
      }
    }
  };

  // Run analysis silently in background after successful submit
  const runAnalysis = async (note) => {
    const trimmed = note.trim();
    if (!trimmed || trimmed.length < 5) return;

    setAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult(null);

    try {
      const result = await analyzeNote(trimmed);
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisError(err.message || 'Mood analysis failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const noteForAnalysis = form.note;
    setNoteHint(false);

    try {
      // Submit check-in first — if it throws, don't analyze
      await onSubmit(form);

      // Mark as submitted so the analysis panel shows
      setSubmitted(true);

      // Reset form fields (analysis panel stays visible)
      setForm({ habit_id: habitId, checkin_date: getTodayString(), note: '' });

      // Auto-analyze if there's a meaningful note
      if (noteForAnalysis.trim().length >= 5) {
        runAnalysis(noteForAnalysis);
      }
    } catch {
      // onSubmit handles its own error display; don't run analysis
      setSubmitted(false);
    }
  };

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), []);

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

      {/* Note field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="checkin-note" className="text-sm font-medium text-slate-700">
            Note{' '}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>

          {/* AI hint badge — appears once enough text is typed */}
          {noteHint && !submitted && (
            <span
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
                bg-indigo-50 text-indigo-600 border border-indigo-200 animate-pulse"
            >
              <Sparkles size={10} />
              AI will analyze on submit
            </span>
          )}
        </div>

        <textarea
          id="checkin-note"
          name="note"
          rows={3}
          value={form.note}
          onChange={handleChange}
          placeholder="How did it go? Any thoughts… (AI will read your mood 🧠)"
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

      {/* ── Mood Analysis Panel ── shown after submit if there was a note */}
      {submitted && (analyzing || analysisResult) && (
        <div className="mood-analysis-panel">
          {analyzing ? (
            /* Shimmer skeleton while AI processes */
            <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Loader2 size={14} className="text-indigo-500 animate-spin" />
                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
                  Analyzing your mood…
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-3 rounded-full bg-indigo-100 animate-pulse w-3/4" />
                <div className="h-3 rounded-full bg-indigo-100 animate-pulse w-1/2" />
                <div className="h-2 rounded-full bg-indigo-100 animate-pulse w-full mt-1" />
                <div className="h-3 rounded-full bg-indigo-100 animate-pulse w-5/6" />
              </div>
            </div>
          ) : (
            <NoteAnalysisResult result={analysisResult} />
          )}
        </div>
      )}

      <Button type="submit" variant="primary" loading={loading}>
        {loading ? 'Saving…' : 'Add Check-in'}
      </Button>
    </form>
  );
};

export default CheckinForm;
