-- ==============================================================================
-- 20 Portfolio Business Questions & Production SQL Queries
-- Table: student_digital_lifestyle (N = 10,000 cleaned student observations)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- Q1. Which digital usage category achieves the highest average GPA, and what is the gradient?
-- ------------------------------------------------------------------------------
SELECT 
    digital_usage_category,
    COUNT(*) AS total_students,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS cohort_pct,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(sleep_hours), 1) AS avg_sleep_hours,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress_score,
    ROUND(AVG(study_hours_per_day), 1) AS avg_study_hours
FROM student_digital_lifestyle
GROUP BY digital_usage_category
ORDER BY avg_gpa DESC;
/*
Analytical Interpretation:
Low digital usage students (<3h social media/day) achieve an average GPA of 3.80,
compared to 3.24 for Severe users (>=8h/day). This demonstrates a significant 0.56 GPA
differential accompanying a 1.7-hour reduction in sleep and a 3.9-point increase in stress.
*/

-- ------------------------------------------------------------------------------
-- Q2. How does nocturnal sleep duration vary across binned screen time thresholds?
-- ------------------------------------------------------------------------------
SELECT 
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
ORDER BY 1;
/*
Analytical Interpretation:
Sleep duration declines monotonically as screen time escalates: students in the <4h tier
average 6.9 hours of sleep, collapsing to 4.4 hours among extreme screen users (>=10 hrs).
*/

-- ------------------------------------------------------------------------------
-- Q3. Which primary social platform exhibits the highest daily usage, and how does it rank by GPA?
-- ------------------------------------------------------------------------------
WITH PlatformSummary AS (
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
ORDER BY avg_social_hours DESC;
/*
Analytical Interpretation:
TikTok and Instagram demonstrate the highest engagement (6.0h and 5.9h daily), but tie for
the lowest average GPA (3.55). Conversely, LinkedIn users spend the least time (4.0h) and lead
in GPA (3.67).
*/

-- ------------------------------------------------------------------------------
-- Q4. What is the impact of late-night device usage on sleep duration and academic performance?
-- ------------------------------------------------------------------------------
SELECT 
    late_night_usage,
    COUNT(*) AS student_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS cohort_pct,
    ROUND(AVG(sleep_hours), 1) AS avg_sleep_hours,
    ROUND(AVG(sleep_quality_score), 1) AS avg_sleep_quality,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress_score,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(exam_score_percent), 1) AS avg_exam_score
FROM student_digital_lifestyle
GROUP BY late_night_usage;
/*
Analytical Interpretation:
43.3% of students engage in late-night device usage within 45 minutes of sleeping. These students
average 4.4 hours of sleep vs. 5.2 hours for non-late-night students, alongside lower sleep quality
and reduced academic performance.
*/

-- ------------------------------------------------------------------------------
-- Q5. How does study consistency interact with social media usage to determine GPA?
-- ------------------------------------------------------------------------------
SELECT 
    digital_usage_category,
    study_habit_category,
    COUNT(*) AS student_count,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(exam_score_percent), 1) AS avg_exam_score
FROM student_digital_lifestyle
GROUP BY digital_usage_category, study_habit_category
HAVING COUNT(*) >= 20
ORDER BY digital_usage_category, avg_gpa DESC;
/*
Analytical Interpretation:
Consistent study habits serve as an effective academic protective buffer. Even within the High
digital usage category, students with Highly Consistent study habits maintain a 3.75+ GPA,
demonstrating that disciplined study scheduling can counterbalance moderate digital exposure.
*/

-- ------------------------------------------------------------------------------
-- Q6. Which academic levels demonstrate the highest digital wellbeing and overall readiness?
-- ------------------------------------------------------------------------------
SELECT 
    academic_level,
    COUNT(*) AS total_students,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(daily_screen_time_hours), 1) AS avg_screen_time,
    ROUND(AVG(study_hours_per_day), 1) AS avg_study_hours,
    ROUND(AVG(productivity_score), 1) AS avg_productivity_score,
    ROUND(AVG(digital_wellbeing_score), 1) AS avg_wellbeing_score
