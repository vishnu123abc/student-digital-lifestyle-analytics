-- ==============================================================================
-- Advanced SQL Analysis: Window Functions, Percentiles & Cohort Math
-- ==============================================================================

-- 1. Percentile Ranks and Quartile Stratification of Screen Time by Major
SELECT 
    student_id,
    course,
    daily_screen_time_hours,
    gpa,
    NTILE(4) OVER (PARTITION BY course ORDER BY daily_screen_time_hours) AS course_screen_quartile,
    ROUND(PERCENT_RANK() OVER (PARTITION BY course ORDER BY daily_screen_time_hours), 3) AS course_screen_percentile,
    ROUND(AVG(gpa) OVER (PARTITION BY course), 2) AS course_mean_gpa,
    ROUND(gpa - AVG(gpa) OVER (PARTITION BY course), 2) AS gpa_variance_from_course_mean
FROM student_digital_lifestyle
ORDER BY course, course_screen_percentile DESC;

-- 2. Running Cumulative Contribution of Screen Time to Total Cohort Hours
WITH ScreenRanked AS (
    SELECT 
        student_id,
        primary_platform,
        daily_screen_time_hours,
        SUM(daily_screen_time_hours) OVER () AS total_cohort_screen_hours,
        SUM(daily_screen_time_hours) OVER (ORDER BY daily_screen_time_hours DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_screen_hours
    FROM student_digital_lifestyle
)
SELECT 
    student_id,
    primary_platform,
    daily_screen_time_hours,
    ROUND((running_screen_hours / total_cohort_screen_hours) * 100, 2) AS cumulative_pct_of_total_screen_time
FROM ScreenRanked
LIMIT 100;

-- 3. Median GPA Calculation via Window Function (Emulating MEDIAN in Standard SQL)
WITH OrderedStudents AS (
    SELECT 
        academic_level,
        gpa,
        ROW_NUMBER() OVER (PARTITION BY academic_level ORDER BY gpa) AS row_num,
        COUNT(*) OVER (PARTITION BY academic_level) AS total_count
    FROM student_digital_lifestyle
)
SELECT 
    academic_level,
    ROUND(AVG(gpa), 2) AS calculated_median_gpa
FROM OrderedStudents
WHERE row_num IN (FLOOR((total_count + 1) / 2.0), CEIL((total_count + 1) / 2.0))
GROUP BY academic_level;

-- 4. Multi-Level Z-Score Standardization of Sleep Hours Across Cohorts
WITH Stats AS (
    SELECT 
        academic_level,
        AVG(sleep_hours) AS mean_sleep,
        STDDEV(sleep_hours) AS std_sleep
    FROM student_digital_lifestyle
    GROUP BY academic_level
)
SELECT 
    s.student_id,
    s.academic_level,
    s.sleep_hours,
    ROUND(st.mean_sleep, 2) AS level_mean_sleep,
    ROUND((s.sleep_hours - st.mean_sleep) / NULLIF(st.std_sleep, 0), 2) AS sleep_z_score
FROM student_digital_lifestyle s
JOIN Stats st ON s.academic_level = st.academic_level
WHERE ABS((s.sleep_hours - st.mean_sleep) / NULLIF(st.std_sleep, 0)) >= 2.0
ORDER BY sleep_z_score ASC
LIMIT 50;
