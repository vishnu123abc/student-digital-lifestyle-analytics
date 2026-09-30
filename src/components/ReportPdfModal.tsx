import React, { useState } from 'react';
import { 
  FileDown, 
  Printer, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  BarChart3, 
  Users, 
  GraduationCap, 
  Smartphone, 
  Moon, 
  Activity,
  Calendar,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { StudentRecord, FilterState } from '../types/analytics';
import { generateFilteredAnalyticsPdf } from '../utils/pdfReportGenerator';

interface ReportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredData: StudentRecord[];
  allData: StudentRecord[];
  filters: FilterState;
  analyticsResults: any;
  liveKPIs: {
    count: number;
    avgGPA: string;
    avgScreenTime: string;
    avgStudyHours: string;
    avgSleepHours: string;
    avgStress: string;
    lateNightPct: string;
    distinctionPct: string;
  };
}

export const ReportPdfModal: React.FC<ReportPdfModalProps> = ({
  isOpen,
  onClose,
  filteredData,
  allData,
  filters,
  analyticsResults,
  liveKPIs
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      setDownloadSuccess(false);

      await generateFilteredAnalyticsPdf({
        filteredData,
        allData,
        filters,
        analyticsResults,
        liveKPIs
      });

      setDownloadSuccess(true);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 4000);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalAll = allData.length || 10000;
  const cohortPct = ((filteredData.length / totalAll) * 100).toFixed(1);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <FileDown className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Executive PDF Analytics Report
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Ready to Export
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Formal 2-page publication summary with live filtered KPIs, charts, and empirical findings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
              title="Print directly or save via browser print"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Print Preview</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/70 space-y-6">
          {/* Notification banner if downloaded */}
          {downloadSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-3 text-xs flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">
                  PDF successfully compiled and downloaded to your device!
                </span>
              </div>
              <span className="text-[11px] text-emerald-700">Check your Downloads folder</span>
            </div>
          )}

          {/* Document Sheet 1 Preview (A4 styled card) */}
          <div className="bg-white border border-slate-300 rounded-lg shadow-md p-6 sm:p-8 space-y-5 max-w-3xl mx-auto">
            {/* Header */}
            <div className="bg-slate-900 text-white rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                  EduMetric Analytics · Institutional Research Briefing
                </span>
                <h1 className="text-lg font-bold text-white tracking-tight mt-0.5">
                  Student Digital Lifestyle & Academic Performance
                </h1>
                <p className="text-xs text-slate-300 mt-1">
                  Empirical cross-sectional evaluation of 10,000 synthetic student observations
                </p>
              </div>

              <div className="bg-slate-800 px-3 py-1.5 rounded border border-slate-700 text-right shrink-0">
                <span className="text-[10px] text-emerald-400 font-semibold block uppercase">Executive Audit</span>
                <span className="text-xs font-mono text-slate-200">{currentDate}</span>
              </div>
            </div>

            {/* Scope / Filter Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                <span>ANALYZED COHORT POPULATION</span>
                <span className="font-mono text-slate-700">
                  N = {filteredData.length.toLocaleString()} Students ({cohortPct}% of total population)
                </span>
              </div>
              <div className="text-[11px] text-slate-600 flex flex-wrap gap-2 pt-1 border-t border-slate-200">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                  City: <strong className="text-slate-900">{filters.city}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                  Level: <strong className="text-slate-900">{filters.academicLevel}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                  Platform: <strong className="text-slate-900">{filters.platform}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                  Usage: <strong className="text-slate-900">{filters.digitalCategory}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                  Band: <strong className="text-slate-900">{filters.performanceBand}</strong>
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                  Late-Night: <strong className="text-slate-900">{filters.lateNight}</strong>
                </span>
              </div>
            </div>

            {/* Filtered KPI Summary Table */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                1. Filtered Cohort Key Performance Indicators (vs. Global Baseline)
              </h2>
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-800 text-white text-[11px]">
                    <tr>
                      <th className="py-2 px-3 font-semibold">Analytical Metric</th>
                      <th className="py-2 px-3 font-semibold">Filtered Cohort</th>
                      <th className="py-2 px-3 font-semibold">Global Baseline</th>
                      <th className="py-2 px-3 font-semibold">Variance / Delta</th>
                      <th className="py-2 px-3 font-semibold">Analytical Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-900">Mean Cumulative GPA</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{liveKPIs.avgGPA} / 4.00</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">3.58 / 4.00</td>
                      <td className="py-2 px-3 font-mono font-bold text-emerald-600">
                        {Number(liveKPIs.avgGPA) >= 3.58 ? '+' : ''}{(Number(liveKPIs.avgGPA) - 3.58).toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-slate-600">Primary academic performance benchmark</td>
                    </tr>
                    <tr className="bg-slate-50/50 hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-900">Distinction Rate (&gt;=3.60)</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{liveKPIs.distinctionPct}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">53.6%</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-700">
                        {(parseFloat(liveKPIs.distinctionPct) - 53.6).toFixed(1)}%
                      </td>
                      <td className="py-2 px-3 text-slate-600">First-class academic classification</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-900">Daily Screen Exposure</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{liveKPIs.avgScreenTime} hrs/day</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">10.2 hrs/day</td>
                      <td className="py-2 px-3 font-mono font-bold text-indigo-600">
                        {(Number(liveKPIs.avgScreenTime) - 10.2).toFixed(1)} hrs
                      </td>
                      <td className="py-2 px-3 text-slate-600">Total digital exposure duration</td>
                    </tr>
                    <tr className="bg-slate-50/50 hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-900">Daily Study Volume</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{liveKPIs.avgStudyHours} hrs/day</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">3.8 hrs/day</td>
                      <td className="py-2 px-3 font-mono font-bold text-sky-600">
                        {(Number(liveKPIs.avgStudyHours) - 3.8).toFixed(1)} hrs
                      </td>
                      <td className="py-2 px-3 text-slate-600">Self-directed academic effort</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-900">Nocturnal Sleep Duration</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{liveKPIs.avgSleepHours} hrs/night</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">5.8 hrs/night</td>
                      <td className="py-2 px-3 font-mono font-bold text-amber-600">
                        {(Number(liveKPIs.avgSleepHours) - 5.8).toFixed(1)} hrs
                      </td>
                      <td className="py-2 px-3 text-slate-600">Circadian restoration & cognitive recovery</td>
                    </tr>
                    <tr className="bg-slate-50/50 hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-900">Perceived Stress Score</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{liveKPIs.avgStress} / 10</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">4.6 / 10</td>
                      <td className="py-2 px-3 font-mono font-bold text-rose-600">
                        {(Number(liveKPIs.avgStress) - 4.6).toFixed(1)}
                      </td>
                      <td className="py-2 px-3 text-slate-600">Self-reported psychometric tension</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-medium text-slate-900">Late-Night Device Habits</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">{liveKPIs.lateNightPct}</td>
                      <td className="py-2 px-3 text-slate-500 font-mono">43.3%</td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-700">
                        {(parseFloat(liveKPIs.lateNightPct) - 43.3).toFixed(1)}%
                      </td>
                      <td className="py-2 px-3 text-slate-600">Active browsing &lt;45m before bedtime</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Visual Charts Summary Callout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs">
                <span className="font-bold text-slate-900 block mb-1">
                  Chart 1: GPA by Usage Category
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Demonstrates the negative step gradient between Low (&lt;3h = 3.80 GPA) and Severe (&gt;=8h = 3.24 GPA) social exposure. Included in PDF export with exact cohort N values.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs">
                <span className="font-bold text-slate-900 block mb-1">
                  Chart 2: Performance Band Spread
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  53.6% Distinction, 35.9% High Merit, 9.6% Merit, and 1.0% At Risk. The PDF renders high-fidelity vector bars matching this exact filtered distribution.
                </p>
              </div>
            </div>

            {/* Strategic Highlight Callout */}
            <div className="bg-slate-900 text-white rounded-lg p-4 text-xs space-y-1">
              <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px] block">
                Primary Empirical Finding · The Consistency Buffer
              </span>
              <p className="text-slate-200 leading-relaxed text-[11px]">
                Study consistency (r = +0.626) exerts a significantly stronger influence on GPA than daily screen hours (r = -0.389). High-consistency learners sustain distinction-tier grade averages regardless of moderate social media usage.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between text-[11px] text-slate-400">
              <span>EduMetric Analytics BI Engine · Page 1 of 2</span>
              <span>Official Institutional Document</span>
            </div>
          </div>

          {/* Document Sheet 2 Preview (Deep-Dive) */}
          <div className="bg-white border border-slate-300 rounded-lg shadow-md p-6 sm:p-8 space-y-5 max-w-3xl mx-auto">
            <div className="bg-slate-800 text-white rounded-lg p-3 flex justify-between items-center text-xs">
              <span className="font-bold">Section 02: Deep-Dive Diagnostics & Strategic Actions</span>
              <span className="text-slate-400 font-mono">Page 2 of 2</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                2. Statistical Findings & Empirical Evidence
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border-l-4 border-l-indigo-600 bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Sleep Displacement Nexus</span>
                  <span className="text-[11px] text-indigo-700 font-semibold block mb-1">r = -0.626 (p &lt; 0.001)</span>
                  <p className="text-[11px] text-slate-600">
                    Each 2-hour increase in screen time associates with 0.62 hours of lost sleep. Students exceeding 10 hours average only 4.4 hours of sleep nightly.
                  </p>
                </div>

                <div className="p-3 rounded-lg border-l-4 border-l-rose-600 bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Late-Night Usage Penalty</span>
                  <span className="text-[11px] text-rose-700 font-semibold block mb-1">+1.4 Stress Score Delta</span>
                  <p className="text-[11px] text-slate-600">
                    43.3% of students engage with screens in bed, driving elevated stress (5.2 vs 3.8 / 10) and a 0.31 deficit in mean cumulative GPA.
                  </p>
                </div>

                <div className="p-3 rounded-lg border-l-4 border-l-blue-600 bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Platform-Specific Nuance</span>
                  <span className="text-[11px] text-blue-700 font-semibold block mb-1">TikTok: 6.0h vs LinkedIn: 4.0h</span>
                  <p className="text-[11px] text-slate-600">
                    Passive video entertainment platforms correlate with lower study consistency, whereas career-oriented platforms associate with higher completion (84.2%).
                  </p>
                </div>

                <div className="p-3 rounded-lg border-l-4 border-l-emerald-600 bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900 block">Metropolitan Uniformity</span>
                  <span className="text-[11px] text-emerald-700 font-semibold block mb-1">ANOVA F = 0.82 (p = 0.60)</span>
                  <p className="text-[11px] text-slate-600">
                    Screen saturation shows no significant variance between cities (10.1h–10.4h), reflecting a widespread cultural dynamic rather than localized phenomena.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                3. Actionable Institutional Recommendations
              </h2>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-900">Circadian Rhythm & Digital Hygiene Advising:</strong>
                    <span className="text-slate-600 ml-1">
                      Integrate mandatory digital well-being modules during orientation addressing pre-bed screen curfews and notification batching.
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-900">Study Consistency Coaching:</strong>
                    <span className="text-slate-600 ml-1">
                      Coach students to prioritize structured 45-minute daily study sprints over end-of-semester cramming to unlock the +0.626 consistency benefit.
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-900">Early-Warning Wellness Alert System:</strong>
                    <span className="text-slate-600 ml-1">
                      Deploy advising triggers for students exhibiting the Digital Heavy profile (&gt;10h screen and &lt;5h sleep) prior to midterms.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-100 rounded text-[11px] text-slate-500 leading-relaxed border border-slate-200">
              <strong>Methodology & Research Ethics:</strong> This report represents empirical analysis from a synthetic educational research dataset (10,000 observations) architected for institutional analytics. Statistical relationships represent correlational observations and should not be construed as clinical diagnoses.
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between text-[11px] text-slate-400">
              <span>EduMetric Analytics BI Engine · Confidential Institutional Copy</span>
              <span>Page 2 of 2</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Exported as high-resolution PDF document (2 Pages · Vector Typography · 300 DPI Canvas Charts)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Close
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />
                  <span>Compiling PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
