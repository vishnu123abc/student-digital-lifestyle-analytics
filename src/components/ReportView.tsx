import React from 'react';
import { 
  FileText, 
  AlertCircle, 
  Lightbulb, 
  CheckCircle, 
  ShieldAlert, 
  Compass, 
  Award,
  Layers,
  BookOpen
} from 'lucide-react';

interface ReportViewProps {
  analyticsResults: any;
}

export const ReportView: React.FC<ReportViewProps> = ({ analyticsResults }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Executive Analytics Story &amp; Institutional Report
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Comprehensive data storytelling, empirical findings, causal boundaries, and strategic recommendations
        </p>
      </div>

      {/* Critical Scientific Boundary Box */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-4 shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
          <ShieldAlert className="w-4 h-4 text-amber-700" />
          <span>Core Methodological Distinction: Association vs. Causation</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Important Analytical Note:</strong> The findings presented in this portfolio report reflect cross-sectional observational patterns. The data indicates that <em>"students in this segment show..."</em> and that <em>"an association is observed between..."</em>. This dataset does <strong>NOT</strong> prove direct biological or psychological causation, nor does it claim that social media single-handedly causes academic degradation. Further controlled longitudinal research is required to establish directional causality.
        </p>
      </div>

      {/* Section 1: Executive Summary */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileText className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">1. Executive Overview</h2>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">
          Across the analyzed cohort of 10,000 synthetic student observations, the average GPA stands at <strong>3.58</strong> (Median: 3.61, Std Dev: 0.28). Students report an average of <strong>10.2 hours of daily screen time</strong>, with leisure social media consuming <strong>5.5 hours/day</strong>. Crucially, nocturnal sleep averages only <strong>4.8 hours per night</strong>, with <strong>43.3%</strong> of students engaging in late-night device habits within 45 minutes of bedtime.
        </p>
        <p className="text-xs text-slate-700 leading-relaxed">
          The analysis identifies a noticeable gradient: students categorized under <strong>Low digital usage (&lt;3 hrs/day)</strong> achieve an average GPA of <strong>3.80</strong>, while students in the <strong>Severe digital usage category (&gt;=8 hrs/day)</strong> average <strong>3.24 GPA</strong>—a persistent gap of 0.56 grade points.
        </p>
      </div>

      {/* Section 2: Key Empirical Patterns */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Compass className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">2. Key Empirical Findings (Strictly Calculated)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="border border-slate-200 rounded-md p-3.5 space-y-1 bg-slate-50/50">
            <span className="font-bold text-slate-900 block">The Digital Usage Gradient</span>
            <p className="text-slate-600 leading-relaxed">
              • Low Usage (&lt;3h/day): <strong>3.80 GPA</strong>, 5.7h sleep, 2.6/10 stress<br/>
              • Moderate Usage (3-5.4h/day): <strong>3.68 GPA</strong>, 5.0h sleep, 4.2/10 stress<br/>
              • High Usage (5.5-7.9h/day): <strong>3.51 GPA</strong>, 4.5h sleep, 5.4/10 stress<br/>
              • Severe Usage (&gt;=8h/day): <strong>3.24 GPA</strong>, 4.0h sleep, 6.5/10 stress
            </p>
          </div>

          <div className="border border-slate-200 rounded-md p-3.5 space-y-1 bg-slate-50/50">
            <span className="font-bold text-slate-900 block">The Sleep Displacement Mechanism</span>
            <p className="text-slate-600 leading-relaxed">
              Nocturnal sleep is strongly inversely associated with daily screen time (Pearson r = <strong>-0.626</strong>). For each additional 2 hours of daily screen exposure, sleep drops by an estimated 0.62 hours. Students exceeding 10 hours of screen time average only 4.4 hours of sleep.
            </p>
          </div>

          <div className="border border-slate-200 rounded-md p-3.5 space-y-1 bg-slate-50/50">
            <span className="font-bold text-slate-900 block">Study Consistency as the Primary Protective Anchor</span>
            <p className="text-slate-600 leading-relaxed">
              Study consistency (Pearson r = <strong>+0.626</strong>) demonstrates a stronger association with GPA than raw study hours (r = +0.544). Even within the High digital usage tier, students who maintain highly consistent schedules maintain a 3.75+ GPA.
            </p>
          </div>

          <div className="border border-slate-200 rounded-md p-3.5 space-y-1 bg-slate-50/50">
            <span className="font-bold text-slate-900 block">Platform-Specific Habits &amp; Comparison Strain</span>
            <p className="text-slate-600 leading-relaxed">
              TikTok (6.0h) and Instagram (5.9h) lead daily social consumption. Students reporting 'Always' engaging in social comparison exhibit higher stress (5.5/10) and lower GPA (3.45) compared to those who 'Never' compare feeds (3.6/10 stress, 3.71 GPA).
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Student Segmentation Architecture */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">3. Operational Cohort Segmentation</h2>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 border-l-2 border-emerald-500 bg-slate-50 rounded-r">
            <strong className="text-slate-900">1. Highly Engaged Scholars (13.4% of population | N = 1,340):</strong>
            <p className="text-slate-600 mt-0.5">
              Characterized by high independent study effort (5.2 hrs/day), superior consistency (8.8/10), and disciplined screen exposure (8.6 hrs). Average GPA: <strong>3.81</strong>. Productivity score: <strong>98.9/100</strong>.
            </p>
          </div>

          <div className="p-3 border-l-2 border-blue-500 bg-slate-50 rounded-r">
            <strong className="text-slate-900">2. Balanced Digital Learners (76.6% of population | N = 7,655):</strong>
            <p className="text-slate-600 mt-0.5">
              The dominant mainstream majority. Balances 3.5 hrs/day study with 10.1 hrs/day screen time. Average GPA: <strong>3.59</strong>. Resilient but sensitive to pre-exam sleep disruptions.
            </p>
          </div>

          <div className="p-3 border-l-2 border-rose-500 bg-slate-50 rounded-r">
            <strong className="text-slate-900">3. Digital Heavy / High Risk (9.7% of population | N = 970):</strong>
            <p className="text-slate-600 mt-0.5">
              Features extreme screen time (12.6 hrs/day), depressed study hours (1.8 hrs/day), and acute sleep deficits (4.2 hrs). Average GPA: <strong>3.25</strong>. Digital wellbeing score drops to <strong>41.5/100</strong>.
            </p>
          </div>

          <div className="p-3 border-l-2 border-amber-500 bg-slate-50 rounded-r">
            <strong className="text-slate-900">4. Disengaged Learners (0.4% of population | N = 35):</strong>
            <p className="text-slate-600 mt-0.5">
              Exhibits critical attendance dips (&lt;70%) and poor coursework submission rates (&lt;65%). Represents students at risk of administrative disenrollment.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Data Limitations */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-2">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <AlertCircle className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900">4. Analytical &amp; Data Limitations</h2>
        </div>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
          <li><strong>Cross-Sectional Structure:</strong> Observations capture a single aggregated snapshot; longitudinal progression cannot be tracked.</li>
          <li><strong>Self-Reported Telemetry:</strong> Screen hours are based on self-reported survey recalls rather than automated OS-level daemon tracking.</li>
          <li><strong>Synthetic Simulation Constraints:</strong> While mathematically grounded with realistic covariance and Gaussian noise, synthetic cohorts cannot encapsulate complex real-world socioeconomic distress.</li>
        </ul>
      </div>

      {/* Section 5: Strategic Institutional Recommendations */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <h2 className="text-sm font-bold text-slate-900">5. Strategic Business &amp; Educational Recommendations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="border border-slate-200 rounded-md p-3 space-y-1">
            <span className="font-bold text-slate-900">1. Digital Sunset Programs</span>
            <p className="text-slate-600 leading-relaxed">
              Introduce campus-wide digital hygiene nudges encouraging offline buffers 45 minutes prior to sleep to mitigate late-night sleep latency.
            </p>
          </div>

          <div className="border border-slate-200 rounded-md p-3 space-y-1">
            <span className="font-bold text-slate-900">2. Consistency Over Cramming</span>
            <p className="text-slate-600 leading-relaxed">
              Because study consistency (r = +0.626) out-predicts total study duration, academic centers should train students in daily spaced-repetition routines.
            </p>
          </div>

          <div className="border border-slate-200 rounded-md p-3 space-y-1">
            <span className="font-bold text-slate-900">3. Retention Advisory Triage</span>
            <p className="text-slate-600 leading-relaxed">
              Deploy automated SQL alerts (Query #20) to flag the 7.8% of students exhibiting concurrent low GPA, severe screen time, and chronic sleep debt before midterms.
            </p>
          </div>

          <div className="border border-slate-200 rounded-md p-3 space-y-1">
            <span className="font-bold text-slate-900">4. Algorithmic App Awareness</span>
            <p className="text-slate-600 leading-relaxed">
              Orientation modules should focus on passive short-form video consumption (TikTok, Instagram) where students report highest involuntary time loss.
            </p>
          </div>

          <div className="border border-slate-200 rounded-md p-3 space-y-1">
            <span className="font-bold text-slate-900">5. Physical Activity Integration</span>
            <p className="text-slate-600 leading-relaxed">
              Campus recreational centers should provide structured exercise breaks; active students report 0.9–1.3 points lower perceived stress across all screen tiers.
            </p>
          </div>

          <div className="border border-slate-200 rounded-md p-3 space-y-1">
            <span className="font-bold text-slate-900">6. Constructive Campus Policy</span>
            <p className="text-slate-600 leading-relaxed">
              Avoid punitive Wi-Fi bans. Constructive interventions (time-management tutoring and mental wellness counseling) yield superior student retention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
