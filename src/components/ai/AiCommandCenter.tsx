import React from 'react';
import { 
  Sparkles, 
  Code, 
  Terminal, 
  BarChart3, 
  HelpCircle,
  BrainCircuit
} from 'lucide-react';

export type AiMode = 'ask' | 'insights' | 'sql' | 'python';

interface AiCommandCenterProps {
  currentAiMode: AiMode | null;
  onSelectMode: (mode: AiMode) => void;
  filteredCount: number;
  activeFilterSummary: string;
}

export const AiCommandCenter: React.FC<AiCommandCenterProps> = ({
  currentAiMode,
  onSelectMode,
  filteredCount,
  activeFilterSummary
}) => {
  const tools: { id: AiMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'ask', label: 'Ask Your Data', icon: <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />, desc: 'Natural Language Data Questions' },
    { id: 'insights', label: 'Generate Insights', icon: <Sparkles className="w-3.5 h-3.5 text-purple-600" />, desc: 'Executive Insights' },
    { id: 'sql', label: 'Generate SQL', icon: <Code className="w-3.5 h-3.5 text-emerald-600" />, desc: 'Schema-Grounded SQL' },
    { id: 'python', label: 'Python Analysis', icon: <Terminal className="w-3.5 h-3.5 text-cyan-600" />, desc: 'Pandas & Statistics' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs mb-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
            AI Analyst Command Center
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500 font-medium">
            Active Context: <strong className="text-slate-800 font-mono">{activeFilterSummary}</strong> ({filteredCount.toLocaleString()} Students)
          </span>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          Grounded in Verified Dataset Metrics
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {tools.map(tool => {
          const isActive = currentAiMode === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectMode(tool.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {tool.icon}
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
