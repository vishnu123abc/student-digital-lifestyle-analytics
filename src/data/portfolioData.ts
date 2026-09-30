export const RESUME_BULLETS = [
  "Architected an end-to-end Student Digital Lifestyle & Academic Analytics platform, generating and analyzing 10,000 synthetic records across 32 behavioral, wellbeing, and academic variables using Python (Pandas, NumPy) and SQL.",
  "Designed a robust 7-stage data cleaning pipeline in Python, handling 1.5% injected nulls via median imputation, deduplicating records, eliminating out-of-bounds outliers, and standardizing messy categorical inputs with zero distribution drift.",
  "Engineered 20+ production SQL business queries utilizing CTEs, window functions (NTILE, DENSE_RANK, SUM OVER), and multi-criteria segmentation to model academic risk and evaluate digital consumption gradients.",
  "Developed an interactive 3-page BI executive dashboard featuring real-time multi-dimensional slicers, 12 core KPIs, and statistical visualizations that identified a 0.56 GPA gap between low and severe digital users.",
  "Conducted inferential statistical modeling including One-Way ANOVA (p < 0.001) and multivariate OLS regression (R² = 0.442), delivering actionable retention recommendations while rigorously separating correlation from causation."
];

export const LINKEDIN_POST = `🚀 Excited to share my latest End-to-End Data Analytics Portfolio Project:

📊 Student Digital Lifestyle & Academic Performance Analytics
How do screen time, social media habits, sleep hygiene, and study routines intersect with student academic performance?

To explore this, I architected a comprehensive analytics study analyzing 10,000 synthetic student records across 10 major metropolitan areas.

💡 Key Analytical Insights:
• The Digital Gradient: Students in the low digital usage tier (<3 hrs/day) average 3.80 GPA vs. 3.24 GPA in the severe tier (>=8 hrs/day)—a 0.56 GPA differential.
• Sleep Displacement: Each 2-hour increase in daily screen time corresponds to a 0.62-hour decrease in nocturnal sleep (r = -0.626).
• Protective Habit Factor: Study consistency (r = +0.626 with GPA) out-predicts raw study hours (r = +0.544). Students with disciplined study habits maintain high GPAs even with moderate screen exposure.
• Crucial Causal Distinction: Observational patterns reveal strong statistical associations, but screen time alone does not prove causation—study consistency and sleep debt serve as primary mediators.

🛠️ Technical Stack:
• Data Engineering: Synthetic generation, 7-stage automated cleaning pipeline (Pandas, NumPy)
• SQL Analytics: 20+ analytical queries using Window Functions, CTEs, Ranking, and Deciles
• Statistical Rigor: ANOVA testing (p < 0.001), Pearson correlation matrix, Multivariate OLS Regression
• BI Dashboard: 3-page interactive decision dashboard with real-time cohort slicers and KPI scorecards

Check out the full repository and live dashboard below! Feedback is warmly welcome. 💬

#DataAnalytics #Python #SQL #DataScience #DataCleaning #DataStorytelling #BusinessIntelligence #AnalyticsPortfolio #Pandas`;

export const GITHUB_FOLDER_STRUCTURE = `student-digital-lifestyle-analytics/
├── data/
│   ├── raw/
│   │   └── student_digital_lifestyle_raw.csv         # 10,015 records with injected data quality issues
│   ├── cleaned/
│   │   └── student_digital_lifestyle_cleaned.csv     # 10,000 validated & cleaned records with derived metrics
├── python/
│   ├── data_cleaning.py                             # 7-stage automated cleaning & validation pipeline
│   ├── eda.py                                       # Exploratory data analysis, distributions & ANOVA tests
│   └── analysis.py                                  # OLS regression modeling & K-Means clustering
├── sql/
│   ├── schema.sql                                   # DDL schema definition with checks & indices
│   ├── data_quality.sql                             # SQL validation queries for nulls, duplicates & bounds
│   ├── business_questions.sql                       # 20 business questions answered in ANSI SQL
│   └── advanced_analysis.sql                        # Advanced window functions, percentiles & cohort math
├── dashboard/
│   └── dashboard_design.md                          # BI dashboard specification & KPI dictionary
├── reports/
│   ├── executive_summary.md                         # Detailed executive report with calculated findings
│   └── data_dictionary.md                           # Complete 32-column business data dictionary
├── notebooks/
│   └── exploratory_analysis.ipynb                   # Executable Jupyter notebook with plots & stats
├── README.md                                        # Production-grade GitHub repository documentation
└── requirements.txt                                 # Python dependencies (pandas, scipy, seaborn, etc.)`;
