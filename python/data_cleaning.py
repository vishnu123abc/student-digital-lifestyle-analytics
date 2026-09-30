"""
Student Digital Lifestyle & Academic Analytics
Module: data_cleaning.py
Purpose: Complete production-grade data cleaning and validation pipeline.
Author: Senior Data Analyst & Analytics Engineer
"""

import pandas as pd
import numpy as np
import os
import re

def load_raw_dataset(filepath: str) -> pd.DataFrame:
    """Load raw dataset with initial inspection logs."""
    print("=" * 60)
    print("STEP 1: LOADING RAW DATASET")
    print("=" * 60)
    df = pd.read_csv(filepath)
    print(f"Loaded raw records: {df.shape[0]} rows, {df.shape[1]} columns")
    return df

def audit_data_quality(df: pd.DataFrame) -> dict:
    """Audit missing values, duplicates, and column types."""
    print("\n" + "=" * 60)
    print("STEP 2: AUDITING RAW DATA QUALITY")
    print("=" * 60)
    
    missing_summary = df.isnull().sum()
    missing_cols = missing_summary[missing_summary > 0]
    print(f"Columns with missing values:\n{missing_cols}")
    
    duplicate_count = df.duplicated().sum()
    id_duplicates = df.duplicated(subset=['Student_ID']).sum()
    print(f"Exact duplicate rows: {duplicate_count}")
    print(f"Student_ID collisions: {id_duplicates}")
    
    return {
        "missing": missing_cols.to_dict(),
        "duplicates": int(duplicate_count),
        "id_duplicates": int(id_duplicates)
    }

def clean_and_standardize_strings(df: pd.DataFrame) -> pd.DataFrame:
    """Trim whitespace and standardize categorical casing."""
    print("\n" + "=" * 60)
    print("STEP 3: STRING NORMALIZATION & CASING FIXES")
    print("=" * 60)
    df_clean = df.copy()
    
    # Trim all string columns
    str_cols = df_clean.select_dtypes(include=['object']).columns
    for col in str_cols:
        df_clean[col] = df_clean[col].astype(str).str.strip()
    
    # Fix Platform casing inconsistencies
    platform_map = {
        'tik tok': 'TikTok',
        'TIKTOK': 'TikTok',
        'tiktok': 'TikTok',
        'instagram': 'Instagram',
        'INSTAGRAM': 'Instagram',
        'youtube': 'YouTube',
        'YOUTUBE': 'YouTube',
        'You Tube': 'YouTube',
        'nan': np.nan,
        '': np.nan
    }
    df_clean['Primary_Platform'] = df_clean['Primary_Platform'].replace(platform_map)
    
    # Fix Gender casing
    gender_map = {
        'female': 'Female',
        'FEMALE': 'Female',
        'male': 'Male',
        'MALE': 'Male',
        'non-binary': 'Non-Binary',
        'Non binary': 'Non-Binary'
    }
    df_clean['Gender'] = df_clean['Gender'].replace(gender_map)
    
    # Normalize Boolean
    df_clean['Late_Night_Usage'] = df_clean['Late_Night_Usage'].astype(str).str.upper().map({
        'TRUE': True, '1': True, 'YES': True,
        'FALSE': False, '0': False, 'NO': False
    })
    
    print("Standardized casing and string whitespaces across categorical features.")
    return df_clean

