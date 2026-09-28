import React, { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { applicationApi } from '../api/client';

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!query.trim()) {
      setError('Please enter an application ID or registered email.');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const res = await applicationApi.track(query.trim());
      setApplications(res.data);
    } catch (err) {
      setApplications([]);
      if (err.response?.status === 404) {
        setError('No applications found matching your search. Please verify your ID or email.');
      } else {
        setError('Failed to retrieve applications. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sampleQuery) => {
    setQuery(sampleQuery);
    setTimeout(() => {
      // Auto trigger track
      applicationApi.track(sampleQuery)
        .then((res) => {
          setApplications(res.data);
          setSearched(true);
          setError('');
        })
        .catch(() => {
          setError('Sample not found.');
        });
    }, 50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <Search className="w-3.5 h-3.5" />
          Real-Time Application Status
        </span>
        <h1 className="text-3xl font-bold text-slate-900">Track Your Admission Status</h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Look up your submitted college applications using your Application Tracking ID or registered Email address.
        </p>
      </div>

      {/* Search Box Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Application ID (e.g. APP-78987289) or Email"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 text-sm font-medium placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-sm"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Search className="w-4 h-4" />
            )}
            Track Status
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Quick Try Samples:</span>
          <button
            type="button"
            onClick={() => handleSampleClick('saicharan@example.com')}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-mono transition-colors cursor-pointer"
          >
            saicharan@example.com
          </button>
          <button
            type="button"
            onClick={() => handleSampleClick('aarav.sharma@example.com')}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-mono transition-colors cursor-pointer"
          >
            aarav.sharma@example.com
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm text-center">
          {error}
        </div>
      )}

      {/* Application Results */}
      {searched && applications && applications.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 px-1">
            Found {applications.length} Application{applications.length !== 1 ? 's' : ''}
          </h2>

          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-indigo-200 transition-colors"
              >
                {/* Application Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono text-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 uppercase">
                        {app.application_id}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">{app.college_name}</h3>
                    </div>
                  </div>

                  <div>
                    <StatusBadge status={app.status} size="md" />
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Applicant Name</span>
                    <span className="text-slate-800 font-bold text-sm mt-0.5 block">{app.student_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Course</span>
                    <span className="text-slate-800 font-semibold text-sm mt-0.5 block">
                      {app.course_name || 'General Admission'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Student Marks Scored</span>
                    <span className="text-indigo-600 font-bold text-sm mt-0.5 block">
                      {app.marks_percentage}%{' '}
                      <span className="text-slate-400 text-xs font-normal">(Cutoff: {app.college_cutoff}%)</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium block">Submission Date</span>
                    <span className="text-slate-700 font-medium mt-0.5 block">
                      {new Date(app.applied_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Remarks block */}
                {app.remarks && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Status Decision Note: </span>
                    {app.remarks}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
