import React, { useState } from 'react';
import { Terminal, Play, Copy, Check, FileCode2, Sparkles, BookOpen } from 'lucide-react';

export const AiPythonAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseOutput, setResponseOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const samplePrompts = [
    "Analyze whether study consistency is associated with GPA using OLS regression.",
    "Evaluate whether sleep hours differ significantly between late-night and non-late-night students using Welch's t-test.",
    "Perform a K-Means clustering analysis to group students based on digital saturation and study volume.",
    "Calculate the Pearson correlation matrix between screen time, sleep duration, and perceived stress score."
  ];

  const handleGeneratePython = async (queryText?: string) => {
    const q = (queryText || prompt).trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setResponseOutput(null);

    try {
      const response = await fetch('/api/ai/python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q })
      });

      if (!response.ok) throw new Error('Python analysis request failed');

      const data = await response.json();
      setResponseOutput(data.text || 'Python analysis completed.');
    } catch (err: any) {
      setResponseOutput(`Error: ${err?.message || 'Server error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Python &amp; Pandas Analysis Assistant
            </h2>
            <p className="text-xs text-slate-500">
              Generate Pandas statistical transformations, SciPy hypothesis tests, and Seaborn visualization code
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
          Pandas 2.0+ · NumPy · SciPy
        </span>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGeneratePython();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a statistical or Pandas query, e.g. 'Test if study hours predict exam score'..."
            className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900 bg-white"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-xs shrink-0"
          >
            {isLoading ? 'Generating Code...' : 'Generate Analysis'}
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
                handleGeneratePython(p);
              }}
              disabled={isLoading}
              className="text-[11px] font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded whitespace-nowrap transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Output */}
      {responseOutput && (
        <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 text-[11px]">Gemini Python Analysis Output</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(responseOutput);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <pre className="text-slate-200 leading-relaxed whitespace-pre-wrap font-sans text-xs">
            {responseOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
