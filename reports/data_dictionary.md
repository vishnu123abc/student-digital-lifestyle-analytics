# Data Dictionary: Student Digital Lifestyle & Academic Performance Analytics

**Dataset Status:** Synthetic Educational & Lifestyle Analytics Dataset  
**Record Count:** 10,000 unique records (Cleaned) / 10,015 records (Raw)  
**Primary Key:** `Student_ID`  
**License:** Open Portfolio Dataset  
**Cautionary Note:** Synthetic dataset created for analytical benchmarking and statistical portfolio demonstrations. Not intended for clinical or psychiatric diagnoses; strictly demonstrates exploratory associations, not medical causation.

---

## 1. Demographic Attributes

| Column Name | Data Type | Business Meaning | Example Value | Allowed Range / Format | Raw or Derived | Potential Analytical Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Student_ID` | VARCHAR(16) | Unique alphanumeric identifier for each enrolled student record | `STU_90042` | `STU_90001` to `STU_100000` | Raw | Primary entity key; join key for multi-table cohort tracking |
| `Age` | INTEGER | Age of the student at the time of survey response | `19` | 15 – 28 years | Raw | Age cohort segmentation; generation gap analysis |
| `Gender` | VARCHAR(24) | Self-identified gender identity | `Female` | `Female`, `Male`, `Non-Binary`, `Prefer not to say` | Raw | Demographic fairness audits; subgroup behavioral variance |
| `City` | VARCHAR(40) | Metro area where student resides or attends campus | `Seattle` | 10 surveyed urban centers | Raw | Geographic clustering; regional infrastructure comparison |
| `State` | VARCHAR(10) | State or administrative region code | `WA` | Standard 2–3 letter codes | Raw | State-level policy and regional grouping |
| `Academic_Level` | VARCHAR(32) | Current educational milestone of the student | `Undergraduate` | `High School`, `Undergraduate`, `Postgraduate` | Raw | Cohort comparison across academic maturity levels |
| `Course` | VARCHAR(48) | Primary field of study or declared major | `Computer Science` | 10 standardized university disciplines | Raw | Workload vs screen habits across technical & humanities majors |
| `Year_of_Study` | INTEGER | Academic progression year within current level | `2` | 1 – 4 | Raw | Transition pressure analysis (Freshman vs Senior) |

---

## 2. Digital Behavior Metrics

| Column Name | Data Type | Business Meaning | Example Value | Allowed Range / Format | Raw or Derived | Potential Analytical Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Primary_Platform` | VARCHAR(32) | Social media platform with highest daily engagement time | `Instagram` | Instagram, TikTok, YouTube, Reddit, Snapchat, LinkedIn, X | Raw | Platform-specific lifestyle associations and user profile profiling |
| `Daily_Social_Media_Hours`| DECIMAL(4,1) | Average hours spent daily browsing or posting on social networks | `5.5` | 0.5 – 14.0 hours | Raw | Core independent variable for digital consumption analysis |
| `Weekend_Social_Media_Hours`| DECIMAL(4,1)| Estimated social media consumption on Saturday/Sunday | `7.2` | 0.5 – 16.0 hours | Raw | Weekend surge modeling and schedule elasticity |
| `Daily_Screen_Time_Hours` | DECIMAL(4,1) | Total daily exposure across phones, laptops, and tablets | `10.2` | 2.0 – 18.0 hours | Raw | Total digital saturation metric; sleep displacement research |
| `Notifications_Per_Day` | INTEGER | Push notifications received across all synchronized apps daily | `172` | 20 – 350 notifications | Raw | Cognitive fragmentation and continuous partial attention proxy |
| `Active_Social_Media_Accounts`| INTEGER | Number of distinct accounts logged into regularly | `4` | 1 – 8 accounts | Raw | Context-switching overhead and online footprint breadth |
| `Late_Night_Usage` | BOOLEAN | Whether device is actively used within 45 mins of bedtime | `TRUE` | `TRUE` / `FALSE` | Raw | Circadian rhythm disruption and sleep latency factor |
| `Social_Media_Checks_Per_Day`| INTEGER | Discrete phone pickups / feed refreshes performed daily | `64` | 10 – 130 checks | Raw | Compulsive habit tracking; micro-interruption frequency |

---

## 3. Study Behavior & Academic Habits

| Column Name | Data Type | Business Meaning | Example Value | Allowed Range / Format | Raw or Derived | Potential Analytical Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Study_Hours_Per_Day` | DECIMAL(4,1) | Focused non-classroom academic study time per day | `3.6` | 0.5 – 10.0 hours | Raw | Academic input measure; time substitution modeling |
| `Classes_Attended_Percent` | DECIMAL(5,1) | Verified lecture and seminar attendance percentage | `85.4` | 40.0% – 100.0% | Raw | Formal engagement indicator; attendance-performance elasticity |
| `Assignment_Completion_Percent`| DECIMAL(5,1)| Percentage of assigned coursework submitted on time | `88.0` | 40.0% – 100.0% | Raw | Conscientiousness and task-execution measure |
| `Study_Consistency_Score` | INTEGER | Survey-assessed rating of study schedule regularity | `7` | 1 – 10 scale | Raw | Habit stability measure; predictor of exam resilience |
| `Online_Learning_Hours` | DECIMAL(4,1) | Hours spent in LMS portals, video lectures, coding labs | `2.1` | 0.5 – 6.0 hours | Raw | Differentiates productive digital screen time from leisure |

---

## 4. Wellbeing, Lifestyle & Mental Health Indicators

| Column Name | Data Type | Business Meaning | Example Value | Allowed Range / Format | Raw or Derived | Potential Analytical Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Sleep_Hours` | DECIMAL(4,1) | Self-reported average nightly sleep duration | `4.8` | 3.5 – 10.0 hours | Raw | Sleep debt identification; cognitive restoration analysis |
| `Sleep_Quality_Score` | INTEGER | Subjective restfulness score upon waking | `3` | 1 (Poor) – 5 (Excellent) | Raw | Sleep architecture quality beyond pure duration |
| `Physical_Activity_Hours_Per_Week`| DECIMAL(4,1)| Total weekly recreational cardio/strength/sports hours | `3.8` | 0.0 – 15.0 hours | Raw | Sedentary lifestyle counterweight and stress buffer |
| `Perceived_Stress_Score` | INTEGER | Self-rated psychometric tension and pressure scale | `5` | 1 (Minimal) – 10 (Severe) | Raw | Mental strain variable; mediating factor in performance |
| `Social_Comparison_Frequency`| VARCHAR(24) | How frequently student compares lifestyle to feeds | `Frequently` | `Never`, `Rarely`, `Sometimes`, `Frequently`, `Always` | Raw | Psychological impact of algorithmic social feeds |
| `Digital_Detox_Days_Per_Month`| INTEGER | Days spent deliberately unplugged or under low screen time | `2` | 0 – 10 days | Raw | Digital boundary enforcement and self-regulation metric |

