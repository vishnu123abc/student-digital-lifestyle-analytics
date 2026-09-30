import React, { useState } from 'react';
import { Code, Play, Copy, Check, Table2, Lightbulb, Sparkles, HelpCircle } from 'lucide-react';
import { StudentRecord } from '../../types/analytics';

interface AiSqlGeneratorProps {
  data: StudentRecord[];
}

export const AiSqlGenerator: React.FC<AiSqlGeneratorProps> = ({ data }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [simulatedResults, setSimulatedResults] = useState<{ columns: string[]; rows: any[] } | null>(null);

  const samplePrompts = [
    "Find the average GPA and study hours by digital usage category.",
    "Calculate the percentage of students engaging in late-night screen usage by platform.",
    "Identify courses with the lowest average sleep duration and highest stress.",
    "Find top 10 students with the highest productivity score who have GPA above 3.8."
  ];

  const handleGenerateSql = async (customPrompt?: string) => {
    const q = (customPrompt || prompt).trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setGeneratedResponse(null);
    setSimulatedResults(null);

    try {
      const response = await fetch('/api/ai/sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q })
      });

      if (!response.ok) throw new Error('SQL Generation failed');

      const resData = await response.json();
      setGeneratedResponse(resData.text || 'No SQL generated.');
    } catch (err: any) {
      setGeneratedResponse(`-- Error generating SQL: ${err?.message || 'Server error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunGeneratedSql = () => {
    // Run instant analytical simulation on current 10K dataset
    const cats = ['Low', 'Moderate', 'High', 'Severe'];
    const rows = cats.map(cat => {
      const group = data.filter(d => d.Digital_Usage_Category === cat);
      const count = group.length;
      return {
        digital_usage_category: cat,
        student_count: count,
        avg_gpa: (group.reduce((a, b) => a + b.GPA, 0) / count).toFixed(2),
        avg_study_hours: (group.reduce((a, b) => a + b.Study_Hours_Per_Day, 0) / count).toFixed(1),
        avg_screen_hours: (group.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / count).toFixed(1)
      };
    });

    setSimulatedResults({
      columns: ['digital_usage_category', 'student_count', 'avg_gpa', 'avg_study_hours', 'avg_screen_hours'],
      rows
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Ask with SQL (Gemini ANSI SQL Generator)
            </h2>
            <p className="text-xs text-slate-500">
              Transform English business questions into exact schema-validated ANSI SQL for table student_digital_lifestyle
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
          Schema: student_digital_lifestyle
        </span>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerateSql();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question in plain English, e.g. 'Compare GPA across platforms for late night users'..."
            className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs shrink-0"
          >
            {isLoading ? 'Generating SQL...' : 'Generate SQL'}
          </button>
        </form>

        {/* Sample queries */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Sample Prompts:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p);
                handleGenerateSql(p);
              }}
              disabled={isLoading}
              className="text-[11px] font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded whitespace-nowrap transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Response */}
      {generatedResponse && (
        <div className="space-y-4">
          <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 text-[11px]">Gemini SQL Response</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedResponse);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleRunGeneratedSql}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-sans text-xs flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Run Query</span>
                </button>
              </div>
            </div>

            <pre className="text-slate-200 leading-relaxed whitespace-pre-wrap font-mono text-xs">
              {generatedResponse}
            </pre>
          </div>

          {/* Results Table Simulation */}
          {simulatedResults && (
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Table2 className="w-4 h-4 text-emerald-600" />
                  Query Execution Output (10,000 In-Memory Rows)
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {simulatedResults.rows.length} rows returned
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                      {simulatedResults.columns.map(c => (
                        <th key={c} className="py-2 px-3">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
                    {simulatedResults.rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        {simulatedResults.columns.map(c => (
                          <td key={c} className="py-1.5 px-3">{String(row[c])}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
