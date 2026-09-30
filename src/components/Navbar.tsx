import React from 'react';
import { 
  BarChart3, 
  Database, 
  Terminal, 
  FileCheck2, 
  FileText, 
  Table2,
  Download,
  Github
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'sql' | 'python' | 'quality' | 'report' | 'data';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onDownloadCleanedCsv: () => void;
  onOpenGithubModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onDownloadCleanedCsv,
  onOpenGithubModal
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'BI Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'sql', label: 'SQL Query Lab', icon: <Database className="w-4 h-4" /> },
    { id: 'python', label: 'Python & EDA Lab', icon: <Terminal className="w-4 h-4" /> },
    { id: 'quality', label: 'Data Cleaning', icon: <FileCheck2 className="w-4 h-4" /> },
    { id: 'report', label: 'Executive Report', icon: <FileText className="w-4 h-4" /> },
    { id: 'data', label: 'Dataset (10K)', icon: <Table2 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold text-base tracking-wider shadow-sm">
              EM
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block">
                EduMetric Analytics
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Student Digital Lifestyle & Academic Performance
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadCleanedCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors whitespace-nowrap shadow-xs"
              title="Download Cleaned CSV (10,000 records)"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Export Clean CSV</span>
            </button>

            <button
              onClick={onOpenGithubModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap shadow-xs"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Project Repo</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 no-scrollbar">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
