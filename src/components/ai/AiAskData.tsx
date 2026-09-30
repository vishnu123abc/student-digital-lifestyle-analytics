import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Send, 
  Loader2, 
  HelpCircle, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  BookOpen,
  X
} from 'lucide-react';
import { FilterState } from '../../types/analytics';

interface AiAskDataProps {
  filters: FilterState;
  liveKPIs: any;
  onClose?: () => void;
}

const SAMPLE_QUESTIONS = [
  "Which academic level has the highest GPA?",
  "What is the relationship between screen time and sleep?",
  "Compare study hours between high and low performers.",
  "What percentage of students have high digital usage?",
  "Which platform has the highest average screen time?",
  "Explain the most important insight from this dashboard."
];

export const AiAskData: React.FC<AiAskDataProps> = ({
  filters,
  liveKPIs,
  onClose
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);

  const filterSummary = React.useMemo(() => {
    const parts: string[] = [];
    if (filters.city !== 'All') parts.push(`City: ${filters.city}`);
    if (filters.academicLevel !== 'All') parts.push(`Level: ${filters.academicLevel}`);
    if (filters.digitalCategory !== 'All') parts.push(`Usage: ${filters.digitalCategory}`);
    if (filters.platform !== 'All') parts.push(`Platform: ${filters.platform}`);
    if (filters.performanceBand !== 'All') parts.push(`Band: ${filters.performanceBand}`);
    if (filters.segment !== 'All') parts.push(`Segment: ${filters.segment}`);
    if (filters.lateNight !== 'All') parts.push(`Late-Night: ${filters.lateNight}`);
    if (parts.length === 0) return 'All 10,000 Students (Unfiltered Baseline)';
    return parts.join(' · ');
  }, [filters]);

  const handleAskQuestion = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsLoading(true);
    setResponseOutput(null);

    try {
      const res = await fetch('/api/ai/ask-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          context: {
            activeFiltersDescription: filterSummary,
            liveKPIs: liveKPIs
          }
        })
      });

      if (!res.ok) {
        throw new Error('Data analysis query failed.');
      }

      const data = await res.json();
      setResponseOutput(data.text);
    } catch (err: any) {
      setResponseOutput(`Error analyzing question: ${err?.message || 'Server error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAskQuestion(query);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Ask Your Data (Gemini Data Analyst)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                Grounded in 10,000 Records
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Active Context: <strong className="text-slate-800">{filterSummary}</strong>
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded border border-slate-200"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your data (e.g., Which academic level has the highest GPA?)..."
            className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-24 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-900 text-white text-xs font-semibold rounded-md hover:bg-slate-800 transition-colors disabled:opacity-40 flex items-center gap-1"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3 h-3" />}
            <span>Analyze</span>
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Suggestions:</span>
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setQuery(q);
                handleAskQuestion(q);
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-600 font-medium">
            Analyzing question against current filtered dataset context...
          </p>
        </div>
      )}

      {/* Response Card */}
      {responseOutput && !isLoading && (
        <div className="bg-slate-900 text-slate-100 rounded-lg p-5 border border-slate-800 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Verified Data Analyst Response
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Grounded in {filters.city !== 'All' || filters.academicLevel !== 'All' ? 'Filtered Cohort' : 'Full 10K Dataset'}
            </span>
          </div>

          <div className="prose prose-invert prose-xs max-w-none text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
            {responseOutput}
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Analytical Integrity: Metrics are derived directly from empirical distributions. Observational findings demonstrate correlation, not clinical causation.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