---

## 5. Academic Performance Outcomes

| Column Name | Data Type | Business Meaning | Example Value | Allowed Range / Format | Raw or Derived | Potential Analytical Use |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `Internal_Marks_Percent` | DECIMAL(5,1) | Continuous assessment, quizzes, and lab scores | `78.4` | 40.0% – 99.0% | Raw | Mid-semester performance benchmark |
| `Assignment_Average_Percent`| DECIMAL(5,1)| Weighted average score across all coursework essays/labs | `82.6` | 44.0% – 99.0% | Raw | Continuous academic quality indicator |
| `Exam_Score_Percent` | DECIMAL(5,1) | Final comprehensive proctored examination percentage | `90.8` | 35.0% – 100.0% | Raw | High-stakes summative academic assessment |
| `Attendance_Percent` | DECIMAL(5,1) | Cumulative semester attendance percentage | `85.4` | 45.0% – 100.0% | Raw | Regulatory threshold compliance (e.g., minimum 75% attendance) |
| `GPA` | DECIMAL(4,2) | Grade Point Average evaluated on standard 4.0 scale | `3.58` | 1.85 – 4.00 | Raw | Primary target outcome for educational success modeling |
| `Academic_Performance_Band` | VARCHAR(24) | Categorical tier based on standard university honours | `Distinction` | `Distinction` (>=3.6), `High Merit` (3.2–3.59), `Merit` (2.8–3.19), `Pass` (2.4–2.79), `At Risk` (<2.4) | Derived | Executive dashboard stratification and cohort grouping |

---

## 6. Business & Analytical Derived Fields

| Column Name | Data Type | Business Meaning & Derivation Formula | Example Value | Allowed Categories | Potential Analytical Use |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `Digital_Usage_Category` | VARCHAR(20) | Screen consumption classification:<br>`Low` (<3h), `Moderate` (3–5.4h), `High` (5.5–7.9h), `Severe` (>=8h) | `High` | `Low`, `Moderate`, `High`, `Severe` | Primary BI dashboard filter and ANOVA comparison factor |
| `Study_Habit_Category` | VARCHAR(32) | Combination of study duration and consistency score | `Moderately Consistent` | `Highly Consistent`, `Moderately Consistent`, `Inconsistent`, `Irregular` | Student habit intervention targeting |
| `Sleep_Category` | VARCHAR(20) | Sleep duration health bracket:<br>`Deprived` (<6h), `Sub-optimal` (6–6.9h), `Optimal` (7–8.4h), `Extended` (>=8.5h) | `Deprived` | `Deprived`, `Sub-optimal`, `Optimal`, `Extended` | Wellbeing triage and cross-tabulation with stress |
| `Academic_Performance_Category`| VARCHAR(24)| Standard letter classification equivalent | `Excellent` | `Excellent`, `Good`, `Average`, `Below Average`, `Critical` | Institutional reporting and retention monitoring |
| `Engagement_Segment` | VARCHAR(32) | Rule-based clustering: Highly Engaged vs Balanced Learner vs Digital Heavy vs Disengaged | `Balanced Learner` | 4 Behavioral Segments | Strategic student support routing |
| `Risk_Segment` | VARCHAR(32) | Multi-factor risk flag (GPA <2.6, Screen >7h, Sleep <5.5h, Stress >=8) | `Lifestyle Risk` | `Low Risk`, `Moderate Risk`, `Academic Risk`, `Lifestyle Risk`, `High Cumulative Risk` | Early-warning radar for university advisors |
| `Productivity_Score` | INTEGER | Normalized 0–100 index: `(Study*6) + (Consistency*4) + (Assignments*0.25) + (Physical*1.5) - (Social*2.2) + 20` | `83` | 10 – 100 | Balanced behavioral efficiency KPI |
| `Digital_Wellbeing_Score`| INTEGER | Normalized 0–100 index: `(Sleep*6) + (SleepQual*5) + (Detox*2.5) - (Screen*2.5) - (Stress*2.5) ± LateNight + 40` | `60` | 10 – 100 | Holistic lifestyle equilibrium metric |
| `Overall_Student_Score` | INTEGER | Holistic readiness score: `(GPA*15) + (Productivity*0.3) + (DigitalWellbeing*0.3)` | `77` | 15 – 100 | Comprehensive institutional vitality index |