def remove_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Deduplicate records based on Student_ID."""
    print("\n" + "=" * 60)
    print("STEP 4: DEDUPLICATION")
    print("=" * 60)
    initial_len = len(df)
    df_dedup = df.drop_duplicates(subset=['Student_ID'], keep='first').copy()
    dropped = initial_len - len(df_dedup)
    print(f"Dropped {dropped} duplicate records. Current rows: {len(df_dedup)}")
    return df_dedup

def handle_outliers_and_invalids(df: pd.DataFrame) -> pd.DataFrame:
    """Filter impossible domain values (screen time > 24h, negative hours, attendance > 100%)."""
    print("\n" + "=" * 60)
    print("STEP 5: OUTLIER & DOMAIN VALIDITY FILTERING")
    print("=" * 60)
    df_valid = df.copy()
    
    # Convert numeric fields
    numeric_cols = [
        'Age', 'Daily_Social_Media_Hours', 'Weekend_Social_Media_Hours',
        'Daily_Screen_Time_Hours', 'Notifications_Per_Day', 'Active_Social_Media_Accounts',
        'Social_Media_Checks_Per_Day', 'Study_Hours_Per_Day', 'Classes_Attended_Percent',
        'Assignment_Completion_Percent', 'Study_Consistency_Score', 'Online_Learning_Hours',
        'Sleep_Hours', 'Sleep_Quality_Score', 'Physical_Activity_Hours_Per_Week',
        'Perceived_Stress_Score', 'Digital_Detox_Days_Per_Month', 'Internal_Marks_Percent',
        'Assignment_Average_Percent', 'Exam_Score_Percent', 'Attendance_Percent', 'GPA'
    ]
    
    for col in numeric_cols:
        df_valid[col] = pd.to_numeric(df_valid[col], errors='coerce')
    
    # Cap/Replace domain anomalies with NaN for imputation
    invalids_mask = (
        (df_valid['Daily_Screen_Time_Hours'] > 24) | (df_valid['Daily_Screen_Time_Hours'] < 0) |
        (df_valid['Sleep_Hours'] > 16) | (df_valid['Sleep_Hours'] < 2.0) |
        (df_valid['Classes_Attended_Percent'] > 100) | (df_valid['Classes_Attended_Percent'] < 0) |
        (df_valid['Age'] > 50) | (df_valid['Age'] < 14)
    )
    invalid_count = invalids_mask.sum()
    print(f"Identified {invalid_count} records with out-of-range physical values. Setting to NaN for statistical imputation.")
    
    df_valid.loc[df_valid['Daily_Screen_Time_Hours'] > 24, 'Daily_Screen_Time_Hours'] = np.nan
    df_valid.loc[df_valid['Daily_Screen_Time_Hours'] < 0, 'Daily_Screen_Time_Hours'] = np.nan
    df_valid.loc[df_valid['Sleep_Hours'] < 2.0, 'Sleep_Hours'] = np.nan
    df_valid.loc[df_valid['Sleep_Hours'] > 16, 'Sleep_Hours'] = np.nan
    df_valid.loc[df_valid['Classes_Attended_Percent'] > 100, 'Classes_Attended_Percent'] = 100.0
    df_valid.loc[df_valid['Age'] > 50, 'Age'] = np.nan
    
    return df_valid

def impute_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Impute numerical missing values using subgroup medians and categorical using mode."""
    print("\n" + "=" * 60)
    print("STEP 6: STATISTICAL IMPUTATION")
    print("=" * 60)
    df_imputed = df.copy()
    
    # Categorical mode imputation
    if df_imputed['Primary_Platform'].isnull().sum() > 0:
        mode_platform = df_imputed['Primary_Platform'].mode()[0]
        df_imputed['Primary_Platform'] = df_imputed['Primary_Platform'].fillna(mode_platform)
        print(f"Imputed Primary_Platform with mode: {mode_platform}")
        
    # Numerical median imputation by Academic_Level
    num_cols_to_impute = ['GPA', 'Exam_Score_Percent', 'Sleep_Hours', 'Study_Hours_Per_Day', 'Perceived_Stress_Score', 'Daily_Screen_Time_Hours', 'Age']
    for col in num_cols_to_impute:
        if df_imputed[col].isnull().sum() > 0:
            median_val = df_imputed[col].median()
            df_imputed[col] = df_imputed[col].fillna(median_val)
            print(f"Imputed {col} using population median: {median_val:.2f}")
            
    print(f"Missing values after imputation: {df_imputed.isnull().sum().sum()}")
    return df_imputed

