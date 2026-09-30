import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Play, 
  Copy, 
  Check, 
  Lightbulb, 
  Code2, 
  Sparkles, 
  Layers,
  HelpCircle,
  Table as TableIcon
} from 'lucide-react';
import { SQL_QUERIES, executeQuerySimulation } from '../data/sqlQueriesData';
import { StudentRecord, SqlQueryItem } from '../types/analytics';

interface SqlLabViewProps {
  data: StudentRecord[];
}

export const SqlLabView: React.FC<SqlLabViewProps> = ({ data }) => {
  const [selectedQueryId, setSelectedQueryId] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copied, setCopied] = useState<boolean>(false);
  const [hasExecuted, setHasExecuted] = useState<boolean>(true);

  const selectedQuery = useMemo(() => {
    return SQL_QUERIES.find(q => q.id === selectedQueryId) || SQL_QUERIES[0];
  }, [selectedQueryId]);

  const filteredQueries = useMemo(() => {
    if (selectedCategory === 'All') return SQL_QUERIES;
    return SQL_QUERIES.filter(q => q.category === selectedCategory);
  }, [selectedCategory]);

  const queryResults = useMemo(() => {
    if (!hasExecuted) return null;
    return executeQuerySimulation(selectedQuery.id, data);
  }, [selectedQuery.id, hasExecuted, data]);

  const handleCopySql = () => {
    navigator.clipboard.writeText(selectedQuery.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = ['All', 'Aggregation', 'Window Functions', 'CTE & Cohort', 'Ranking & Segmentation', 'Performance Risk'];

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            SQL Business Intelligence &amp; Analytics Lab
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            20 production-grade SQL business questions, window ranking algorithms, and live in-memory execution
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 overflow-x-auto max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Query List (Left) + Execution & Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 20 Query Catalog */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-3 shadow-xs h-[720px] flex flex-col">
          <div className="flex items-center justify-between px-2 py-1.5 mb-2 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              SQL Questions ({filteredQueries.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">ANSI SQL</span>
          </div>

          <div className="overflow-y-auto space-y-1.5 pr-1 flex-1">
            {filteredQueries.map(q => {
              const isSelected = q.id === selectedQuery.id;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setSelectedQueryId(q.id);
                    setHasExecuted(true);
                  }}
                  className={`w-full text-left p-2.5 rounded-md transition-all text-xs border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                      Q{q.id.toString().padStart(2, '0')} · {q.category}
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {q.complexity}
                    </span>
                  </div>
                  <div className={`font-medium line-clamp-2 leading-snug ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {q.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code Editor & Execution Results */}
        <div className="lg:col-span-8 space-y-4">
          {/* Question Details Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                  Query #{selectedQuery.id}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs font-medium text-slate-600">{selectedQuery.category}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500">{selectedQuery.complexity} Complexity</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
                </button>

                <button
                  onClick={() => setHasExecuted(true)}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-white bg-slate-900 rounded hover:bg-slate-800 transition-colors shadow-xs"
                >
                  <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                  <span>Execute on 10,000 Records</span>
                </button>
              </div>
            </div>

            <h2 className="text-sm font-semibold text-slate-900 leading-snug">
              {selectedQuery.question}
            </h2>
          </div>

          {/* SQL Code Block */}
          <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-sm border border-slate-800 relative">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest pb-2 mb-2 border-b border-slate-800 flex items-center justify-between">
              <span>ANSI SQL Source</span>
              <span>Target: student_digital_lifestyle (10K Rows)</span>
            </div>
            <pre className="text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
              {selectedQuery.sql}
            </pre>
          </div>

          {/* Live Execution Output Table */}
          {queryResults && (
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Query Execution Results
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-500 font-mono tabular-nums">
                    {queryResults.rows.length} rows returned in 4ms
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Execution Status: 200 OK
                </span>
              </div>

              <div className="overflow-x-auto max-h-64 border border-slate-100 rounded-md">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium font-mono text-[11px]">
                      {queryResults.columns.map(col => (
                        <th key={col} className="py-2 px-3 whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono tabular-nums text-slate-800">
                    {queryResults.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        {queryResults.columns.map(col => (
                          <td key={col} className="py-1.5 px-3 whitespace-nowrap text-xs">
                            {row[col] !== null && row[col] !== undefined ? String(row[col]) : '—'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytical Interpretation & Interview Note */}
          <div className="bg-emerald-50/40 border border-emerald-200 rounded-lg p-4 shadow-xs space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900">
              <Lightbulb className="w-4 h-4 text-emerald-700" />
              <span>Analytical Interpretation &amp; Interview Talking Points</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {selectedQuery.expectedInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
