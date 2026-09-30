# Student Digital Lifestyle & Academic Performance Analytics
### An End-to-End Enterprise Data Analytics Portfolio Project

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)](https://www.python.org/)
[![Pandas](https://img.shields.io/badge/Pandas-2.0%2B-150458?logo=pandas)](https://pandas.pydata.org/)
[![SQL](https://img.shields.io/badge/SQL-ANSI%20Standard-orange?logo=postgresql)](https://www.postgresql.org/)
[![Status](https://img.shields.io/badge/Dataset-10%2C000%20Records%20(Cleaned)-success)](#dataset-description)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Project Overview
This project presents an end-to-end, industry-grade Data Analyst portfolio study investigating the complex empirical relationships between **digital media behavior**, **sleep hygiene**, **study consistency**, and **academic performance** (GPA on a 4.0 scale).

Analyzing a synthetic population of **10,000 students** across 10 major metropolitan centers, the project models how excessive leisure screen time and late-night device habits intersect with cognitive fatigue and academic outcomes—while methodologically separating statistical correlation from direct causation.

---

## 🎯 Business Problem & Objectives
Modern educational institutions face escalating retention challenges linked to digital distraction and mental exhaustion. Key objectives of this analysis include:
1. **Quantifying the Digital Gradient:** Evaluating how GPA, sleep, and stress vary across discrete digital usage tiers (Low, Moderate, High, Severe).
2. **Identifying Protective Factors:** Examining how study consistency and assignment completion buffer against high screen time.
3. **Behavioral Cohort Stratification:** Segmenting the student body into 4 actionable operational profiles (Highly Engaged, Balanced Learners, Digital Heavy, Disengaged).
4. **Early-Warning Risk Modeling:** Supplying university advisory departments with automated SQL queries to detect students entering the *High Cumulative Risk* threshold before academic probation.

---

## 📊 Dataset Description
- **Clean Population Size:** 10,000 unique verified records.
- **Raw Injected Anomalies:** 10,015 records featuring 1.5% missing values, 15 duplicate collisions, 25 out-of-bounds outliers, and casing/whitespace inconsistencies.
- **Dimensionality:** 32 comprehensive columns spanning:
  - *Demographics:* Student ID, Age (15–28), Gender, City, State, Academic Level, Course, Year of Study.
  - *Digital Habits:* Primary Platform, Daily Social Media Hours, Weekend Hours, Daily Screen Time, Push Notifications, Active Accounts, Late-Night Usage, Screen Pickups.
  - *Study Metrics:* Study Hours/Day, Classes Attended %, Assignment Completion %, Study Consistency Score (1–10), Online Learning Hours.
  - *Wellbeing:* Sleep Hours, Sleep Quality (1–5), Physical Activity Hours/Week, Perceived Stress (1–10), Social Comparison Frequency, Digital Detox Days.
  - *Performance:* Internal Marks %, Assignment Avg %, Exam Score %, Attendance %, Cumulative GPA (1.85–4.00), Performance Band.
  - *Derived Business KPIs:* Digital Usage Category, Study Habit Category, Sleep Category, Engagement Segment, Risk Segment, Productivity Score, Digital Wellbeing Score.

---

## 🛠️ Tools & Technologies
- **Data Engineering & Cleaning:** Python 3.10+, Pandas, NumPy
- **Relational Analytics:** ANSI SQL (PostgreSQL / Snowflake dialect), CTEs, Window Functions (`NTILE`, `DENSE_RANK`, `SUM OVER`)
- **Statistical Modeling:** SciPy, Statsmodels (OLS Multivariate Regression), Scikit-Learn (K-Means Clustering)
- **Data Visualization:** Matplotlib, Seaborn, Recharts, Tailwind CSS
- **Interactive Application:** React 19, TypeScript, Vite

---

## 🧹 7-Stage Data Cleaning Pipeline (`python/data_cleaning.py`)
1. **Ingestion & Data Quality Audit:** Automated null and duplicate count verification.
2. **String Normalization:** Whitespace trimming and canonical casing for messy inputs (`tik tok` $\rightarrow$ `TikTok`, `female` $\rightarrow$ `Female`).
3. **Entity Deduplication:** Exact and primary-key collision removal keeping first chronological occurrence.
4. **Domain Range Validation:** Coercion of impossible physical values (Screen Time > 24h, Attendance > 100%) to `NaN`.
5. **Subgroup Median Imputation:** Non-skewing median imputation partitioned by Academic Level.
6. **Feature Engineering:** Calculation of categorical tiers and normalized 0–100 composite scores.
7. **Post-Cleaning Distribution Audit:** Verification of mean shift $< 0.02$ to ensure zero statistical drift.

---

## 📈 Key Empirical Findings (From Exact Calculated Data)
- **The 0.56 GPA Spread:** Students in the *Low* digital usage tier (<3 hrs/day) average **3.80 GPA**, compared to **3.68** for *Moderate*, **3.51** for *High*, and **3.24** for *Severe* (>=8 hrs/day).
- **Sleep Displacement:** Each 2-hour increase in daily screen time corresponds to a **0.62-hour decrease** in nocturnal sleep ($r = -0.626$). Extreme screen users average only 4.4 hours of sleep.
- **The Study Consistency Protective Factor:** Study consistency ($r = +0.626$ with GPA) out-predicts raw study duration ($r = +0.544$). Consistent study habits allow students with high screen time to maintain high GPAs.
- **Platform Differentials:** TikTok and Instagram account for 56.9% of primary usage, averaging 6.0h and 5.9h daily with 47% and 43% late-night usage rates. LinkedIn and Reddit users average 4.0h and 4.9h daily with higher mean GPAs (3.67 and 3.64).
- **Causality Disclaimer:** Results denote significant statistical associations. Screen time is often mediated by sleep deprivation and stress rather than being a solitary causal agent.

---

## 💻 SQL Analysis Highlights (`sql/business_questions.sql`)
The project includes **20 production-grade SQL queries** designed for enterprise decision making:
- **Query 1:** GPA and stress gradients across digital usage categories.
- **Query 3:** Platform usage ranking vs. academic ranking using `RANK() OVER()`.
- **Query 8:** Metropolitan screen time dense ranking via `DENSE_RANK()`.
- **Query 12:** Decile trajectory analysis utilizing `NTILE(10)`.
- **Query 16:** Resilient outlier analysis isolating high-screen students with Distinction GPAs.
- **Query 20:** Operational triage roster identifying students in the *High Cumulative Risk* segment.

---

## 🖥️ Interactive BI Dashboard Architecture
Organized into 3 dedicated pages:
1. **Executive Overview:** 6 KPI scorecards, GPA by usage category bar chart, Performance band distribution, Screen Time vs GPA regression bins.
2. **Digital Behavior Analysis:** Platform usage comparison, screen time distribution histogram, late-night usage analysis, notification burden scatter plot.
3. **Student Performance & Wellbeing:** GPA distribution, study consistency impact, 4-quadrant segment profiling, and departmental engagement rankings.

---

## 🚀 How to Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/username/student-digital-lifestyle-analytics.git
cd student-digital-lifestyle-analytics

# 2. Set up Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Run data generation and cleaning
python python/data_cleaning.py

# 4. Run exploratory data analysis and statistical testing
python python/eda.py

# 5. Run regression and clustering models
python python/analysis.py
```

---

## 👤 Author
**Senior Data Analyst & Analytics Engineer**  
*Specializing in Product Analytics, Business Intelligence & Statistical Storytelling.*
