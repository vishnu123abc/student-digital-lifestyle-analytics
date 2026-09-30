# Business Intelligence Dashboard Specification
## Student Digital Lifestyle & Academic Performance Analytics

---

## 1. Dashboard Architecture Overview

The BI solution is engineered as an executive decision-support system structured into 3 analytical tiers:
1. **Executive Overview (Strategic):** High-level summary of academic outcomes, digital saturation, sleep deficits, and cross-metric correlations.
2. **Digital Behavior Analysis (Operational):** Deep dive into app preferences, usage volume, late-night patterns, and notification loads.
3. **Student Performance & Wellbeing (Diagnostic):** Detailed triage across study consistency, stress scores, student segments, and risk indicators.

---

## 2. KPI Framework & Measurement Logic

| KPI Name | Formula / Calculation | Business Meaning | Target / Healthy Benchmark | Recommended Visualization | Available Slicers |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Total Enrolled Sample** | `COUNT(Student_ID)` | Size of the analyzed student body | 10,000 students | Single-value metric card | All dimensions |
| **Average GPA** | `AVG(GPA)` | Overall academic outcome metric | >= 3.50 (4.0 scale) | Metric card with Sparkline | Level, Course, Platform |
| **Average Daily Screen Time** | `AVG(Daily_Screen_Time_Hours)` | Cumulative screen exposure across devices | < 7.0 hrs/day | Metric card with warning delta | Gender, Level, Platform |
| **Average Social Media Usage** | `AVG(Daily_Social_Media_Hours)`| Non-academic leisure social browsing | < 4.0 hrs/day | Metric card | Platform, Age Group |
| **Average Study Hours** | `AVG(Study_Hours_Per_Day)` | Focused independent study volume | >= 4.0 hrs/day | Metric card with benchmark | Course, Year of Study |
| **Average Sleep Hours** | `AVG(Sleep_Hours)` | Sleep duration health indicator | >= 7.0 hrs/night | Metric card with status tint | Late-Night, Usage Cat |
| **Average Perceived Stress** | `AVG(Perceived_Stress_Score)` | Self-reported psychometric stress (1-10)| <= 4.0 / 10 | Metric card with gauge | Segment, Platform |
| **Distinction Student %** | `(COUNT(GPA >= 3.6) / Total) * 100` | Proportion of top academic performers | >= 40.0% | Donut chart / % KPI | Course, Academic Level |
| **High Digital Usage %** | `(COUNT(Social >= 5.5h) / Total) * 100`| Proportion in high/severe digital tiers | < 30.0% | Percentage badge | Platform, City |
| **Late-Night Device %** | `(COUNT(Late_Night = True) / Total) * 100`| Students browsing before bed | < 25.0% | Metric card with alert icon | Platform, Usage Cat |
| **Digital Wellbeing Index** | `AVG(Digital_Wellbeing_Score)` | Composite equilibrium metric (0-100) | >= 70 / 100 | Half-radial progress arc | Segment, Course |
| **Student Productivity Index**| `AVG(Productivity_Score)` | Study and activity output score (0-100) | >= 80 / 100 | Metric card | Habit Cat, Academic Level |

---

## 3. Detailed Page Layout Specifications

### Page 1: Executive Overview
- **Header Row:**
  - 6 Metric Cards: Total Students (10,000), Avg GPA (3.58), Avg Screen Time (10.2h), Avg Study Hours (3.6h), Avg Sleep Hours (4.8h), Avg Stress Score (4.7/10).
- **Primary Grid (2 columns):**
  - *Left Chart:* **Average GPA by Digital Usage Category** (Bar chart: Low [3.80], Moderate [3.68], High [3.51], Severe [3.24]). Demonstrates clear downward gradient.
  - *Right Chart:* **Academic Performance Band Distribution** (Column chart: Distinction [53.6%], High Merit [35.9%], Merit [9.6%], Pass [1.0%]).
- **Secondary Grid (2 columns):**
  - *Left Chart:* **Screen Time vs. GPA Correlation Bins** (Area/Column chart demonstrating GPA progression across screen brackets).
  - *Right Chart:* **Sleep Hours vs. Stress by Digital Usage** (Dual-axis / combo column chart linking decreased sleep to increased stress).

### Page 2: Digital Behavior Analysis
- **Top Row Metrics:**
  - Most Popular Platform: Instagram (29.1%) & TikTok (27.8%).
  - Peak Usage Platform: TikTok (6.0h avg daily social media).
  - Late-Night Prevalence: 43.3% overall.
- **Visuals:**
  - *Chart 1:* **Social Media Hours & Screen Time by Platform** (Horizontal ranked bar chart).
  - *Chart 2:* **Daily Screen Time Distribution** (Histogram with normal density curve overlay).
  - *Chart 3:* **Late-Night Usage Rate by Primary Platform** (Column chart comparing % late-night users across TikTok, Instagram, YouTube, etc.).
  - *Chart 4:* **Push Notifications vs. Daily Screen Time** (Scatter plot with trend line showing attention fragmentation).
  - *Chart 5:* **Average Screen Time by City / Metro Area** (Ranked bar chart highlighting Toronto [10.4h], Seattle [10.3h], Chicago [10.2h]).
  - *Chart 6:* **Social Comparison Frequency Breakdown** (Stacked bar linking comparison frequency to mean stress score).

### Page 3: Student Performance & Wellbeing
- **Top Row Metrics:**
  - Distinction Rate: 53.6%.
  - Average Study Consistency: 6.8/10.
  - Average Productivity Score: 83.1/100.
- **Visuals:**
  - *Chart 1:* **GPA Distribution Histogram** (Bins 1.8–4.0 with mean 3.58 reference line).
  - *Chart 2:* **Study Hours vs. GPA** (Scatter / regression plot illustrating positive returns to study effort).
  - *Chart 3:* **Study Consistency vs. GPA by Performance Tier** (Heatmap / bar chart showing consistency outperforming raw hours).
  - *Chart 4:* **Student Engagement Segment Profiles** (4-card comparative matrix showing Highly Engaged vs Balanced vs Digital Heavy vs Disengaged).
  - *Chart 5:* **Productivity Score vs. Digital Wellbeing Score** (Quadrant scatter chart separating high-performing balanced students from burnout candidates).
  - *Chart 6:* **Course Breakdown by Study Hours & Attendance** (Ranked dual-metric chart highlighting Nursing and Data Science).

---

## 4. Interactive Slicers & Global Filter Controls

The dashboard provides synchronized cross-filtering across:
1. **Gender:** Female, Male, Non-Binary, Prefer not to say
2. **Academic Level:** High School, Undergraduate, Postgraduate
3. **Primary Platform:** Instagram, TikTok, YouTube, Reddit, Snapchat, LinkedIn, X
4. **Digital Usage Category:** Low (<3h), Moderate (3–5.4h), High (5.5–7.9h), Severe (>=8h)
5. **Academic Performance Band:** Distinction, High Merit, Merit, Pass, At Risk
6. **Student Segment:** Highly Engaged, Balanced Learner, Digital Heavy, Disengaged
7. **Late-Night Usage Toggle:** All / Late-Night Only / Non-Late Night
8. **City / State Dropdown:** 10 metropolitan hubs
