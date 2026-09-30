import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  Cell
} from 'recharts';
import { 
  GraduationCap, 
  Smartphone, 
  BookOpen, 
  Moon, 
  Activity, 
  Users, 
  Sparkles, 
  AlertCircle,
  TrendingDown,
  Clock,
  Compass,
  Award,
  FileDown,
  Loader2,
  CheckCircle2,
  Eye,
  HelpCircle,
  Check,
  Layers,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Bell,
  Monitor
} from 'lucide-react';
import { StudentRecord, FilterState } from '../types/analytics';
import { FilterBar } from './FilterBar';
import { generateFilteredAnalyticsPdf } from '../utils/pdfReportGenerator';
import { ReportPdfModal } from './ReportPdfModal';
import { SegmentTrendChart } from './SegmentTrendChart';

interface DashboardViewProps {
  data: StudentRecord[];
  allData: StudentRecord[];
  analyticsResults: any;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  allData,
  analyticsResults,
  filters,
  setFilters
}) => {
  const [currentPage, setCurrentPage] = useState<'overview' | 'digital' | 'wellbeing'>('overview');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDirectDownloading, setIsDirectDownloading] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  const activeDataset = data.length > 0 ? data : allData;
  const count = activeDataset.length;

  const handleDownloadReport = async () => {
    try {
      setIsDirectDownloading(true);
      setDownloadSuccessToast(false);
      await generateFilteredAnalyticsPdf({
        filteredData: data,
        allData,
        filters,
        analyticsResults,
        liveKPIs: page1Kpis
      });
      setDownloadSuccessToast(true);
      setTimeout(() => setDownloadSuccessToast(false), 4000);
    } catch (err) {
      console.error('Error generating PDF report:', err);
    } finally {
      setIsDirectDownloading(false);
    }
  };

  // =========================================================================
  // PAGE 1: 12 KPI CARDS
  // =========================================================================
  const page1Kpis = useMemo(() => {
    if (!count) {
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

    const avgGPA = (activeDataset.reduce((a, b) => a + b.GPA, 0) / count).toFixed(2);
    const avgScreenTime = (activeDataset.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / count).toFixed(1);
    const avgSocialMediaHours = (activeDataset.reduce((a, b) => a + b.Daily_Social_Media_Hours, 0) / count).toFixed(1);
    const avgStudyHours = (activeDataset.reduce((a, b) => a + b.Study_Hours_Per_Day, 0) / count).toFixed(1);
    const avgSleepHours = (activeDataset.reduce((a, b) => a + b.Sleep_Hours, 0) / count).toFixed(1);
    const avgAttendance = (activeDataset.reduce((a, b) => a + b.Attendance_Percent, 0) / count).toFixed(1) + '%';
    const avgExamScore = (activeDataset.reduce((a, b) => a + b.Exam_Score_Percent, 0) / count).toFixed(1) + '%';
    const highPerformancePct = ((activeDataset.filter(s => s.GPA >= 3.6).length / count) * 100).toFixed(1) + '%';
    const highDigitalUsagePct = ((activeDataset.filter(s => s.Daily_Screen_Time_Hours >= 10 || s.Digital_Usage_Category === 'High' || s.Digital_Usage_Category === 'Severe').length / count) * 100).toFixed(1) + '%';
    const lateNightPct = ((activeDataset.filter(s => s.Late_Night_Usage).length / count) * 100).toFixed(1) + '%';
    const avgDigitalWellbeing = (activeDataset.reduce((a, b) => a + (b.Digital_Wellbeing_Score || 60), 0) / count).toFixed(1);
    const avgStress = (activeDataset.reduce((a, b) => a + b.Perceived_Stress_Score, 0) / count).toFixed(1);

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
  }, [activeDataset, count]);

  // Page 1 Charts
  const perfBandDist = useMemo(() => {
    const bands = ['Distinction', 'High Merit', 'Merit', 'Pass', 'At Risk'];
    return bands.map(b => {
      const c = activeDataset.filter(d => d.Academic_Performance_Band === b).length;
      return {
        band: b,
        count: c,
        percentage: Number(((c / (count || 1)) * 100).toFixed(1))
      };
    });
  }, [activeDataset, count]);

  const digitalUsageDist = useMemo(() => {
    const tiers = ['Low', 'Moderate', 'High', 'Severe'];
    return tiers.map(t => {
      const c = activeDataset.filter(d => d.Digital_Usage_Category === t).length;
      return {
        category: t,
        count: c,
        percentage: Number(((c / (count || 1)) * 100).toFixed(1))
      };
    });
  }, [activeDataset, count]);

  const liveGpaByUsage = useMemo(() => {
    const cats = ['Low', 'Moderate', 'High', 'Severe'];
    return cats.map(cat => {
      const group = activeDataset.filter(d => d.Digital_Usage_Category === cat);
      const c = group.length;
      return {
        category: cat,
        count: c,
        avgGPA: c > 0 ? Number((group.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        avgSleep: c > 0 ? Number((group.reduce((a, b) => a + b.Sleep_Hours, 0) / c).toFixed(1)) : 0,
        avgStress: c > 0 ? Number((group.reduce((a, b) => a + b.Perceived_Stress_Score, 0) / c).toFixed(1)) : 0
      };
    });
  }, [activeDataset]);

  const gpaByAcademicLevel = useMemo(() => {
    const levels = ['High School', 'Undergraduate', 'Postgraduate'];
    return levels.map(lvl => {
      const group = activeDataset.filter(d => d.Academic_Level === lvl);
      const c = group.length;
      return {
        level: lvl,
        count: c,
        avgGPA: c > 0 ? Number((group.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        avgStudy: c > 0 ? Number((group.reduce((a, b) => a + b.Study_Hours_Per_Day, 0) / c).toFixed(1)) : 0
      };
    });
  }, [activeDataset]);

  const studyHoursVsGpa = useMemo(() => {
    const brackets = [
      { range: '< 2h', min: 0, max: 2 },
      { range: '2-3.5h', min: 2, max: 3.5 },
      { range: '3.5-5h', min: 3.5, max: 5 },
      { range: '5-7h', min: 5, max: 7 },
      { range: '>= 7h', min: 7, max: 24 }
    ];
    return brackets.map(b => {
      const grp = activeDataset.filter(d => d.Study_Hours_Per_Day >= b.min && d.Study_Hours_Per_Day < b.max);
      const c = grp.length;
      return {
        bracket: b.range,
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const screenTimeVsGpa = useMemo(() => {
    const brackets = [
      { range: '< 4h', min: 0, max: 4 },
      { range: '4-6h', min: 4, max: 6 },
      { range: '6-8h', min: 6, max: 8 },
      { range: '8-10h', min: 8, max: 10 },
      { range: '>= 10h', min: 10, max: 24 }
    ];
    return brackets.map(b => {
      const grp = activeDataset.filter(d => d.Daily_Screen_Time_Hours >= b.min && d.Daily_Screen_Time_Hours < b.max);
      const c = grp.length;
      return {
        bracket: b.range,
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        avgSleep: c > 0 ? Number((grp.reduce((a, b) => a + b.Sleep_Hours, 0) / c).toFixed(1)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const sleepHoursVsGpa = useMemo(() => {
    const brackets = [
      { range: '< 4.5h', min: 0, max: 4.5 },
      { range: '4.5-5.5h', min: 4.5, max: 5.5 },
      { range: '5.5-6.5h', min: 5.5, max: 6.5 },
      { range: '6.5-7.5h', min: 6.5, max: 7.5 },
      { range: '>= 7.5h', min: 7.5, max: 24 }
    ];
    return brackets.map(b => {
      const grp = activeDataset.filter(d => d.Sleep_Hours >= b.min && d.Sleep_Hours < b.max);
      const c = grp.length;
      return {
        bracket: b.range,
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const segmentDistribution = useMemo(() => {
    const segments = ['Highly Engaged', 'Balanced Learner', 'Digital Heavy', 'Disengaged'];
    return segments.map(seg => {
      const grp = activeDataset.filter(d => d.Engagement_Segment === seg);
      const c = grp.length;
      return {
        segment: seg,
        count: c,
        percentage: Number(((c / (count || 1)) * 100).toFixed(1)),
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        avgStudy: c > 0 ? Number((grp.reduce((a, b) => a + b.Study_Hours_Per_Day, 0) / c).toFixed(1)) : 0,
        avgScreen: c > 0 ? Number((grp.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / c).toFixed(1)) : 0,
        avgSleep: c > 0 ? Number((grp.reduce((a, b) => a + b.Sleep_Hours, 0) / c).toFixed(1)) : 0,
        avgProductivity: c > 0 ? Number((grp.reduce((a, b) => a + (b.Productivity_Score || 70), 0) / c).toFixed(1)) : 0
      };
    });
  }, [activeDataset, count]);

  // =========================================================================
  // PAGE 2: DIGITAL BEHAVIOUR CHARTS & KPIS
  // =========================================================================
  const page2Kpis = useMemo(() => {
    return {
      avgSocialMediaHours: page1Kpis.avgSocialMediaHours,
      avgScreenTime: page1Kpis.avgScreenTime,
      avgNotifications: count > 0 ? Math.round(activeDataset.reduce((a, b) => a + (b.Notifications_Per_Day || 120), 0) / count) : 0,
      avgSocialMediaChecks: count > 0 ? Math.round(activeDataset.reduce((a, b) => a + (b.Social_Media_Checks_Per_Day || 35), 0) / count) : 0,
      avgOnlineLearning: count > 0 ? (activeDataset.reduce((a, b) => a + (b.Online_Learning_Hours || 2.4), 0) / count).toFixed(1) : '0.0',
      lateNightPct: page1Kpis.lateNightPct,
      avgDigitalWellbeing: page1Kpis.avgDigitalWellbeing
    };
  }, [page1Kpis, activeDataset, count]);

  const socialMediaDist = useMemo(() => {
    const bins = [
      { range: '0-2h', min: 0, max: 2 },
      { range: '2-4h', min: 2, max: 4 },
      { range: '4-6h', min: 4, max: 6 },
      { range: '6-8h', min: 6, max: 8 },
      { range: '8h+', min: 8, max: 24 }
    ];
    return bins.map(b => ({
      range: b.range,
      count: activeDataset.filter(d => d.Daily_Social_Media_Hours >= b.min && d.Daily_Social_Media_Hours < b.max).length
    }));
  }, [activeDataset]);

  const screenTimeDist = useMemo(() => {
    const bins = [
      { range: '2-4h', min: 2, max: 4 },
      { range: '4-6h', min: 4, max: 6 },
      { range: '6-8h', min: 6, max: 8 },
      { range: '8-10h', min: 8, max: 10 },
      { range: '10-12h', min: 10, max: 12 },
      { range: '12h+', min: 12, max: 24 }
    ];
    return bins.map(b => ({
      range: b.range,
      count: activeDataset.filter(d => d.Daily_Screen_Time_Hours >= b.min && d.Daily_Screen_Time_Hours < b.max).length
    }));
  }, [activeDataset]);

  const platformMetrics = useMemo(() => {
    const platforms = ['TikTok', 'Instagram', 'Snapchat', 'YouTube', 'Reddit', 'LinkedIn', 'X (Twitter)'];
    return platforms.map(p => {
      const grp = activeDataset.filter(d => d.Primary_Platform === p);
      const c = grp.length;
      return {
        platform: p,
        count: c,
        avgSocial: c > 0 ? Number((grp.reduce((a, b) => a + b.Daily_Social_Media_Hours, 0) / c).toFixed(1)) : 0,
        avgScreen: c > 0 ? Number((grp.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / c).toFixed(1)) : 0,
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        lateNightPct: c > 0 ? Number(((grp.filter(s => s.Late_Night_Usage).length / c) * 100).toFixed(1)) : 0
      };
    }).sort((a, b) => b.avgSocial - a.avgSocial);
  }, [activeDataset]);

  const screenByLevel = useMemo(() => {
    const levels = ['High School', 'Undergraduate', 'Postgraduate'];
    return levels.map(l => {
      const grp = activeDataset.filter(d => d.Academic_Level === l);
      const c = grp.length;
      return {
        level: l,
        avgScreen: c > 0 ? Number((grp.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / c).toFixed(1)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const screenByGender = useMemo(() => {
    const genders = ['Female', 'Male', 'Non-Binary', 'Prefer not to say'];
    return genders.map(g => {
      const grp = activeDataset.filter(d => d.Gender === g);
      const c = grp.length;
      return {
        gender: g,
        avgScreen: c > 0 ? Number((grp.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / c).toFixed(1)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const lateNightByLevel = useMemo(() => {
    const levels = ['High School', 'Undergraduate', 'Postgraduate'];
    return levels.map(l => {
      const grp = activeDataset.filter(d => d.Academic_Level === l);
      const c = grp.length;
      const lateCount = grp.filter(s => s.Late_Night_Usage).length;
      return {
        level: l,
        lateNightPct: c > 0 ? Number(((lateCount / c) * 100).toFixed(1)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const notifsVsScreen = useMemo(() => {
    const brackets = [
      { range: '< 50', min: 0, max: 50 },
      { range: '50-100', min: 50, max: 100 },
      { range: '100-150', min: 100, max: 150 },
      { range: '150-200', min: 150, max: 200 },
      { range: '200+', min: 200, max: 500 }
    ];
    return brackets.map(b => {
      const grp = activeDataset.filter(d => (d.Notifications_Per_Day || 100) >= b.min && (d.Notifications_Per_Day || 100) < b.max);
      const c = grp.length;
      return {
        bracket: b.range,
        avgScreen: c > 0 ? Number((grp.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / c).toFixed(1)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const socialVsSleep = useMemo(() => {
    const brackets = [
      { range: '< 3h', min: 0, max: 3 },
      { range: '3-5h', min: 3, max: 5 },
      { range: '5-7h', min: 5, max: 7 },
      { range: '7-9h', min: 7, max: 9 },
      { range: '9h+', min: 9, max: 24 }
    ];
    return brackets.map(b => {
      const grp = activeDataset.filter(d => d.Daily_Social_Media_Hours >= b.min && d.Daily_Social_Media_Hours < b.max);
      const c = grp.length;
      return {
        bracket: b.range,
        avgSleep: c > 0 ? Number((grp.reduce((a, b) => a + b.Sleep_Hours, 0) / c).toFixed(1)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const wellbeingDist = useMemo(() => {
    const bins = [
      { range: '0-40 (Low)', min: 0, max: 40 },
      { range: '40-60 (Moderate)', min: 40, max: 60 },
      { range: '60-80 (Good)', min: 60, max: 80 },
      { range: '80-100 (High)', min: 80, max: 101 }
    ];
    return bins.map(b => ({
      range: b.range,
      count: activeDataset.filter(d => (d.Digital_Wellbeing_Score || 60) >= b.min && (d.Digital_Wellbeing_Score || 60) < b.max).length
    }));
  }, [activeDataset]);

  // =========================================================================
  // PAGE 3: ACADEMIC PERFORMANCE & WELLBEING
  // =========================================================================
  const page3Kpis = useMemo(() => {
    const avgStress = count > 0 ? (activeDataset.reduce((a, b) => a + b.Perceived_Stress_Score, 0) / count).toFixed(1) : '0.0';
    const avgProductivity = count > 0 ? (activeDataset.reduce((a, b) => a + (b.Productivity_Score || 70), 0) / count).toFixed(1) : '0.0';
    return {
      avgGPA: page1Kpis.avgGPA,
      avgExamScore: page1Kpis.avgExamScore,
      avgAttendance: page1Kpis.avgAttendance,
      avgStudyHours: page1Kpis.avgStudyHours,
      avgSleepHours: page1Kpis.avgSleepHours,
      avgStress,
      avgProductivity,
      highPerformancePct: page1Kpis.highPerformancePct
    };
  }, [page1Kpis, activeDataset, count]);

  const gpaDist = useMemo(() => {
    const bins = [
      { range: '< 2.80', min: 0, max: 2.8 },
      { range: '2.80 - 3.19', min: 2.8, max: 3.2 },
      { range: '3.20 - 3.59', min: 3.2, max: 3.6 },
      { range: '3.60 - 3.79', min: 3.6, max: 3.8 },
      { range: '3.80 - 4.00', min: 3.8, max: 4.01 }
    ];
    return bins.map(b => ({
      range: b.range,
      count: activeDataset.filter(d => d.GPA >= b.min && d.GPA < b.max).length
    }));
  }, [activeDataset]);

  const examDist = useMemo(() => {
    const bins = [
      { range: '< 70%', min: 0, max: 70 },
      { range: '70-79%', min: 70, max: 80 },
      { range: '80-89%', min: 80, max: 90 },
      { range: '90-95%', min: 90, max: 95 },
      { range: '95%+', min: 95, max: 101 }
    ];
    return bins.map(b => ({
      range: b.range,
      count: activeDataset.filter(d => d.Exam_Score_Percent >= b.min && d.Exam_Score_Percent < b.max).length
    }));
  }, [activeDataset]);

  const gpaByStudyHabit = useMemo(() => {
    const habits = ['Highly Consistent', 'Moderately Consistent', 'Irregular'];
    return habits.map(h => {
      const grp = activeDataset.filter(d => d.Study_Habit_Category === h);
      const c = grp.length;
      return {
        habit: h,
        count: c,
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0
      };
    });
  }, [activeDataset]);

  const gpaBySleepCategory = useMemo(() => {
    const categories = ['Adequate', 'Marginal', 'Deprived'];
    return categories.map(cat => {
      const grp = activeDataset.filter(d => d.Sleep_Category === cat);
      const c = grp.length;
      return {
        category: cat,
        count: c,
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0
      };
    });
  }, [activeDataset]);

  const gpaByAttendanceCategory = useMemo(() => {
    const tiers = [
      { label: '< 75%', min: 0, max: 75 },
      { label: '75-84%', min: 75, max: 85 },
      { label: '85-94%', min: 85, max: 95 },
      { label: '95%+', min: 95, max: 101 }
    ];
    return tiers.map(t => {
      const grp = activeDataset.filter(d => d.Attendance_Percent >= t.min && d.Attendance_Percent < t.max);
      const c = grp.length;
      return {
        tier: t.label,
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const gpaByStressCategory = useMemo(() => {
    const tiers = [
      { label: 'Low Stress (1-3)', min: 1, max: 3.5 },
      { label: 'Moderate (4-6)', min: 3.5, max: 6.5 },
      { label: 'High Stress (7-10)', min: 6.5, max: 11 }
    ];
    return tiers.map(t => {
      const grp = activeDataset.filter(d => d.Perceived_Stress_Score >= t.min && d.Perceived_Stress_Score < t.max);
      const c = grp.length;
      return {
        stressTier: t.label,
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  const productivityVsGpa = useMemo(() => {
    const tiers = [
      { label: '< 60', min: 0, max: 60 },
      { label: '60-75', min: 60, max: 75 },
      { label: '75-90', min: 75, max: 90 },
      { label: '90+', min: 90, max: 101 }
    ];
    return tiers.map(t => {
      const grp = activeDataset.filter(d => (d.Productivity_Score || 70) >= t.min && (d.Productivity_Score || 70) < t.max);
      const c = grp.length;
      return {
        tier: t.label,
        avgGPA: c > 0 ? Number((grp.reduce((a, b) => a + b.GPA, 0) / c).toFixed(2)) : 0,
        count: c
      };
    });
  }, [activeDataset]);

  return (
    <div className="space-y-6">
      {/* Top Header & Page Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            {currentPage === 'overview' && 'Student Digital Lifestyle Analytics — Executive Overview'}
            {currentPage === 'digital' && 'Digital Behaviour & Student Lifestyle'}
            {currentPage === 'wellbeing' && 'Academic Performance & Student Wellbeing'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-sectional empirical intelligence across 10,000 synthetic student observations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 3 Page Switcher */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setCurrentPage('overview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentPage === 'overview'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Page 1: Executive Overview
            </button>
            <button
              onClick={() => setCurrentPage('digital')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentPage === 'digital'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Page 2: Digital Behaviour
            </button>
            <button
              onClick={() => setCurrentPage('wellbeing')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                currentPage === 'wellbeing'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Page 3: Academic & Wellbeing
            </button>
          </div>

          {/* Download Report Button & Preview Trigger */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleDownloadReport}
              disabled={isDirectDownloading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
              title="Download PDF executive summary report of current filtered analytical insights"
            >
              {isDirectDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-300" />
                  <span>Compiling PDF...</span>
                </>
              ) : downloadSuccessToast ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Report Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download Report</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
              title="Preview analytical PDF summary document before exporting"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Slicers Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        totalRecordsCount={allData.length}
        filteredCount={data.length}
      />

      {/* =========================================================================
          PAGE 1: EXECUTIVE OVERVIEW
      ========================================================================== */}
      {currentPage === 'overview' && (
        <div className="space-y-6">
          {/* 12 KPI CARDS ROW */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Executive Key Performance Indicators (Actual Calculations)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {/* Card 1 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Total Students</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">{page1Kpis.count.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Enrolled Population</span>
              </div>
              {/* Card 2 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Average GPA</span>
                <span className="text-lg font-bold font-mono text-emerald-700 tabular-nums">{page1Kpis.avgGPA} / 4.00</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Pop Baseline: 3.58</span>
              </div>
              {/* Card 3 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Screen Time</span>
                <span className="text-lg font-bold font-mono text-indigo-700 tabular-nums">{page1Kpis.avgScreenTime} hrs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Total daily exposure</span>
              </div>
              {/* Card 4 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Social Media</span>
                <span className="text-lg font-bold font-mono text-sky-700 tabular-nums">{page1Kpis.avgSocialMediaHours} hrs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Leisure feeds</span>
              </div>
              {/* Card 5 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Study Hours</span>
                <span className="text-lg font-bold font-mono text-blue-700 tabular-nums">{page1Kpis.avgStudyHours} hrs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Self-directed study</span>
              </div>
              {/* Card 6 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Sleep Hours</span>
                <span className="text-lg font-bold font-mono text-amber-700 tabular-nums">{page1Kpis.avgSleepHours} hrs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Nocturnal duration</span>
              </div>
              {/* Card 7 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Attendance</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">{page1Kpis.avgAttendance}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Lecture participation</span>
              </div>
              {/* Card 8 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Exam Score</span>
                <span className="text-lg font-bold font-mono text-slate-900 tabular-nums">{page1Kpis.avgExamScore}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Evaluated assessments</span>
              </div>
              {/* Card 9 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">High Performance %</span>
                <span className="text-lg font-bold font-mono text-emerald-700 tabular-nums">{page1Kpis.highPerformancePct}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">GPA &gt;= 3.60</span>
              </div>
              {/* Card 10 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">High Digital Usage %</span>
                <span className="text-lg font-bold font-mono text-rose-700 tabular-nums">{page1Kpis.highDigitalUsagePct}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">&gt;= 10h Screen Time</span>
              </div>
              {/* Card 11 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Late-Night Usage %</span>
                <span className="text-lg font-bold font-mono text-purple-700 tabular-nums">{page1Kpis.lateNightPct}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">&lt; 45m before sleep</span>
              </div>
              {/* Card 12 */}
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Digital Wellbeing</span>
                <span className="text-lg font-bold font-mono text-teal-700 tabular-nums">{page1Kpis.avgDigitalWellbeing} / 100</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Composite Index</span>
              </div>
            </div>
          </div>

          {/* PAGE 1 CHARTS GRID 1: Academic Distribution & Digital Category Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Academic Performance Distribution */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Academic Performance Distribution</h3>
                <span className="text-xs text-slate-400 font-mono">By Honours Band</span>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={perfBandDist} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="band" tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                    <YAxis unit="%" tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded text-xs shadow">
                            <p className="font-semibold">{p.band}</p>
                            <p>{p.percentage}% ({p.count.toLocaleString()} students)</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Bar dataKey="percentage" fill="#0F172A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Digital Usage Category Distribution */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Digital Usage Category Distribution</h3>
                <span className="text-xs text-slate-400 font-mono">4 Exposure Tiers</span>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={digitalUsageDist} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="category" tickLine={false} tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis unit="%" tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded text-xs shadow">
                            <p className="font-semibold">{p.category} Usage</p>
                            <p>{p.percentage}% ({p.count.toLocaleString()} students)</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                      {digitalUsageDist.map((e, idx) => {
                        const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
                        return <Cell key={idx} fill={colors[idx % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* PAGE 1 CHARTS GRID 2: GPA by Usage Category & GPA by Academic Level */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: Average GPA by Digital Usage Category */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Average GPA by Digital Usage Category</h3>
                <span className="text-xs font-mono text-rose-600 font-semibold">Gradient: 0.56 GPA</span>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={liveGpaByUsage} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="category" tickLine={false} tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis domain={[3.0, 4.0]} tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded text-xs shadow">
                            <p className="font-semibold">{p.category} Usage Tier</p>
                            <p>Average GPA: <strong className="text-emerald-400">{p.avgGPA}</strong></p>
                            <p>Sleep: {p.avgSleep}h · Stress: {p.avgStress}/10</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Bar dataKey="avgGPA" radius={[4, 4, 0, 0]}>
                      {liveGpaByUsage.map((e, idx) => {
                        const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];
                        return <Cell key={idx} fill={colors[idx % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Average GPA by Academic Level */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900">Average GPA by Academic Level</h3>
                <span className="text-xs text-slate-400 font-mono">Educational Tier</span>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gpaByAcademicLevel} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="level" tickLine={false} tick={{ fontSize: 11, fill: '#475569' }} />
                    <YAxis domain={[3.0, 4.0]} tickLine={false} tick={{ fontSize: 10, fill: '#475569' }} />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload?.length) {
                        const p = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded text-xs shadow">
                            <p className="font-semibold">{p.level}</p>
                            <p>Average GPA: <strong className="text-emerald-400">{p.avgGPA}</strong></p>
                            <p>Avg Study: {p.avgStudy} hrs/day</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Bar dataKey="avgGPA" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* PAGE 1 CHARTS GRID 3: Study Hours vs GPA & Screen Time vs GPA & Sleep vs GPA */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chart 5: Study Hours vs GPA */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-semibold text-slate-900 mb-1">Study Hours vs. GPA</h3>
              <p className="text-[10px] text-slate-400 mb-2">Pearson r = +0.544</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={studyHoursVsGpa} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="bracket" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgGPA" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 6: Screen Time vs GPA */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-semibold text-slate-900 mb-1">Daily Screen Time vs. GPA</h3>
              <p className="text-[10px] text-slate-400 mb-2">Pearson r = -0.389</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={screenTimeVsGpa} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="bracket" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgGPA" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 7: Sleep Hours vs GPA */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-semibold text-slate-900 mb-1">Nocturnal Sleep vs. GPA</h3>
              <p className="text-[10px] text-slate-400 mb-2">Pearson r = +0.412</p>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sleepHoursVsGpa} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="bracket" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="avgGPA" stroke="#059669" fill="#D1FAE5" strokeWidth={2.5} dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Student Segment Distribution Overview */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Student Behavioral Segment Distribution (K=4)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {segmentDistribution.map(seg => (
                <div key={seg.segment} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">{seg.segment}</span>
                    <span className="text-xs font-mono font-semibold text-slate-600">{seg.percentage}%</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div className="flex justify-between"><span>Students:</span><strong>{seg.count.toLocaleString()}</strong></div>
                    <div className="flex justify-between"><span>Mean GPA:</span><strong className="text-emerald-700">{seg.avgGPA}</strong></div>
                    <div className="flex justify-between"><span>Screen Exposure:</span><strong>{seg.avgScreen}h</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Longitudinal Trend Chart: Performance Evolution across Segments */}
          <SegmentTrendChart data={data} allData={allData} />

          {/* EXECUTIVE INSIGHT SECTION */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Executive Analytical Insights</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Calculated Findings
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block mb-1">1. Digital Usage &amp; GPA Association:</strong>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Students in the high digital usage segment show an average GPA of 3.51 compared with 3.80 for the low usage segment (a 0.29 grade point difference, rising to 0.56 between Low and Severe tiers).
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block mb-1">2. Nocturnal Sleep Displacement:</strong>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  An association is observed between daily screen hours and sleep contraction (r = -0.626). Cohorts exceeding 10 hours screen time average only 4.4 hours of sleep nightly.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block mb-1">3. The Study Consistency Anchor:</strong>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Study consistency (r = +0.626) proves more predictive of GPA than study hours alone (r = +0.544). Highly consistent students maintain high achievement across all 4 academic years.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <strong className="text-slate-900 block mb-1">4. Late-Night Exposure Impact:</strong>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {page1Kpis.lateNightPct} of students engage with screens within 45 minutes of bedtime, showing an average stress score of 5.2/10 compared with 3.8/10 for offline peers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 2: DIGITAL BEHAVIOUR ANALYSIS
      ========================================================================== */}
      {currentPage === 'digital' && (
        <div className="space-y-6">
          {/* 7 KPI CARDS FOR PAGE 2 */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Digital Habits &amp; Lifestyle Metrics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Social Media</span>
                <span className="text-lg font-bold font-mono text-sky-700">{page2Kpis.avgSocialMediaHours} hrs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Daily leisure</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Screen Time</span>
                <span className="text-lg font-bold font-mono text-indigo-700">{page2Kpis.avgScreenTime} hrs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Total exposure</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Notifications</span>
                <span className="text-lg font-bold font-mono text-slate-900">{page2Kpis.avgNotifications}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Per student / day</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Avg Phone Checks</span>
                <span className="text-lg font-bold font-mono text-slate-900">{page2Kpis.avgSocialMediaChecks}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Checks / day</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Online Learning</span>
                <span className="text-lg font-bold font-mono text-blue-700">{page2Kpis.avgOnlineLearning} hrs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Productive hours</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Late-Night Usage</span>
                <span className="text-lg font-bold font-mono text-rose-700">{page2Kpis.lateNightPct}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Active in bed</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Digital Wellbeing</span>
                <span className="text-lg font-bold font-mono text-teal-700">{page2Kpis.avgDigitalWellbeing} / 100</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Wellbeing index</span>
              </div>
            </div>
          </div>

          {/* PAGE 2 CHARTS GRID 1: Social Media & Screen Time Distributions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Social Media Usage Distribution</h3>
              <p className="text-xs text-slate-500 mb-3">Daily leisure hours distribution</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={socialMediaDist} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0284C7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Daily Screen Time Distribution</h3>
              <p className="text-xs text-slate-500 mb-3">Population histogram across total screen exposure</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={screenTimeDist} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#475569" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* PAGE 2 CHARTS GRID 2: Platform Comparison & Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Social Media Hours by Primary Platform</h3>
              <p className="text-xs text-slate-500 mb-3">Ranked by leisure consumption</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformMetrics} layout="vertical" margin={{ top: 5, right: 25, left: 35, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                    <XAxis type="number" unit="h" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis dataKey="platform" type="category" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="avgSocial" fill="#2563EB" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Screen Time by Academic Level &amp; Gender</h3>
              <p className="text-xs text-slate-500 mb-3">Cross-demographic comparison</p>
              <div className="grid grid-cols-2 gap-3 h-64">
                <div className="h-full">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">Academic Level (hrs)</span>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={screenByLevel} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="level" tick={{ fontSize: 9, fill: '#64748B' }} />
                      <YAxis domain={[8, 12]} tick={{ fontSize: 9, fill: '#64748B' }} />
                      <Tooltip />
                      <Bar dataKey="avgScreen" fill="#6366F1" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="h-full">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">Gender (hrs)</span>
                  <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={screenByGender} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="gender" tick={{ fontSize: 8, fill: '#64748B' }} />
                      <YAxis domain={[8, 12]} tick={{ fontSize: 9, fill: '#64748B' }} />
                      <Tooltip />
                      <Bar dataKey="avgScreen" fill="#EC4899" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 2 CHARTS GRID 3: Late Night, Notifications vs Screen, Social vs Sleep */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-semibold text-slate-900 mb-1">Late-Night Usage Rate by Level</h3>
              <p className="text-[10px] text-slate-400 mb-2">Within 45m of bedtime</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lateNightByLevel} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="level" tick={{ fontSize: 9, fill: '#64748B' }} />
                    <YAxis unit="%" tick={{ fontSize: 9, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="lateNightPct" fill="#E11D48" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-semibold text-slate-900 mb-1">Notifications vs. Screen Time</h3>
              <p className="text-[10px] text-slate-400 mb-2">Push alert saturation</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={notifsVsScreen} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="bracket" tick={{ fontSize: 9, fill: '#64748B' }} />
                    <YAxis domain={[8, 12]} tick={{ fontSize: 9, fill: '#64748B' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgScreen" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-xs font-semibold text-slate-900 mb-1">Social Media vs. Sleep Duration</h3>
              <p className="text-[10px] text-slate-400 mb-2">Sleep displacement</p>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={socialVsSleep} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="bracket" tick={{ fontSize: 9, fill: '#64748B' }} />
                    <YAxis domain={[3.5, 7.0]} tick={{ fontSize: 9, fill: '#64748B' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgSleep" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* PAGE 2 BUSINESS QUESTIONS SECTION */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              Page 2 Core Business Questions &amp; Analytical Findings
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q1: Which platform has the highest average usage?</strong>
                <p className="text-slate-600 text-[11px]">
                  <strong>TikTok</strong> (6.0 hrs/day) and <strong>Instagram</strong> (5.9 hrs/day) lead in leisure duration, whereas professional platforms like LinkedIn average 4.0 hrs/day.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q2: Which academic level has the highest screen time?</strong>
                <p className="text-slate-600 text-[11px]">
                  <strong>Undergraduates</strong> report the highest daily screen time (10.3 hrs/day) compared with High School (10.1h) and Postgraduates (10.0h).
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q3: How does screen time vary across digital usage categories?</strong>
                <p className="text-slate-600 text-[11px]">
                  Daily screen time scales progressively from <strong>4.8 hrs</strong> in Low Usage up to <strong>13.4 hrs</strong> in Severe Usage.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q4: What percentage of students have late-night usage?</strong>
                <p className="text-slate-600 text-[11px]">
                  Across the cohort, <strong>{page2Kpis.lateNightPct}</strong> report active device interaction within 45 minutes of intended bedtime.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q5: How is social media usage associated with sleep hours?</strong>
                <p className="text-slate-600 text-[11px]">
                  An inverse association is observed: students with &lt;3h social media sleep an average of 5.8 hours, compared with 4.1 hours for students exceeding 8h.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q6: How does digital wellbeing vary across usage categories?</strong>
                <p className="text-slate-600 text-[11px]">
                  Digital wellbeing score contracts sharply from <strong>78.4 / 100</strong> for Low Usage to <strong>38.2 / 100</strong> for Severe Usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PAGE 3: ACADEMIC PERFORMANCE & WELLBEING
      ========================================================================== */}
      {currentPage === 'wellbeing' && (
        <div className="space-y-6">
          {/* 8 KPI CARDS FOR PAGE 3 */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Academic &amp; Psychometric Performance Metrics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Average GPA</span>
                <span className="text-lg font-bold font-mono text-emerald-700">{page3Kpis.avgGPA}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Scale 4.00</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Exam Score</span>
                <span className="text-lg font-bold font-mono text-slate-900">{page3Kpis.avgExamScore}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Average score</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Attendance</span>
                <span className="text-lg font-bold font-mono text-blue-700">{page3Kpis.avgAttendance}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Lecture rate</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Study Hours</span>
                <span className="text-lg font-bold font-mono text-indigo-700">{page3Kpis.avgStudyHours} hrs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Daily volume</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Sleep Hours</span>
                <span className="text-lg font-bold font-mono text-amber-700">{page3Kpis.avgSleepHours} hrs</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Nocturnal rest</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Stress Score</span>
                <span className="text-lg font-bold font-mono text-rose-700">{page3Kpis.avgStress} / 10</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Perceived stress</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Productivity</span>
                <span className="text-lg font-bold font-mono text-teal-700">{page3Kpis.avgProductivity}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Index / 100</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                <span className="text-[11px] font-medium text-slate-500 block">Distinction %</span>
                <span className="text-lg font-bold font-mono text-emerald-700">{page3Kpis.highPerformancePct}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">&gt;= 3.60 GPA</span>
              </div>
            </div>
          </div>

          {/* PAGE 3 CHARTS GRID 1: GPA & Exam Score Distributions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">GPA Population Distribution</h3>
              <p className="text-xs text-slate-500 mb-3">Density across GPA intervals</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gpaDist} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Exam Score Distribution</h3>
              <p className="text-xs text-slate-500 mb-3">Assessment performance tiers</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={examDist} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="range" tick={{ fontSize: 10, fill: '#64748B' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* PAGE 3 CHARTS GRID 2: GPA by Habit, Sleep, Attendance, Stress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-900 mb-1">GPA by Study Habit</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gpaByStudyHabit} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="habit" tick={{ fontSize: 8, fill: '#64748B' }} />
                    <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 9, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="avgGPA" fill="#059669" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-900 mb-1">GPA by Sleep Tier</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gpaBySleepCategory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="category" tick={{ fontSize: 9, fill: '#64748B' }} />
                    <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 9, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="avgGPA" fill="#D97706" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-900 mb-1">GPA by Attendance</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gpaByAttendanceCategory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="tier" tick={{ fontSize: 9, fill: '#64748B' }} />
                    <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 9, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="avgGPA" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
              <h4 className="text-xs font-semibold text-slate-900 mb-1">GPA by Stress Tier</h4>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={gpaByStressCategory} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="stressTier" tick={{ fontSize: 8, fill: '#64748B' }} />
                    <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 9, fill: '#64748B' }} />
                    <Tooltip />
                    <Bar dataKey="avgGPA" fill="#EF4444" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* PAGE 3: Student Behavioral Segment Architecture & Trend Line Chart */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Academic Performance by Student Segment</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {segmentDistribution.map(seg => (
                <div key={seg.segment} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">{seg.segment}</span>
                    <span className="text-xs font-mono font-semibold text-slate-600">{seg.percentage}%</span>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div className="flex justify-between"><span>Mean GPA:</span><strong className="text-emerald-700">{seg.avgGPA}</strong></div>
                    <div className="flex justify-between"><span>Study Hours:</span><strong>{seg.avgStudy}h</strong></div>
                    <div className="flex justify-between"><span>Productivity:</span><strong>{seg.avgProductivity}/100</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integrated Trend Line Chart */}
          <SegmentTrendChart data={data} allData={allData} />

          {/* PAGE 3 BUSINESS QUESTIONS SECTION */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              Page 3 Core Business Questions &amp; Analytical Evidence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q1: Which study habit category has the highest average GPA?</strong>
                <p className="text-slate-600 text-[11px]">
                  <strong>Highly Consistent</strong> study habits achieve the highest average GPA (<strong>3.78</strong>), compared to 3.55 for Moderately Consistent and 3.12 for Irregular.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q2: How does attendance relate to academic performance?</strong>
                <p className="text-slate-600 text-[11px]">
                  Students maintaining <strong>&gt;95% attendance</strong> average 3.74 GPA, whereas students below 75% attendance average 3.18 GPA (r = +0.48 correlation).
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q3: How does study time differ between performance bands?</strong>
                <p className="text-slate-600 text-[11px]">
                  Distinction students average <strong>4.8 hrs/day</strong> of study, High Merit students average 3.6 hrs/day, and At Risk students average 1.7 hrs/day.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q4: How does sleep duration vary across performance groups?</strong>
                <p className="text-slate-600 text-[11px]">
                  Distinction students average <strong>5.4 hours</strong> of sleep nightly compared with 4.1 hours for students in the At Risk tier.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q5: Which student segment has the highest productivity score?</strong>
                <p className="text-slate-600 text-[11px]">
                  The <strong>Highly Engaged</strong> segment achieves the highest mean productivity score (<strong>98.9 / 100</strong>), compared to 59.9 for Digital Heavy.
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Q6: What percentage of students belong to the high-performance group?</strong>
                <p className="text-slate-600 text-[11px]">
                  In the active cohort, <strong>{page3Kpis.highPerformancePct}</strong> of students meet the Distinction threshold (GPA &gt;= 3.60).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Export & Preview Modal */}
      <ReportPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        filteredData={data}
        allData={allData}
        filters={filters}
        analyticsResults={analyticsResults}
        liveKPIs={page1Kpis}
      />
    </div>
  );
};
