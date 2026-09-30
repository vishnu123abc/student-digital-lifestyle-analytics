"""
Student Digital Lifestyle & Academic Analytics
Module: analysis.py
Purpose: Advanced Statistical Modeling, OLS Regression & Cohort Segmentation
Author: Senior Data Analyst & Analytics Engineer
"""

import pandas as pd
import numpy as np
import statsmodels.api as sm
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import os

def perform_multivariate_regression(df: pd.DataFrame):
    """Run Ordinary Least Squares (OLS) regression modeling GPA predictors."""
    print("=" * 60)
    print("MULTIVARIATE OLS REGRESSION (DEPENDENT VARIABLE: GPA)")
    print("=" * 60)
    
    features = [
        'Daily_Screen_Time_Hours', 'Daily_Social_Media_Hours', 'Study_Hours_Per_Day',
        'Study_Consistency_Score', 'Sleep_Hours', 'Attendance_Percent', 'Perceived_Stress_Score'
    ]
    
    X = df[features].copy()
    X = sm.add_constant(X)
    y = df['GPA']
    
    model = sm.OLS(y, X).fit()
    print(model.summary().tables[1])
    print(f"\nR-squared: {model.rsquared:.3f}, Adjusted R-squared: {model.rsquared_adj:.3f}")
    print(f"F-statistic: {model.fvalue:.1f}, Prob (F-statistic): {model.f_pvalue:.2e}")
    
    return model

def analyze_student_segments(df: pd.DataFrame):
    """Analyze behavioral differences across rule-based and k-means segments."""
    print("\n" + "=" * 60)
    print("STUDENT BEHAVIORAL SEGMENT PROFILES")
    print("=" * 60)
    
    segment_cols = ['GPA', 'Daily_Screen_Time_Hours', 'Study_Hours_Per_Day', 'Sleep_Hours', 'Productivity_Score', 'Digital_Wellbeing_Score']
    profile = df.groupby('Engagement_Segment')[segment_cols].mean()
    profile['Student_Count'] = df.groupby('Engagement_Segment')['Student_ID'].count()
    profile['Cohort_Share_%'] = (profile['Student_Count'] / len(df) * 100).round(1)
    
    print(profile.round(2).to_string())
    return profile

def run_kmeans_clustering(df: pd.DataFrame, n_clusters: int = 4):
    """Run unsupervised K-Means clustering as comparative validation."""
    print("\n" + "=" * 60)
    print(f"UNSUPERVISED K-MEANS CLUSTERING (K={n_clusters})")
    print("=" * 60)
    
    cluster_features = [
        'Daily_Social_Media_Hours', 'Daily_Screen_Time_Hours',
        'Study_Hours_Per_Day', 'Sleep_Hours', 'GPA'
    ]
    
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df[cluster_features])
    
    kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
    df['KMeans_Cluster'] = kmeans.fit_predict(scaled_data)
    
    cluster_summary = df.groupby('KMeans_Cluster')[cluster_features].mean()
    cluster_summary['Count'] = df.groupby('KMeans_Cluster')['Student_ID'].count()
    print("K-Means Cluster Centroids (Unscaled Means):")
    print(cluster_summary.round(2).to_string())
    
    return kmeans

if __name__ == "__main__":
    clean_file = "data/cleaned/student_digital_lifestyle_cleaned.csv"
    if os.path.exists(clean_file):
        df_clean = pd.read_csv(clean_file)
        perform_multivariate_regression(df_clean)
        analyze_student_segments(df_clean)
        run_kmeans_clustering(df_clean)
    else:
        print(f"Cleaned dataset {clean_file} not found. Please clean dataset first.")
