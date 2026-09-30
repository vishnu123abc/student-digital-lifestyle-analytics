export interface StudentRecord {
  Student_ID: string;
  Age: number;
  Gender: string;
  City: string;
  State: string;
  Academic_Level: string;
  Course: string;
  Year_of_Study: number;
  Primary_Platform: string;
  Daily_Social_Media_Hours: number;
  Weekend_Social_Media_Hours: number;
  Daily_Screen_Time_Hours: number;
  Notifications_Per_Day: number;
  Active_Social_Media_Accounts: number;
  Late_Night_Usage: boolean;
  Social_Media_Checks_Per_Day: number;
  Study_Hours_Per_Day: number;
  Classes_Attended_Percent: number;
  Assignment_Completion_Percent: number;
  Study_Consistency_Score: number;
  Online_Learning_Hours: number;
  Sleep_Hours: number;
  Sleep_Quality_Score: number;
  Physical_Activity_Hours_Per_Week: number;
  Perceived_Stress_Score: number;
  Social_Comparison_Frequency: string;
  Digital_Detox_Days_Per_Month: number;
  Internal_Marks_Percent: number;
  Assignment_Average_Percent: number;
  Exam_Score_Percent: number;
  Attendance_Percent: number;
  GPA: number;
  Academic_Performance_Band: string;
  Digital_Usage_Category: string;
  Study_Habit_Category: string;
  Sleep_Category: string;
  Academic_Performance_Category: string;
  Engagement_Segment: string;
  Risk_Segment: string;
  Productivity_Score: number;
  Digital_Wellbeing_Score: number;
  Overall_Student_Score: number;
}

export interface SummaryStats {
  totalStudents: number;
  rawCount: number;
  avgGPA: number;
  medianGPA: number;
  stdGPA: number;
  avgScreenTime: number;
  medianScreenTime: number;
  avgSocialHours: number;
  avgSleepHours: number;
  avgStudyHours: number;
  avgStressScore: number;
  avgAttendance: number;
  avgExamScore: number;
  lateNightUsagePct: number;
  highPerformancePct: number;
  highDigitalUsagePct: number;
  avgDigitalWellbeingScore: number;
  avgProductivityScore: number;
}

export interface FilterState {
  gender: string;
  ageGroup: string;
  academicLevel: string;
  course: string;
  yearOfStudy: string;
  city: string;
  state: string;
  platform: string;
  digitalCategory: string;
  performanceBand: string;
  segment: string;
  lateNight: string;
  studyHabitCategory: string;
  sleepCategory: string;
  searchQuery: string;
}

export interface SqlQueryItem {
  id: number;
  title: string;
  question: string;
  category: 'Aggregation' | 'Window Functions' | 'CTE & Cohort' | 'Ranking & Segmentation' | 'Performance Risk';
  sql: string;
  expectedInsight: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface InterviewQuestionItem {
  id: number;
  domain: 'Python/Pandas' | 'SQL' | 'Statistics' | 'BI & Dashboard' | 'Business Analysis' | 'Data Cleaning';
  question: string;
  answer: string;
  keyConcepts: string[];
}
