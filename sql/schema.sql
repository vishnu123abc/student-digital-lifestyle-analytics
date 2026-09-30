-- ==============================================================================
-- Schema Definition: student_digital_lifestyle
-- Table architecture for PostgreSQL / BigQuery / Snowflake / SQLite
-- ==============================================================================

CREATE TABLE IF NOT EXISTS student_digital_lifestyle (
    student_id                      VARCHAR(16) PRIMARY KEY,
    age                             INTEGER NOT NULL CHECK (age BETWEEN 14 AND 40),
    gender                          VARCHAR(24) NOT NULL,
    city                            VARCHAR(40) NOT NULL,
    state                           VARCHAR(10) NOT NULL,
    academic_level                  VARCHAR(32) NOT NULL,
    course                          VARCHAR(48) NOT NULL,
    year_of_study                   INTEGER NOT NULL CHECK (year_of_study BETWEEN 1 AND 4),
    primary_platform                VARCHAR(32) NOT NULL,
    daily_social_media_hours        NUMERIC(4, 1) NOT NULL CHECK (daily_social_media_hours >= 0 AND daily_social_media_hours <= 24),
    weekend_social_media_hours      NUMERIC(4, 1) NOT NULL,
    daily_screen_time_hours         NUMERIC(4, 1) NOT NULL CHECK (daily_screen_time_hours >= 0 AND daily_screen_time_hours <= 24),
    notifications_per_day           INTEGER NOT NULL CHECK (notifications_per_day >= 0),
    active_social_media_accounts    INTEGER NOT NULL CHECK (active_social_media_accounts >= 0),
    late_night_usage                BOOLEAN NOT NULL,
    social_media_checks_per_day     INTEGER NOT NULL,
    study_hours_per_day             NUMERIC(4, 1) NOT NULL CHECK (study_hours_per_day >= 0),
    classes_attended_percent        NUMERIC(5, 1) NOT NULL CHECK (classes_attended_percent BETWEEN 0 AND 100),
    assignment_completion_percent   NUMERIC(5, 1) NOT NULL CHECK (assignment_completion_percent BETWEEN 0 AND 100),
    study_consistency_score         INTEGER NOT NULL CHECK (study_consistency_score BETWEEN 1 AND 10),
    online_learning_hours           NUMERIC(4, 1) NOT NULL,
    sleep_hours                     NUMERIC(4, 1) NOT NULL CHECK (sleep_hours BETWEEN 0 AND 24),
    sleep_quality_score             INTEGER NOT NULL CHECK (sleep_quality_score BETWEEN 1 AND 5),
    physical_activity_hours_per_week NUMERIC(4, 1) NOT NULL,
    perceived_stress_score          INTEGER NOT NULL CHECK (perceived_stress_score BETWEEN 1 AND 10),
    social_comparison_frequency     VARCHAR(24) NOT NULL,
    digital_detox_days_per_month    INTEGER NOT NULL CHECK (digital_detox_days_per_month BETWEEN 0 AND 31),
    internal_marks_percent          NUMERIC(5, 1) NOT NULL,
    assignment_average_percent      NUMERIC(5, 1) NOT NULL,
    exam_score_percent              NUMERIC(5, 1) NOT NULL,
    attendance_percent              NUMERIC(5, 1) NOT NULL,
    gpa                             NUMERIC(4, 2) NOT NULL CHECK (gpa BETWEEN 0.0 AND 4.0),
    academic_performance_band       VARCHAR(24) NOT NULL,
    digital_usage_category          VARCHAR(20) NOT NULL,
    study_habit_category            VARCHAR(32) NOT NULL,
    sleep_category                  VARCHAR(20) NOT NULL,
    academic_performance_category   VARCHAR(24) NOT NULL,
    engagement_segment              VARCHAR(32) NOT NULL,
    risk_segment                    VARCHAR(32) NOT NULL,
    productivity_score              INTEGER NOT NULL CHECK (productivity_score BETWEEN 0 AND 100),
    digital_wellbeing_score         INTEGER NOT NULL CHECK (digital_wellbeing_score BETWEEN 0 AND 100),
    overall_student_score           INTEGER NOT NULL CHECK (overall_student_score BETWEEN 0 AND 100)
);

-- Recommended Performance Indices
CREATE INDEX idx_student_digital_usage ON student_digital_lifestyle(digital_usage_category);
CREATE INDEX idx_student_performance_band ON student_digital_lifestyle(academic_performance_band);
CREATE INDEX idx_student_engagement_segment ON student_digital_lifestyle(engagement_segment);
CREATE INDEX idx_student_platform ON student_digital_lifestyle(primary_platform);
CREATE INDEX idx_student_gpa ON student_digital_lifestyle(gpa);
CREATE INDEX idx_student_screen_time ON student_digital_lifestyle(daily_screen_time_hours);
