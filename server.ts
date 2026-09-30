import express, { Request, Response } from 'express';
import { createServer } from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK with required telemetry User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Load analytical summary
let analyticsSummary: any = null;
try {
  const summaryPath = path.join(__dirname, 'src/data/analytics_results.json');
  if (fs.existsSync(summaryPath)) {
    analyticsSummary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  }
} catch (err) {
  console.warn('Could not preload analytics_results.json on server start:', err);
}

const SYSTEM_INSTRUCTION_BASE = `You are "Gemini AI Data Analyst", a specialized Senior Data Analyst assistant embedded inside the "Student Digital Lifestyle & Academic Performance Analytics" platform.

PROJECT CONTEXT & SCHEMA:
Table: student_digital_lifestyle (10,000 synthetic student records)
Columns:
- Demographics: Student_ID, Age (15-28), Gender (Female, Male, Non-Binary, Prefer not to say), City (Boston, Austin, Seattle, Chicago, New York, Atlanta, San Francisco, Denver, Toronto, London), State, Academic_Level (High School, Undergraduate, Postgraduate), Course, Year_of_Study (1-4)
- Digital Habits: Primary_Platform (Instagram, TikTok, YouTube, Reddit, Snapchat, LinkedIn, X (Twitter)), Daily_Social_Media_Hours (0.5-14.0), Weekend_Social_Media_Hours, Daily_Screen_Time_Hours (2.5-17.5), Notifications_Per_Day (25-340), Active_Social_Media_Accounts, Late_Night_Usage (BOOLEAN: screen use within 45m of bed), Social_Media_Checks_Per_Day
- Study Habits: Study_Hours_Per_Day (0.8-10.0), Classes_Attended_Percent (45-100%), Assignment_Completion_Percent, Study_Consistency_Score (1-10), Online_Learning_Hours
- Lifestyle & Wellbeing: Sleep_Hours (3.5-10.0), Sleep_Quality_Score (1-5), Physical_Activity_Hours_Per_Week (0-15), Perceived_Stress_Score (1-10), Social_Comparison_Frequency (Never, Rarely, Sometimes, Frequently, Always), Digital_Detox_Days_Per_Month (0-10)
- Academic Outcomes: Internal_Marks_Percent, Assignment_Average_Percent, Exam_Score_Percent, Attendance_Percent, GPA (1.85-4.00, 4.0 scale), Academic_Performance_Band (Distinction >=3.6, High Merit 3.2-3.59, Merit 2.8-3.19, Pass 2.4-2.79, At Risk <2.4)
- Derived Categories: Digital_Usage_Category (Low <3h, Moderate 3-5.4h, High 5.5-7.9h, Severe >=8h), Study_Habit_Category, Sleep_Category, Engagement_Segment (Highly Engaged, Balanced Learner, Digital Heavy, Disengaged), Risk_Segment, Productivity_Score (0-100), Digital_Wellbeing_Score (0-100), Overall_Student_Score (0-100)

GLOBAL CALCULATED BENCHMARKS (Full 10,000 Records):
- Mean GPA: 3.58 (Median: 3.61, Std Dev: 0.28)
- Mean Daily Screen Time: 10.2 hrs | Mean Social Media: 5.5 hrs
- Mean Sleep: 4.8 hrs | Late Night Device Users: 43.3%
- Mean Study Hours: 3.6 hrs | Mean Consistency: 6.8 / 10
- Mean Stress Score: 4.7 / 10 | Mean Attendance: 85.4%
- Distinction Share (GPA >= 3.6): 53.6% | High Merit: 35.9% | Merit: 9.6% | Pass: 1.0%
- Digital Usage Tiers:
  * Low (<3h): 3.80 GPA, 5.7h sleep, 2.6 stress
  * Moderate (3-5.4h): 3.68 GPA, 5.0h sleep, 4.2 stress
  * High (5.5-7.9h): 3.51 GPA, 4.5h sleep, 5.4 stress
  * Severe (>=8h): 3.24 GPA, 4.0h sleep, 6.5 stress (0.56 GPA gap vs Low)
- Pearson Correlations:
  * Screen Time vs GPA: r = -0.389
  * Social Media Hours vs GPA: r = -0.524
  * Screen Time vs Sleep: r = -0.626 (Strong sleep displacement)
  * Study Consistency vs GPA: r = +0.626 (Strongest positive anchor)
  * Study Hours vs GPA: r = +0.544
  * Social Media Hours vs Perceived Stress: r = +0.683

STRICT ANALYTICAL INTEGRITY RULES:
1. NEVER INVENT NUMBERS. When asked for a calculation, strictly use the provided live filter context or the verified benchmarks above. If data is unavailable, state: "I don't have enough data in the current project context to calculate that."
2. NEVER CLAIM CORRELATION PROVES CAUSATION. Use language like "an association is observed between...", "students in this cohort exhibit...", "the data indicates...".
3. CONTEXT AWARENESS: When active filters are provided, calculate or answer using ONLY the filtered context, stating "With the current filters applied...".
4. FORMAT STRUCTURE: For analytical questions, always provide:
   - **Answer:** Direct concise factual response.
   - **Evidence:** Relevant calculated metric or analysis.
   - **Interpretation:** Clear analytical explanation of what the numbers mean.
   - **Limitation:** Correlation does not establish causation; self-reported constraints.`;

