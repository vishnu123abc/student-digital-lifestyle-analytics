import React, { useState } from 'react';
import { 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Trash2, 
  ShieldCheck, 
  Layers,
  BarChart3,
  Box
} from 'lucide-react';
import { DataQualityVisuals } from './DataQualityVisuals';

interface DataQualityViewProps {
  analyticsResults: any;
}

export const DataQualityView: React.FC<DataQualityViewProps> = ({ analyticsResults }) => {
  const [selectedAuditTab, setSelectedAuditTab] = useState<'visuals' | 'overview' | 'comparison' | 'workflow'>('visuals');

  const anomalies = [
    { title: 'Duplicate Records', injected: 15, treated: 15, method: 'drop_duplicates(subset=["Student_ID"], keep="first")', status: 'Resolved' },
    { title: 'Missing Numerical Values', injected: 148, treated: 148, method: 'Subgroup median imputation grouped by Academic_Level', status: 'Resolved' },
    { title: 'Missing Platform Categories', injected: 22, treated: 22, method: 'Mode imputation (Instagram)', status: 'Resolved' },
    { title: 'Out-of-Bounds Outliers (>24h Screen, <0h Sleep)', injected: 25, treated: 25, method: 'Coerced to NaN and statistically imputed', status: 'Resolved' },
    { title: 'Categorical Casing Inconsistencies ("tik tok", "TIKTOK")', injected: 60, treated: 60, method: 'Standardized dictionary mapping to canonical platform', status: 'Resolved' },
    { title: 'Whitespace Padding in Strings', injected: 45, treated: 45, method: 'Vectorized .str.strip() applied across all string columns', status: 'Resolved' }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Ingestion & Schema Inspection',
      code: 'df = pd.read_csv("raw.csv"); df.info()',
      reason: 'Validates initial memory footprint, column counts (32), and detects unexpected string object conversions caused by dirty tokens.'
    },
    {
      step: 2,
      title: 'Categorical Standardization & Whitespace Sanitization',
      code: 'df["Primary_Platform"] = df["Primary_Platform"].str.strip().replace(platform_map)',
      reason: 'Standardizes casing anomalies ("tik tok" -> "TikTok") before performing any group-by aggregations or mode imputations.'
    },
    {
      step: 3,
      title: 'Entity Deduplication',
      code: 'df = df.drop_duplicates(subset=["Student_ID"], keep="first")',
      reason: 'Prevents double-counting identical survey submissions and eliminates artificial inflation of cohort sample sizes.'
    },
    {
      step: 4,
      title: 'Domain Range & Physical Validity Auditing',
      code: 'df.loc[(df["Daily_Screen_Time_Hours"] > 24) | (df["Daily_Screen_Time_Hours"] < 0), "Daily_Screen_Time_Hours"] = np.nan',
      reason: 'Physically impossible inputs (e.g. 26.5 screen hours in a 24-hour day) must not pollute standard deviations or linear regressions.'
    },
    {
      step: 5,
      title: 'Subgroup Median Imputation',
      code: 'df["GPA"] = df.groupby("Academic_Level")["GPA"].transform(lambda x: x.fillna(x.median()))',
      reason: 'Preserves academic subgroup differences (Postgrad median 3.68 vs Undergrad median 3.60) rather than using a flat global average.'
    },
    {
      step: 6,
      title: 'Feature Engineering of Business Categories',
      code: 'df["Academic_Performance_Band"] = pd.cut(df["GPA"], bins=[...], labels=[...])',
      reason: 'Translates raw continuous values into high-value executive reporting categories (Distinction, High Merit, Merit, Pass).'
    },
    {
      step: 7,
      title: 'Statistical Drift & Integrity Verification',
      code: 'assert abs(pre_clean_mean - post_clean_mean) < 0.05',
      reason: 'Guarantees that data cleaning improved data quality without altering genuine underlying distributional shapes or introducing bias.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Data Quality Audit &amp; Cleaning Studio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full inspection of intentional anomalies, automated cleaning pipelines, and pre/post statistical validation
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setSelectedAuditTab('visuals')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              selectedAuditTab === 'visuals' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Missing &amp; Outliers Visuals</span>
          </button>
          <button
            onClick={() => setSelectedAuditTab('overview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedAuditTab === 'overview' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Anomaly Audit Summary
          </button>
          <button
            onClick={() => setSelectedAuditTab('comparison')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedAuditTab === 'comparison' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Raw vs. Cleaned Compare
          </button>
          <button
            onClick={() => setSelectedAuditTab('workflow')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedAuditTab === 'workflow' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            7-Stage Cleaning Logic
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium mb-1">
            <span>Raw Ingested Records</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">10,015</div>
          <div className="text-[11px] text-slate-500 mt-1">15 duplicates, 1.5% nulls</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium mb-1">
            <span>Cleaned Valid Records</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-emerald-700">10,000</div>
          <div className="text-[11px] text-slate-500 mt-1">100% verified &amp; complete</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium mb-1">
            <span>Total Anomaly Remediations</span>
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-slate-900">315</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 6 anomaly categories</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-medium mb-1">
            <span>Pre/Post Mean Shift</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-bold font-mono tabular-nums text-indigo-700">&lt; 0.02 units</div>
          <div className="text-[11px] text-slate-500 mt-1">Zero statistical distortion</div>
        </div>
      </div>

      {/* Subtab: Missing & Outlier Visual Diagnostics */}
      {selectedAuditTab === 'visuals' && (
        <DataQualityVisuals analyticsResults={analyticsResults} />
      )}

      {/* Subtab 1: Anomaly Audit Table */}
      {selectedAuditTab === 'overview' && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900">
              Injected Data Quality Defects &amp; Remediation Audit Trail
            </h2>
            <span className="text-xs text-slate-500 font-mono">Status: 100% Cleaned</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium font-mono text-[11px]">
                  <th className="py-2.5 px-3">Quality Issue Category</th>
                  <th className="py-2.5 px-3 text-center">Injected Count</th>
                  <th className="py-2.5 px-3 text-center">Treated Count</th>
                  <th className="py-2.5 px-3">Remediation Protocol / Code</th>
                  <th className="py-2.5 px-3 text-center">Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {anomalies.map((a, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{a.title}</td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-amber-700">{a.injected}</td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums text-emerald-700">{a.treated}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{a.method}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Comparison Side-by-Side */}
      {selectedAuditTab === 'comparison' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-rose-50/30 border border-rose-200 rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Raw Record Example (With Injected Defects)
              </span>
              <span className="text-[11px] font-mono text-rose-700">Row #120</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between bg-white/70 p-2 rounded border border-rose-100">
                <span className="text-slate-500">Student_ID:</span>
                <span className="font-semibold text-slate-900">STU_90120</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-rose-100">
                <span className="text-slate-500">Primary_Platform:</span>
                <span className="font-bold text-rose-700">" tik tok " (Messy casing &amp; spaces)</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-rose-100">
                <span className="text-slate-500">Daily_Screen_Time_Hours:</span>
                <span className="font-bold text-rose-700">26.5 hrs (Physically impossible &gt;24h)</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-rose-100">
                <span className="text-slate-500">GPA:</span>
                <span className="font-bold text-rose-700">null / empty (Missing value)</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-rose-100">
                <span className="text-slate-500">Gender:</span>
                <span className="font-bold text-rose-700">"female" (Inconsistent lowercase)</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-rose-100">
                <span className="text-slate-500">Derived Business Columns:</span>
                <span className="text-slate-400">None (Raw schema only)</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/30 border border-emerald-200 rounded-lg p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Cleaned &amp; Enriched Record (Post-Pipeline)
              </span>
              <span className="text-[11px] font-mono text-emerald-700">Row #120</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between bg-white/70 p-2 rounded border border-emerald-100">
                <span className="text-slate-500">Student_ID:</span>
                <span className="font-semibold text-slate-900">STU_90120</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-emerald-100">
                <span className="text-slate-500">Primary_Platform:</span>
                <span className="font-bold text-emerald-700">TikTok (Clean canonical name)</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-emerald-100">
                <span className="text-slate-500">Daily_Screen_Time_Hours:</span>
                <span className="font-bold text-emerald-700">10.2 hrs (Imputed via Level median)</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-emerald-100">
                <span className="text-slate-500">GPA:</span>
                <span className="font-bold text-emerald-700">3.61 (Imputed via Level median)</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-emerald-100">
                <span className="text-slate-500">Gender:</span>
                <span className="font-bold text-emerald-700">Female (Standardized title case)</span>
              </div>
              <div className="flex justify-between bg-white/70 p-2 rounded border border-emerald-100">
                <span className="text-slate-500">Derived Business Columns:</span>
                <span className="font-semibold text-emerald-700">Distinction, High Usage, Balanced</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: 7-Stage Workflow Details */}
      {selectedAuditTab === 'workflow' && (
        <div className="space-y-3">
          {workflowSteps.map(step => (
            <div key={step.step} className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-[11px] font-bold">
                  {step.step}
                </span>
                <h3 className="text-xs font-bold text-slate-900">{step.title}</h3>
              </div>
              <div className="bg-slate-950 text-slate-200 font-mono text-[11px] p-2 rounded overflow-x-auto">
                <code>{step.code}</code>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                <strong>Analytical Rationale:</strong> {step.reason}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
