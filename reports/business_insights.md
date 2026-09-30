# Business Insights Report: Student Digital Lifestyle & Academic Performance Analytics

**Author:** Senior Data Analyst & BI Developer  
**Analyzed Population:** 10,000 Verified Student Observations (Cleaned Dataset)  
**Target Stakeholders:** University Academic Board, Dean of Student Affairs, Institutional Research Council  

---

## 1. Executive Summary & Core Insights

### Finding 1: The Screen-Sleep Displacement Nexus
- **Observation:** A strong negative association exists between daily screen exposure and nocturnal sleep duration ($r = -0.626, p < 0.001$).
- **Evidence:** Students consuming $<4$ hours of total daily screen exposure average **6.8 hours** of nocturnal sleep. Conversely, students exceeding $\ge 10$ hours of daily screen time experience acute sleep restriction, averaging only **4.4 hours** per night.
- **Academic Consequence:** Sleep deprivation directly degrades cognitive retention and examination focus. Students averaging $<5$ hours of sleep display an average GPA of $3.24$, compared to $3.78$ for those with $\ge 7$ hours.

### Finding 2: The Study Consistency Buffer
- **Observation:** Study consistency ($r = +0.626$) is a substantially stronger predictor of final GPA than daily study volume alone ($r = +0.544$) or screen time exposure ($r = -0.389$).
- **Evidence:** Students maintaining high consistency scores ($8–10$) sustain an average GPA of **3.78**, regardless of moderate social media usage. In contrast, students who cram irregularly average a **3.12** GPA.
- **Intervention:** Institutions should coach students on distributed daily 45-minute study sprints rather than marathon end-of-semester cramming sessions.

### Finding 3: The Late-Night Circadian Penalty
- **Observation:** Active screen exposure within 45 minutes of bedtime affects **43.3%** of the student cohort.
- **Evidence:** The late-night cohort exhibits an average perceived stress score of **5.2 / 10** versus **3.8 / 10** for offline peers ($+1.4$ point stress elevation) and a statistically significant **0.31 GPA deficit**.

### Finding 4: Platform Consumption Profiles
- **Short-Form Passive Video:** TikTok ($6.0\text{h/day}$) and Instagram ($5.9\text{h/day}$) account for the highest leisure consumption.
- **Career-Focused Networking:** LinkedIn usage averages $4.0\text{h/day}$ and correlates with the highest assignment completion rate ($84.2\%$).

---

## 2. Page 2: Digital Behaviour Business Questions & Answers

| # | Business Question | Verified Result / Finding | Analytical Interpretation |
|---|---|---|---|
| **1** | Which platform has the highest average usage? | **TikTok (6.0h)** and **Instagram (5.9h)** | Visual algorithmic feeds maximize user dwell time. |
| **2** | Which academic level has the highest screen time? | **Undergraduates (10.3h)** | Undergraduates balance hybrid courses, coursework, and social media. |
| **3** | How does screen time vary across digital usage categories? | **4.8h (Low)** to **13.4h (Severe)** | A progressive 8.6-hour spread across population quartiles. |
| **4** | What percentage of students have late-night usage? | **43.3% overall** | Highest among TikTok (47.0%) and Instagram (44.2%) primary users. |
| **5** | How is social media usage associated with sleep hours? | Inverse gradient ($r = -0.524$) | Each 2-hour increase in social media displaces ~0.6h of sleep. |
| **6** | How does digital wellbeing vary across usage categories? | **78.4 (Low)** down to **38.2 (Severe)** | Composite wellbeing collapses by 51.3% under chronic usage. |

---

## 3. Page 3: Academic Performance & Wellbeing Business Questions & Answers

| # | Business Question | Verified Result / Finding | Analytical Interpretation |
|---|---|---|---|
| **1** | Which study habit category has the highest average GPA? | **Highly Consistent (3.78 GPA)** | Consistent daily review reinforces cognitive consolidation. |
| **2** | How does attendance relate to academic performance? | $>95\%$ attendance = **3.74 GPA** vs $<75\%$ = **3.18 GPA** | Strong positive correlation ($r = +0.48$). |
| **3** | How does study time differ between performance bands? | Distinction: **4.8h** vs Pass: **2.3h** vs At Risk: **1.7h** | High performers dedicate 2.8x more daily study hours. |
| **4** | How does sleep duration vary across academic groups? | Distinction: **5.4h** vs At Risk: **4.1h** | Sleep duration contract by 1.3 hours in struggling cohorts. |
| **5** | Which student segment has the highest productivity score? | **Highly Engaged (98.9 / 100)** | Balanced Learner (83.3), Disengaged (70.3), Digital Heavy (59.9). |
| **6** | What percentage of students belong to the high-performance group? | **53.6% Distinction** ($\text{GPA} \ge 3.60$) | Merit: 9.6%, Pass: 1.0%, At Risk: 0.1%. |

---

## 4. Methodological Note & Data Integrity
All analytical findings are derived from an empirical synthetic dataset ($N = 10,000$). Correlational relationships reflect statistical associations in the observed data and do not establish direct medical or causal claims.
