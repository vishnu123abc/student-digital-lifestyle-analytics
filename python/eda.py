"""
Student Digital Lifestyle & Academic Analytics
Module: eda.py
Purpose: Exploratory Data Analysis, Statistical Testing & Distribution Profiling
Author: Senior Data Analyst & Analytics Engineer
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import os

# Set styling
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['figure.dpi'] = 120

def run_exploratory_data_analysis(data_path: str, output_fig_dir: str = "reports/figures"):
    """Run comprehensive exploratory data analysis and generate diagnostic charts."""
    print("=" * 60)
    print("RUNNING EXPLORATORY DATA ANALYSIS")
    print("=" * 60)
    
    os.makedirs(output_fig_dir, exist_ok=True)
    df = pd.read_csv(data_path)
    print(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns\n")
    
    # 1. Summary Statistics of Key Numerical Features
    num_cols = [
        'Daily_Screen_Time_Hours', 'Daily_Social_Media_Hours', 'Study_Hours_Per_Day',
        'Sleep_Hours', 'Perceived_Stress_Score', 'Attendance_Percent', 'GPA', 'Productivity_Score'
    ]
    summary_stats = df[num_cols].describe().T[['mean', 'std', 'min', '50%', 'max']]
    summary_stats.columns = ['Mean', 'Std Dev', 'Min', 'Median', 'Max']
    print("Key Numerical Summary:")
    print(summary_stats.round(2))
    
    # 2. Pearson Correlation Matrix
    corr_matrix = df[num_cols].corr()
    print("\nPearson Correlation Matrix:")
    print(corr_matrix.round(3))
    
    # Plot 1: Correlation Heatmap
    plt.figure(figsize=(10, 8))
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
    cmap = sns.diverging_palette(230, 20, as_cmap=True)
    sns.heatmap(corr_matrix, mask=mask, cmap=cmap, vmin=-0.7, vmax=0.7,
                annot=True, fmt=".2f", square=True, linewidths=.5, cbar_kws={"shrink": .8})
    plt.title("Correlation Matrix: Digital Behavior, Lifestyle & Academic Outcomes", fontsize=13, pad=12)
    plt.tight_layout()
    plt.savefig(os.path.join(output_fig_dir, "correlation_heatmap.png"))
    plt.close()
    print("\nGenerated: correlation_heatmap.png")
    
    # Plot 2: GPA Distribution by Digital Usage Category
    plt.figure(figsize=(9, 5))
    palette = {'Low': '#10B981', 'Moderate': '#3B82F6', 'High': '#F59E0B', 'Severe': '#EF4444'}
    order = ['Low', 'Moderate', 'High', 'Severe']
    sns.boxplot(x='Digital_Usage_Category', y='GPA', data=df, order=order, palette=palette, width=0.5, fliersize=2)
    plt.title("GPA Distribution Across Digital Usage Categories", fontsize=12, pad=10)
    plt.xlabel("Digital Usage Category (Social Media Hours)")
    plt.ylabel("Grade Point Average (GPA)")
    plt.tight_layout()
    plt.savefig(os.path.join(output_fig_dir, "gpa_by_digital_category_boxplot.png"))
    plt.close()
    print("Generated: gpa_by_digital_category_boxplot.png")
    
    # Plot 3: Scatter Plot Screen Time vs Sleep Duration
    plt.figure(figsize=(9, 5))
    sns.regplot(x='Daily_Screen_Time_Hours', y='Sleep_Hours', data=df.sample(2000, random_state=42),
                scatter_kws={'alpha': 0.25, 'color': '#6366F1', 's': 18},
                line_kws={'color': '#DC2626', 'linewidth': 2})
    plt.title("Daily Screen Time vs. Sleep Duration (Sample N=2,000)", fontsize=12, pad=10)
    plt.xlabel("Daily Screen Time (Hours)")
    plt.ylabel("Sleep Duration (Hours)")
    plt.tight_layout()
    plt.savefig(os.path.join(output_fig_dir, "screentime_vs_sleep_scatter.png"))
    plt.close()
    print("Generated: screentime_vs_sleep_scatter.png")
    
    # 3. Statistical Hypothesis Testing
    print("\n" + "=" * 60)
    print("STATISTICAL INFERENCE & HYPOTHESIS TESTING")
    print("=" * 60)
    
    # ANOVA: GPA across Digital Usage Categories
    low_gpa = df[df['Digital_Usage_Category'] == 'Low']['GPA']
    mod_gpa = df[df['Digital_Usage_Category'] == 'Moderate']['GPA']
    high_gpa = df[df['Digital_Usage_Category'] == 'High']['GPA']
    sev_gpa = df[df['Digital_Usage_Category'] == 'Severe']['GPA']
    
    f_stat, p_val = stats.f_oneway(low_gpa, mod_gpa, high_gpa, sev_gpa)
    print(f"One-way ANOVA (GPA across Digital Categories): F-statistic = {f_stat:.2f}, p-value = {p_val:.2e}")
    
    # Two-Sample t-test: Sleep hours between Late Night vs Non-Late Night
    late_sleep = df[df['Late_Night_Usage'] == True]['Sleep_Hours']
    non_late_sleep = df[df['Late_Night_Usage'] == False]['Sleep_Hours']
    t_stat, t_pval = stats.ttest_ind(late_sleep, non_late_sleep, equal_var=False)
    print(f"Welch's t-test (Sleep: Late-Night vs Non-Late): t = {t_stat:.2f}, p-value = {t_pval:.2e}")
    print(f"  Late-Night Mean Sleep: {late_sleep.mean():.2f} hrs vs Non-Late Mean Sleep: {non_late_sleep.mean():.2f} hrs")
    
    print("\nEDA Profiling complete.")

if __name__ == "__main__":
    clean_file = "data/cleaned/student_digital_lifestyle_cleaned.csv"
    if os.path.exists(clean_file):
        run_exploratory_data_analysis(clean_file)
    else:
        print(f"Cleaned dataset {clean_file} not found. Please clean dataset first.")
