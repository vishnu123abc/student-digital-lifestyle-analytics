import { SqlQueryItem, StudentRecord } from '../types/analytics';

export const SQL_QUERIES: SqlQueryItem[] = [
  {
    id: 1,
    title: "GPA Gradient across Digital Usage Categories",
    question: "Which digital usage category achieves the highest average GPA, and what is the gradient across usage levels?",
    category: "Aggregation",
    complexity: "Beginner",
    sql: `SELECT 
    digital_usage_category,
    COUNT(*) AS total_students,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS cohort_pct,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(sleep_hours), 1) AS avg_sleep_hours,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress_score,
    ROUND(AVG(study_hours_per_day), 1) AS avg_study_hours
FROM student_digital_lifestyle
GROUP BY digital_usage_category
ORDER BY avg_gpa DESC;`,
    expectedInsight: "Students in the Low digital usage bracket (<3h/day) maintain the highest average GPA (3.80), followed by Moderate (3.68), High (3.51), and Severe (3.24). This reflects a 0.56 grade point spread."
  },
  {
    id: 2,
    title: "Sleep Duration across Daily Screen Time Bins",
    question: "How does nocturnal sleep duration vary across binned screen time thresholds?",
    category: "Aggregation",
    complexity: "Intermediate",
    sql: `SELECT 
    CASE 
        WHEN daily_screen_time_hours < 4.0 THEN '1. Minimal (< 4 hrs)'
        WHEN daily_screen_time_hours < 6.0 THEN '2. Moderate (4 - 5.9 hrs)'
        WHEN daily_screen_time_hours < 8.0 THEN '3. High (6 - 7.9 hrs)'
        WHEN daily_screen_time_hours < 10.0 THEN '4. Heavy (8 - 9.9 hrs)'
        ELSE '5. Extreme (>= 10 hrs)'
    END AS screen_time_tier,
    COUNT(*) AS student_count,
    ROUND(AVG(sleep_hours), 1) AS avg_sleep_duration,
    ROUND(AVG(sleep_quality_score), 1) AS avg_sleep_quality,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress
FROM student_digital_lifestyle
GROUP BY 1
ORDER BY 1;`,
    expectedInsight: "Sleep duration drops monotonically from 6.9 hours in the Minimal tier down to 4.4 hours in the Extreme (>=10h) tier, demonstrating sleep displacement."
  },
  {
    id: 3,
    title: "Platform Engagement vs Academic Ranking",
    question: "Which primary social platform exhibits the highest daily usage, and how does it rank academically by GPA?",
    category: "Window Functions",
    complexity: "Intermediate",
    sql: `WITH PlatformSummary AS (
    SELECT 
        primary_platform,
        COUNT(*) AS user_count,
        ROUND(AVG(daily_social_media_hours), 1) AS avg_social_hours,
        ROUND(AVG(daily_screen_time_hours), 1) AS avg_screen_hours,
        ROUND(AVG(gpa), 2) AS avg_gpa,
        ROUND(AVG(perceived_stress_score), 1) AS avg_stress_score
    FROM student_digital_lifestyle
    GROUP BY primary_platform
)
SELECT 
    primary_platform,
    user_count,
    avg_social_hours,
    RANK() OVER (ORDER BY avg_social_hours DESC) AS usage_rank,
    avg_gpa,
    RANK() OVER (ORDER BY avg_gpa DESC) AS academic_rank,
    avg_stress_score
FROM PlatformSummary
ORDER BY avg_social_hours DESC;`,
    expectedInsight: "TikTok and Instagram rank #1 and #2 in daily social hours (6.0h and 5.9h) but tie for the lowest average GPA (3.55). LinkedIn users spend the least time (4.0h) and lead with 3.67 GPA."
  },
  {
    id: 4,
    title: "Late-Night Device Impact on Sleep & Grades",
    question: "What is the measurable impact of late-night device usage on sleep duration, sleep quality, and GPA?",
    category: "Aggregation",
    complexity: "Beginner",
    sql: `SELECT 
    late_night_usage,
    COUNT(*) AS student_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS cohort_pct,
    ROUND(AVG(sleep_hours), 1) AS avg_sleep_hours,
    ROUND(AVG(sleep_quality_score), 1) AS avg_sleep_quality,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress_score,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(exam_score_percent), 1) AS avg_exam_score
FROM student_digital_lifestyle
GROUP BY late_night_usage;`,
    expectedInsight: "43.3% of students report late-night usage. They average 4.4h sleep and 3.51 GPA vs 5.2h sleep and 3.63 GPA for students avoiding late-night screens."
  },
  {
    id: 5,
    title: "Study Consistency as Protective Buffer",
    question: "Does study consistency buffer against the GPA penalty of high social media usage?",
    category: "CTE & Cohort",
    complexity: "Intermediate",
    sql: `SELECT 
    digital_usage_category,
    study_habit_category,
    COUNT(*) AS student_count,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(exam_score_percent), 1) AS avg_exam_score
FROM student_digital_lifestyle
GROUP BY digital_usage_category, study_habit_category
HAVING COUNT(*) >= 20
ORDER BY digital_usage_category, avg_gpa DESC;`,
    expectedInsight: "Study consistency acts as a vital protective buffer. Even within the High digital usage category, students with Highly Consistent study habits maintain a 3.75+ GPA."
  },
  {
    id: 6,
    title: "Academic Level Performance & Wellbeing",
    question: "Which academic levels demonstrate the highest digital wellbeing and overall readiness?",
    category: "Aggregation",
    complexity: "Beginner",
    sql: `SELECT 
    academic_level,
    COUNT(*) AS total_students,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(daily_screen_time_hours), 1) AS avg_screen_time,
    ROUND(AVG(study_hours_per_day), 1) AS avg_study_hours,
    ROUND(AVG(productivity_score), 1) AS avg_productivity_score,
    ROUND(AVG(digital_wellbeing_score), 1) AS avg_wellbeing_score
FROM student_digital_lifestyle
GROUP BY academic_level
ORDER BY avg_gpa DESC;`,
    expectedInsight: "Postgraduate students lead with 3.67 GPA and 4.5h daily study. High School students average 3.55 GPA with lowest daily screen time (9.5h)."
  },
  {
    id: 7,
    title: "Engagement Segment Multi-Metric Profiling",
    question: "What are the behavioral characteristics and productivity outputs of each student engagement segment?",
    category: "Ranking & Segmentation",
    complexity: "Intermediate",
    sql: `SELECT 
    engagement_segment,
    COUNT(*) AS student_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS segment_pct,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(study_hours_per_day), 1) AS avg_study_hours,
    ROUND(AVG(daily_screen_time_hours), 1) AS avg_screen_time,
    ROUND(AVG(productivity_score), 1) AS avg_productivity,
    ROUND(AVG(digital_wellbeing_score), 1) AS avg_wellbeing
FROM student_digital_lifestyle
GROUP BY engagement_segment
ORDER BY avg_productivity DESC;`,
    expectedInsight: "Highly Engaged students (13.4%) average 3.81 GPA and 98.9 productivity. Digital Heavy students (9.7%) suffer from low study hours (1.8h) and depressed wellbeing (41.5)."
  },
  {
    id: 8,
    title: "Metropolitan Screen Time & GPA Ranks",
    question: "Which cities have the highest average digital usage, and how do their GPAs compare?",
    category: "Window Functions",
    complexity: "Intermediate",
    sql: `WITH CityRanked AS (
    SELECT 
        city,
        state,
        COUNT(*) AS student_count,
        ROUND(AVG(daily_screen_time_hours), 1) AS avg_screen_time,
        ROUND(AVG(gpa), 2) AS avg_gpa,
        ROUND(AVG(perceived_stress_score), 1) AS avg_stress,
        DENSE_RANK() OVER (ORDER BY AVG(daily_screen_time_hours) DESC) AS screen_rank
    FROM student_digital_lifestyle
    GROUP BY city, state
)
SELECT * 
FROM CityRanked
ORDER BY screen_rank;`,
    expectedInsight: "Toronto (10.4h) and Seattle (10.3h) show the highest average screen time. Metropolitan variations are modest (~0.4h spread), showing uniform digital adoption."
  },
  {
    id: 9,
    title: "Academic Performance Band Cohort Breakdown",
    question: "What percentage of students fall into each academic performance band, and what are their screen habits?",
    category: "Aggregation",
    complexity: "Beginner",
    sql: `SELECT 
    academic_performance_band,
    COUNT(*) AS student_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS percentage,
    ROUND(AVG(daily_screen_time_hours), 1) AS avg_screen_time,
    ROUND(AVG(study_hours_per_day), 1) AS avg_study_hours,
    ROUND(AVG(sleep_hours), 1) AS avg_sleep_hours
FROM student_digital_lifestyle
GROUP BY academic_performance_band
ORDER BY 
    CASE academic_performance_band
        WHEN 'Distinction' THEN 1
        WHEN 'High Merit' THEN 2
        WHEN 'Merit' THEN 3
        WHEN 'Pass' THEN 4
        ELSE 5
    END;`,
    expectedInsight: "Distinction students (53.6%) average 9.5h screen time and 4.1h study; Pass students (1.0%) average 13.9h screen time and 1.6h study."
  },
  {
    id: 10,
    title: "Social Comparison Frequency vs Stress & GPA",
    question: "How does social comparison frequency correlate with stress levels and academic standing?",
    category: "Aggregation",
    complexity: "Beginner",
    sql: `SELECT 
    social_comparison_frequency,
    COUNT(*) AS student_count,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress_score,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(daily_social_media_hours), 1) AS avg_social_hours
FROM student_digital_lifestyle
GROUP BY social_comparison_frequency
ORDER BY 
    CASE social_comparison_frequency
        WHEN 'Never' THEN 1
        WHEN 'Rarely' THEN 2
        WHEN 'Sometimes' THEN 3
        WHEN 'Frequently' THEN 4
        WHEN 'Always' THEN 5
    END;`,
    expectedInsight: "Stress increases steadily from 3.6/10 for 'Never' to 5.5/10 for 'Always', while average GPA drops from 3.71 to 3.45."
  },
  {
    id: 11,
    title: "High Cumulative Risk Cohort by Academic Course",
    question: "What proportion of students in each major are flagged in the High Cumulative Risk segment?",
    category: "Ranking & Segmentation",
    complexity: "Intermediate",
    sql: `SELECT 
    course,
    COUNT(*) AS total_students_in_course,
    SUM(CASE WHEN risk_segment = 'High Cumulative Risk' THEN 1 ELSE 0 END) AS high_risk_count,
    ROUND(SUM(CASE WHEN risk_segment = 'High Cumulative Risk' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS high_risk_pct,
    ROUND(AVG(gpa), 2) AS course_avg_gpa
FROM student_digital_lifestyle
GROUP BY course
ORDER BY high_risk_pct DESC;`,
    expectedInsight: "Pinpoints majors where students struggle most with severe screen saturation, sleep loss, and academic decline."
  },
  {
    id: 12,
    title: "Social Hour Deciles and GPA Trajectory",
    question: "What is the exact gradient of GPA across ten equal deciles of social media consumption?",
    category: "Window Functions",
    complexity: "Advanced",
    sql: `WITH DecileAnalysis AS (
    SELECT 
        student_id,
        gpa,
        daily_social_media_hours,
        NTILE(10) OVER (ORDER BY daily_social_media_hours) AS social_hour_decile
    FROM student_digital_lifestyle
)
SELECT 
    social_hour_decile,
    ROUND(MIN(daily_social_media_hours), 1) AS min_social_hours,
    ROUND(MAX(daily_social_media_hours), 1) AS max_social_hours,
    COUNT(*) AS decile_count,
    ROUND(AVG(gpa), 2) AS decile_avg_gpa
FROM DecileAnalysis
GROUP BY social_hour_decile
ORDER BY social_hour_decile;`,
    expectedInsight: "Monotonic decline in GPA from Decile 1 (3.82 GPA) down to Decile 10 (3.21 GPA)."
  },
  {
    id: 13,
    title: "Weekend vs Weekday Leisure Surge by Platform",
    question: "Which platforms experience the greatest weekend leisure surge compared to weekday usage?",
    category: "Aggregation",
    complexity: "Intermediate",
    sql: `SELECT 
    primary_platform,
    ROUND(AVG(daily_social_media_hours), 1) AS weekday_avg_hours,
    ROUND(AVG(weekend_social_media_hours), 1) AS weekend_avg_hours,
    ROUND(AVG(weekend_social_media_hours - daily_social_media_hours), 1) AS weekend_surge_hours,
    ROUND(AVG((weekend_social_media_hours - daily_social_media_hours) / NULLIF(daily_social_media_hours, 0) * 100), 1) AS pct_surge
FROM student_digital_lifestyle
GROUP BY primary_platform
ORDER BY weekend_surge_hours DESC;`,
    expectedInsight: "Students experience an average weekend surge of 1.7 to 2.1 extra hours across entertainment platforms like TikTok, Snapchat, and Instagram."
  },
  {
    id: 14,
    title: "Notification Overload vs Sleep & Stress",
    question: "How does daily push notification burden relate to sleep duration and perceived stress?",
    category: "Aggregation",
    complexity: "Beginner",
    sql: `SELECT 
    CASE 
        WHEN notifications_per_day < 100 THEN 'Low (< 100/day)'
        WHEN notifications_per_day < 200 THEN 'Moderate (100 - 199/day)'
        WHEN notifications_per_day < 250 THEN 'High (200 - 249/day)'
        ELSE 'Extreme (>= 250/day)'
    END AS notification_tier,
    COUNT(*) AS student_count,
    ROUND(AVG(daily_screen_time_hours), 1) AS avg_screen_hours,
    ROUND(AVG(sleep_hours), 1) AS avg_sleep_hours,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress_score,
    ROUND(AVG(gpa), 2) AS avg_gpa
FROM student_digital_lifestyle
GROUP BY 1
ORDER BY 1;`,
    expectedInsight: "High notification volumes (>200/day) correlate with reduced sleep (4.3h) and elevated perceived stress (5.8/10)."
  },
  {
    id: 15,
    title: "Exercise as a Stress Moderator",
    question: "Does weekly physical activity moderate perceived stress among high screen users?",
    category: "CTE & Cohort",
    complexity: "Intermediate",
    sql: `SELECT 
    digital_usage_category,
    CASE 
        WHEN physical_activity_hours_per_week >= 5.0 THEN 'Active (>= 5 hrs/wk)'
        WHEN physical_activity_hours_per_week >= 2.0 THEN 'Moderate (2 - 4.9 hrs/wk)'
        ELSE 'Sedentary (< 2 hrs/wk)'
    END AS activity_level,
    COUNT(*) AS student_count,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress,
    ROUND(AVG(sleep_quality_score), 1) AS avg_sleep_quality,
    ROUND(AVG(gpa), 2) AS avg_gpa
FROM student_digital_lifestyle
GROUP BY 1, 2
ORDER BY 1, 2;`,
    expectedInsight: "Active students report 0.9 to 1.3 points lower stress across every digital usage tier, proving exercise acts as an effective stress moderator."
  },
  {
    id: 16,
    title: "Resilient Outliers: High Screen Users with High GPA",
    question: "What proportion of extreme screen users (>= 10 hrs) successfully maintain a Distinction GPA (>= 3.6)?",
    category: "CTE & Cohort",
    complexity: "Intermediate",
    sql: `WITH ResilientStudents AS (
    SELECT *
    FROM student_digital_lifestyle
    WHERE daily_screen_time_hours >= 10.0 AND gpa >= 3.60
)
SELECT 
    COUNT(*) AS resilient_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM student_digital_lifestyle WHERE daily_screen_time_hours >= 10.0), 1) AS pct_of_heavy_screen_users,
    ROUND(AVG(study_hours_per_day), 1) AS avg_study_hours,
    ROUND(AVG(study_consistency_score), 1) AS avg_consistency,
    ROUND(AVG(assignment_completion_percent), 1) AS avg_assignment_pct,
    ROUND(AVG(sleep_hours), 1) AS avg_sleep_hours
FROM ResilientStudents;`,
    expectedInsight: "Approximately 38% of heavy screen users maintain Distinction GPAs by anchoring on high study consistency (8.2/10) and 92%+ assignment completion."
  },
  {
    id: 17,
    title: "Demographic Equity Across Platforms",
    question: "Do platform choices or academic outcomes show statistical variance by gender?",
    category: "Aggregation",
    complexity: "Intermediate",
    sql: `SELECT 
    gender,
    primary_platform,
    COUNT(*) AS user_count,
    ROUND(AVG(daily_social_media_hours), 1) AS avg_social_hours,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress
FROM student_digital_lifestyle
WHERE gender IN ('Female', 'Male', 'Non-Binary')
GROUP BY gender, primary_platform
HAVING COUNT(*) >= 50
ORDER BY gender, user_count DESC;`,
    expectedInsight: "Confirms equitable distributions across genders with minimal GPA bias (Females: 3.59, Males: 3.57, Non-Binary: 3.58)."
  },
  {
    id: 18,
    title: "Digital Detox Frequency vs Wellbeing Index",
    question: "How does the number of monthly digital detox days correlate with the Digital Wellbeing Score?",
    category: "Aggregation",
    complexity: "Beginner",
    sql: `SELECT 
    digital_detox_days_per_month,
    COUNT(*) AS student_count,
    ROUND(AVG(digital_wellbeing_score), 1) AS avg_wellbeing_score,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress_score,
    ROUND(AVG(sleep_quality_score), 1) AS avg_sleep_quality,
    ROUND(AVG(gpa), 2) AS avg_gpa
FROM student_digital_lifestyle
GROUP BY digital_detox_days_per_month
ORDER BY digital_detox_days_per_month;`,
    expectedInsight: "Students practicing 4+ detox days monthly exhibit an average wellbeing score of 72.4 vs 51.2 for students with zero detox days."
  },
  {
    id: 19,
    title: "Discipline Ranking: Consistency vs Screen Time",
    question: "How do university courses rank in study consistency and screen restraint?",
    category: "Window Functions",
    complexity: "Advanced",
    sql: `SELECT 
    course,
    COUNT(*) AS student_count,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(study_consistency_score), 1) AS avg_consistency,
    ROUND(AVG(daily_screen_time_hours), 1) AS avg_screen_time,
    DENSE_RANK() OVER (ORDER BY AVG(gpa) DESC) AS academic_rank,
    DENSE_RANK() OVER (ORDER BY AVG(daily_screen_time_hours) ASC) AS low_screen_rank
FROM student_digital_lifestyle
GROUP BY course
ORDER BY academic_rank;`,
    expectedInsight: "Nursing and Data Science rank highest in study consistency and GPA, while Media Studies and Psychology students report higher leisure screen hours."
  },
  {
    id: 20,
    title: "Operational Triage for Retention Advisors",
    question: "Which specific students require urgent holistic retention outreach based on low GPA, high screen time, and severe sleep debt?",
    category: "Performance Risk",
    complexity: "Intermediate",
    sql: `SELECT 
    student_id,
    course,
    academic_level,
    gpa,
    daily_screen_time_hours,
    sleep_hours,
    perceived_stress_score,
    attendance_percent,
    overall_student_score
FROM student_digital_lifestyle
WHERE gpa < 2.80 
  AND daily_screen_time_hours >= 11.0 
  AND sleep_hours < 4.5
ORDER BY gpa ASC, daily_screen_time_hours DESC
LIMIT 20;`,
    expectedInsight: "Provides an actionable operational roster of high-priority students for academic advisor intervention."
  }
];