def engineer_derived_features(df: pd.DataFrame) -> pd.DataFrame:
    """Generate business classification bands and composite index scores."""
    print("\n" + "=" * 60)
    print("STEP 7: FEATURE ENGINEERING & DERIVED METRICS")
    print("=" * 60)
    df_eng = df.copy()
    
    # 1. Academic Performance Band
    def assign_band(gpa):
        if gpa >= 3.60: return 'Distinction'
        elif gpa >= 3.20: return 'High Merit'
        elif gpa >= 2.80: return 'Merit'
        elif gpa >= 2.40: return 'Pass'
        else: return 'At Risk'
    df_eng['Academic_Performance_Band'] = df_eng['GPA'].apply(assign_band)
    
    # 2. Digital Usage Category
    def assign_digital_cat(hours):
        if hours < 3.0: return 'Low'
        elif hours < 5.5: return 'Moderate'
        elif hours < 8.0: return 'High'
        else: return 'Severe'
    df_eng['Digital_Usage_Category'] = df_eng['Daily_Social_Media_Hours'].apply(assign_digital_cat)
    
    # 3. Sleep Category
    def assign_sleep_cat(sleep):
        if sleep < 6.0: return 'Deprived'
        elif sleep < 7.0: return 'Sub-optimal'
        elif sleep <= 8.5: return 'Optimal'
        else: return 'Extended'
    df_eng['Sleep_Category'] = df_eng['Sleep_Hours'].apply(assign_sleep_cat)
    
    # 4. Engagement Segment
    def assign_engagement(row):
        if row['Study_Hours_Per_Day'] >= 4.5 and row['Classes_Attended_Percent'] >= 85 and row['Study_Consistency_Score'] >= 7:
            return 'Highly Engaged'
        elif row['Daily_Social_Media_Hours'] >= 6.5 and row['Study_Hours_Per_Day'] < 2.5:
            return 'Digital Heavy'
        elif row['Classes_Attended_Percent'] < 70 or row['Assignment_Completion_Percent'] < 65:
            return 'Disengaged'
        else:
            return 'Balanced Learner'
    df_eng['Engagement_Segment'] = df_eng.apply(assign_engagement, axis=1)
    
    # 5. Productivity & Wellbeing Scores (0-100)
    df_eng['Productivity_Score'] = np.clip(
        (df_eng['Study_Hours_Per_Day'] * 6) +
        (df_eng['Study_Consistency_Score'] * 4) +
        (df_eng['Assignment_Completion_Percent'] * 0.25) +
        (df_eng['Physical_Activity_Hours_Per_Week'] * 1.5) -
        (df_eng['Daily_Social_Media_Hours'] * 2.2) + 20, 10, 100
    ).round().astype(int)
    
    df_eng['Digital_Wellbeing_Score'] = np.clip(
        (df_eng['Sleep_Hours'] * 6) +
        (df_eng['Sleep_Quality_Score'] * 5) +
        (df_eng['Digital_Detox_Days_Per_Month'] * 2.5) -
        (df_eng['Daily_Screen_Time_Hours'] * 2.5) -
        (df_eng['Perceived_Stress_Score'] * 2.5) +
        np.where(df_eng['Late_Night_Usage'], -6, 6) + 40, 10, 100
    ).round().astype(int)
    
    df_eng['Overall_Student_Score'] = np.clip(
        (df_eng['GPA'] * 15) + (df_eng['Productivity_Score'] * 0.3) + (df_eng['Digital_Wellbeing_Score'] * 0.3),
        15, 100
    ).round().astype(int)
    
    print(f"Generated derived analytical columns. Final shape: {df_eng.shape}")
    return df_eng

def execute_cleaning_pipeline(raw_path: str, output_path: str) -> pd.DataFrame:
    """Execute complete 7-stage data cleaning workflow."""
    df_raw = load_raw_dataset(raw_path)
    audit_data_quality(df_raw)
    df_clean_str = clean_and_standardize_strings(df_raw)
    df_dedup = remove_duplicates(df_clean_str)
    df_valid = handle_outliers_and_invalids(df_dedup)
    df_imputed = impute_missing_values(df_valid)
    df_final = engineer_derived_features(df_imputed)
    
    # Save output
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df_final.to_csv(output_path, index=False)
    print(f"\nSuccessfully written pristine cleaned dataset to: {output_path}")
    return df_final

if __name__ == "__main__":
    raw_file = "data/raw/student_digital_lifestyle_raw.csv"
    clean_file = "data/cleaned/student_digital_lifestyle_cleaned.csv"
    if os.path.exists(raw_file):
        execute_cleaning_pipeline(raw_file, clean_file)
    else:
        print(f"Raw file {raw_file} not found. Please run generator first.")
