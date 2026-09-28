import React, { useState, useEffect } from 'react';
import {
  Building2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import EligibilityChecker from '../components/EligibilityChecker';
import CollegeCard from '../components/CollegeCard';
import CollegeModal from '../components/CollegeModal';
import { statsApi, collegeApi } from '../api/client';

export default function HomePage({ setActiveTab, setSelectedCollegeForApply }) {
  const [stats, setStats] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollegeModal, setSelectedCollegeModal] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, colRes] = await Promise.all([
          statsApi.getStats(),
          collegeApi.getAll(),
        ]);
        setStats(statsRes.data);
        setColleges(colRes.data.results || colRes.data || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleApply = (college) => {
    setSelectedCollegeForApply(college);
    setActiveTab('apply');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-800/40">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Centralized College Admissions Platform 2026
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Find Your Dream College.{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              Check Cutoffs & Apply Instantly.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Direct online application portal for top global and regional universities.
            Instant cutoff verification, automatic eligibility analysis, and real-time status tracking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('apply')}
              className="px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center gap-2 transition-all cursor-pointer"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('colleges')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              Explore All Colleges
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="relative z-10 mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats?.total_colleges || 5}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Affiliated Colleges</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300">
              {stats?.total_courses || 15}+
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Academic Programs</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {stats?.acceptance_rate || 66.7}%
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Overall Acceptance Rate</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-pink-300">
              {stats?.total_applications || 6}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">Applications Processed</div>
          </div>
        </div>
      </section>

      {/* Interactive Eligibility Calculator */}
      <section>
        <EligibilityChecker onApplyCollege={handleApply} />
      </section>

      {/* How it works 3-step guide */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Streamlined Process</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">How College Admissions Work</h2>
          <p className="text-sm text-slate-500 mt-1">Simple 3-step online admission workflow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-base mb-4">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Check Cutoffs</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explore colleges (Oxford, Cambridge, MITS, Viswam, Gnanambika) and view minimum mark requirements.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-base mb-4">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Apply with Percentage</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fill out student details and submit your marks. The system automatically verifies your eligibility.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-base mb-4">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Track Real-Time Status</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive your unique Application Tracking ID (`APP-XXXXXX`) to monitor review or acceptance status anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Colleges Gallery */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Colleges & Universities</h2>
            <p className="text-sm text-slate-500">
              Browse institution requirements, cutoff scores, and academic programs
            </p>
          </div>
          <button
            onClick={() => setActiveTab('colleges')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            View all colleges ({colleges.length})
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.slice(0, 6).map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onViewDetails={(c) => setSelectedCollegeModal(c)}
                onApply={handleApply}
              />
            ))}
          </div>
        )}
      </section>

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
