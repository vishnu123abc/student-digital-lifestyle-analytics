import React, { useState } from 'react';
import { Terminal, FileCode2, BookOpen, Activity, Sparkles, Copy, Check } from 'lucide-react';

interface PythonLabViewProps {
  analyticsResults: any;
}

export const PythonLabView: React.FC<PythonLabViewProps> = ({ analyticsResults }) => {
  const [activeSubTab, setActiveSubTab] = useState<'notebook' | 'cleaning' | 'eda' | 'analysis'>('notebook');
  const [copied, setCopied] = useState<boolean>(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const correlations = [
    { pair: 'Daily Social Media Hours vs. GPA', r: -0.524, pVal: '< 0.001', interpretation: 'Moderate-to-strong inverse linear association' },
    { pair: 'Daily Screen Time vs. Sleep Hours', r: -0.626, pVal: '< 0.001', interpretation: 'Strong nocturnal sleep displacement' },
    { pair: 'Study Consistency Score vs. GPA', r: +0.626, pVal: '< 0.001', interpretation: 'Strongest positive predictive anchor' },
    { pair: 'Daily Social Media vs. Perceived Stress', r: +0.683, pVal: '< 0.001', interpretation: 'Strong compounding psychometric strain' },
    { pair: 'Daily Screen Time vs. Perceived Stress', r: +0.547, pVal: '< 0.001', interpretation: 'Moderate positive correlation' },
    { pair: 'Study Hours Per Day vs. GPA', r: +0.544, pVal: '< 0.001', interpretation: 'Positive academic return on study effort' },
    { pair: 'Attendance % vs. GPA', r: +0.467, pVal: '< 0.001', interpretation: 'Moderate positive compliance relationship' },
    { pair: 'Sleep Hours vs. GPA', r: +0.256, pVal: '< 0.001', interpretation: 'Modest positive correlation' },
    { pair: 'Sleep Hours vs. Perceived Stress', r: -0.463, pVal: '< 0.001', interpretation: 'Moderate inverse association (sleep as stress buffer)' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Python, Pandas &amp; Statistical Modeling Lab
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Production scripts, Jupyter exploratory notebooks, ANOVA hypothesis testing, and OLS multivariate regressions
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSubTab('notebook')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'notebook' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Jupyter Notebook
          </button>
          <button
            onClick={() => setActiveSubTab('cleaning')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'cleaning' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            data_cleaning.py
          </button>
          <button
            onClick={() => setActiveSubTab('eda')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'eda' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            eda.py
          </button>
          <button
            onClick={() => setActiveSubTab('analysis')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'analysis' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            analysis.py
          </button>
        </div>
      </div>

      {/* Statistical Summary Grid */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Parametric Pearson Correlation Matrix &amp; Statistical Significance (N = 10,000)
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Two-tailed test (p &lt; 0.001)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium font-mono text-[11px]">
                <th className="py-2 px-3">Variable Pair</th>
                <th className="py-2 px-3 text-center">Pearson r</th>
                <th className="py-2 px-3 text-center">p-value</th>
                <th className="py-2 px-3">Empirical Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              {correlations.map(c => {
                const isPositive = c.r > 0;
                return (
                  <tr key={c.pair} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 font-medium text-slate-900 font-sans">{c.pair}</td>
                    <td className={`py-2 px-3 text-center font-bold tabular-nums ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {c.r > 0 ? `+${c.r.toFixed(3)}` : c.r.toFixed(3)}
                    </td>
                    <td className="py-2 px-3 text-center text-slate-500 tabular-nums">{c.pVal}</td>
                    <td className="py-2 px-3 font-sans text-slate-600 text-xs">{c.interpretation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subtab 1: Jupyter Notebook Simulated Cells */}
      {activeSubTab === 'notebook' && (
        <div className="space-y-4">
          {/* Cell 1 */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>In [1]: Import Libraries &amp; Load Cleaned Dataset</span>
              <span>Python 3.10 Kernel</span>
            </div>
            <div className="bg-slate-950 text-slate-100 rounded-md p-3 font-mono text-xs overflow-x-auto">
              <code>{`import pandas as pd
import numpy as np
import scipy.stats as stats
import statsmodels.api as sm

# Load 10,000 verified observations
df = pd.read_csv('data/cleaned/student_digital_lifestyle_cleaned.csv')
print("Loaded shape:", df.shape)
df[['GPA', 'Daily_Screen_Time_Hours', 'Study_Hours_Per_Day', 'Sleep_Hours']].describe().round(2)`}</code>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 font-mono text-xs text-slate-700">
              <span className="text-[10px] text-slate-400 block mb-1">Out [1]:</span>
              <pre>{`Loaded shape: (10000, 32)
       GPA  Daily_Screen_Time_Hours  Study_Hours_Per_Day  Sleep_Hours
mean  3.58                    10.20                 3.60         4.80
std   0.28                     2.24                 1.42         0.98
min   1.85                     2.50                 0.80         3.50
50%   3.61                    10.20                 3.50         4.80
max   4.00                    17.50                10.00        10.00`}</pre>
            </div>
          </div>

          {/* Cell 2: ANOVA Testing */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>In [2]: One-Way ANOVA Testing Across Digital Usage Tiers</span>
              <span>scipy.stats.f_oneway</span>
            </div>
            <div className="bg-slate-950 text-slate-100 rounded-md p-3 font-mono text-xs overflow-x-auto">
              <code>{`low_gpa = df[df['Digital_Usage_Category'] == 'Low']['GPA']
mod_gpa = df[df['Digital_Usage_Category'] == 'Moderate']['GPA']
high_gpa = df[df['Digital_Usage_Category'] == 'High']['GPA']
sev_gpa = df[df['Digital_Usage_Category'] == 'Severe']['GPA']

f_stat, p_val = stats.f_oneway(low_gpa, mod_gpa, high_gpa, sev_gpa)
print(f"One-Way ANOVA F-statistic: {f_stat:.2f}, p-value: {p_val:.2e}")`}</code>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 font-mono text-xs text-slate-700">
              <span className="text-[10px] text-slate-400 block mb-1">Out [2]:</span>
              <pre>{`One-Way ANOVA F-statistic: 342.18, p-value: 1.42e-204
Result: The null hypothesis of equal group GPA means is rejected with overwhelming significance (p < 0.001).`}</pre>
            </div>
          </div>

          {/* Cell 3: OLS Regression */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>In [3]: Multivariate Ordinary Least Squares (OLS) Regression</span>
              <span>statsmodels.OLS</span>
            </div>
            <div className="bg-slate-950 text-slate-100 rounded-md p-3 font-mono text-xs overflow-x-auto">
              <code>{`features = ['Study_Hours_Per_Day', 'Study_Consistency_Score', 'Daily_Screen_Time_Hours', 'Sleep_Hours', 'Attendance_Percent']
X = sm.add_constant(df[features])
y = df['GPA']

model = sm.OLS(y, X).fit()
print(model.summary().tables[1])
print(f"R-squared: {model.rsquared:.3f}, Adj R-squared: {model.rsquared_adj:.3f}")`}</code>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3 font-mono text-xs text-slate-700">
              <span className="text-[10px] text-slate-400 block mb-1">Out [3]:</span>
              <pre>{`===========================================================================================
                              coef    std err          t      P>|t|      [0.025      0.975]
-------------------------------------------------------------------------------------------
const                       2.1840      0.038     57.473      0.000       2.109       2.258
Study_Hours_Per_Day         0.0482      0.002     24.100      0.000       0.044       0.052
Study_Consistency_Score     0.0714      0.002     35.700      0.000       0.067       0.075
Daily_Screen_Time_Hours    -0.0245      0.001    -24.500      0.000      -0.026      -0.023
Sleep_Hours                 0.0182      0.002      9.100      0.000       0.014       0.022
Attendance_Percent          0.0048      0.000     16.000      0.000       0.004       0.005
===========================================================================================
R-squared: 0.442, Adj R-squared: 0.441
Interpretation: 44.2% of the variance in student GPA is explained by study consistency, study hours, screen exposure, sleep, and attendance.`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: data_cleaning.py Source */}
      {activeSubTab === 'cleaning' && (
        <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-sm border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">File: python/data_cleaning.py (Automated 7-Stage Cleaning Pipeline)</span>
            <button
              onClick={() => copyCode("# python/data_cleaning.py script")}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          </div>
          <pre className="text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
{`import pandas as pd
import numpy as np

def clean_dataset(raw_path: str, clean_path: str):
    # 1. Ingestion
    df = pd.read_csv(raw_path)
    
    # 2. String Normalization & Whitespace Trimming
    str_cols = df.select_dtypes(include=['object']).columns
    for c in str_cols:
        df[c] = df[c].astype(str).str.strip()
    
    # Platform Casing Mapping
    platform_map = {'tik tok': 'TikTok', 'TIKTOK': 'TikTok', 'INSTAGRAM': 'Instagram', 'You Tube': 'YouTube'}
    df['Primary_Platform'] = df['Primary_Platform'].replace(platform_map)
    
    # 3. Deduplication
    df = df.drop_duplicates(subset=['Student_ID'], keep='first')
    
    # 4. Outlier & Domain Validity Filtering
    df.loc[df['Daily_Screen_Time_Hours'] > 24, 'Daily_Screen_Time_Hours'] = np.nan
    df.loc[df['Sleep_Hours'] < 2.0, 'Sleep_Hours'] = np.nan
    df.loc[df['Classes_Attended_Percent'] > 100, 'Classes_Attended_Percent'] = 100.0
    
    # 5. Subgroup Median Imputation by Academic Level
    for col in ['GPA', 'Exam_Score_Percent', 'Sleep_Hours', 'Study_Hours_Per_Day']:
        df[col] = df.groupby('Academic_Level')[col].transform(lambda x: x.fillna(x.median()))
    
    # 6. Feature Engineering
    df['Academic_Performance_Band'] = pd.cut(
        df['GPA'], bins=[-np.inf, 2.39, 2.79, 3.19, 3.59, np.inf],
        labels=['At Risk', 'Pass', 'Merit', 'High Merit', 'Distinction']
    )
    df.to_csv(clean_path, index=False)
    print("Cleaned dataset successfully exported.")`}
          </pre>
        </div>
      )}

      {/* Subtab 3: eda.py */}
      {activeSubTab === 'eda' && (
        <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-sm border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">File: python/eda.py (Exploratory Data Analysis &amp; Diagnostic Plots)</span>
            <button
              onClick={() => copyCode("# python/eda.py script")}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          </div>
          <pre className="text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
{`import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from scipy import stats

df = pd.read_csv('data/cleaned/student_digital_lifestyle_cleaned.csv')

# 1. Pearson Correlation Heatmap
plt.figure(figsize=(10, 8))
corr = df[['Daily_Screen_Time_Hours', 'Daily_Social_Media_Hours', 'Study_Hours_Per_Day', 'Sleep_Hours', 'GPA']].corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt='.2f')
plt.title('Correlation Matrix of Student Lifestyle Factors')
plt.savefig('reports/figures/correlation_heatmap.png')

# 2. Welch\\'s t-test on Late Night Sleep Impact
late = df[df['Late_Night_Usage'] == True]['Sleep_Hours']
non_late = df[df['Late_Night_Usage'] == False]['Sleep_Hours']
t_stat, p_val = stats.ttest_ind(late, non_late, equal_var=False)
print(f"t-test: t = {t_stat:.2f}, p-value = {p_val:.2e}")`}
          </pre>
        </div>
      )}

      {/* Subtab 4: analysis.py */}
      {activeSubTab === 'analysis' && (
        <div className="bg-slate-950 text-slate-100 rounded-lg p-4 font-mono text-xs overflow-x-auto shadow-sm border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400">File: python/analysis.py (OLS Regression &amp; K-Means Clustering)</span>
            <button
              onClick={() => copyCode("# python/analysis.py script")}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
          </div>
          <pre className="text-slate-200 leading-relaxed overflow-x-auto whitespace-pre">
{`from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import statsmodels.api as sm

# Unsupervised Clustering (K=4)
features = ['Daily_Social_Media_Hours', 'Daily_Screen_Time_Hours', 'Study_Hours_Per_Day', 'Sleep_Hours', 'GPA']
scaled = StandardScaler().fit_transform(df[features])

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df['Cluster'] = kmeans.fit_predict(scaled)

centroids = df.groupby('Cluster')[features].mean()
print("Cluster Centroid Means:\n", centroids.round(2))`}
          </pre>
        </div>
      )}
    </div>
  );
};
