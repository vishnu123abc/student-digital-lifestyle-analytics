-- ==============================================================================
-- SQL Data Quality & Validation Audit Suite
-- ==============================================================================

-- 1. Identify Duplicate Student IDs
SELECT 
    student_id, 
    COUNT(*) AS occurrence_count
FROM student_digital_lifestyle
GROUP BY student_id
HAVING COUNT(*) > 1;

-- 2. Detect Missing / Null Values Across Core Analytical Metrics
SELECT
    SUM(CASE WHEN student_id IS NULL THEN 1 ELSE 0 END) AS null_student_id,
    SUM(CASE WHEN gpa IS NULL THEN 1 ELSE 0 END) AS null_gpa,
    SUM(CASE WHEN daily_screen_time_hours IS NULL THEN 1 ELSE 0 END) AS null_screen_time,
    SUM(CASE WHEN sleep_hours IS NULL THEN 1 ELSE 0 END) AS null_sleep_hours,
    SUM(CASE WHEN primary_platform IS NULL THEN 1 ELSE 0 END) AS null_platform,
    SUM(CASE WHEN exam_score_percent IS NULL THEN 1 ELSE 0 END) AS null_exam_score
FROM student_digital_lifestyle;

-- 3. Detect Out-of-Bounds & Impossible Numerical Values
SELECT
    COUNT(*) AS total_invalid_records,
    SUM(CASE WHEN gpa < 0.0 OR gpa > 4.0 THEN 1 ELSE 0 END) AS invalid_gpa,
    SUM(CASE WHEN daily_screen_time_hours > 24.0 OR daily_screen_time_hours < 0 THEN 1 ELSE 0 END) AS invalid_screen_time,
    SUM(CASE WHEN sleep_hours > 24.0 OR sleep_hours < 0 THEN 1 ELSE 0 END) AS invalid_sleep_hours,
    SUM(CASE WHEN classes_attended_percent > 100.0 OR classes_attended_percent < 0 THEN 1 ELSE 0 END) AS invalid_attendance,
    SUM(CASE WHEN age < 14 OR age > 60 THEN 1 ELSE 0 END) AS invalid_age
FROM student_digital_lifestyle;

-- 4. Check for Inconsistent Categorical Values (Leading/Trailing Spaces & Casing)
SELECT DISTINCT primary_platform
FROM student_digital_lifestyle
WHERE primary_platform != TRIM(primary_platform)
   OR LOWER(primary_platform) IN ('tik tok', 'tiktok', 'instagram', 'youtube');

-- 5. Validate Derived Category Logic Invariants
SELECT 
    COUNT(*) AS logic_mismatch_count
FROM student_digital_lifestyle
WHERE (daily_social_media_hours < 3.0 AND digital_usage_category != 'Low')
   OR (daily_social_media_hours >= 8.0 AND digital_usage_category != 'Severe')
   OR (gpa >= 3.60 AND academic_performance_band != 'Distinction');
