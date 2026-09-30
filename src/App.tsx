import React, { useState, useMemo } from 'react';
import analyticsResults from './data/analytics_results.json';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SqlLabView } from './components/SqlLabView';
import { PythonLabView } from './components/PythonLabView';
import { DataQualityView } from './components/DataQualityView';
import { ReportView } from './components/ReportView';
import { DataTableView } from './components/DataTableView';
import { GithubModal } from './components/GithubModal';
import { AiCommandCenter, AiMode } from './components/ai/AiCommandCenter';
import { AiAskData } from './components/ai/AiAskData';
import { AiSqlGenerator } from './components/ai/AiSqlGenerator';
import { AiPythonAssistant } from './components/ai/AiPythonAssistant';
import { AiExecutiveInsights } from './components/ai/AiExecutiveInsights';
import { StudentRecord, FilterState } from './types/analytics';
import { X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState<boolean>(false);
  const [activeAiMode, setActiveAiMode] = useState<AiMode | null>(null);

  // Global Filter State
  const [filters, setFilters] = useState<FilterState>({
    gender: 'All',
    ageGroup: 'All',
    academicLevel: 'All',
    course: 'All',
    yearOfStudy: 'All',
    city: 'All',
    state: 'All',
    platform: 'All',
    digitalCategory: 'All',
    performanceBand: 'All',
    segment: 'All',
    lateNight: 'All',
    studyHabitCategory: 'All',
    sleepCategory: 'All',
    searchQuery: ''
  });

  // Extract clean dataset
  const allCleanedRecords: StudentRecord[] = useMemo(() => {
    if (analyticsResults.sampleCleanRecords && analyticsResults.sampleCleanRecords.length > 0) {
      return analyticsResults.sampleCleanRecords as StudentRecord[];
    }
    return [];
  }, []);

  const rawSampleRecords = useMemo(() => {
    return analyticsResults.sampleRawRecords || [];
  }, []);

  // Filtered dataset based on live filters
  const filteredData = useMemo(() => {
    return allCleanedRecords.filter(student => {
      if (filters.gender !== 'All' && student.Gender !== filters.gender) return false;
      if (filters.academicLevel !== 'All' && student.Academic_Level !== filters.academicLevel) return false;
      if (filters.course !== 'All' && student.Course !== filters.course) return false;
      if (filters.yearOfStudy !== 'All' && String(student.Year_of_Study) !== filters.yearOfStudy) return false;
      if (filters.city !== 'All' && student.City !== filters.city) return false;
      if (filters.state !== 'All' && student.State !== filters.state) return false;
      if (filters.platform !== 'All' && student.Primary_Platform !== filters.platform) return false;
      if (filters.digitalCategory !== 'All' && student.Digital_Usage_Category !== filters.digitalCategory) return false;
      if (filters.performanceBand !== 'All' && student.Academic_Performance_Band !== filters.performanceBand) return false;
      if (filters.segment !== 'All' && student.Engagement_Segment !== filters.segment) return false;
      if (filters.lateNight === 'LateNight' && !student.Late_Night_Usage) return false;
      if (filters.lateNight === 'NoLateNight' && student.Late_Night_Usage) return false;
      if (filters.studyHabitCategory !== 'All' && student.Study_Habit_Category !== filters.studyHabitCategory) return false;
      if (filters.sleepCategory !== 'All' && student.Sleep_Category !== filters.sleepCategory) return false;

      // Age Group Filter
      if (filters.ageGroup !== 'All') {
        const age = student.Age;
        if (filters.ageGroup === '<18' && age >= 18) return false;
        if (filters.ageGroup === '18-21' && (age < 18 || age > 21)) return false;
        if (filters.ageGroup === '22-25' && (age < 22 || age > 25)) return false;
        if (filters.ageGroup === '26+' && age < 26) return false;
      }

      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesId = student.Student_ID.toLowerCase().includes(query);
        const matchesCourse = student.Course.toLowerCase().includes(query);
        const matchesCity = student.City.toLowerCase().includes(query);
        if (!matchesId && !matchesCourse && !matchesCity) return false;
      }

      return true;
    });
  }, [allCleanedRecords, filters]);

  // Real-time recalculated live 12 KPIs for currently filtered cohort
  const liveKPIs = useMemo(() => {
    const count = filteredData.length;
    if (count === 0) {
      return {
        count: 0,
        avgGPA: '0.00',
        avgScreenTime: '0.0',
        avgSocialMediaHours: '0.0',
        avgStudyHours: '0.0',
        avgSleepHours: '0.0',
        avgAttendance: '0.0%',
        avgExamScore: '0.0%',
        highPerformancePct: '0.0%',
        highDigitalUsagePct: '0.0%',
        lateNightPct: '0.0%',
        avgDigitalWellbeing: '0.0',
        avgStress: '0.0',
        distinctionPct: '0.0%'
      };
    }
    const avgGPA = (filteredData.reduce((a, b) => a + b.GPA, 0) / count).toFixed(2);
    const avgScreenTime = (filteredData.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / count).toFixed(1);
    const avgSocialMediaHours = (filteredData.reduce((a, b) => a + b.Daily_Social_Media_Hours, 0) / count).toFixed(1);
    const avgStudyHours = (filteredData.reduce((a, b) => a + b.Study_Hours_Per_Day, 0) / count).toFixed(1);
    const avgSleepHours = (filteredData.reduce((a, b) => a + b.Sleep_Hours, 0) / count).toFixed(1);
    const avgAttendance = (filteredData.reduce((a, b) => a + b.Attendance_Percent, 0) / count).toFixed(1) + '%';
    const avgExamScore = (filteredData.reduce((a, b) => a + b.Exam_Score_Percent, 0) / count).toFixed(1) + '%';
    const highPerformancePct = ((filteredData.filter(s => s.GPA >= 3.6).length / count) * 100).toFixed(1) + '%';
    const highDigitalUsagePct = ((filteredData.filter(s => s.Daily_Screen_Time_Hours >= 10 || s.Digital_Usage_Category === 'High' || s.Digital_Usage_Category === 'Severe').length / count) * 100).toFixed(1) + '%';
    const lateNightPct = ((filteredData.filter(s => s.Late_Night_Usage).length / count) * 100).toFixed(1) + '%';
    const avgDigitalWellbeing = (filteredData.reduce((a, b) => a + (b.Digital_Wellbeing_Score || 60), 0) / count).toFixed(1);
    const avgStress = (filteredData.reduce((a, b) => a + b.Perceived_Stress_Score, 0) / count).toFixed(1);

    return {
      count,
      avgGPA,
      avgScreenTime,
      avgSocialMediaHours,
      avgStudyHours,
      avgSleepHours,
      avgAttendance,
      avgExamScore,
      highPerformancePct,
      highDigitalUsagePct,
      lateNightPct,
      avgDigitalWellbeing,
      avgStress,
      distinctionPct: highPerformancePct
    };
  }, [filteredData]);

  // Active filter text summary
  const activeFilterSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.city !== 'All') parts.push(`City: ${filters.city}`);
    if (filters.academicLevel !== 'All') parts.push(`Level: ${filters.academicLevel}`);
    if (filters.digitalCategory !== 'All') parts.push(`Usage: ${filters.digitalCategory}`);
    if (filters.platform !== 'All') parts.push(`Platform: ${filters.platform}`);
    if (filters.performanceBand !== 'All') parts.push(`Band: ${filters.performanceBand}`);
    if (filters.segment !== 'All') parts.push(`Segment: ${filters.segment}`);
    if (filters.lateNight !== 'All') parts.push(`Late-Night: ${filters.lateNight === 'LateNight' ? 'Yes' : 'No'}`);
    if (parts.length === 0) return 'All 10,000 Students';
    return parts.join(' · ');
  }, [filters]);

  // CSV download utility
  const triggerDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCleanedCsv = () => {
    if (allCleanedRecords.length === 0) return;
    const headers = Object.keys(allCleanedRecords[0]);
    const rows = allCleanedRecords.map(r => 
      headers.map(h => {
        const val = (r as any)[h];
        return val !== null && val !== undefined ? String(val) : '';
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    triggerDownload('student_digital_lifestyle_cleaned.csv', csv);
  };

  const handleDownloadRawCsv = () => {
    if (rawSampleRecords.length === 0) return;
    const headers = Object.keys(rawSampleRecords[0]);
    const rows = rawSampleRecords.map((r: any) => 
      headers.map(h => {
        const val = r[h];
        return val !== null && val !== undefined ? String(val) : '';
      }).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    triggerDownload('student_digital_lifestyle_raw.csv', csv);
  };

  const handleSelectAiMode = (mode: AiMode) => {
    if (activeAiMode === mode) {
      setActiveAiMode(null);
    } else {
      setActiveAiMode(mode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white relative">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadCleanedCsv={handleDownloadCleanedCsv}
        onOpenGithubModal={() => setIsGithubModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* AI Analyst Command Center */}
        <AiCommandCenter
          currentAiMode={activeAiMode}
          onSelectMode={handleSelectAiMode}
          filteredCount={filteredData.length}
          activeFilterSummary={activeFilterSummary}
        />

        {/* Active AI Tool Panel (Modal/Drawer when a mode is selected) */}
        {activeAiMode && (
          <div className="mb-6 relative">
            <div className="flex justify-end mb-1">
              <button
                onClick={() => setActiveAiMode(null)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Close AI Tool Panel</span>
              </button>
            </div>

            {activeAiMode === 'ask' && (
              <AiAskData
                filters={filters}
                liveKPIs={liveKPIs}
                onClose={() => setActiveAiMode(null)}
              />
            )}

            {activeAiMode === 'sql' && (
              <AiSqlGenerator data={filteredData} />
            )}

            {activeAiMode === 'python' && (
              <AiPythonAssistant />
            )}

            {activeAiMode === 'insights' && (
              <AiExecutiveInsights
                filters={filters}
                liveKPIs={liveKPIs}
              />
            )}
          </div>
        )}

        {/* Primary Tabs */}
        {activeTab === 'dashboard' && (
          <DashboardView
            data={filteredData}
            allData={allCleanedRecords}
            analyticsResults={analyticsResults}
            filters={filters}
            setFilters={setFilters}
          />
        )}

        {activeTab === 'sql' && (
          <SqlLabView data={allCleanedRecords} />
        )}

        {activeTab === 'python' && (
          <PythonLabView analyticsResults={analyticsResults} />
        )}

        {activeTab === 'quality' && (
          <DataQualityView analyticsResults={analyticsResults} />
        )}

        {activeTab === 'report' && (
          <ReportView analyticsResults={analyticsResults} />
        )}

        {activeTab === 'data' && (
          <DataTableView
            cleanedData={allCleanedRecords}
            rawSampleData={rawSampleRecords}
            onDownloadCleanedCsv={handleDownloadCleanedCsv}
            onDownloadRawCsv={handleDownloadRawCsv}
          />
        )}
      </main>

      {/* GitHub Repository Modal */}
      <GithubModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">EduMetric Analytics</span>
            <span>·</span>
            <span>Interactive Student Lifestyle &amp; Academic Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 font-mono text-[11px]">
            <span>10,000 Records Analyzed</span>
            <span>·</span>
            <span>Gemini 3.8 Flash Analytics</span>
            <span>·</span>
            <span>Verified Empirical Metrics</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
