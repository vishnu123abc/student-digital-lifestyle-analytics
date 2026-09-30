import React, { useState } from 'react';
import { Filter, RotateCcw, Search, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterState } from '../types/analytics';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalRecordsCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalRecordsCount,
  filteredCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleReset = () => {
    setFilters({
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
  };

  const isFiltered = 
    filters.gender !== 'All' ||
    filters.ageGroup !== 'All' ||
    filters.academicLevel !== 'All' ||
    filters.course !== 'All' ||
    filters.yearOfStudy !== 'All' ||
    filters.city !== 'All' ||
    filters.state !== 'All' ||
    filters.platform !== 'All' ||
    filters.digitalCategory !== 'All' ||
    filters.performanceBand !== 'All' ||
    filters.segment !== 'All' ||
    filters.lateNight !== 'All' ||
    filters.studyHabitCategory !== 'All' ||
    filters.sleepCategory !== 'All' ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5 mb-6 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Interactive Multi-Dimensional Slicers
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-600 font-mono tabular-nums">
            Showing <strong className="text-slate-900">{filteredCount.toLocaleString()}</strong> of {totalRecordsCount.toLocaleString()} Students ({((filteredCount / (totalRecordsCount || 1)) * 100).toFixed(1)}%)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>{showAdvanced ? 'Fewer Filters' : 'More Demographic & Habit Filters'}</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Slicers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {/* Search */}
        <div className="col-span-2">
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Search Student / Major / City</label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="e.g. STU_90042, Computer Science, Boston..."
              className="w-full text-xs pl-8 pr-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
            />
          </div>
        </div>

        {/* Academic Level */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Academic Level</label>
          <select
            value={filters.academicLevel}
            onChange={(e) => setFilters(prev => ({ ...prev, academicLevel: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Levels</option>
            <option value="High School">High School</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>

        {/* Primary Platform */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Primary Platform</label>
          <select
            value={filters.platform}
            onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Platforms</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YouTube</option>
            <option value="Reddit">Reddit</option>
            <option value="Snapchat">Snapchat</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="X (Twitter)">X (Twitter)</option>
          </select>
        </div>

        {/* Digital Usage Category */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Digital Usage</label>
          <select
            value={filters.digitalCategory}
            onChange={(e) => setFilters(prev => ({ ...prev, digitalCategory: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Tiers</option>
            <option value="Low">Low (&lt; 3h)</option>
            <option value="Moderate">Moderate (3-5.4h)</option>
            <option value="High">High (5.5-7.9h)</option>
            <option value="Severe">Severe (&gt;= 8h)</option>
          </select>
        </div>

        {/* Performance Band */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Academic Band</label>
          <select
            value={filters.performanceBand}
            onChange={(e) => setFilters(prev => ({ ...prev, performanceBand: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Bands</option>
            <option value="Distinction">Distinction (&gt;= 3.6)</option>
            <option value="High Merit">High Merit (3.2-3.59)</option>
            <option value="Merit">Merit (2.8-3.19)</option>
            <option value="Pass">Pass (2.4-2.79)</option>
            <option value="At Risk">At Risk (&lt; 2.4)</option>
          </select>
        </div>

        {/* Student Segment */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">Behavioral Segment</label>
          <select
            value={filters.segment}
            onChange={(e) => setFilters(prev => ({ ...prev, segment: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Segments</option>
            <option value="Highly Engaged">Highly Engaged</option>
            <option value="Balanced Learner">Balanced Learner</option>
            <option value="Digital Heavy">Digital Heavy</option>
            <option value="Disengaged">Disengaged</option>
          </select>
        </div>

        {/* Metropolitan Hub / City */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 mb-1">City Hub</label>
          <select
            value={filters.city}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Cities</option>
            <option value="Boston">Boston</option>
            <option value="Austin">Austin</option>
            <option value="Seattle">Seattle</option>
            <option value="Chicago">Chicago</option>
            <option value="New York">New York</option>
            <option value="Atlanta">Atlanta</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Denver">Denver</option>
            <option value="Toronto">Toronto</option>
            <option value="London">London</option>
          </select>
        </div>
      </div>

      {/* Advanced Secondary Filters (Expandable) */}
      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 pt-3 mt-3 border-t border-slate-100 animate-in fade-in">
          {/* Gender */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Gender</label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
              className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Genders</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-Binary">Non-Binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Age Group</label>
            <select
              value={filters.ageGroup}
              onChange={(e) => setFilters(prev => ({ ...prev, ageGroup: e.target.value }))}
              className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Ages</option>
              <option value="<18">&lt; 18 yrs</option>
              <option value="18-21">18 – 21 yrs</option>
              <option value="22-25">22 – 25 yrs</option>
              <option value="26+">26+ yrs</option>
            </select>
          </div>

          {/* Year of Study */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Year of Study</label>
            <select
              value={filters.yearOfStudy}
              onChange={(e) => setFilters(prev => ({ ...prev, yearOfStudy: e.target.value }))}
              className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Years</option>
              <option value="1">Year 1 (Freshman)</option>
              <option value="2">Year 2 (Sophomore)</option>
              <option value="3">Year 3 (Junior)</option>
              <option value="4">Year 4 (Senior)</option>
            </select>
          </div>

          {/* Late-Night Usage */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Late-Night Screen</label>
            <select
              value={filters.lateNight}
              onChange={(e) => setFilters(prev => ({ ...prev, lateNight: e.target.value }))}
              className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Habits</option>
              <option value="LateNight">Late-Night (&lt;45m to bed)</option>
              <option value="NoLateNight">Offline Before Bed</option>
            </select>
          </div>

          {/* Study Habit Category */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Study Habit</label>
            <select
              value={filters.studyHabitCategory}
              onChange={(e) => setFilters(prev => ({ ...prev, studyHabitCategory: e.target.value }))}
              className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Habits</option>
              <option value="Highly Consistent">Highly Consistent (Score 8-10)</option>
              <option value="Moderately Consistent">Moderately Consistent (5-7)</option>
              <option value="Irregular">Irregular (&lt;5)</option>
            </select>
          </div>

          {/* Sleep Category */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Sleep Category</label>
            <select
              value={filters.sleepCategory}
              onChange={(e) => setFilters(prev => ({ ...prev, sleepCategory: e.target.value }))}
              className="w-full text-xs py-1.5 px-2 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
            >
              <option value="All">All Sleep Durations</option>
              <option value="Adequate">Adequate (&gt;= 7h)</option>
              <option value="Marginal">Marginal (5.5 – 6.9h)</option>
              <option value="Deprived">Deprived (&lt; 5.5h)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
