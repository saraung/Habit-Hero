import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../common/Button';
import { FREQUENCIES, CATEGORIES } from '../../utils/constants';
import { getTodayString } from '../../utils/dateUtils';

const defaultForm = {
  name: '',
  frequency: 'daily',
  category: 'Health',
  start_date: getTodayString(),
};


const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition';

const labelClass = 'block text-sm font-medium text-slate-700 mb-1.5';

const HabitForm = ({ onSubmit, initialValues = {}, loading = false }) => {
  const location = useLocation();
  const seedName = location.state?.name || '';
  const [form, setForm] = useState({ ...defaultForm, ...initialValues, name: initialValues.name || seedName });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Habit name is required.';
    if (form.name.trim().length > 100)
      errs.name = 'Name must be under 100 characters.';
    if (!form.start_date) errs.start_date = 'Start date is required.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Name */}
      <div>
        <label htmlFor="habit-name" className={labelClass}>
          Habit Name <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Morning Run, Read 30 mins"
          className={`${inputClass} ${errors.name ? 'border-red-400 focus:ring-red-200' : ''}`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Frequency */}
      <div>
        <label htmlFor="habit-frequency" className={labelClass}>
          Frequency
        </label>
        <select
          id="habit-frequency"
          name="frequency"
          value={form.frequency}
          onChange={handleChange}
          className={inputClass}
        >
          {FREQUENCIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label htmlFor="habit-category" className={labelClass}>
          Category
        </label>
        <select
          id="habit-category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Start Date */}
      <div>
        <label htmlFor="habit-start-date" className={labelClass}>
          Start Date <span className="text-red-500">*</span>
        </label>
        <input
          id="habit-start-date"
          name="start_date"
          type="date"
          value={form.start_date}
          onChange={handleChange}
          className={`${inputClass} ${errors.start_date ? 'border-red-400 focus:ring-red-200' : ''}`}
        />
        {errors.start_date && (
          <p className="mt-1 text-xs text-red-500">{errors.start_date}</p>
        )}
      </div>

      <Button type="submit" variant="primary" size="lg" loading={loading}>
        {loading ? 'Saving…' : 'Create Habit'}
      </Button>
    </form>
  );
};

export default HabitForm;
