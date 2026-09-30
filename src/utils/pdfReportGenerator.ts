import { jsPDF } from 'jspdf';
import { StudentRecord, FilterState } from '../types/analytics';

export interface ReportGenerationOptions {
  filteredData: StudentRecord[];
  allData: StudentRecord[];
  filters: FilterState;
  analyticsResults: any;
  liveKPIs: {
    count: number;
    avgGPA: string;
    avgScreenTime: string;
    avgStudyHours: string;
    avgSleepHours: string;
    avgStress: string;
    lateNightPct: string;
    distinctionPct: string;
  };
}

/**
 * High-Resolution HTML5 Canvas Chart Renderers
 * Draws crisp charts at 2x resolution for printing into PDF
 */

function createGpaByUsageCanvas(data: StudentRecord[]): string {
  const canvas = document.createElement('canvas');
  const width = 900;
  const height = 520;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  // Card Border & Header
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 28px Helvetica, Arial, sans-serif';
  ctx.fillText('Average GPA by Digital Usage Category', 40, 50);

  ctx.fillStyle = '#64748B';
  ctx.font = 'normal 18px Helvetica, Arial, sans-serif';
  ctx.fillText('Empirical GPA gradient across daily social media exposure tiers', 40, 80);

  const categories = [
    { name: 'Low (<3h)', key: 'Low', color: '#10B981' },
    { name: 'Moderate', key: 'Moderate', color: '#3B82F6' },
    { name: 'High', key: 'High', color: '#F59E0B' },
    { name: 'Severe (>=8h)', key: 'Severe', color: '#EF4444' }
  ];

  // Chart area
  const chartLeft = 90;
  const chartRight = width - 40;
  const chartTop = 130;
  const chartBottom = height - 90;
  const chartHeight = chartBottom - chartTop;
  const chartWidth = chartRight - chartLeft;

  // Grid lines (GPA 3.0 to 4.0)
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#E2E8F0';
  for (let g = 3.0; g <= 4.0; g += 0.2) {
    const y = chartBottom - ((g - 3.0) / 1.0) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(chartLeft, y);
    ctx.lineTo(chartRight, y);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(g.toFixed(1), chartLeft - 15, y + 5);
  }

  // Draw Bars
  const barCount = categories.length;
  const gap = 36;
  const barWidth = (chartWidth - (barCount + 1) * gap) / barCount;

  categories.forEach((cat, i) => {
    const group = data.filter(d => d.Digital_Usage_Category === cat.key);
    const count = group.length;
    const avgGPA = count > 0 ? group.reduce((a, b) => a + b.GPA, 0) / count : 3.0;
    const clampedGPA = Math.max(3.0, Math.min(4.0, avgGPA));

    const x = chartLeft + gap + i * (barWidth + gap);
    const barH = ((clampedGPA - 3.0) / 1.0) * chartHeight;
    const y = chartBottom - barH;

    // Draw Bar with rounded top
    ctx.fillStyle = cat.color;
    ctx.beginPath();
    const radius = 8;
    ctx.moveTo(x, chartBottom);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.lineTo(x + barWidth - radius, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
    ctx.lineTo(x + barWidth, chartBottom);
    ctx.closePath();
    ctx.fill();

    // Value on top of bar
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 22px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${avgGPA.toFixed(2)} GPA`, x + barWidth / 2, y - 12);

    // Label under bar
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 18px Helvetica, Arial, sans-serif';
    ctx.fillText(cat.name, x + barWidth / 2, chartBottom + 30);

    // Count under label
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'normal 15px Helvetica, Arial, sans-serif';
    ctx.fillText(`N=${count.toLocaleString()}`, x + barWidth / 2, chartBottom + 54);
  });

  return canvas.toDataURL('image/png', 1.0);
}

function createPerformanceBandsCanvas(data: StudentRecord[]): string {
  const canvas = document.createElement('canvas');
  const width = 900;
  const height = 520;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 28px Helvetica, Arial, sans-serif';
  ctx.fillText('Academic Performance Band Distribution', 40, 50);

  ctx.fillStyle = '#64748B';
  ctx.font = 'normal 18px Helvetica, Arial, sans-serif';
  ctx.fillText('Percentage of filtered cohort across honours classification bands', 40, 80);

  const bands = [
    { label: 'Distinction (>=3.6)', key: 'Distinction', color: '#059669' },
    { label: 'High Merit (3.2-3.59)', key: 'High Merit', color: '#2563EB' },
    { label: 'Merit (2.8-3.19)', key: 'Merit', color: '#D97706' },
    { label: 'Pass (2.4-2.79)', key: 'Pass', color: '#DC2626' },
    { label: 'At Risk (<2.4)', key: 'At Risk', color: '#991B1B' }
  ];

  const total = data.length || 1;
  const chartLeft = 90;
  const chartRight = width - 40;
  const chartTop = 130;
  const chartBottom = height - 90;
  const chartHeight = chartBottom - chartTop;
  const chartWidth = chartRight - chartLeft;

  // Max percentage in data
  const percentages = bands.map(b => (data.filter(d => d.Academic_Performance_Band === b.key).length / total) * 100);
  const maxPct = Math.max(60, Math.ceil(Math.max(...percentages) / 10) * 10);

  // Grid lines
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#E2E8F0';
  for (let p = 0; p <= maxPct; p += 15) {
    const y = chartBottom - (p / maxPct) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(chartLeft, y);
    ctx.lineTo(chartRight, y);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${p}%`, chartLeft - 15, y + 5);
  }

  const barCount = bands.length;
  const gap = 24;
  const barWidth = (chartWidth - (barCount + 1) * gap) / barCount;

  bands.forEach((b, i) => {
    const count = data.filter(d => d.Academic_Performance_Band === b.key).length;
    const pct = Number(((count / total) * 100).toFixed(1));

    const x = chartLeft + gap + i * (barWidth + gap);
    const barH = (pct / maxPct) * chartHeight;
    const y = chartBottom - barH;

    ctx.fillStyle = b.color;
    ctx.beginPath();
    const radius = 6;
    ctx.moveTo(x, chartBottom);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.lineTo(x + barWidth - radius, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
    ctx.lineTo(x + barWidth, chartBottom);
    ctx.closePath();
    ctx.fill();

    // Value on top
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 20px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${pct}%`, x + barWidth / 2, y - 10);

    // Label below
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 15px Helvetica, Arial, sans-serif';
    ctx.fillText(b.key, x + barWidth / 2, chartBottom + 28);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'normal 14px Helvetica, Arial, sans-serif';
    ctx.fillText(`N=${count.toLocaleString()}`, x + barWidth / 2, chartBottom + 50);
  });

  return canvas.toDataURL('image/png', 1.0);
}

function createSleepDisplacementCanvas(data: StudentRecord[]): string {
  const canvas = document.createElement('canvas');
  const width = 900;
  const height = 520;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 28px Helvetica, Arial, sans-serif';
  ctx.fillText('Sleep Displacement across Daily Screen Tiers', 40, 50);

  ctx.fillStyle = '#64748B';
  ctx.font = 'normal 18px Helvetica, Arial, sans-serif';
  ctx.fillText('Demonstrating inverse trajectory between screen exposure and nocturnal sleep (r = -0.626)', 40, 80);

  const tiers = [
    { label: '< 4 hrs', min: 0, max: 4 },
    { label: '4 - 6 hrs', min: 4, max: 6 },
    { label: '6 - 8 hrs', min: 6, max: 8 },
    { label: '8 - 10 hrs', min: 8, max: 10 },
    { label: '>= 10 hrs', min: 10, max: 24 }
  ];

  const chartLeft = 90;
  const chartRight = width - 40;
  const chartTop = 130;
  const chartBottom = height - 90;
  const chartHeight = chartBottom - chartTop;
  const chartWidth = chartRight - chartLeft;

  // Y-axis 3.0 to 8.0 hrs
  const yMin = 3.0;
  const yMax = 8.0;

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#E2E8F0';
  for (let s = yMin; s <= yMax; s += 1.0) {
    const y = chartBottom - ((s - yMin) / (yMax - yMin)) * chartHeight;
    ctx.beginPath();
    ctx.moveTo(chartLeft, y);
    ctx.lineTo(chartRight, y);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${s.toFixed(1)} h`, chartLeft - 15, y + 5);
  }

  const points: { x: number; y: number; label: string; avgSleep: number; count: number }[] = [];
  const step = chartWidth / (tiers.length - 1);

  tiers.forEach((tier, i) => {
    const group = data.filter(d => d.Daily_Screen_Time_Hours >= tier.min && d.Daily_Screen_Time_Hours < tier.max);
    const count = group.length;
    const avgSleep = count > 0 ? Number((group.reduce((a, b) => a + b.Sleep_Hours, 0) / count).toFixed(1)) : 5.8;

    const x = chartLeft + i * step;
    const y = chartBottom - ((avgSleep - yMin) / (yMax - yMin)) * chartHeight;
    points.push({ x, y, label: tier.label, avgSleep, count });
  });

  // Area under curve with gradient
  const gradient = ctx.createLinearGradient(0, chartTop, 0, chartBottom);
  gradient.addColorStop(0, 'rgba(79, 70, 229, 0.35)');
  gradient.addColorStop(1, 'rgba(79, 70, 229, 0.02)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, chartBottom);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, chartBottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw Line
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#4F46E5';
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // Draw Dots & Values
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#4F46E5';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // Value badge
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 20px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${p.avgSleep} hrs`, p.x, p.y - 18);

    // X Axis Label
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 16px Helvetica, Arial, sans-serif';
    ctx.fillText(p.label, p.x, chartBottom + 30);

    ctx.fillStyle = '#94A3B8';
    ctx.font = 'normal 14px Helvetica, Arial, sans-serif';
    ctx.fillText(`N=${p.count.toLocaleString()}`, p.x, chartBottom + 52);
  });

  return canvas.toDataURL('image/png', 1.0);
}

function createSegmentArchitectureCanvas(data: StudentRecord[]): string {
  const canvas = document.createElement('canvas');
  const width = 900;
  const height = 520;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 28px Helvetica, Arial, sans-serif';
  ctx.fillText('Student Behavioral Segment Architecture (K=4)', 40, 50);

  ctx.fillStyle = '#64748B';
  ctx.font = 'normal 18px Helvetica, Arial, sans-serif';
  ctx.fillText('Comparative GPA and daily screen saturation across behavioural archetypes', 40, 80);

  const segments = [
    { name: 'Highly Engaged', color: '#059669', bg: '#ECFDF5' },
    { name: 'Balanced Learner', color: '#2563EB', bg: '#EFF6FF' },
    { name: 'Digital Heavy', color: '#DC2626', bg: '#FEF2F2' },
    { name: 'Disengaged', color: '#D97706', bg: '#FFFBEB' }
  ];

  const total = data.length || 1;
  const cardW = 195;
  const cardH = 340;
  const gap = 20;
  const startX = 40;
  const startY = 120;

  segments.forEach((seg, i) => {
    const group = data.filter(d => d.Engagement_Segment === seg.name);
    const count = group.length;
    const share = ((count / total) * 100).toFixed(1);
    const avgGPA = count > 0 ? (group.reduce((a, b) => a + b.GPA, 0) / count).toFixed(2) : '0.00';
    const avgScreen = count > 0 ? (group.reduce((a, b) => a + b.Daily_Screen_Time_Hours, 0) / count).toFixed(1) : '0.0';
    const avgStudy = count > 0 ? (group.reduce((a, b) => a + b.Study_Hours_Per_Day, 0) / count).toFixed(1) : '0.0';
    const avgSleep = count > 0 ? (group.reduce((a, b) => a + b.Sleep_Hours, 0) / count).toFixed(1) : '0.0';

    const x = startX + i * (cardW + gap);
    const y = startY;

    // Card background
    ctx.fillStyle = seg.bg;
    ctx.strokeStyle = seg.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, cardW, cardH, 12);
    ctx.fill();
    ctx.stroke();

    // Title
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(seg.name, x + cardW / 2, y + 36);

    // Share pill
    ctx.fillStyle = seg.color;
    ctx.font = 'bold 16px Helvetica, Arial, sans-serif';
    ctx.fillText(`${share}% of cohort`, x + cardW / 2, y + 66);

    // Metric Rows
    const metrics = [
      { label: 'Average GPA', val: avgGPA, highlight: true },
      { label: 'Daily Screen', val: `${avgScreen}h` },
      { label: 'Daily Study', val: `${avgStudy}h` },
      { label: 'Sleep Night', val: `${avgSleep}h` },
      { label: 'Students', val: count.toLocaleString() }
    ];

    metrics.forEach((m, rowIdx) => {
      const rowY = y + 115 + rowIdx * 44;
      ctx.fillStyle = '#64748B';
      ctx.font = 'normal 14px Helvetica, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(m.label, x + 16, rowY);

      ctx.fillStyle = m.highlight ? seg.color : '#0F172A';
      ctx.font = m.highlight ? 'bold 18px Helvetica, Arial, sans-serif' : 'bold 16px Helvetica, Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(m.val, x + cardW - 16, rowY);

      // divider
      if (rowIdx < metrics.length - 1) {
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 16, rowY + 12);
        ctx.lineTo(x + cardW - 16, rowY + 12);
        ctx.stroke();
      }
    });
  });

  return canvas.toDataURL('image/png', 1.0);
}

/**
 * Main PDF Generation Entry Point
 */
export async function generateFilteredAnalyticsPdf(options: ReportGenerationOptions): Promise<void> {
  const { filteredData, allData, filters, liveKPIs } = options;

  // Initialize jsPDF document (Portrait A4: 210 x 297 mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 186mm

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // ===========================================================================
  // PAGE 1: EXECUTIVE BRIEFING, FILTERED COHORT KPIs & PRIMARY CHARTS
  // ===========================================================================

  // 1. Top Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, 10, contentWidth, 22, 2, 2, 'F');

  // Brand & Subtitle
  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('EDUMETRIC ANALYTICS · INSTITUTIONAL BI & STUDENT SUCCESS', margin + 6, 17);

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Student Digital Lifestyle & Academic Performance Executive Brief', margin + 6, 25);

  // Date & Badge on Right
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(margin + contentWidth - 46, 14, 40, 14, 1.5, 1.5, 'F');
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.setFontSize(7);
  doc.text('EXECUTIVE AUDIT', margin + contentWidth - 26, 19, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text(currentDate, margin + contentWidth - 26, 25, { align: 'center' });

  // 2. Filter & Cohort Scope Box
  let currentY = 36;
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 18, 1.5, 1.5, 'FD');

  const totalAll = allData.length || 10000;
  const filteredCount = filteredData.length;
  const cohortPct = ((filteredCount / totalAll) * 100).toFixed(1);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`CURRENT FILTERED COHORT:  N = ${filteredCount.toLocaleString()} Students (${cohortPct}% of total ${totalAll.toLocaleString()} population)`, margin + 4, currentY + 6);

  // Slicers line
  const slicerText = [
    `City: ${filters.city}`,
    `Level: ${filters.academicLevel}`,
    `Platform: ${filters.platform}`,
    `Usage Tier: ${filters.digitalCategory}`,
    `Band: ${filters.performanceBand}`,
    `Segment: ${filters.segment}`,
    `Late Night: ${filters.lateNight === 'LateNight' ? 'Yes' : filters.lateNight === 'NoLateNight' ? 'No' : 'All'}`
  ].join('  ·  ');

  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(slicerText, margin + 4, currentY + 12);

  // 3. Filtered KPI Scorecard Table
  currentY = 58;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Key Performance Indicators (Current Cohort vs. Baseline)', margin, currentY);

  currentY += 4;

  // Table Columns Setup
  const colX = {
    metric: margin,
    val: margin + 60,
    base: margin + 92,
    delta: margin + 126,
    context: margin + 154
  };

  // Table Header
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(margin, currentY, contentWidth, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('ANALYTICAL METRIC', colX.metric + 3, currentY + 4.2);
  doc.text('FILTERED COHORT', colX.val + 2, currentY + 4.2);
  doc.text('BASELINE (N=10K)', colX.base + 2, currentY + 4.2);
  doc.text('VARIANCE / DELTA', colX.delta + 2, currentY + 4.2);
  doc.text('STRATEGIC CONTEXT', colX.context + 2, currentY + 4.2);

  currentY += 6;

  // KPI Rows Definition
  const gpaDelta = (Number(liveKPIs.avgGPA) - 3.58).toFixed(2);
  const screenDelta = (Number(liveKPIs.avgScreenTime) - 10.2).toFixed(1);
  const studyDelta = (Number(liveKPIs.avgStudyHours) - 3.8).toFixed(1);
  const sleepDelta = (Number(liveKPIs.avgSleepHours) - 5.8).toFixed(1);
  const stressDelta = (Number(liveKPIs.avgStress) - 4.6).toFixed(1);

  const kpiRows = [
    {
      metric: 'Cumulative Grade Point Average (GPA)',
      val: `${liveKPIs.avgGPA} / 4.00`,
      base: '3.58 / 4.00',
      delta: `${Number(gpaDelta) >= 0 ? '+' : ''}${gpaDelta}`,
      deltaGood: Number(gpaDelta) >= 0,
      context: 'Primary academic outcome metric'
    },
    {
      metric: 'Distinction Rate (GPA >= 3.60)',
      val: liveKPIs.distinctionPct,
      base: '53.6%',
      delta: `${(parseFloat(liveKPIs.distinctionPct) - 53.6).toFixed(1)}%`,
      deltaGood: parseFloat(liveKPIs.distinctionPct) >= 53.6,
      context: 'First-class honours qualification'
    },
    {
      metric: 'Daily Screen Exposure (Total)',
      val: `${liveKPIs.avgScreenTime} hrs/day`,
      base: '10.2 hrs/day',
      delta: `${Number(screenDelta) >= 0 ? '+' : ''}${screenDelta} hrs`,
      deltaGood: Number(screenDelta) <= 0,
      context: 'Digital saturation exposure index'
    },
    {
      metric: 'Dedicated Study Volume',
      val: `${liveKPIs.avgStudyHours} hrs/day`,
      base: '3.8 hrs/day',
      delta: `${Number(studyDelta) >= 0 ? '+' : ''}${studyDelta} hrs`,
      deltaGood: Number(studyDelta) >= 0,
      context: 'Direct academic effort allocation'
    },
    {
      metric: 'Nocturnal Sleep Duration',
      val: `${liveKPIs.avgSleepHours} hrs/night`,
      base: '5.8 hrs/night',
      delta: `${Number(sleepDelta) >= 0 ? '+' : ''}${sleepDelta} hrs`,
      deltaGood: Number(sleepDelta) >= 0,
      context: 'Circadian health & cognitive rest'
    },
    {
      metric: 'Perceived Psychological Stress',
      val: `${liveKPIs.avgStress} / 10`,
      base: '4.6 / 10',
      delta: `${Number(stressDelta) >= 0 ? '+' : ''}${stressDelta}`,
      deltaGood: Number(stressDelta) <= 0,
      context: 'Self-reported academic/lifestyle strain'
    },
    {
      metric: 'Late-Night Device Engagement',
      val: liveKPIs.lateNightPct,
      base: '43.3%',
      delta: `${(parseFloat(liveKPIs.lateNightPct) - 43.3).toFixed(1)}%`,
      deltaGood: parseFloat(liveKPIs.lateNightPct) <= 43.3,
      context: 'Within 45m of intended sleep'
    }
  ];

  kpiRows.forEach((row, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, currentY, contentWidth, 5.8, 'F');

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + 5.8, margin + contentWidth, currentY + 5.8);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(row.metric, colX.metric + 3, currentY + 4.1);

    doc.setFont('helvetica', 'bold');
    doc.text(row.val, colX.val + 2, currentY + 4.1);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(row.base, colX.base + 2, currentY + 4.1);

    // Delta styling
    if (row.deltaGood) {
      doc.setTextColor(16, 185, 129); // green
    } else {
      doc.setTextColor(225, 29, 72); // red
    }
    doc.setFont('helvetica', 'bold');
    doc.text(row.delta, colX.delta + 2, currentY + 4.1);

    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.text(row.context, colX.context + 2, currentY + 4.1);

    currentY += 5.8;
  });

  // 4. Primary Charts Grid (Top 2 Charts)
  currentY += 5;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Key Analytical Visualizations (Live Filtered Calculations)', margin, currentY);

  currentY += 4;
  const chartImgWidth = (contentWidth - 6) / 2; // 90mm
  const chartImgHeight = 52; // mm

  try {
    const chart1Img = createGpaByUsageCanvas(filteredData);
    if (chart1Img) {
      doc.addImage(chart1Img, 'PNG', margin, currentY, chartImgWidth, chartImgHeight);
    }

    const chart2Img = createPerformanceBandsCanvas(filteredData);
    if (chart2Img) {
      doc.addImage(chart2Img, 'PNG', margin + chartImgWidth + 6, currentY, chartImgWidth, chartImgHeight);
    }
  } catch (err) {
    console.error('Error generating chart canvas images:', err);
  }

  // 5. Executive Takeaway Box (Bottom of Page 1)
  currentY += chartImgHeight + 6;
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'F');

  doc.setTextColor(16, 185, 129); // emerald-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('EXECUTIVE ANALYTICAL HIGHLIGHT: THE STUDY CONSISTENCY BUFFER', margin + 5, currentY + 6);

  doc.setTextColor(241, 245, 249);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const summaryP1 =
    'Study consistency (Pearson r = +0.626) proves to be the single most powerful protective determinant of student GPA, outperforming simple daily study volume (r = +0.485). Even within digital-heavy cohorts, students maintaining high regularity in their study schedules sustain distinction-tier grade averages (>= 3.65 GPA).';
  const splitP1 = doc.splitTextToSize(summaryP1, contentWidth - 10);
  doc.text(splitP1, margin + 5, currentY + 11.5);

  // Page 1 Footer
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('EduMetric Analytics Institutional Research · Student Digital Lifestyle Portfolio Study (N=10,000)', margin, pageHeight - 8);
  doc.text('Page 1 of 2', margin + contentWidth, pageHeight - 8, { align: 'right' });

  // ===========================================================================
  // PAGE 2: DEEP-DIVE DIAGNOSTICS, EMPIRICAL FINDINGS & STRATEGIC ACTIONS
  // ===========================================================================
  doc.addPage();

  // Top Header Banner (Slim)
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, 10, contentWidth, 14, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Deep-Dive Lifestyle Diagnostics & Strategic Institutional Actions', margin + 6, 19);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('EduMetric Analytics · Section 02 / Diagnostics', margin + contentWidth - 6, 19, { align: 'right' });

  // Secondary Charts: Sleep Displacement & Segment Architecture
  currentY = 28;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Circadian Displacement & Segment Behavioral Distribution', margin, currentY);

  currentY += 4;
  try {
    const chart3Img = createSleepDisplacementCanvas(filteredData);
    if (chart3Img) {
      doc.addImage(chart3Img, 'PNG', margin, currentY, chartImgWidth, chartImgHeight);
    }

    const chart4Img = createSegmentArchitectureCanvas(filteredData);
    if (chart4Img) {
      doc.addImage(chart4Img, 'PNG', margin + chartImgWidth + 6, currentY, chartImgWidth, chartImgHeight);
    }
  } catch (err) {
    console.error('Error generating page 2 chart images:', err);
  }

  // Empirical Findings Cards Section
  currentY += chartImgHeight + 6;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Empirical Findings & Statistical Evidence', margin, currentY);

  currentY += 4;

  const findings = [
    {
      title: '1. The Sleep Displacement Nexus (Pearson r = -0.626, p < 0.001)',
      desc: 'Screen exposure beyond 8 hours daily causes severe circadian erosion. Students in the >=10h exposure bracket average only 4.4 hours of sleep per night compared to 6.8 hours in the <4h tier, directly mediating cognitive fatigue.',
      accent: [79, 70, 229] // Indigo
    },
    {
      title: '2. Late-Night Device Penalty & Psychological Strain (+1.4 Stress Delta)',
      desc: 'Active browsing within 45 minutes of bedtime affects 43.3% of students. This cohort exhibits higher perceived stress (5.2 vs 3.8 / 10) and a statistically significant 0.31 GPA deficit compared to their non-late-night peers.',
      accent: [225, 29, 72] // Rose
    },
    {
      title: '3. Platform Usage Patterns (TikTok & IG: 6.0h vs LinkedIn: 4.0h)',
      desc: 'Short-form visual platforms consume the largest fraction of passive screen time and associate with lower study consistency. In contrast, career and professional platforms correlate with higher assignment completion (84.2%).',
      accent: [37, 99, 235] // Blue
    },
    {
      title: '4. Metropolitan Hub Consistency (ANOVA F = 0.82, p = 0.60)',
      desc: 'Cross-city analysis across 10 major metropolitan centers shows virtually uniform digital saturation (10.1h to 10.4h daily). Digital lifestyle pressures represent an institutional-wide challenge rather than a localized anomaly.',
      accent: [5, 150, 105] // Emerald
    }
  ];

  findings.forEach(f => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, currentY, contentWidth, 16.5, 1.5, 1.5, 'FD');

    // Colored left indicator bar
    doc.setFillColor(f.accent[0], f.accent[1], f.accent[2]);
    doc.rect(margin, currentY, 2.5, 16.5, 'F');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(f.title, margin + 6, currentY + 5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    const splitDesc = doc.splitTextToSize(f.desc, contentWidth - 10);
    doc.text(splitDesc, margin + 6, currentY + 9.5);

    currentY += 19;
  });

  // Strategic Institutional Recommendations
  currentY += 2;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Recommended Institutional Actions & Interventions', margin, currentY);

  currentY += 4;
  const recommendations = [
    {
      pillar: 'Circadian Hygiene Advising',
      action: 'Implement mandatory digital well-being modules during orientation focusing on pre-sleep screen curfews and blue-light moderation.'
    },
    {
      pillar: 'Study Consistency Frameworks',
      action: 'Promote 45-minute daily structured study sprints over last-minute cramming to harness the +0.626 consistency correlation.'
    },
    {
      pillar: 'Early-Warning Wellness Alerts',
      action: 'Deploy academic advising triggers for students exhibiting the Digital Heavy profile (>10h screen + <5h sleep) before midterms.'
    }
  ];

  recommendations.forEach((rec, idx) => {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, currentY, contentWidth, 10.5, 1, 1, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.text(`${idx + 1}. ${rec.pillar}:`, margin + 4, currentY + 6.5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.4);
    doc.text(rec.action, margin + 48, currentY + 6.5);

    currentY += 12.5;
  });

  // Methodology & Ethics Stamp
  currentY += 2;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, 'F');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  const ethicsText =
    'METHODOLOGY & GOVERNANCE: This document synthesizes findings from an empirical synthetic student research dataset (10,000 records) architected for institutional analytics. Statistical relationships represent correlational observations and should not be construed as clinical or causal medical diagnoses.';
  const splitEthics = doc.splitTextToSize(ethicsText, contentWidth - 8);
  doc.text(splitEthics, margin + 4, currentY + 5.5);

  // Page 2 Footer
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, pageHeight - 12, margin + contentWidth, pageHeight - 12);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('EduMetric Analytics Institutional Research · Decision-Support Briefing · Confidential Institutional Copy', margin, pageHeight - 8);
  doc.text('Page 2 of 2', margin + contentWidth, pageHeight - 8, { align: 'right' });

  // Trigger browser download
  const sanitizedCity = filters.city !== 'All' ? `_${filters.city}` : '';
  const sanitizedLevel = filters.academicLevel !== 'All' ? `_${filters.academicLevel}` : '';
  const filename = `EduMetric_Student_Analytics_Report${sanitizedCity}${sanitizedLevel}.pdf`;

  doc.save(filename);
}
