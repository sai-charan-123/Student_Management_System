import React, { useState, useEffect, useCallback } from 'react';
import { Search, School, RotateCcw } from 'lucide-react';
import CollegeCard from '../components/CollegeCard';
import CollegeModal from '../components/CollegeModal';
import { collegeApi } from '../api/client';

export default function CollegesPage({ setActiveTab, setSelectedCollegeForApply }) {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [maxCutoff, setMaxCutoff] = useState(100);
  const [sortBy, setSortBy] = useState('name');
  const [selectedCollegeModal, setSelectedCollegeModal] = useState(null);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await collegeApi.getAll({
        search: search || undefined,
        max_cutoff: maxCutoff < 100 ? maxCutoff : undefined,
      });
      let data = res.data.results || res.data || [];

      // Sort
      if (sortBy === 'cutoff-asc') {
        data.sort((a, b) => a.min_marks_requirement - b.min_marks_requirement);
      } else if (sortBy === 'cutoff-desc') {
        data.sort((a, b) => b.min_marks_requirement - a.min_marks_requirement);
      } else if (sortBy === 'name') {
        data.sort((a, b) => a.name.localeCompare(b.name));
      }

      setColleges(data);
    } catch (err) {
      console.error('Error fetching colleges:', err);
    } finally {
      setLoading(false);
    }
  }, [search, maxCutoff, sortBy]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchColleges();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [fetchColleges]);

  const handleResetFilters = () => {
    setSearch('');
    setMaxCutoff(100);
    setSortBy('name');
  };

  const handleApply = (college) => {
    setSelectedCollegeForApply(college);
    setActiveTab('apply');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
            <School className="w-3.5 h-3.5" />
            Admissions 2026 Directory
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Explore Colleges & Universities</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse our network of partner institutions, explore minimum cutoff requirements, and apply directly.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          {/* Search Box */}
          <div className="sm:col-span-6 lg:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search College Name, Code, or Location
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Oxford, MITS, Viswam, AP..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Cutoff Slider */}
          <div className="sm:col-span-6 lg:col-span-4">
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Max Cutoff Filter: <span className="text-indigo-600 font-bold">{maxCutoff}%</span>
              </label>
              {maxCutoff < 100 && (
                <span className="text-[11px] text-slate-400">Showing cutoffs &le; {maxCutoff}%</span>
              )}
            </div>
            <input
              type="range"
              min="50"
              max="100"
              step="1"
              value={maxCutoff}
              onChange={(e) => setMaxCutoff(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-6 lg:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
            >
              <option value="name">Name (A-Z)</option>
              <option value="cutoff-asc">Cutoff (Lowest first)</option>
              <option value="cutoff-desc">Cutoff (Highest first)</option>
            </select>
          </div>

          {/* Reset Button */}
          <div className="sm:col-span-6 lg:col-span-1 flex justify-end">
            <button
              onClick={handleResetFilters}
              title="Reset Filters"
              className="w-full sm:w-auto p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Colleges Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-white border border-slate-200 animate-pulse" />
          ))}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No colleges match your filter</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords or increasing the maximum cutoff filter threshold.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="text-xs font-semibold text-slate-500 mb-4 px-1">
            Showing {colleges.length} Institution{colleges.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onViewDetails={(c) => setSelectedCollegeModal(c)}
                onApply={handleApply}
              />
            ))}
          </div>
        </div>
      )}

      {/* College Modal */}
      {selectedCollegeModal && (
        <CollegeModal
          college={selectedCollegeModal}
          onClose={() => setSelectedCollegeModal(null)}
          onApply={handleApply}
        />
      )}
    </div>
  );
}
