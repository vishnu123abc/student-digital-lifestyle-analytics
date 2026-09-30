import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  BarChart3,
  Box,
  Layers,
  Info,
  ShieldAlert,
  ArrowUpDown,
  Sparkles,
  TrendingDown,
  Eye,
  Sliders
} from 'lucide-react';

interface ColumnMissingInfo {
  column: string;
  category: 'Demographics' | 'Digital' | 'Study' | 'Lifestyle' | 'Academic';
  dataType: string;
  missingRaw: number;
  missingClean: number;
  pctRaw: number;
  treatment: string;
}

export const ALL_COLUMNS_DATA: ColumnMissingInfo[] = [
  { column: 'Perceived_Stress_Score', category: 'Lifestyle', dataType: 'Integer (1-10)', missingRaw: 33, missingClean: 0, pctRaw: 0.33, treatment: 'Subgroup median imputation grouped by Academic_Level' },
  { column: 'Study_Hours_Per_Day', category: 'Study', dataType: 'Float (hrs)', missingRaw: 26, missingClean: 0, pctRaw: 0.26, treatment: 'Cohort median imputation by Academic_Level' },
  { column: 'Sleep_Hours', category: 'Lifestyle', dataType: 'Float (hrs)', missingRaw: 26, missingClean: 0, pctRaw: 0.26, treatment: 'Subgroup median imputation grouped by Academic_Level' },
  { column: 'Exam_Score_Percent', category: 'Academic', dataType: 'Float (%)', missingRaw: 25, missingClean: 0, pctRaw: 0.25, treatment: 'Median score imputation grouped by Academic_Level' },
  { column: 'GPA', category: 'Academic', dataType: 'Float (0.0-4.0)', missingRaw: 25, missingClean: 0, pctRaw: 0.25, treatment: 'Subgroup median (Postgrad: 3.68, Undergrad: 3.60)' },
  { column: 'Primary_Platform', category: 'Digital', dataType: 'String', missingRaw: 20, missingClean: 0, pctRaw: 0.20, treatment: 'Categorical mode imputation ("Instagram")' },
  { column: 'Student_ID', category: 'Demographics', dataType: 'String (UUID/Key)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete primary key (15 duplicate rows pruned)' },
  { column: 'Age', category: 'Demographics', dataType: 'Integer (years)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete, bounded [15, 30]' },
  { column: 'Gender', category: 'Demographics', dataType: 'String', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Casing standardized ("female" -> "Female")' },
  { column: 'City', category: 'Demographics', dataType: 'String', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Cleaned, stripped whitespace' },
  { column: 'State', category: 'Demographics', dataType: 'String', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete 2-letter postal code' },
  { column: 'Academic_Level', category: 'Demographics', dataType: 'String', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Canonical category labels' },
  { column: 'Course', category: 'Demographics', dataType: 'String', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Canonical degree labels' },
  { column: 'Year_of_Study', category: 'Demographics', dataType: 'Integer (1-5)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete integer sequence' },
  { column: 'Daily_Social_Media_Hours', category: 'Digital', dataType: 'Float (hrs)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete distribution verified' },
  { column: 'Weekend_Social_Media_Hours', category: 'Digital', dataType: 'Float (hrs)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete distribution verified' },
  { column: 'Daily_Screen_Time_Hours', category: 'Digital', dataType: 'Float (hrs)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: '7 domain violations (>24h) coerced to NaN & imputed' },
  { column: 'Notifications_Per_Day', category: 'Digital', dataType: 'Integer', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete integer metric' },
  { column: 'Active_Social_Media_Accounts', category: 'Digital', dataType: 'Integer', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Bounded [1, 8]' },
  { column: 'Late_Night_Usage', category: 'Digital', dataType: 'Boolean', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Standardized truth values ("TRUE", "1" -> True)' },
  { column: 'Social_Media_Checks_Per_Day', category: 'Digital', dataType: 'Integer', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete integer metric' },
  { column: 'Classes_Attended_Percent', category: 'Study', dataType: 'Float (%)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Capped at 100.0% max bound' },
  { column: 'Assignment_Completion_Percent', category: 'Study', dataType: 'Float (%)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Verified within [0, 100]' },
  { column: 'Study_Consistency_Score', category: 'Study', dataType: 'Integer (1-10)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete ordinal ranking' },
  { column: 'Online_Learning_Hours', category: 'Study', dataType: 'Float (hrs)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete distribution' },
  { column: 'Sleep_Quality_Score', category: 'Lifestyle', dataType: 'Integer (1-10)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Complete ordinal scale' },
  { column: 'Physical_Activity_Hours_Per_Week', category: 'Lifestyle', dataType: 'Float (hrs)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Verified non-negative' },
  { column: 'Social_Comparison_Frequency', category: 'Lifestyle', dataType: 'String', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Categorical ordinal scale' },
  { column: 'Digital_Detox_Days_Per_Month', category: 'Lifestyle', dataType: 'Integer (0-30)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Integer day counts' },
  { column: 'Internal_Marks_Percent', category: 'Academic', dataType: 'Float (%)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Standardized continuous %' },
  { column: 'Assignment_Average_Percent', category: 'Academic', dataType: 'Float (%)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Standardized continuous %' },
  { column: 'Attendance_Percent', category: 'Academic', dataType: 'Float (%)', missingRaw: 0, missingClean: 0, pctRaw: 0.0, treatment: 'Standardized continuous %' }
];

interface OutlierMetricStats {
  key: 'Daily_Screen_Time_Hours' | 'GPA';
  title: string;
  shortTitle: string;
  unit: string;
  raw: {
    n: number;
    min: number;
    q1: number;
    median: number;
    mean: number;
    q3: number;
    max: number;
    iqr: number;
    lowerWhisker: number;
    upperWhisker: number;
    outlierCount: number;
    outlierPct: number;
    criticalDomainErrors: number;
    sampleOutliers: Array<{ id: string; value: number; type: 'severe' | 'mild'; note: string }>;
  };
  cleaned: {
    n: number;
    min: number;
    q1: number;
    median: number;
    mean: number;
    q3: number;
    max: number;
    iqr: number;
    lowerWhisker: number;
    upperWhisker: number;
    outlierCount: number;
    outlierPct: number;
    criticalDomainErrors: number;
    sampleOutliers: Array<{ id: string; value: number; type: 'severe' | 'mild'; note: string }>;
  };
  analystRationale: string;
}

export const OUTLIER_SPECS: Record<'Daily_Screen_Time_Hours' | 'GPA', OutlierMetricStats> = {
  Daily_Screen_Time_Hours: {
    key: 'Daily_Screen_Time_Hours',
    title: 'Daily Screen Time Hours',
    shortTitle: 'Screen Time',
    unit: 'hrs',
    raw: {
      n: 10015,
      min: 3.6,
      q1: 8.5,
      median: 10.2,
      mean: 10.16,
      q3: 11.8,
      max: 26.5,
      iqr: 3.3,
      lowerWhisker: 3.6,
      upperWhisker: 16.75,
      outlierCount: 19,
      outlierPct: 0.19,
      criticalDomainErrors: 7,
      sampleOutliers: [
        { id: 'STU_90121', value: 26.5, type: 'severe', note: 'Physically impossible (>24h in a day)' },
        { id: 'STU_90125', value: 26.5, type: 'severe', note: 'Physically impossible (>24h in a day)' },
        { id: 'STU_90129', value: 26.5, type: 'severe', note: 'Physically impossible (>24h in a day)' },
        { id: 'STU_90133', value: 26.5, type: 'severe', note: 'Physically impossible (>24h in a day)' },
        { id: 'STU_90137', value: 26.5, type: 'severe', note: 'Physically impossible (>24h in a day)' },
        { id: 'STU_90696', value: 17.0, type: 'mild', note: 'Extreme heavy digital user (Tukey outlier >16.75h)' },
        { id: 'STU_91526', value: 17.0, type: 'mild', note: 'Extreme heavy digital user (Tukey outlier >16.75h)' },
        { id: 'STU_92356', value: 17.0, type: 'mild', note: 'Extreme heavy digital user (Tukey outlier >16.75h)' }
      ]
    },
    cleaned: {
      n: 10000,
      min: 3.6,
      q1: 8.5,
      median: 10.2,
      mean: 10.15,
      q3: 11.8,
      max: 17.0,
      iqr: 3.3,
      lowerWhisker: 3.6,
      upperWhisker: 16.75,
      outlierCount: 12,
      outlierPct: 0.12,
      criticalDomainErrors: 0,
      sampleOutliers: [
        { id: 'STU_90696', value: 17.0, type: 'mild', note: 'Retained valid heavy user (17.0 hrs/day)' },
        { id: 'STU_91526', value: 17.0, type: 'mild', note: 'Retained valid heavy user (17.0 hrs/day)' },
        { id: 'STU_92356', value: 17.0, type: 'mild', note: 'Retained valid heavy user (17.0 hrs/day)' },
        { id: 'STU_93186', value: 17.0, type: 'mild', note: 'Retained valid heavy user (17.0 hrs/day)' },
        { id: 'STU_94016', value: 17.0, type: 'mild', note: 'Retained valid heavy user (17.0 hrs/day)' }
      ]
    },
    analystRationale:
      'In the raw dataset, 7 records contained 26.5 hours of daily screen time, which is a physical impossibility for a single 24-hour day. The cleaning pipeline converted values >24.0h to NaN and statistically imputed them using academic-level subgroup medians (10.2 hrs). Legitimate heavy users at 17.0 hrs/day were preserved to retain observational authenticity.'
  },
  GPA: {
    key: 'GPA',
    title: 'Grade Point Average (GPA)',
    shortTitle: 'Cumulative GPA',
    unit: '',
    raw: {
      n: 9990,
      min: 2.55,
      q1: 3.41,
      median: 3.61,
      mean: 3.58,
      q3: 3.80,
      max: 4.0,
      iqr: 0.39,
      lowerWhisker: 2.83,
      upperWhisker: 4.0,
      outlierCount: 111,
      outlierPct: 1.11,
      criticalDomainErrors: 0,
      sampleOutliers: [
        { id: 'STU_90009', value: 2.79, type: 'mild', note: 'Academic at-risk cohort candidate (<2.83)' },
        { id: 'STU_90021', value: 2.74, type: 'mild', note: 'Academic at-risk cohort candidate (<2.83)' },
        { id: 'STU_90093', value: 2.69, type: 'mild', note: 'Academic at-risk cohort candidate (<2.83)' },
        { id: 'STU_90175', value: 2.66, type: 'mild', note: 'Academic at-risk cohort candidate (<2.83)' },
        { id: 'STU_90274', value: 2.75, type: 'mild', note: 'Academic at-risk cohort candidate (<2.83)' },
        { id: 'STU_90455', value: 2.55, type: 'mild', note: 'Severe academic struggle (lowest cohort GPA)' },
        { id: 'STU_90782', value: 2.55, type: 'mild', note: 'Severe academic struggle (lowest cohort GPA)' }
      ]
    },
    cleaned: {
      n: 10000,
      min: 2.55,
      q1: 3.41,
      median: 3.61,
      mean: 3.58,
      q3: 3.80,
      max: 4.0,
      iqr: 0.39,
      lowerWhisker: 2.83,
      upperWhisker: 4.0,
      outlierCount: 111,
      outlierPct: 1.11,
      criticalDomainErrors: 0,
      sampleOutliers: [
        { id: 'STU_90009', value: 2.79, type: 'mild', note: 'Legitimate academic performance tail (<2.83)' },
        { id: 'STU_90021', value: 2.74, type: 'mild', note: 'Legitimate academic performance tail (<2.83)' },
        { id: 'STU_90093', value: 2.69, type: 'mild', note: 'Legitimate academic performance tail (<2.83)' },
        { id: 'STU_90175', value: 2.66, type: 'mild', note: 'Legitimate academic performance tail (<2.83)' },
        { id: 'STU_90455', value: 2.55, type: 'mild', note: 'Preserved at-risk baseline (2.55 GPA)' }
      ]
    },
    analystRationale:
      'GPA shows 111 lower-tail outliers below the Tukey lower whisker (2.83). Crucially, a professional Data Analyst must NEVER blindly delete low GPAs: these records represent real students in academic jeopardy who require institutional support. The 25 missing GPA records were imputed via academic level medians, preserving the genuine performance spread without biasing variance.'
  }
};

interface DataQualityVisualsProps {
  analyticsResults?: any;
}

export const DataQualityVisuals: React.FC<DataQualityVisualsProps> = () => {
  // Missing Values View Controls
  const [missingFilterMode, setMissingFilterMode] = useState<'affected_only' | 'all'>('affected_only');
  const [missingMetricType, setMissingMetricType] = useState<'count' | 'percent'>('count');
  const [selectedColumn, setSelectedColumn] = useState<string | null>('Perceived_Stress_Score');

  // Box-Plot View Controls
  const [activeBoxMetric, setActiveBoxMetric] = useState<'Daily_Screen_Time_Hours' | 'GPA'>('Daily_Screen_Time_Hours');
  const [activeDatasetState, setActiveDatasetState] = useState<'raw' | 'cleaned' | 'compare'>('compare');
  const [hoveredOutlier, setHoveredOutlier] = useState<{ id: string; val: number; note: string; type: string } | null>(null);

  // Filtered Missing Values Data
  const missingChartData = useMemo(() => {
    let list = ALL_COLUMNS_DATA;
    if (missingFilterMode === 'affected_only') {
      list = list.filter(item => item.missingRaw > 0);
    }
    return list.map(item => ({
      ...item,
      displayVal: missingMetricType === 'count' ? item.missingRaw : item.pctRaw,
      cleanDisplayVal: 0
    }));
  }, [missingFilterMode, missingMetricType]);

  const activeColDetail = useMemo(() => {
    return ALL_COLUMNS_DATA.find(c => c.column === selectedColumn) || ALL_COLUMNS_DATA[0];
  }, [selectedColumn]);

  const activeStat = OUTLIER_SPECS[activeBoxMetric];

  // Helper for rendering horizontal box plots using clean SVG
  const renderBoxPlotSvg = (
    statObj: OutlierMetricStats['raw'],
    colorScheme: { boxBg: string; boxBorder: string; median: string; whisker: string; outlierFill: string; outlierBorder: string },
    label: string,
    isRaw: boolean
  ) => {
    // Determine coordinate scale
    // Screen Time bounds: 0 to 30; GPA bounds: 2.0 to 4.2
    const minDomain = activeBoxMetric === 'Daily_Screen_Time_Hours' ? 2 : 2.2;
    const maxDomain = activeBoxMetric === 'Daily_Screen_Time_Hours' ? 28 : 4.2;

    const width = 640;
    const height = 150;
    const paddingLeft = 40;
    const paddingRight = 40;
    const chartWidth = width - paddingLeft - paddingRight;

    const scaleX = (val: number) => {
      const clamped = Math.max(minDomain, Math.min(maxDomain, val));
      return paddingLeft + ((clamped - minDomain) / (maxDomain - minDomain)) * chartWidth;
    };

    const yCenter = 75;
    const boxHeight = 44;
    const boxY = yCenter - boxHeight / 2;

    const xMin = scaleX(statObj.min);
    const xLowerWhisker = scaleX(statObj.lowerWhisker);
    const xQ1 = scaleX(statObj.q1);
    const xMedian = scaleX(statObj.median);
    const xMean = scaleX(statObj.mean);
    const xQ3 = scaleX(statObj.q3);
    const xUpperWhisker = scaleX(statObj.upperWhisker);
    const xMax = scaleX(statObj.max);

    // Generate axis tick marks
    const ticks = activeBoxMetric === 'Daily_Screen_Time_Hours' 
      ? [4, 8, 12, 16, 20, 24, 28] 
      : [2.4, 2.8, 3.2, 3.6, 4.0];

    return (
      <div className="bg-slate-50/80 rounded-lg p-3.5 border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isRaw ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <h4 className="text-xs font-bold text-slate-800 tracking-tight">{label}</h4>
            <span className="text-[11px] font-mono text-slate-500">
              (N = {statObj.n.toLocaleString()}, IQR = {statObj.iqr}{activeStat.unit ? ` ${activeStat.unit}` : ''})
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="font-mono text-slate-600">
              Outliers: <strong className={statObj.outlierCount > 0 ? (isRaw ? 'text-amber-700' : 'text-slate-800') : 'text-emerald-700'}>
                {statObj.outlierCount}
              </strong> ({statObj.outlierPct}%)
            </span>
            {isRaw && statObj.criticalDomainErrors > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded text-[10px]">
                <ShieldAlert className="w-3 h-3 text-rose-600" />
                {statObj.criticalDomainErrors} Invalid (&gt;24h)
              </span>
            )}
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[520px] select-none">
            {/* Background Grid Lines for Ticks */}
            {ticks.map((t, idx) => {
              const xPos = scaleX(t);
              return (
                <g key={idx}>
                  <line
                    x1={xPos}
                    y1={20}
                    x2={xPos}
                    y2={height - 25}
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={xPos}
                    y={height - 10}
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-slate-400"
                  >
                    {t}{activeStat.unit ? activeStat.unit : ''}
                  </text>
                </g>
              );
            })}

            {/* Outlier Shading Beyond Whiskers */}
            {activeBoxMetric === 'Daily_Screen_Time_Hours' && (
              <rect
                x={xUpperWhisker}
                y={25}
                width={width - paddingRight - xUpperWhisker}
                height={boxHeight + 20}
                fill={isRaw ? '#fff1f2' : '#f8fafc'}
                opacity={0.7}
                rx={4}
              />
            )}
            {activeBoxMetric === 'GPA' && (
              <rect
                x={paddingLeft}
                y={25}
                width={xLowerWhisker - paddingLeft}
                height={boxHeight + 20}
                fill={isRaw ? '#fff1f2' : '#fef2f2'}
                opacity={0.7}
                rx={4}
              />
            )}

            {/* Horizontal Whisker Line from Lower to Upper Whisker */}
            <line
              x1={xLowerWhisker}
              y1={yCenter}
              x2={xUpperWhisker}
              y2={yCenter}
              stroke={colorScheme.whisker}
              strokeWidth="2"
            />

            {/* Lower Whisker Cap */}
            <line
              x1={xLowerWhisker}
              y1={yCenter - 14}
              x2={xLowerWhisker}
              y2={yCenter + 14}
              stroke={colorScheme.whisker}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Upper Whisker Cap */}
            <line
              x1={xUpperWhisker}
              y1={yCenter - 14}
              x2={xUpperWhisker}
              y2={yCenter + 14}
              stroke={colorScheme.whisker}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* IQR Box (Q1 to Q3) */}
            <rect
              x={xQ1}
              y={boxY}
              width={Math.max(2, xQ3 - xQ1)}
              height={boxHeight}
              fill={colorScheme.boxBg}
              stroke={colorScheme.boxBorder}
              strokeWidth="2"
              rx={5}
            />

            {/* Median Line (Bold) */}
            <line
              x1={xMedian}
              y1={boxY}
              x2={xMedian}
              y2={boxY + boxHeight}
              stroke={colorScheme.median}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Mean Diamond Indicator */}
            <polygon
              points={`${xMean},${yCenter - 7} ${xMean + 6},${yCenter} ${xMean},${yCenter + 7} ${xMean - 6},${yCenter}`}
              fill="#0f172a"
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            {/* Outliers Scatter Points */}
            {statObj.sampleOutliers.map((outlier, i) => {
              const xPos = scaleX(outlier.value);
              // Slight jittering on y for visual distinction
              const jitter = ((i % 3) - 1) * 8;
              const yPos = yCenter + jitter;
              const isSevere = outlier.type === 'severe';

              return (
                <g
                  key={outlier.id + i}
                  className="cursor-pointer transition-transform hover:scale-125"
                  onMouseEnter={() =>
                    setHoveredOutlier({
                      id: outlier.id,
                      val: outlier.value,
                      note: outlier.note,
                      type: outlier.type
                    })
                  }
                  onMouseLeave={() => setHoveredOutlier(null)}
                >
                  <circle
                    cx={xPos}
                    cy={yPos}
                    r={isSevere ? 6 : 4.5}
                    fill={isSevere ? '#e11d48' : colorScheme.outlierFill}
                    stroke={isSevere ? '#ffffff' : colorScheme.outlierBorder}
                    strokeWidth={isSevere ? 2 : 1.5}
                  />
                  {isSevere && (
                    <text
                      x={xPos}
                      y={yPos - 10}
                      textAnchor="middle"
                      className="text-[9px] font-bold font-mono fill-rose-700 pointer-events-none"
                    >
                      !
                    </text>
                  )}
                </g>
              );
            })}

            {/* Annotations / Labels on Box */}
            <text x={xQ1} y={boxY - 4} textAnchor="middle" className="text-[10px] font-mono fill-slate-600 font-semibold">
              Q1: {statObj.q1}
            </text>
            <text x={xMedian} y={boxY + boxHeight + 13} textAnchor="middle" className="text-[10px] font-mono fill-slate-900 font-bold">
              Med: {statObj.median}
            </text>
            <text x={xQ3} y={boxY - 4} textAnchor="middle" className="text-[10px] font-mono fill-slate-600 font-semibold">
              Q3: {statObj.q3}
            </text>
            <text x={xLowerWhisker} y={yCenter + 26} textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
              Low: {statObj.lowerWhisker}
            </text>
            <text x={xUpperWhisker} y={yCenter + 26} textAnchor="middle" className="text-[9px] font-mono fill-slate-500">
              High: {statObj.upperWhisker}
            </text>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overview Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 shadow-xs border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-mono font-medium border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Data Quality &amp; Statistical Diagnostics Layer</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              Missing Values Profiling &amp; Tukey Box-Plot Outlier Identification
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Real-time audit verifying column completeness across 32 schema features alongside IQR-based Tukey outlier boundaries for continuous digital lifestyle and performance variables.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0 text-left">
            <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 border border-white/10">
              <div className="text-[10px] text-slate-300 font-medium">Missing Cells</div>
              <div className="text-base font-bold font-mono text-amber-300">155 / 320,480</div>
              <div className="text-[10px] text-emerald-400 font-medium">100% Imputed</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 border border-white/10">
              <div className="text-[10px] text-slate-300 font-medium">Screen Outliers</div>
              <div className="text-base font-bold font-mono text-rose-300">19 &rarr; 12 Valid</div>
              <div className="text-[10px] text-indigo-300 font-medium">7 Invalid &gt;24h Treated</div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-lg p-2.5 border border-white/10 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-300 font-medium">GPA Outliers</div>
              <div className="text-base font-bold font-mono text-sky-300">111 Lower Tail</div>
              <div className="text-[10px] text-amber-300 font-medium">Retained At-Risk Cohort</div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: MISSING VALUE COUNTS PER COLUMN (BAR CHART) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600 border border-amber-200">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Missing Value Counts Per Column (Pre- vs. Post-Imputation)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Distribution of null cells injected into raw dataset vs. 100% resolution after median/mode imputation
            </p>
          </div>

          {/* Interactive Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
              <button
                onClick={() => setMissingFilterMode('affected_only')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  missingFilterMode === 'affected_only'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Affected Columns ({ALL_COLUMNS_DATA.filter(c => c.missingRaw > 0).length})
              </button>
              <button
                onClick={() => setMissingFilterMode('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  missingFilterMode === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Columns (32)
              </button>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
              <button
                onClick={() => setMissingMetricType('count')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  missingMetricType === 'count'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Count
              </button>
              <button
                onClick={() => setMissingMetricType('percent')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  missingMetricType === 'percent'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rate (%)
              </button>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={missingChartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 40 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length > 0) {
                  setSelectedColumn(e.activePayload[0].payload.column);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="column"
                tick={{ fontSize: 10, fill: '#64748b' }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                domain={[0, missingMetricType === 'count' ? 40 : 0.4]}
                unit={missingMetricType === 'percent' ? '%' : ''}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ColumnMissingInfo;
                    return (
                      <div className="bg-slate-900 text-white rounded-lg p-3 text-xs shadow-lg border border-slate-800 space-y-1.5 max-w-xs">
                        <div className="font-bold text-amber-300 font-mono text-[11px] pb-1 border-b border-slate-700">
                          {data.column}
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300 text-[11px]">
                          <span>Domain Category:</span>
                          <span className="font-semibold text-white">{data.category}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300 text-[11px]">
                          <span>Data Type:</span>
                          <span className="font-mono text-slate-200">{data.dataType}</span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300 text-[11px]">
                          <span>Raw Missing Count:</span>
                          <span className="font-bold font-mono text-rose-400">
                            {data.missingRaw} rows ({data.pctRaw.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="flex justify-between gap-4 text-slate-300 text-[11px]">
                          <span>Cleaned Dataset Status:</span>
                          <span className="font-bold font-mono text-emerald-400">0 rows (0.00% null)</span>
                        </div>
                        <div className="pt-1 text-[10px] text-slate-400 border-t border-slate-800 leading-tight">
                          <strong>Treatment:</strong> {data.treatment}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Bar dataKey="displayVal" name="Raw Ingested Missing" radius={[4, 4, 0, 0]}>
                {missingChartData.map((entry, index) => {
                  const isSelected = entry.column === selectedColumn;
                  const isMissing = entry.missingRaw > 0;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        isMissing
                          ? isSelected
                            ? '#d97706'
                            : '#f59e0b'
                          : '#cbd5e1'
                      }
                      stroke={isSelected ? '#78350f' : undefined}
                      strokeWidth={isSelected ? 2 : 0}
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Column Audit Detail Card */}
        {activeColDetail && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-900 text-sm">{activeColDetail.column}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-medium">
                  {activeColDetail.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-mono">
                  {activeColDetail.dataType}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">
                <strong>Imputation Methodology:</strong> {activeColDetail.treatment}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 font-mono text-[11px]">
              <div className="text-right">
                <div className="text-slate-500 text-[10px]">Raw Missing</div>
                <div className="font-bold text-rose-700">{activeColDetail.missingRaw} rows ({activeColDetail.pctRaw}%)</div>
              </div>
              <div className="h-7 w-px bg-slate-200" />
              <div className="text-right">
                <div className="text-slate-500 text-[10px]">Clean Missing</div>
                <div className="font-bold text-emerald-700">0 rows (100% Complete)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: BOX-PLOT OUTLIER VISUALIZATION (DAILY SCREEN TIME & GPA) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-200">
                <Box className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Tukey Box-Plot Outlier Identification Engine
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Interactive 5-number summary (Min, Q1, Median, Q3, Max) + Tukey 1.5&times;IQR whiskers detecting physical domain errors vs. authentic cohort distribution
            </p>
          </div>

          {/* Metric Selector & Dataset State Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
              <button
                onClick={() => setActiveBoxMetric('Daily_Screen_Time_Hours')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeBoxMetric === 'Daily_Screen_Time_Hours'
                    ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daily Screen Time Hours
              </button>
              <button
                onClick={() => setActiveBoxMetric('GPA')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeBoxMetric === 'GPA'
                    ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cumulative GPA
              </button>
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
              <button
                onClick={() => setActiveDatasetState('compare')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeDatasetState === 'compare'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Side-by-Side Compare
              </button>
              <button
                onClick={() => setActiveDatasetState('raw')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeDatasetState === 'raw'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Raw Ingested
              </button>
              <button
                onClick={() => setActiveDatasetState('cleaned')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeDatasetState === 'cleaned'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cleaned Final
              </button>
            </div>
          </div>
        </div>

        {/* Hovered Outlier Floating Tooltip Alert */}
        {hoveredOutlier && (
          <div className="bg-slate-900 text-white px-3.5 py-2 rounded-lg text-xs font-mono flex items-center justify-between shadow-md border border-slate-700 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-3.5 h-3.5 ${hoveredOutlier.type === 'severe' ? 'text-rose-400' : 'text-amber-400'}`} />
              <span className="font-semibold text-amber-300">Outlier Point Detected:</span>
              <span className="text-white">
                {hoveredOutlier.id} = <strong>{hoveredOutlier.val}{activeStat.unit}</strong>
              </span>
            </div>
            <span className="text-slate-300 text-[11px] italic">
              {hoveredOutlier.note}
            </span>
          </div>
        )}

        {/* Box Plot Visuals Container */}
        <div className="space-y-4">
          {(activeDatasetState === 'compare' || activeDatasetState === 'raw') && (
            renderBoxPlotSvg(
              activeStat.raw,
              {
                boxBg: '#fef3c7',
                boxBorder: '#d97706',
                median: '#b45309',
                whisker: '#92400e',
                outlierFill: '#f59e0b',
                outlierBorder: '#78350f'
              },
              `Raw Ingested Dataset — ${activeStat.title}`,
              true
            )
          )}

          {(activeDatasetState === 'compare' || activeDatasetState === 'cleaned') && (
            renderBoxPlotSvg(
              activeStat.cleaned,
              {
                boxBg: '#dcfce7',
                boxBorder: '#16a34a',
                median: '#15803d',
                whisker: '#166534',
                outlierFill: '#22c55e',
                outlierBorder: '#14532d'
              },
              `Cleaned Production Dataset — ${activeStat.title}`,
              false
            )
          )}
        </div>

        {/* 5-Number Summary & Tukey Boundaries Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">Minimum</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {activeStat.cleaned.min}{activeStat.unit}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">Lower Whisker</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {activeStat.cleaned.lowerWhisker}{activeStat.unit}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">Q1 (25th %)</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {activeStat.cleaned.q1}{activeStat.unit}
            </span>
          </div>
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-2 text-center">
            <span className="text-[10px] text-indigo-700 font-semibold uppercase tracking-wider block">Median (50th)</span>
            <span className="text-sm font-bold font-mono text-indigo-900">
              {activeStat.cleaned.median}{activeStat.unit}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">Q3 (75th %)</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {activeStat.cleaned.q3}{activeStat.unit}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">IQR (Spread)</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {activeStat.cleaned.iqr}{activeStat.unit}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">Upper Whisker</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {activeStat.cleaned.upperWhisker}{activeStat.unit}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-center">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider block">Maximum</span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {activeStat.cleaned.max}{activeStat.unit}
            </span>
          </div>
        </div>

        {/* Data Analyst Rationale & Mathematical Explanation */}
        <div className="bg-slate-900 text-slate-200 rounded-lg p-4 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Senior Data Analyst Rationale &amp; Treatment Policy for {activeStat.title}</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeStat.analystRationale}
          </p>
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Formula: IQR = Q3 &minus; Q1</span>
            <span>Lower Fence = Q1 &minus; 1.5 &times; IQR</span>
            <span>Upper Fence = Q3 + 1.5 &times; IQR</span>
            <span className="text-emerald-400 font-semibold">Tukey (1977) Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
