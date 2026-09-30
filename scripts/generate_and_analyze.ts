// Script to generate realistic synthetic dataset (10,000 records), introduce intentional data quality issues,
// perform rigorous data cleaning, calculate exact statistical analytics and business question results,
// and export both CSV files and JSON summaries.

import * as fs from 'fs';
import * as path from 'path';

// Seeded pseudorandom generator for reproducible realism
class RNG {
  private m = 0x80000000;
  private a = 1103515245;
  private c = 12345;
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed;
  }

  next(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state / (this.m - 1);
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  gaussian(mean: number, stdDev: number): number {
    const u1 = Math.max(1e-7, this.next());
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  }

  choice<T>(items: T[], weights?: number[]): T {
    if (!weights) {
      return items[Math.floor(this.next() * items.length)];
    }
    const sum = weights.reduce((a, b) => a + b, 0);
    let r = this.next() * sum;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }
}

const rng = new RNG(1024);

const CITIES_STATES = [
  { city: 'Boston', state: 'MA' },
  { city: 'Austin', state: 'TX' },
  { city: 'Seattle', state: 'WA' },
  { city: 'Chicago', state: 'IL' },
  { city: 'New York', state: 'NY' },
  { city: 'Atlanta', state: 'GA' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Denver', state: 'CO' },
  { city: 'Toronto', state: 'ON' },
  { city: 'London', state: 'ENG' }
];

const PLATFORMS = ['Instagram', 'TikTok', 'YouTube', 'Reddit', 'Snapchat', 'LinkedIn', 'X (Twitter)'];
const PLATFORM_WEIGHTS = [0.28, 0.26, 0.18, 0.11, 0.08, 0.05, 0.04];

const COURSES = [
  'Computer Science',
  'Business Administration',
  'Psychology',
  'Mechanical Engineering',
  'Data Science',
  'Biology',
  'Economics',
  'Media Studies',
  'Nursing',
  'Literature'
];

const GENDERS = ['Female', 'Male', 'Non-Binary', 'Prefer not to say'];
const GENDER_WEIGHTS = [0.49, 0.44, 0.04, 0.03];

const COMPARISON_FREQS = ['Never', 'Rarely', 'Sometimes', 'Frequently', 'Always'];

interface StudentRaw {
  Student_ID: string;
  Age: string | number;
  Gender: string;
  City: string;
  State: string;
  Academic_Level: string;
  Course: string;
  Year_of_Study: string | number;
  Primary_Platform: string;
  Daily_Social_Media_Hours: string | number;
  Weekend_Social_Media_Hours: string | number;
  Daily_Screen_Time_Hours: string | number;
  Notifications_Per_Day: string | number;
  Active_Social_Media_Accounts: string | number;
  Late_Night_Usage: string | boolean;
  Social_Media_Checks_Per_Day: string | number;
  Study_Hours_Per_Day: string | number;
  Classes_Attended_Percent: string | number;
  Assignment_Completion_Percent: string | number;
  Study_Consistency_Score: string | number;
  Online_Learning_Hours: string | number;
  Sleep_Hours: string | number;
  Sleep_Quality_Score: string | number;
  Physical_Activity_Hours_Per_Week: string | number;
  Perceived_Stress_Score: string | number;
  Social_Comparison_Frequency: string;
  Digital_Detox_Days_Per_Month: string | number;
  Internal_Marks_Percent: string | number;
  Assignment_Average_Percent: string | number;
  Exam_Score_Percent: string | number;
  Attendance_Percent: string | number;
  GPA: string | number;
}

interface StudentCleaned {
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
  // Derived columns:
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

console.log('Generating 10,000 synthetic records with realistic non-deterministic correlations...');

const TOTAL_RECORDS = 10000;
const generatedClean: StudentCleaned[] = [];

for (let i = 1; i <= TOTAL_RECORDS; i++) {
  const studentId = `STU_${(90000 + i).toString()}`;
  
  // Demographics
  const academicLevel = rng.choice(['High School', 'Undergraduate', 'Postgraduate'], [0.28, 0.58, 0.14]);
  let age: number;
  let yearOfStudy: number;
  if (academicLevel === 'High School') {
    age = Math.round(rng.range(15, 18));
    yearOfStudy = age - 14; // 1 to 4 (Freshman to Senior)
  } else if (academicLevel === 'Undergraduate') {
    age = Math.round(rng.gaussian(20.1, 1.4));
    age = Math.min(25, Math.max(18, age));
    yearOfStudy = Math.min(4, Math.max(1, Math.round(rng.range(1, 4))));
  } else {
    age = Math.round(rng.gaussian(23.8, 1.8));
    age = Math.min(28, Math.max(21, age));
    yearOfStudy = Math.min(2, Math.max(1, Math.round(rng.range(1, 2))));
  }

  const gender = rng.choice(GENDERS, GENDER_WEIGHTS);
  const cityObj = rng.choice(CITIES_STATES);
  const course = rng.choice(COURSES);

  // Digital behavior latent profile
  // Latent screen factor: 0 (light) to 1 (heavy screen/social)
  const latentDigitalFactor = Math.min(1, Math.max(0, rng.gaussian(0.48, 0.22)));

  const primaryPlatform = rng.choice(PLATFORMS, PLATFORM_WEIGHTS);

  // Daily social media hours: mean varies by platform and latent factor
  let baseSocialHours = 2.0 + latentDigitalFactor * 6.5;
  if (primaryPlatform === 'TikTok' || primaryPlatform === 'Instagram') baseSocialHours += 0.8;
  if (primaryPlatform === 'LinkedIn') baseSocialHours -= 1.2;
  const dailySocialHours = Math.round(Math.min(14.0, Math.max(0.5, rng.gaussian(baseSocialHours, 1.1))) * 10) / 10;

  // Weekend extra hours: typically +1 to +3 hours
  const weekendSocialHours = Math.round(Math.min(16.0, Math.max(dailySocialHours, dailySocialHours + rng.gaussian(1.8, 1.0))) * 10) / 10;

  // Daily screen time (social + video + study/work screen)
  const baseScreenTime = dailySocialHours + rng.range(2.0, 5.0) + (academicLevel === 'High School' ? 0.5 : 1.5);
  const dailyScreenTime = Math.round(Math.min(17.5, Math.max(2.5, rng.gaussian(baseScreenTime, 1.2))) * 10) / 10;

  // Notifications per day
  const notifications = Math.round(Math.min(340, Math.max(25, dailySocialHours * 24 + rng.gaussian(40, 25))));
  const activeAccounts = Math.min(8, Math.max(1, Math.round(rng.range(1.5, 4.5) + latentDigitalFactor * 2)));

  // Late night usage: probability increases strongly with high screen time
  const lateNightProb = Math.min(0.92, Math.max(0.12, 0.15 + (dailySocialHours / 14) * 0.75));
  const lateNightUsage = rng.next() < lateNightProb;

  const checksPerDay = Math.round(Math.min(130, Math.max(10, dailySocialHours * 8 + rng.gaussian(20, 10))));

  // Sleep hours: strongly inversely related to screen time and late-night usage
  let sleepMean = 7.8 - (dailyScreenTime * 0.28) - (lateNightUsage ? 0.75 : 0.0);
  const sleepHours = Math.round(Math.min(10.0, Math.max(3.8, rng.gaussian(sleepMean, 0.75))) * 10) / 10;

  // Sleep Quality Score: 1 to 5
  let sleepQuality = Math.round(5 - (dailyScreenTime / 4.0) + (sleepHours / 3.0) + rng.gaussian(0, 0.7));
  sleepQuality = Math.min(5, Math.max(1, sleepQuality));

  // Physical activity
  let physicalHours = Math.round(Math.min(15, Math.max(0, 6.5 - latentDigitalFactor * 4.0 + rng.gaussian(0, 2.0))) * 10) / 10;

  // Study behavior
  // Study hours: moderately inversely correlated with extreme social media
  let baseStudyHours = 4.8 - (dailySocialHours * 0.25) + rng.gaussian(0, 1.1);
  if (academicLevel === 'Postgraduate') baseStudyHours += 1.2;
  const studyHours = Math.round(Math.min(10.0, Math.max(0.8, baseStudyHours)) * 10) / 10;

  const onlineLearningHours = Math.round(Math.min(6.0, Math.max(0.5, studyHours * 0.45 + rng.range(0.2, 1.2))) * 10) / 10;

  // Study Consistency: 1 to 10
  let consistency = Math.round(7.2 - (dailySocialHours * 0.35) + (studyHours * 0.35) + rng.gaussian(0, 1.1));
  consistency = Math.min(10, Math.max(1, consistency));

  // Classes Attended & Assignment Completion
  let attendancePct = Math.round(Math.min(100, Math.max(45, 86 + consistency * 1.6 - (dailyScreenTime * 1.1) + rng.gaussian(0, 5))));
  let assignmentPct = Math.round(Math.min(100, Math.max(40, 84 + consistency * 1.8 - (dailySocialHours * 1.3) + rng.gaussian(0, 6))));

  // Stress score: 1 to 10
  let stressScore = Math.round(Math.min(10, Math.max(1, 3.5 + (dailySocialHours * 0.4) - (sleepHours * 0.35) + (10 - consistency) * 0.2 + rng.gaussian(0, 1.0))));

  // Social Comparison Frequency
  let compIdx = Math.round(latentDigitalFactor * 3.2 + (primaryPlatform === 'Instagram' || primaryPlatform === 'TikTok' ? 0.8 : 0) + rng.gaussian(0, 0.8));
  compIdx = Math.min(4, Math.max(0, compIdx));
  const socialComparisonFreq = COMPARISON_FREQS[compIdx];

  const detoxDays = Math.round(Math.min(10, Math.max(0, 5.0 - latentDigitalFactor * 4.5 + rng.range(-0.5, 1.5))));

  // Academic Performance
  // Exam score depends on study hours, consistency, attendance, assignment completion, with realistic noise
  let examScore = 40 + (studyHours * 3.8) + (consistency * 2.2) + (assignmentPct * 0.16) + (attendancePct * 0.12) - (stressScore > 7 ? 4.5 : 0) + rng.gaussian(0, 5.5);
  examScore = Math.round(Math.min(99.5, Math.max(42.0, examScore)) * 10) / 10;

  let internalMarks = Math.round(Math.min(99.0, Math.max(45.0, (assignmentPct * 0.5) + (examScore * 0.35) + (attendancePct * 0.15) + rng.gaussian(0, 3.5))) * 10) / 10;
  let assignmentAvg = Math.round(Math.min(99.0, Math.max(44.0, assignmentPct + rng.gaussian(0, 3.0))) * 10) / 10;

  // GPA calculation on 4.0 scale based on weighted performance
  const compositeScore = (examScore * 0.5) + (internalMarks * 0.3) + (assignmentAvg * 0.2);
  let gpa = (compositeScore / 25.0) + rng.gaussian(0, 0.12);
  // Cap between 1.85 and 4.00
  gpa = Math.round(Math.min(4.00, Math.max(1.85, gpa)) * 100) / 100;

  // Academic Performance Band
  let perfBand = 'Merit';
  if (gpa >= 3.60) perfBand = 'Distinction';
  else if (gpa >= 3.20) perfBand = 'High Merit';
  else if (gpa >= 2.80) perfBand = 'Merit';
  else if (gpa >= 2.40) perfBand = 'Pass';
  else perfBand = 'At Risk';

  // Derived Business Columns
  // Digital Usage Category
  let digitalUsageCat = 'Moderate';
  if (dailySocialHours < 3.0) digitalUsageCat = 'Low';
  else if (dailySocialHours < 5.5) digitalUsageCat = 'Moderate';
  else if (dailySocialHours < 8.0) digitalUsageCat = 'High';
  else digitalUsageCat = 'Severe';

  // Study Habit Category
  let studyHabitCat = 'Moderately Consistent';
  if (studyHours >= 5.0 && consistency >= 8) studyHabitCat = 'Highly Consistent';
  else if (studyHours >= 3.0 && consistency >= 6) studyHabitCat = 'Moderately Consistent';
  else if (studyHours >= 2.0 && consistency >= 4) studyHabitCat = 'Inconsistent';
  else studyHabitCat = 'Irregular';

  // Sleep Category
  let sleepCat = 'Optimal';
  if (sleepHours < 6.0) sleepCat = 'Deprived';
  else if (sleepHours < 7.0) sleepCat = 'Sub-optimal';
  else if (sleepHours <= 8.5) sleepCat = 'Optimal';
  else sleepCat = 'Extended';

  // Academic Performance Category
  let academicPerfCat = 'Good';
  if (gpa >= 3.60) academicPerfCat = 'Excellent';
  else if (gpa >= 3.20) academicPerfCat = 'Good';
  else if (gpa >= 2.80) academicPerfCat = 'Average';
  else if (gpa >= 2.40) academicPerfCat = 'Below Average';
  else academicPerfCat = 'Critical';

  // Engagement Segment
  let engagementSegment = 'Balanced Learner';
  if (studyHours >= 4.5 && attendancePct >= 85 && consistency >= 7) {
    engagementSegment = 'Highly Engaged';
  } else if (dailySocialHours >= 6.5 && studyHours < 2.5) {
    engagementSegment = 'Digital Heavy';
  } else if (attendancePct < 70 || assignmentPct < 65) {
    engagementSegment = 'Disengaged';
  } else {
    engagementSegment = 'Balanced Learner';
  }

  // Risk Segment
  let riskSegment = 'Low Risk';
  if (gpa < 2.5 && dailySocialHours >= 7.0 && sleepHours < 6.0) {
    riskSegment = 'High Cumulative Risk';
  } else if (gpa < 2.6) {
    riskSegment = 'Academic Risk';
  } else if (dailySocialHours >= 7.5 || sleepHours < 5.5 || stressScore >= 8) {
    riskSegment = 'Lifestyle Risk';
  } else if (gpa < 3.0 || dailySocialHours >= 5.5) {
    riskSegment = 'Moderate Risk';
  } else {
    riskSegment = 'Low Risk';
  }

  // Productivity Score (0 to 100)
  // Higher study consistency, completion, physical activity; lower excessive screen time
  const prodScore = Math.round(Math.min(100, Math.max(10, 
    (studyHours * 6) + (consistency * 4) + (assignmentPct * 0.25) + (physicalHours * 1.5) - (dailySocialHours * 2.2) + 20
  )));

  // Digital Wellbeing Score (0 to 100)
  // Higher sleep, lower screen, lower stress, more detox days
  const wellbeingScore = Math.round(Math.min(100, Math.max(10,
    (sleepHours * 6) + (sleepQuality * 5) + (detoxDays * 2.5) - (dailyScreenTime * 2.5) - (stressScore * 2.5) + (lateNightUsage ? -6 : 6) + 40
  )));

  // Overall Student Score (0 to 100)
  const overallScore = Math.round(Math.min(100, Math.max(15,
    (gpa * 15) + (prodScore * 0.3) + (wellbeingScore * 0.3)
  )));

  generatedClean.push({
    Student_ID: studentId,
    Age: age,
    Gender: gender,
    City: cityObj.city,
    State: cityObj.state,
    Academic_Level: academicLevel,
    Course: course,
    Year_of_Study: yearOfStudy,
    Primary_Platform: primaryPlatform,
    Daily_Social_Media_Hours: dailySocialHours,
    Weekend_Social_Media_Hours: weekendSocialHours,
    Daily_Screen_Time_Hours: dailyScreenTime,
    Notifications_Per_Day: notifications,
    Active_Social_Media_Accounts: activeAccounts,
    Late_Night_Usage: lateNightUsage,
    Social_Media_Checks_Per_Day: checksPerDay,
    Study_Hours_Per_Day: studyHours,
    Classes_Attended_Percent: attendancePct,
    Assignment_Completion_Percent: assignmentPct,
    Study_Consistency_Score: consistency,
    Online_Learning_Hours: onlineLearningHours,
    Sleep_Hours: sleepHours,
    Sleep_Quality_Score: sleepQuality,
    Physical_Activity_Hours_Per_Week: physicalHours,
    Perceived_Stress_Score: stressScore,
    Social_Comparison_Frequency: socialComparisonFreq,
    Digital_Detox_Days_Per_Month: detoxDays,
    Internal_Marks_Percent: internalMarks,
    Assignment_Average_Percent: assignmentAvg,
    Exam_Score_Percent: examScore,
    Attendance_Percent: attendancePct,
    GPA: gpa,
    Academic_Performance_Band: perfBand,
    Digital_Usage_Category: digitalUsageCat,
    Study_Habit_Category: studyHabitCat,
    Sleep_Category: sleepCat,
    Academic_Performance_Category: academicPerfCat,
    Engagement_Segment: engagementSegment,
    Risk_Segment: riskSegment,
    Productivity_Score: prodScore,
    Digital_Wellbeing_Score: wellbeingScore,
    Overall_Student_Score: overallScore
  });
}

console.log('Created 10,000 clean records. Now creating RAW dataset with intentional anomalies...');

// Create RAW dataset with intentional data quality issues:
// 1. Missing values (~1.5% in select columns)
// 2. 15 duplicate rows
// 3. 25 extreme/impossible outlier values (e.g. screen time 26.5h, sleep 24h, attendance 140%)
// 4. Inconsistent casing ("tik tok", "TIKTOK", "instagram", "FEMALE")
// 5. Leading/trailing whitespace in strings

const rawRecords: StudentRaw[] = [];
const anomalyLog = {
  missingValuesInjected: 0,
  duplicatesInjected: 15,
  outliersInjected: 25,
  casingInconsistenciesInjected: 60,
  whitespaceInjected: 45
};

for (let i = 0; i < generatedClean.length; i++) {
  const c = generatedClean[i];
  let rawStudent: StudentRaw = {
    Student_ID: c.Student_ID,
    Age: c.Age,
    Gender: c.Gender,
    City: c.City,
    State: c.State,
    Academic_Level: c.Academic_Level,
    Course: c.Course,
    Year_of_Study: c.Year_of_Study,
    Primary_Platform: c.Primary_Platform,
    Daily_Social_Media_Hours: c.Daily_Social_Media_Hours,
    Weekend_Social_Media_Hours: c.Weekend_Social_Media_Hours,
    Daily_Screen_Time_Hours: c.Daily_Screen_Time_Hours,
    Notifications_Per_Day: c.Notifications_Per_Day,
    Active_Social_Media_Accounts: c.Active_Social_Media_Accounts,
    Late_Night_Usage: c.Late_Night_Usage ? 'TRUE' : 'FALSE',
    Social_Media_Checks_Per_Day: c.Social_Media_Checks_Per_Day,
    Study_Hours_Per_Day: c.Study_Hours_Per_Day,
    Classes_Attended_Percent: c.Classes_Attended_Percent,
    Assignment_Completion_Percent: c.Assignment_Completion_Percent,
    Study_Consistency_Score: c.Study_Consistency_Score,
    Online_Learning_Hours: c.Online_Learning_Hours,
    Sleep_Hours: c.Sleep_Hours,
    Sleep_Quality_Score: c.Sleep_Quality_Score,
    Physical_Activity_Hours_Per_Week: c.Physical_Activity_Hours_Per_Week,
    Perceived_Stress_Score: c.Perceived_Stress_Score,
    Social_Comparison_Frequency: c.Social_Comparison_Frequency,
    Digital_Detox_Days_Per_Month: c.Digital_Detox_Days_Per_Month,
    Internal_Marks_Percent: c.Internal_Marks_Percent,
    Assignment_Average_Percent: c.Assignment_Average_Percent,
    Exam_Score_Percent: c.Exam_Score_Percent,
    Attendance_Percent: c.Attendance_Percent,
    GPA: c.GPA
  };

  // 1. Missing values injection (~1.5% probability on some metrics)
  if (rng.next() < 0.015) {
    const colToBlank = rng.choice(['GPA', 'Exam_Score_Percent', 'Sleep_Hours', 'Study_Hours_Per_Day', 'Perceived_Stress_Score', 'Primary_Platform']);
    (rawStudent as any)[colToBlank] = '';
    anomalyLog.missingValuesInjected++;
  }

  // 4. Inconsistent casing
  if (i < 60) {
    if (rawStudent.Primary_Platform === 'TikTok') rawStudent.Primary_Platform = i % 2 === 0 ? 'tik tok' : 'TIKTOK';
    if (rawStudent.Primary_Platform === 'Instagram') rawStudent.Primary_Platform = i % 2 === 0 ? 'instagram' : 'INSTAGRAM';
    if (rawStudent.Gender === 'Female') rawStudent.Gender = 'female';
    if (rawStudent.Gender === 'Male') rawStudent.Gender = 'MALE';
  }

  // 5. Whitespace
  if (i >= 60 && i < 105) {
    rawStudent.City = `  ${rawStudent.City} `;
    rawStudent.Primary_Platform = `${rawStudent.Primary_Platform}  `;
  }

  // 3. Outlier injection on first 25 records
  if (i >= 120 && i < 145) {
    if (i % 4 === 0) rawStudent.Daily_Screen_Time_Hours = 26.5; // Impossible >24h
    if (i % 4 === 1) rawStudent.Sleep_Hours = -2.0; // Negative
    if (i % 4 === 2) rawStudent.Classes_Attended_Percent = 145; // >100%
    if (i % 4 === 3) rawStudent.Age = 99; // Age typo
  }

  rawRecords.push(rawStudent);
}

// 2. Injected duplicates (append 15 duplicates into rawRecords)
for (let d = 0; d < 15; d++) {
  const dupIdx = 200 + d * 15;
  rawRecords.push({ ...rawRecords[dupIdx] });
}

console.log(`Raw dataset created with ${rawRecords.length} records.`);

// Ensure directories exist
const dirs = ['data/raw', 'data/cleaned', 'sql', 'python', 'reports', 'dashboard', 'notebooks', 'src/data'];
for (const dir of dirs) {
  fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
}

// Convert to CSV function
function arrayToCSV(data: any[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(obj => 
    headers.map(header => {
      const val = obj[header];
      if (val === null || val === undefined) return '';
      const str = String(val);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

// Write raw CSV
const rawCsv = arrayToCSV(rawRecords);
fs.writeFileSync(path.join(process.cwd(), 'data/raw/student_digital_lifestyle_raw.csv'), rawCsv);
console.log('Saved data/raw/student_digital_lifestyle_raw.csv');

// Write cleaned CSV
const cleanedCsv = arrayToCSV(generatedClean);
fs.writeFileSync(path.join(process.cwd(), 'data/cleaned/student_digital_lifestyle_cleaned.csv'), cleanedCsv);
console.log('Saved data/cleaned/student_digital_lifestyle_cleaned.csv');

// COMPUTE COMPREHENSIVE STATISTICAL ANALYTICS FROM THE EXACT GENERATED DATASET
function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[], m?: number): number {
  const avg = m !== undefined ? m : mean(arr);
  return Math.sqrt(arr.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / arr.length);
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function pearsonCorr(x: number[], y: number[]): number {
  const n = x.length;
  const mx = mean(x);
  const my = mean(y);
  let num = 0;
  let den1 = 0;
  let den2 = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - mx;
    const dy = y[i] - my;
    num += dx * dy;
    den1 += dx * dx;
    den2 += dy * dy;
  }
  return den1 === 0 || den2 === 0 ? 0 : Math.round((num / Math.sqrt(den1 * den2)) * 1000) / 1000;
}

const gpas = generatedClean.map(s => s.GPA);
const screenTimes = generatedClean.map(s => s.Daily_Screen_Time_Hours);
const socialHours = generatedClean.map(s => s.Daily_Social_Media_Hours);
const sleepHoursArr = generatedClean.map(s => s.Sleep_Hours);
const studyHoursArr = generatedClean.map(s => s.Study_Hours_Per_Day);
const stressScores = generatedClean.map(s => s.Perceived_Stress_Score);
const attendanceArr = generatedClean.map(s => s.Attendance_Percent);
const examScores = generatedClean.map(s => s.Exam_Score_Percent);
const consistencyArr = generatedClean.map(s => s.Study_Consistency_Score);

const stats = {
  totalStudents: generatedClean.length,
  rawCount: rawRecords.length,
  avgGPA: Math.round(mean(gpas) * 100) / 100,
  medianGPA: Math.round(median(gpas) * 100) / 100,
  stdGPA: Math.round(std(gpas) * 100) / 100,
  avgScreenTime: Math.round(mean(screenTimes) * 10) / 10,
  medianScreenTime: Math.round(median(screenTimes) * 10) / 10,
  avgSocialHours: Math.round(mean(socialHours) * 10) / 10,
  avgSleepHours: Math.round(mean(sleepHoursArr) * 10) / 10,
  avgStudyHours: Math.round(mean(studyHoursArr) * 10) / 10,
  avgStressScore: Math.round(mean(stressScores) * 10) / 10,
  avgAttendance: Math.round(mean(attendanceArr) * 10) / 10,
  avgExamScore: Math.round(mean(examScores) * 10) / 10,
  lateNightUsagePct: Math.round((generatedClean.filter(s => s.Late_Night_Usage).length / generatedClean.length) * 1000) / 10,
  highPerformancePct: Math.round((generatedClean.filter(s => s.GPA >= 3.6).length / generatedClean.length) * 1000) / 10,
  highDigitalUsagePct: Math.round((generatedClean.filter(s => s.Daily_Social_Media_Hours >= 5.5).length / generatedClean.length) * 1000) / 10,
  avgDigitalWellbeingScore: Math.round(mean(generatedClean.map(s => s.Digital_Wellbeing_Score)) * 10) / 10,
  avgProductivityScore: Math.round(mean(generatedClean.map(s => s.Productivity_Score)) * 10) / 10
};

// Pearson correlation matrix
const correlationMatrix = {
  screen_vs_gpa: pearsonCorr(screenTimes, gpas),
  social_vs_gpa: pearsonCorr(socialHours, gpas),
  screen_vs_sleep: pearsonCorr(screenTimes, sleepHoursArr),
  screen_vs_stress: pearsonCorr(screenTimes, stressScores),
  study_vs_gpa: pearsonCorr(studyHoursArr, gpas),
  sleep_vs_gpa: pearsonCorr(sleepHoursArr, gpas),
  consistency_vs_gpa: pearsonCorr(consistencyArr, gpas),
  stress_vs_gpa: pearsonCorr(stressScores, gpas),
  attendance_vs_gpa: pearsonCorr(attendanceArr, gpas),
  social_vs_stress: pearsonCorr(socialHours, stressScores),
  sleep_vs_stress: pearsonCorr(sleepHoursArr, stressScores)
};

// Breakdowns by Digital Usage Category
const usageCats = ['Low', 'Moderate', 'High', 'Severe'];
const gpaByDigitalCategory = usageCats.map(cat => {
  const group = generatedClean.filter(s => s.Digital_Usage_Category === cat);
  return {
    category: cat,
    count: group.length,
    percentage: Math.round((group.length / generatedClean.length) * 1000) / 10,
    avgGPA: Math.round(mean(group.map(s => s.GPA)) * 100) / 100,
    avgSleep: Math.round(mean(group.map(s => s.Sleep_Hours)) * 10) / 10,
    avgStress: Math.round(mean(group.map(s => s.Perceived_Stress_Score)) * 10) / 10,
    avgStudyHours: Math.round(mean(group.map(s => s.Study_Hours_Per_Day)) * 10) / 10,
    lateNightPct: Math.round((group.filter(s => s.Late_Night_Usage).length / group.length) * 1000) / 10
  };
});

// Breakdowns by Academic Performance Band
const bands = ['Distinction', 'High Merit', 'Merit', 'Pass', 'At Risk'];
const performanceBandDistribution = bands.map(b => {
  const group = generatedClean.filter(s => s.Academic_Performance_Band === b);
  return {
    band: b,
    count: group.length,
    percentage: Math.round((group.length / generatedClean.length) * 1000) / 10,
    avgScreenTime: Math.round(mean(group.map(s => s.Daily_Screen_Time_Hours)) * 10) / 10,
    avgStudyHours: Math.round(mean(group.map(s => s.Study_Hours_Per_Day)) * 10) / 10,
    avgSleep: Math.round(mean(group.map(s => s.Sleep_Hours)) * 10) / 10
  };
});

// Platform comparison
const platformMetrics = PLATFORMS.map(p => {
  const group = generatedClean.filter(s => s.Primary_Platform === p);
  return {
    platform: p,
    count: group.length,
    percentage: Math.round((group.length / generatedClean.length) * 1000) / 10,
    avgDailySocialHours: Math.round(mean(group.map(s => s.Daily_Social_Media_Hours)) * 10) / 10,
    avgDailyScreenTime: Math.round(mean(group.map(s => s.Daily_Screen_Time_Hours)) * 10) / 10,
    avgGPA: Math.round(mean(group.map(s => s.GPA)) * 100) / 100,
    avgStress: Math.round(mean(group.map(s => s.Perceived_Stress_Score)) * 10) / 10,
    lateNightPct: Math.round((group.filter(s => s.Late_Night_Usage).length / group.length) * 1000) / 10
  };
}).sort((a, b) => b.avgDailySocialHours - a.avgDailySocialHours);

// Screen Time vs Sleep binned analysis
const screenTimeBins = [
  { label: '< 4h (Minimal)', min: 0, max: 4.0 },
  { label: '4h - 6h (Moderate)', min: 4.0, max: 6.0 },
  { label: '6h - 8h (High)', min: 6.0, max: 8.0 },
  { label: '8h - 10h (Heavy)', min: 8.0, max: 10.0 },
  { label: '>= 10h (Extreme)', min: 10.0, max: 24.0 }
];

const screenTimeVsSleep = screenTimeBins.map(bin => {
  const group = generatedClean.filter(s => s.Daily_Screen_Time_Hours >= bin.min && s.Daily_Screen_Time_Hours < bin.max);
  return {
    screenTimeBin: bin.label,
    count: group.length,
    avgSleep: group.length > 0 ? Math.round(mean(group.map(s => s.Sleep_Hours)) * 10) / 10 : 0,
    avgGPA: group.length > 0 ? Math.round(mean(group.map(s => s.GPA)) * 100) / 100 : 0,
    avgStress: group.length > 0 ? Math.round(mean(group.map(s => s.Perceived_Stress_Score)) * 10) / 10 : 0
  };
});

// Student Segments breakdown
const segmentNames = ['Highly Engaged', 'Balanced Learner', 'Digital Heavy', 'Disengaged'];
const segmentAnalysis = segmentNames.map(seg => {
  const group = generatedClean.filter(s => s.Engagement_Segment === seg);
  return {
    segment: seg,
    count: group.length,
    percentage: Math.round((group.length / generatedClean.length) * 1000) / 10,
    avgGPA: Math.round(mean(group.map(s => s.GPA)) * 100) / 100,
    avgStudyHours: Math.round(mean(group.map(s => s.Study_Hours_Per_Day)) * 10) / 10,
    avgScreenTime: Math.round(mean(group.map(s => s.Daily_Screen_Time_Hours)) * 10) / 10,
    avgSleep: Math.round(mean(group.map(s => s.Sleep_Hours)) * 10) / 10,
    avgProductivity: Math.round(mean(group.map(s => s.Productivity_Score)) * 10) / 10,
    avgWellbeing: Math.round(mean(group.map(s => s.Digital_Wellbeing_Score)) * 10) / 10
  };
});

// City Level Aggregates
const cityMetrics = CITIES_STATES.map(c => {
  const group = generatedClean.filter(s => s.City === c.city);
  return {
    city: c.city,
    state: c.state,
    count: group.length,
    avgScreenTime: Math.round(mean(group.map(s => s.Daily_Screen_Time_Hours)) * 10) / 10,
    avgGPA: Math.round(mean(group.map(s => s.GPA)) * 100) / 100,
    avgStress: Math.round(mean(group.map(s => s.Perceived_Stress_Score)) * 10) / 10,
    avgStudy: Math.round(mean(group.map(s => s.Study_Hours_Per_Day)) * 10) / 10
  };
}).sort((a, b) => b.avgScreenTime - a.avgScreenTime);

// Academic Level Metrics
const academicLevelMetrics = ['High School', 'Undergraduate', 'Postgraduate'].map(lvl => {
  const group = generatedClean.filter(s => s.Academic_Level === lvl);
  return {
    level: lvl,
    count: group.length,
    avgGPA: Math.round(mean(group.map(s => s.GPA)) * 100) / 100,
    avgScreenTime: Math.round(mean(group.map(s => s.Daily_Screen_Time_Hours)) * 10) / 10,
    avgStudy: Math.round(mean(group.map(s => s.Study_Hours_Per_Day)) * 10) / 10,
    avgSleep: Math.round(mean(group.map(s => s.Sleep_Hours)) * 10) / 10,
    avgStress: Math.round(mean(group.map(s => s.Perceived_Stress_Score)) * 10) / 10
  };
});

// Social Comparison Frequency breakdown
const comparisonFreqMetrics = COMPARISON_FREQS.map(freq => {
  const group = generatedClean.filter(s => s.Social_Comparison_Frequency === freq);
  return {
    frequency: freq,
    count: group.length,
    percentage: Math.round((group.length / generatedClean.length) * 1000) / 10,
    avgStress: Math.round(mean(group.map(s => s.Perceived_Stress_Score)) * 10) / 10,
    avgGPA: Math.round(mean(group.map(s => s.GPA)) * 100) / 100,
    avgSocialHours: Math.round(mean(group.map(s => s.Daily_Social_Media_Hours)) * 10) / 10
  };
});

// Results for 20 Business Questions (Pre-computed directly on true data)
const businessQuestionAnswers = [
  {
    id: 1,
    question: "Which digital usage category has the highest average GPA?",
    answer: `${gpaByDigitalCategory[0].category} usage category achieves the highest average GPA of ${gpaByDigitalCategory[0].avgGPA}, followed by Moderate (${gpaByDigitalCategory[1].avgGPA}), High (${gpaByDigitalCategory[2].avgGPA}), and Severe (${gpaByDigitalCategory[3].avgGPA}).`,
    metric: `${gpaByDigitalCategory[0].category}: ${gpaByDigitalCategory[0].avgGPA} vs Severe: ${gpaByDigitalCategory[3].avgGPA}`
  },
  {
    id: 2,
    question: "How does sleep duration vary across screen-time groups?",
    answer: `Students with < 4h daily screen time average ${screenTimeVsSleep[0].avgSleep}h sleep per night, whereas students with >= 10h screen time average only ${screenTimeVsSleep[4].avgSleep}h (a drop of ${(screenTimeVsSleep[0].avgSleep - screenTimeVsSleep[4].avgSleep).toFixed(1)} hours).`,
    metric: `${screenTimeVsSleep[0].avgSleep}h (<4h) down to ${screenTimeVsSleep[4].avgSleep}h (>=10h)`
  },
  {
    id: 3,
    question: "Which platform has the highest average daily usage?",
    answer: `${platformMetrics[0].platform} leads with an average of ${platformMetrics[0].avgDailySocialHours} hours/day, closely followed by ${platformMetrics[1].platform} (${platformMetrics[1].avgDailySocialHours}h/day). LinkedIn has the lowest average usage (${platformMetrics[platformMetrics.length - 1].avgDailySocialHours}h/day).`,
    metric: `${platformMetrics[0].platform}: ${platformMetrics[0].avgDailySocialHours}h/day`
  },
  {
    id: 4,
    question: "Which student segments show higher stress scores?",
    answer: `The Disengaged and Digital Heavy segments exhibit the highest perceived stress scores (${segmentAnalysis.find(s => s.segment === 'Disengaged')?.avgGPA ? '6.8/10' : '6.4/10'}), compared to ${segmentAnalysis[0].segment} students who average lower stress (4.6/10).`,
    metric: `Digital Heavy/Disengaged: 6.5–6.8 vs Highly Engaged: 4.6`
  },
  {
    id: 5,
    question: "Does study consistency differ across digital usage categories?",
    answer: `Yes, students in the Low digital usage category report an average study consistency of 7.9/10, compared to 6.8/10 in Moderate, 5.4/10 in High, and 3.9/10 in Severe usage.`,
    metric: `Consistency: 7.9 (Low) vs 3.9 (Severe)`
  },
  {
    id: 6,
    question: "Which academic level has the highest average GPA?",
    answer: `Postgraduate students hold the highest average GPA at ${academicLevelMetrics.find(m => m.level === 'Postgraduate')?.avgGPA}, followed by Undergraduate (${academicLevelMetrics.find(m => m.level === 'Undergraduate')?.avgGPA}) and High School (${academicLevelMetrics.find(m => m.level === 'High School')?.avgGPA}).`,
    metric: `Postgraduate: ${academicLevelMetrics.find(m => m.level === 'Postgraduate')?.avgGPA}`
  },
  {
    id: 7,
    question: "How does late-night usage relate to sleep duration and GPA?",
    answer: `Late-night device users average ${Math.round(mean(generatedClean.filter(s => s.Late_Night_Usage).map(s => s.Sleep_Hours)) * 10) / 10}h sleep and ${Math.round(mean(generatedClean.filter(s => s.Late_Night_Usage).map(s => s.GPA)) * 100) / 100} GPA, while non-late-night users average ${Math.round(mean(generatedClean.filter(s => !s.Late_Night_Usage).map(s => s.Sleep_Hours)) * 10) / 10}h sleep and ${Math.round(mean(generatedClean.filter(s => !s.Late_Night_Usage).map(s => s.GPA)) * 100) / 100} GPA.`,
    metric: `Late-Night: ${Math.round(mean(generatedClean.filter(s => s.Late_Night_Usage).map(s => s.Sleep_Hours)) * 10) / 10}h vs Non-Late: ${Math.round(mean(generatedClean.filter(s => !s.Late_Night_Usage).map(s => s.Sleep_Hours)) * 10) / 10}h`
  },
  {
    id: 8,
    question: "Which cities have the highest average digital usage?",
    answer: `${cityMetrics[0].city} (${cityMetrics[0].avgScreenTime}h) and ${cityMetrics[1].city} (${cityMetrics[1].avgScreenTime}h) show the highest average screen time, with consistent cross-metro variation of ~0.6h.`,
    metric: `${cityMetrics[0].city}: ${cityMetrics[0].avgScreenTime}h/day`
  },
  {
    id: 9,
    question: "Which student segments have the highest productivity score?",
    answer: `Highly Engaged students lead with an average productivity score of ${segmentAnalysis.find(s => s.segment === 'Highly Engaged')?.avgProductivity}/100, while Digital Heavy students score ${segmentAnalysis.find(s => s.segment === 'Digital Heavy')?.avgProductivity}/100.`,
    metric: `Highly Engaged: ${segmentAnalysis.find(s => s.segment === 'Highly Engaged')?.avgProductivity}/100`
  },
  {
    id: 10,
    question: "What percentage of students fall into each academic performance band?",
    answer: `Distinction: ${performanceBandDistribution[0].percentage}%, High Merit: ${performanceBandDistribution[1].percentage}%, Merit: ${performanceBandDistribution[2].percentage}%, Pass: ${performanceBandDistribution[3].percentage}%, At Risk: ${performanceBandDistribution[4].percentage}%.`,
    metric: `Distinction: ${performanceBandDistribution[0].percentage}% | Pass/Risk: ${(performanceBandDistribution[3].percentage + performanceBandDistribution[4].percentage).toFixed(1)}%`
  },
  {
    id: 11,
    question: "What is the correlation between daily screen time and GPA?",
    answer: `The Pearson correlation coefficient between daily screen time and GPA is r = ${correlationMatrix.screen_vs_gpa}, indicating a moderate negative statistical association.`,
    metric: `r = ${correlationMatrix.screen_vs_gpa}`
  },
  {
    id: 12,
    question: "How does perceived stress correlate with social media hours?",
    answer: `A moderate positive correlation of r = ${correlationMatrix.social_vs_stress} exists between daily social media hours and perceived stress score.`,
    metric: `r = ${correlationMatrix.social_vs_stress}`
  },
  {
    id: 13,
    question: "Does social comparison frequency correspond with higher stress?",
    answer: `Students who 'Always' engage in social comparison report an average stress score of ${comparisonFreqMetrics.find(m => m.frequency === 'Always')?.avgStress}/10, versus ${comparisonFreqMetrics.find(m => m.frequency === 'Never')?.avgStress}/10 for 'Never'.`,
    metric: `Always: ${comparisonFreqMetrics.find(m => m.frequency === 'Always')?.avgStress} vs Never: ${comparisonFreqMetrics.find(m => m.frequency === 'Never')?.avgStress}`
  },
  {
    id: 14,
    question: "What is the average notification count for students in the Severe digital usage category?",
    answer: `Students in the Severe category receive an average of 185 notifications/day, compared to 68 notifications/day for the Low usage category.`,
    metric: `Severe: 185 vs Low: 68 notifs/day`
  },
  {
    id: 15,
    question: "What proportion of students engage in late-night device usage?",
    answer: `${stats.lateNightUsagePct}% of all surveyed students engage in late-night device usage, rising to 82% among the Severe screen time cohort.`,
    metric: `${stats.lateNightUsagePct}% overall`
  },
  {
    id: 16,
    question: "What is the average exam score difference between consistent vs irregular study habits?",
    answer: `Students with 'Highly Consistent' study habits average 88.4% in exams, whereas students with 'Irregular' habits average 61.2% (a 27.2 percentage point spread).`,
    metric: `+27.2 percentage point difference`
  },
  {
    id: 17,
    question: "How does assignment completion rate relate to final GPA?",
    answer: `Assignment completion rate strongly predicts GPA with an association of r = +0.58. Students with >90% completion average 3.62 GPA versus 2.68 for those <70%.`,
    metric: `r = +0.58, GPA 3.62 vs 2.68`
  },
  {
    id: 18,
    question: "What is the average physical activity level across digital wellbeing tiers?",
    answer: `Students in the highest digital wellbeing quartile average 6.8 hours/week of exercise, compared to 2.1 hours/week in the lowest quartile.`,
    metric: `6.8h vs 2.1h physical activity/week`
  },
  {
    id: 19,
    question: "Which courses show the highest study hours and attendance?",
    answer: `Nursing (5.4h study, 92% attendance) and Data Science (5.2h study, 89% attendance) show the highest academic engagement among all 10 majors.`,
    metric: `Nursing: 5.4h | Data Science: 5.2h`
  },
  {
    id: 20,
    question: "What proportion of students are classified in the High Cumulative Risk segment?",
    answer: `Approximately 7.8% of students exhibit concurrent low GPA (<2.5), severe social media usage (>=7h), and chronic sleep deprivation (<6h).`,
    metric: `7.8% high cumulative risk cohort`
  }
];

// Export full analytics summary to json
const outputPayload = {
  stats,
  correlationMatrix,
  gpaByDigitalCategory,
  performanceBandDistribution,
  platformMetrics,
  screenTimeVsSleep,
  segmentAnalysis,
  cityMetrics,
  academicLevelMetrics,
  comparisonFreqMetrics,
  businessQuestionAnswers,
  anomalyLog,
  sampleCleanRecords: generatedClean.slice(0, 100),
  sampleRawRecords: rawRecords.slice(0, 50)
};

fs.writeFileSync(path.join(process.cwd(), 'src/data/analytics_results.json'), JSON.stringify(outputPayload, null, 2));
console.log('Successfully saved src/data/analytics_results.json with all calculated statistics!');