// 1. Natural Language "Ask Your Data" Endpoint
app.post('/api/ai/ask-data', async (req: Request, res: Response) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required.' });
    }

    let filterContextText = 'None (Full 10,000 student dataset active)';
    if (context && context.activeFiltersDescription) {
      filterContextText = context.activeFiltersDescription;
    }

    let liveKpiText = '';
    if (context && context.liveKPIs) {
      liveKpiText = `\nCURRENT FILTERED KPIS:
- Cohort Count: ${context.liveKPIs.count} students
- Average GPA: ${context.liveKPIs.avgGPA}
- Average Daily Screen Time: ${context.liveKPIs.avgScreenTime} hrs
- Average Study Hours: ${context.liveKPIs.avgStudyHours} hrs
- Average Sleep Hours: ${context.liveKPIs.avgSleepHours} hrs
- Average Stress Score: ${context.liveKPIs.avgStress} / 10
- Late Night Usage Rate: ${context.liveKPIs.lateNightPct}
- Distinction Share (GPA >= 3.6): ${context.liveKPIs.distinctionPct}`;
    }

    const systemInstruction = `${SYSTEM_INSTRUCTION_BASE}

CURRENT ANALYSIS CONTEXT:
${filterContextText}
${liveKpiText}

Respond strictly using the required 4-part structure:
### Answer
[Direct answer]

### Evidence
[Calculated values / metrics]

### Interpretation
[Statistical meaning and business takeaway]

### Limitation
[Observational disclaimer: correlation does not equal causation]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    return res.json({
      text: response.text || 'Unable to analyze question.',
      activeContext: filterContextText,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/ask-data:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to process data question.',
    });
  }
});

// 4. Generate SQL Endpoint
app.post('/api/ai/sql', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const systemInstruction = `You are a Senior SQL Engineer for the table "student_digital_lifestyle".
Available Columns:
student_id, age, gender, city, state, academic_level, course, year_of_study, primary_platform,
daily_social_media_hours, weekend_social_media_hours, daily_screen_time_hours, notifications_per_day,
active_social_media_accounts, late_night_usage, social_media_checks_per_day, study_hours_per_day,
classes_attended_percent, assignment_completion_percent, study_consistency_score, online_learning_hours,
sleep_hours, sleep_quality_score, physical_activity_hours_per_week, perceived_stress_score,
social_comparison_frequency, digital_detox_days_per_month, internal_marks_percent, assignment_average_percent,
exam_score_percent, attendance_percent, gpa, academic_performance_band, digital_usage_category,
study_habit_category, sleep_category, academic_performance_category, engagement_segment, risk_segment,
productivity_score, digital_wellbeing_score, overall_student_score.

RULES:
- Do NOT invent columns or tables.
- Return ONLY valid ANSI SQL (PostgreSQL compatible).
- Provide:
  1. BUSINESS QUESTION
  2. SQL QUERY (inside a clean \`\`\`sql codeblock)
  3. EXPLANATION of clauses (CTE, Window function, Group By, etc.)
  4. EXPECTED OUTPUT STRUCTURE`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a production SQL query for: "${prompt}"`,
      config: {
        systemInstruction,
        temperature: 0.1,
      },
    });

    return res.json({
      text: response.text || 'SQL generation complete.',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/sql:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate SQL query.',
    });
  }
});

// 5. Python Analysis Assistant Endpoint
app.post('/api/ai/python', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const systemInstruction = `You are a Senior Python Data Analyst & Pandas Specialist.
Dataset: 'data/cleaned/student_digital_lifestyle_cleaned.csv' (10,000 rows, 32 columns).
Generate clean, idiomatic Python code using Pandas, NumPy, SciPy, or Seaborn.
Columns: student_id, age, gender, city, state, academic_level, course, primary_platform, daily_social_media_hours, daily_screen_time_hours, study_hours_per_day, sleep_hours, perceived_stress_score, gpa, academic_performance_band, digital_usage_category, engagement_segment.

Format:
- **PYTHON CODE:** Clean \`\`\`python snippet
- **METHODOLOGY:** Why this statistical method was selected
- **CALCULATED OUTCOME:** Expected statistical output
- **DATA STORY & INTERPRETATION:** What this means for educational leadership
- **RECOMMENDED VISUALIZATION:** Suggested Matplotlib/Seaborn plot`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Write a Python analysis for: "${prompt}"`,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    return res.json({
      text: response.text || 'Python analysis complete.',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/python:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate Python analysis.',
    });
  }
});

// 6. Generate Executive Insights Endpoint
app.post('/api/ai/insights', async (req: Request, res: Response) => {
  try {
    const { context } = req.body;

    const systemInstruction = `You are a Principal BI Consultant presenting to a University Academic Board.
Analyze the currently filtered student dashboard and generate 4 high-value, data-driven executive insights.
Every insight MUST cite an actual calculated metric from the provided context.
Do NOT invent numbers.

Structure each insight as:
1. **KEY FINDING:** Bold headline summarizing the pattern.
2. **SUPPORTING METRIC:** The exact numbers from the context.
3. **POSSIBLE EXPLANATION:** Behavioral/cognitive mechanism.
4. **BUSINESS / RETENTION IMPLICATION:** How this impacts student success.
5. **ACTIONABLE RECOMMENDATION:** Specific intervention.`;

    const promptText = `Analyze the current student cohort context:
Filters: ${context?.activeFiltersDescription || 'All 10,000 students'}
Live KPIs:
- Count: ${context?.liveKPIs?.count}
- Mean GPA: ${context?.liveKPIs?.avgGPA}
- Mean Screen Time: ${context?.liveKPIs?.avgScreenTime}h
- Mean Study Hours: ${context?.liveKPIs?.avgStudyHours}h
- Mean Sleep Hours: ${context?.liveKPIs?.avgSleepHours}h
- Mean Stress: ${context?.liveKPIs?.avgStress}/10
- Late Night Screen Rate: ${context?.liveKPIs?.lateNightPct}
- Distinction Share: ${context?.liveKPIs?.distinctionPct}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    return res.json({
      text: response.text || 'Executive insights generated.',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/insights:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate executive insights.',
    });
  }
});

// Mount Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
