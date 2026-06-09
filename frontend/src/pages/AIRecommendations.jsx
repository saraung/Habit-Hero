import { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Brain,
  Lightbulb,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useRecommendations from '../hooks/useRecommendations';
import useHabits from '../hooks/useHabits';
import Loader from '../components/common/Loader';
import Card, { CardHeader, CardTitle, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';

// ─── How-it-works steps ────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    icon: Brain,
    title: 'Reads Your Habits',
    desc: 'Analyses the names and categories of habits you already track.',
  },
  {
    icon: Lightbulb,
    title: 'TF-IDF Matching',
    desc: 'Builds a text profile and computes cosine similarity against a curated knowledge base.',
  },
  {
    icon: Sparkles,
    title: 'Category Boost',
    desc: 'Library items matching your habit categories get extra weight for smarter results.',
  },
];

// ─── Pastel colours cycling for recommendation cards ───────────────────────
const CARD_ACCENTS = [
  { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'text-indigo-500', num: 'bg-indigo-100 text-indigo-600' },
  { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', num: 'bg-emerald-100 text-emerald-600' },
  { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', num: 'bg-amber-100 text-amber-600' },
];

const AIRecommendations = () => {
  const navigate = useNavigate();
  const { recommendations, loading, error, refresh } = useRecommendations();
  const { habits } = useHabits();

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">AI Recommendations</h1>
          </div>
          <p className="text-sm text-slate-500">
            Personalised habits suggested based on what you already track
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={refresh}
          disabled={loading}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* ── Current habits context ─────────────────────────────────────────── */}
      {!loading && habits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Based on your {habits.length} habit{habits.length !== 1 ? 's' : ''}</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {habits.map((h) => (
                <span
                  key={h.id}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
                >
                  <CheckCircle2 size={10} className="text-indigo-400" />
                  {h.name}
                </span>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* ── Recommendations ────────────────────────────────────────────────── */}
      {loading ? (
        <Loader message="Generating recommendations…" />
      ) : recommendations.length > 0 ? (
        <>
          <div>
            <h2 className="text-base font-semibold text-slate-700 mb-3">
              🤖 Recommended for you
            </h2>
            <div className="flex flex-col gap-3">
              {recommendations.map((rec, idx) => {
                const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
                return (
                  <div
                    key={rec}
                    className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${accent.bg} ${accent.border}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Number badge */}
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${accent.num}`}>
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{rec}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Recommended by AI engine
                        </p>
                      </div>
                    </div>
                    {/* Quick-add → pre-fills Create Habit with the name */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        navigate('/habits/new', { state: { name: rec } })
                      }
                      className="shrink-0"
                    >
                      <Plus size={13} />
                      Add
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-slate-400 text-center">
            Recommendations update when you add or remove habits.
          </p>
        </>
      ) : (
        !error && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-indigo-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-700 mb-1">
              No recommendations yet
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mb-4">
              Create at least one habit so the AI engine can suggest complementary ones.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/habits/new')}>
              <Plus size={14} /> Create First Habit
            </Button>
          </div>
        )
      )}

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <Icon size={16} className="text-indigo-500" />
                </div>
                <p className="text-sm font-semibold text-slate-700">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default AIRecommendations;