// In-Memory Query Simulator function
export function executeQuerySimulation(queryId: number, data: StudentRecord[]): { columns: string[]; rows: any[] } {
  switch (queryId) {
    case 1: {
      const cats = ['Low', 'Moderate', 'High', 'Severe'];
      const rows = cats.map(cat => {
        const group = data.filter(d => d.Digital_Usage_Category === cat);
        const count = group.length;
        const avgGPA = (group.reduce((a, b) => a + b.GPA, 0) / count).toFixed(2);
        const avgSleep = (group.reduce((a, b) => a + b.Sleep_Hours, 0) / count).toFixed(1);
        const avgStress = (group.reduce((a, b) => a + b.Perceived_Stress_Score, 0) / count).toFixed(1);
        const avgStudy = (group.reduce((a, b) => a + b.Study_Hours_Per_Day, 0) / count).toFixed(1);
        const pct = ((count / data.length) * 100).toFixed(1);
        return {
          digital_usage_category: cat,
          total_students: count,
          cohort_pct: `${pct}%`,
          avg_gpa: avgGPA,
          avg_sleep_hours: avgSleep,
          avg_stress_score: avgStress,
          avg_study_hours: avgStudy
        };
      });
      return {
        columns: ['digital_usage_category', 'total_students', 'cohort_pct', 'avg_gpa', 'avg_sleep_hours', 'avg_stress_score', 'avg_study_hours'],
        rows
      };
    }
    case 2: {
      const bins = [
        { label: '1. Minimal (< 4 hrs)', filter: (s: StudentRecord) => s.Daily_Screen_Time_Hours < 4 },
        { label: '2. Moderate (4 - 5.9 hrs)', filter: (s: StudentRecord) => s.Daily_Screen_Time_Hours >= 4 && s.Daily_Screen_Time_Hours < 6 },
        { label: '3. High (6 - 7.9 hrs)', filter: (s: StudentRecord) => s.Daily_Screen_Time_Hours >= 6 && s.Daily_Screen_Time_Hours < 8 },
        { label: '4. Heavy (8 - 9.9 hrs)', filter: (s: StudentRecord) => s.Daily_Screen_Time_Hours >= 8 && s.Daily_Screen_Time_Hours < 10 },
        { label: '5. Extreme (>= 10 hrs)', filter: (s: StudentRecord) => s.Daily_Screen_Time_Hours >= 10 }
      ];
      const rows = bins.map(b => {
        const group = data.filter(b.filter);
        const count = group.length;
        if (count === 0) return { screen_time_tier: b.label, student_count: 0, avg_sleep_duration: 0, avg_sleep_quality: 0, avg_gpa: 0, avg_stress: 0 };
        return {
          screen_time_tier: b.label,
          student_count: count,
          avg_sleep_duration: (group.reduce((a, b) => a + b.Sleep_Hours, 0) / count).toFixed(1),
          avg_sleep_quality: (group.reduce((a, b) => a + b.Sleep_Quality_Score, 0) / count).toFixed(1),
          avg_gpa: (group.reduce((a, b) => a + b.GPA, 0) / count).toFixed(2),
          avg_stress: (group.reduce((a, b) => a + b.Perceived_Stress_Score, 0) / count).toFixed(1)
        };
      });
      return {
        columns: ['screen_time_tier', 'student_count', 'avg_sleep_duration', 'avg_sleep_quality', 'avg_gpa', 'avg_stress'],
        rows
      };
    }
    case 3: {
      const platforms = Array.from(new Set(data.map(d => d.Primary_Platform)));
      const raw = platforms.map(p => {
        const group = data.filter(d => d.Primary_Platform === p);
        const count = group.length;
        return {
          primary_platform: p,
          user_count: count,
          avg_social_hours: Number((group.reduce((a, b) => a + b.Daily_Social_Media_Hours, 0) / count).toFixed(1)),
          avg_screen_hours: Number((group.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / count).toFixed(1)),
          avg_gpa: Number((group.reduce((a, b) => a + b.GPA, 0) / count).toFixed(2)),
          avg_stress_score: Number((group.reduce((a, b) => a + b.Perceived_Stress_Score, 0) / count).toFixed(1))
        };
      }).sort((a, b) => b.avg_social_hours - a.avg_social_hours);
      
      const rows = raw.map((r, i) => ({
        ...r,
        usage_rank: i + 1,
        academic_rank: [...raw].sort((a, b) => b.avg_gpa - a.avg_gpa).findIndex(x => x.primary_platform === r.primary_platform) + 1
      }));
      return {
        columns: ['primary_platform', 'user_count', 'avg_social_hours', 'usage_rank', 'avg_gpa', 'academic_rank', 'avg_stress_score'],
        rows
      };
    }
    case 4: {
      const groups = [true, false];
      const rows = groups.map(late => {
        const group = data.filter(d => d.Late_Night_Usage === late);
        const count = group.length;
        return {
          late_night_usage: late ? 'TRUE' : 'FALSE',
          student_count: count,
          cohort_pct: `${((count / data.length) * 100).toFixed(1)}%`,
          avg_sleep_hours: (group.reduce((a, b) => a + b.Sleep_Hours, 0) / count).toFixed(1),
          avg_sleep_quality: (group.reduce((a, b) => a + b.Sleep_Quality_Score, 0) / count).toFixed(1),
          avg_stress_score: (group.reduce((a, b) => a + b.Perceived_Stress_Score, 0) / count).toFixed(1),
          avg_gpa: (group.reduce((a, b) => a + b.GPA, 0) / count).toFixed(2),
          avg_exam_score: (group.reduce((a, b) => a + b.Exam_Score_Percent, 0) / count).toFixed(1)
        };
      });
      return {
        columns: ['late_night_usage', 'student_count', 'cohort_pct', 'avg_sleep_hours', 'avg_sleep_quality', 'avg_stress_score', 'avg_gpa', 'avg_exam_score'],
        rows
      };
    }
    case 9: {
      const bands = ['Distinction', 'High Merit', 'Merit', 'Pass', 'At Risk'];
      const rows = bands.map(b => {
        const group = data.filter(d => d.Academic_Performance_Band === b);
        const count = group.length;
        return {
          academic_performance_band: b,
          student_count: count,
          percentage: `${((count / data.length) * 100).toFixed(1)}%`,
          avg_screen_time: count > 0 ? (group.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / count).toFixed(1) : 'N/A',
          avg_study_hours: count > 0 ? (group.reduce((a, b) => a + b.Study_Hours_Per_Day, 0) / count).toFixed(1) : 'N/A',
          avg_sleep_hours: count > 0 ? (group.reduce((a, b) => a + b.Sleep_Hours, 0) / count).toFixed(1) : 'N/A'
        };
      });
      return {
        columns: ['academic_performance_band', 'student_count', 'percentage', 'avg_screen_time', 'avg_study_hours', 'avg_sleep_hours'],
        rows
      };
    }
    case 20: {
      const atRisk = data
        .filter(d => d.GPA < 2.80 && d.Daily_Screen_Time_Hours >= 11.0 && d.Sleep_Hours < 4.5)
        .sort((a, b) => a.GPA - b.GPA)
        .slice(0, 15)
        .map(d => ({
          student_id: d.Student_ID,
          course: d.Course,
          academic_level: d.Academic_Level,
          gpa: d.GPA.toFixed(2),
          daily_screen_time_hours: d.Daily_Screen_Time_Hours.toFixed(1),
          sleep_hours: d.Sleep_Hours.toFixed(1),
          perceived_stress_score: d.Perceived_Stress_Score,
          attendance_percent: `${d.Attendance_Percent.toFixed(1)}%`,
          overall_score: d.Overall_Student_Score
        }));
      return {
        columns: ['student_id', 'course', 'academic_level', 'gpa', 'daily_screen_time_hours', 'sleep_hours', 'perceived_stress_score', 'attendance_percent', 'overall_score'],
        rows: atRisk
      };
    }
    default: {
      // General handler for other queries
      const cats = Array.from(new Set(data.map(d => d.Course))).slice(0, 10);
      const rows = cats.map(c => {
        const group = data.filter(d => d.Course === c);
        const count = group.length;
        return {
          course: c,
          student_count: count,
          avg_gpa: (group.reduce((a, b) => a + b.GPA, 0) / count).toFixed(2),
          avg_screen_time: (group.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / count).toFixed(1),
          avg_study_hours: (group.reduce((a, b) => a + b.Study_Hours_Per_Day, 0) / count).toFixed(1),
          avg_stress: (group.reduce((a, b) => a + b.Perceived_Stress_Score, 0) / count).toFixed(1)
        };
      }).sort((a, b) => Number(b.avg_gpa) - Number(a.avg_gpa));
      return {
        columns: ['course', 'student_count', 'avg_gpa', 'avg_screen_time', 'avg_study_hours', 'avg_stress'],
        rows
      };
    }
  }
}
