import React, { useState, useMemo } from 'react';
import { 
  Table2, 
  Download, 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { StudentRecord } from '../types/analytics';

interface DataTableViewProps {
  cleanedData: StudentRecord[];
  rawSampleData: any[];
  onDownloadCleanedCsv: () => void;
  onDownloadRawCsv: () => void;
}

export const DataTableView: React.FC<DataTableViewProps> = ({
  cleanedData,
  rawSampleData,
  onDownloadCleanedCsv,
  onDownloadRawCsv
}) => {
  const [datasetMode, setDatasetMode] = useState<'cleaned' | 'raw'>('cleaned');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<string>('Student_ID');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const activeRecords = datasetMode === 'cleaned' ? cleanedData : rawSampleData;

  const filteredRecords = useMemo(() => {
    let result = [...activeRecords];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r => 
        String(r.Student_ID || '').toLowerCase().includes(q) ||
        String(r.Course || '').toLowerCase().includes(q) ||
        String(r.City || '').toLowerCase().includes(q) ||
        String(r.Primary_Platform || '').toLowerCase().includes(q) ||
        String(r.Academic_Level || '').toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const vA = a[sortField];
      const vB = b[sortField];
      if (vA === vB) return 0;
      if (vA === null || vA === undefined) return 1;
      if (vB === null || vB === undefined) return -1;
      if (typeof vA === 'number' && typeof vB === 'number') {
        return sortAsc ? vA - vB : vB - vA;
      }
      return sortAsc 
        ? String(vA).localeCompare(String(vB)) 
        : String(vB).localeCompare(String(vA));
    });

    return result;
  }, [activeRecords, searchTerm, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const columns = datasetMode === 'cleaned'
    ? [
        { key: 'Student_ID', label: 'ID' },
        { key: 'Academic_Level', label: 'Level' },
        { key: 'Course', label: 'Course' },
        { key: 'City', label: 'City' },
        { key: 'Primary_Platform', label: 'Platform' },
        { key: 'Daily_Social_Media_Hours', label: 'Social (h)' },
        { key: 'Daily_Screen_Time_Hours', label: 'Screen (h)' },
        { key: 'Sleep_Hours', label: 'Sleep (h)' },
        { key: 'Perceived_Stress_Score', label: 'Stress' },
        { key: 'GPA', label: 'GPA' },
        { key: 'Academic_Performance_Band', label: 'Band' },
        { key: 'Engagement_Segment', label: 'Segment' }
      ]
    : [
        { key: 'Student_ID', label: 'ID' },
        { key: 'Academic_Level', label: 'Level' },
        { key: 'Course', label: 'Course' },
        { key: 'City', label: 'City' },
        { key: 'Primary_Platform', label: 'Platform' },
        { key: 'Daily_Social_Media_Hours', label: 'Social (h)' },
        { key: 'Daily_Screen_Time_Hours', label: 'Screen (h)' },
        { key: 'Sleep_Hours', label: 'Sleep (h)' },
        { key: 'Perceived_Stress_Score', label: 'Stress' },
        { key: 'GPA', label: 'GPA' }
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Dataset Explorer &amp; CSV Exporter
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Paginated tabular browser for the 10,000 synthetic observations with live search and export capabilities
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Raw vs Cleaned */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => {
                setDatasetMode('cleaned');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                datasetMode === 'cleaned'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cleaned (10K Rows)</span>
            </button>
            <button
              onClick={() => {
                setDatasetMode('raw');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                datasetMode === 'raw'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Raw Sample (With Anomalies)</span>
            </button>
          </div>

          <button
            onClick={datasetMode === 'cleaned' ? onDownloadCleanedCsv : onDownloadRawCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search ID, Course, City, Platform..."
            className="w-full text-xs pl-8 pr-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="font-mono tabular-nums">
            Showing <strong>{((currentPage - 1) * pageSize + 1).toLocaleString()}</strong> - <strong>{Math.min(currentPage * pageSize, filteredRecords.length).toLocaleString()}</strong> of {filteredRecords.length.toLocaleString()} records
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="text-xs py-1 px-2 border border-slate-300 rounded-md bg-white text-slate-800"
            >
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[580px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 text-slate-600 font-medium font-mono text-[11px]">
              <tr>
                {columns.map(col => (
                  <th 
                    key={col.key} 
                    onClick={() => handleSort(col.key)}
                    className="py-2.5 px-3 whitespace-nowrap cursor-pointer hover:bg-slate-100/70 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1">
                      <span>{col.label}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              {paginatedRows.map((row, idx) => {
                const isLate = row.Late_Night_Usage === true || row.Late_Night_Usage === 'TRUE';
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    {columns.map(col => {
                      const val = row[col.key];
                      const isGPA = col.key === 'GPA';
                      return (
                        <td key={col.key} className="py-2 px-3 whitespace-nowrap tabular-nums">
                          {isGPA && typeof val === 'number' ? (
                            <strong className={val >= 3.6 ? 'text-emerald-700 font-bold' : val < 2.8 ? 'text-rose-700' : 'text-slate-900'}>
                              {val.toFixed(2)}
                            </strong>
                          ) : val !== null && val !== undefined && val !== '' ? (
                            String(val)
                          ) : (
                            <span className="text-rose-400 italic">null</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50 text-xs">
          <span className="text-slate-500 font-mono tabular-nums">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