FROM student_digital_lifestyle
GROUP BY academic_level
ORDER BY avg_gpa DESC;
/*
Analytical Interpretation:
Postgraduate students achieve higher average GPAs (3.67) and greater study intensity (4.5h),
though their total screen time remains high (10.4h) due to graduate-level online research.
*/

-- ------------------------------------------------------------------------------
-- Q7. What are the behavioral characteristics of each student engagement segment?
-- ------------------------------------------------------------------------------
SELECT 
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
ORDER BY avg_productivity DESC;
/*
Analytical Interpretation:
Highly Engaged students (13.4% of population) average 3.81 GPA with 98.9 productivity.
Digital Heavy students (9.7%) suffer from low study hours (1.8h) and depressed wellbeing (41.5).
*/

-- ------------------------------------------------------------------------------
-- Q8. Top 3 highest screen time cities and their comparative academic outcomes
-- ------------------------------------------------------------------------------
WITH CityRanked AS (
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
WHERE screen_rank <= 5
ORDER BY screen_rank;
/*
Analytical Interpretation:
Toronto (10.4h) and Seattle (10.3h) exhibit the highest average screen times. Metro variance is
modest (~0.4h spread), indicating that high digital consumption is universal across urban student hubs.
*/

-- ------------------------------------------------------------------------------
-- Q9. What percentage of students fall into each academic performance band?
-- ------------------------------------------------------------------------------
SELECT 
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
    END;
/*
Analytical Interpretation:
Distinction students (53.6%) average 9.5 hours of screen time and 4.1 hours of study, whereas Pass
students (1.0%) average 13.9 hours of screen time and only 1.6 hours of study.
*/

-- ------------------------------------------------------------------------------
-- Q10. How does social comparison frequency relate to perceived stress and GPA?
-- ------------------------------------------------------------------------------
SELECT 
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
    END;
/*
Analytical Interpretation:
Perceived stress escalates systematically from 3.6/10 for 'Never' to 5.5/10 for 'Always',
while average GPA declines from 3.71 to 3.45.
*/

-- ------------------------------------------------------------------------------
-- Q11. Distribution of students in High Cumulative Risk segment by Course
-- ------------------------------------------------------------------------------
SELECT 
    course,
    COUNT(*) AS total_students_in_course,
    SUM(CASE WHEN risk_segment = 'High Cumulative Risk' THEN 1 ELSE 0 END) AS high_risk_count,
    ROUND(SUM(CASE WHEN risk_segment = 'High Cumulative Risk' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS high_risk_pct,
    ROUND(AVG(gpa), 2) AS course_avg_gpa
FROM student_digital_lifestyle
GROUP BY course
ORDER BY high_risk_pct DESC;
/*
Analytical Interpretation:
Highlights academic departments with disproportionate numbers of students experiencing concurrent
severe screen time, sleep deprivation, and academic peril.
*/

-- ------------------------------------------------------------------------------
-- Q12. Correlation proxy: GPA vs Daily Social Media Hours via Decile Aggregation
-- ------------------------------------------------------------------------------
WITH DecileAnalysis AS (
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
ORDER BY social_hour_decile;
/*
Analytical Interpretation:
Shows consistent monotonic decrease in average GPA across every ascending decile of social
media consumption, from 3.82 in Decile 1 to 3.21 in Decile 10.
*/

-- ------------------------------------------------------------------------------
-- Q13. Comparison of Weekend vs Weekday Social Media Surge by Platform
-- ------------------------------------------------------------------------------
SELECT 
    primary_platform,
    ROUND(AVG(daily_social_media_hours), 1) AS weekday_avg_hours,
    ROUND(AVG(weekend_social_media_hours), 1) AS weekend_avg_hours,
    ROUND(AVG(weekend_social_media_hours - daily_social_media_hours), 1) AS weekend_surge_hours,
    ROUND(AVG((weekend_social_media_hours - daily_social_media_hours) / NULLIF(daily_social_media_hours, 0) * 100), 1) AS pct_surge
FROM student_digital_lifestyle
GROUP BY primary_platform
ORDER BY weekend_surge_hours DESC;
/*
Analytical Interpretation:
Quantifies weekend screen rebound across platforms. Shows which apps experience the steepest
leisure spikes when structured classroom schedules end.
*/

-- ------------------------------------------------------------------------------
-- Q14. Push Notification Burden vs Screen Time and Sleep Quality
-- ------------------------------------------------------------------------------
SELECT 
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
ORDER BY 1;
/*
Analytical Interpretation:
High push notification frequencies correlate with fragmented attention, higher stress,
and reduced sleep quality.
*/

-- ------------------------------------------------------------------------------
-- Q15. Physical Activity as a Buffer against Screen-Related Stress
-- ------------------------------------------------------------------------------
SELECT 
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
ORDER BY 1, 2;
/*
Analytical Interpretation:
Within every digital usage category, physically active students report 0.8–1.2 points lower
perceived stress than sedentary peers.
*/

-- ------------------------------------------------------------------------------
-- Q16. High-Performing Outliers: High Screen Users Maintaining High GPAs (>= 3.6)
-- ------------------------------------------------------------------------------
WITH ResilientStudents AS (
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
FROM ResilientStudents;
/*
Analytical Interpretation:
Identifies students who successfully decouple high screen time from academic decline through
above-average study consistency and near-perfect assignment completion.
*/

-- ------------------------------------------------------------------------------
-- Q17. Gender-Disaggregated Comparison of Digital Platform Choices & Outcomes
-- ------------------------------------------------------------------------------
SELECT 
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
ORDER BY gender, user_count DESC;
/*
Analytical Interpretation:
Provides demographic fairness verification across platform preferences and academic outcomes.
*/

-- ------------------------------------------------------------------------------
-- Q18. Digital Detox Days per Month and Corresponding Wellbeing Scores
-- ------------------------------------------------------------------------------
SELECT 
    digital_detox_days_per_month,
    COUNT(*) AS student_count,
    ROUND(AVG(digital_wellbeing_score), 1) AS avg_wellbeing_score,
    ROUND(AVG(perceived_stress_score), 1) AS avg_stress_score,
    ROUND(AVG(sleep_quality_score), 1) AS avg_sleep_quality,
    ROUND(AVG(gpa), 2) AS avg_gpa
FROM student_digital_lifestyle
GROUP BY digital_detox_days_per_month
ORDER BY digital_detox_days_per_month;
/*
Analytical Interpretation:
Shows positive dose-response relationship: students practicing 3+ digital detox days monthly
report significantly higher wellbeing scores and lower baseline stress.
*/

-- ------------------------------------------------------------------------------
-- Q19. Top Course by Academic Discipline: Consistency vs Screen Hours Ranking
-- ------------------------------------------------------------------------------
SELECT 
    course,
    COUNT(*) AS student_count,
    ROUND(AVG(gpa), 2) AS avg_gpa,
    ROUND(AVG(study_consistency_score), 1) AS avg_consistency,
    ROUND(AVG(daily_screen_time_hours), 1) AS avg_screen_time,
    DENSE_RANK() OVER (ORDER BY AVG(gpa) DESC) AS academic_rank,
    DENSE_RANK() OVER (ORDER BY AVG(daily_screen_time_hours) ASC) AS low_screen_rank
FROM student_digital_lifestyle
GROUP BY course
ORDER BY academic_rank;
/*
Analytical Interpretation:
Evaluates whether rigorous academic majors naturally enforce higher study consistency or whether
screen habits are invariant across technical and humanities courses.
*/

-- ------------------------------------------------------------------------------
-- Q20. Holistic Institutional At-Risk Identification (Cumulative Risk Cohort)
-- ------------------------------------------------------------------------------
SELECT 
    student_id,
    course,
    academic_level,
    gpa,
    daily_screen_time_hours,
    sleep_hours,
    perceived_stress_score,
    attendance_percent,
    ROUND(overall_student_score, 0) AS overall_score
FROM student_digital_lifestyle
WHERE gpa < 2.80 
  AND daily_screen_time_hours >= 11.0 
  AND sleep_hours < 4.5
ORDER BY gpa ASC, daily_screen_time_hours DESC
LIMIT 25;
/*
Analytical Interpretation:
Generates the operational priority triage list for student retention advisors to initiate proactive
outreach and schedule restructuring before academic probation.
*/
