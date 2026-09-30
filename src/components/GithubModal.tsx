import React, { useState } from 'react';
import { X, Folder, File, Copy, Check, Github, ExternalLink } from 'lucide-react';
import { GITHUB_FOLDER_STRUCTURE } from '../data/portfolioData';

interface GithubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubModal: React.FC<GithubModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(GITHUB_FOLDER_STRUCTURE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Github className="w-5 h-5 text-slate-900" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                GitHub Repository Architecture
              </h2>
              <span className="text-[11px] text-slate-500">
                student-digital-lifestyle-analytics
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            This project is structured adhering to enterprise data analytics repository conventions, providing complete raw and cleaned data partitions, modular Python extraction and statistical scripts, production ANSI SQL schemas and queries, and BI dashboard design rubrics.
          </p>

          <div className="bg-slate-950 text-slate-200 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
            <pre className="whitespace-pre leading-relaxed">{GITHUB_FOLDER_STRUCTURE}</pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50">
          <span className="text-[11px] text-slate-500 font-mono">
            Files: 14 | Branches: main | License: MIT
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied Tree' : 'Copy File Tree'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
