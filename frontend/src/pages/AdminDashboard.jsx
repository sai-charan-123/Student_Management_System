import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  School,
  X,
  Sparkles,
  Percent,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { statsApi, applicationApi, collegeApi } from '../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showAddCollegeModal, setShowAddCollegeModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');

  // New College Form State
  const [newCollegeData, setNewCollegeData] = useState({
    name: '',
    code: '',
    location: '',
    min_marks_requirement: '',
    established_year: '',
    website: '',
    description: '',
  });
  const [savingCollege, setSavingCollege] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statsRes, appsRes, colRes] = await Promise.all([
        statsApi.getStats(),
        applicationApi.getAll({
          status: statusFilter || undefined,
          college: collegeFilter || undefined,
          search: search || undefined,
        }),
        collegeApi.getAll(),
      ]);

      setStats(statsRes.data);
      setApplications(appsRes.data.results || appsRes.data || []);
      setColleges(colRes.data.results || colRes.data || []);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, collegeFilter, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 200);
    return () => clearTimeout(timer);
  }, [loadData]);

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await applicationApi.updateStatus(appId, {
        status: newStatus,
        remarks: `Manual Admin Override: Status changed to ${newStatus}.`,
      });
      setMessage(`Application ${newStatus.toLowerCase()} successfully!`);
      setTimeout(() => setMessage(''), 3000);
      loadData();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    if (!newCollegeData.name || !newCollegeData.code || !newCollegeData.min_marks_requirement) {
      return;
    }
    setSavingCollege(true);
    try {
      await collegeApi.create({
        ...newCollegeData,
        min_marks_requirement: parseFloat(newCollegeData.min_marks_requirement),
        established_year: newCollegeData.established_year ? parseInt(newCollegeData.established_year) : 2026,
      });
      setShowAddCollegeModal(false);
      setNewCollegeData({
        name: '',
        code: '',
        location: '',
        min_marks_requirement: '',
        established_year: '',
        website: '',
        description: '',
      });
      setMessage('New college created successfully!');
      setTimeout(() => setMessage(''), 3000);
      loadData();
    } catch (err) {
      console.error('Error creating college:', err);
    } finally {
      setSavingCollege(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            Admissions Administration Panel
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Application Management Portal</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review student admissions, manage cutoffs, and monitor institutional statistics.
          </p>
        </div>

        <button
          onClick={() => setShowAddCollegeModal(true)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New College
        </button>
      </div>

      {/* Alert toast message */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {message}
        </div>
      )}

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Applications</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.total_applications || 0}
          </div>
          <div className="text-xs text-slate-400 mt-1">Across all colleges</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold">
            <span>Accepted</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {stats?.accepted_count || 0}
          </div>
          <div className="text-xs text-emerald-700/70 mt-1">
            {stats?.acceptance_rate || 0}% acceptance rate
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-rose-600 text-xs font-semibold">
            <span>Not Qualified</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 mt-2">
            {stats?.rejected_count || 0}
          </div>
          <div className="text-xs text-rose-700/70 mt-1">Below minimum cutoffs</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-indigo-600 text-xs font-semibold">
            <span>Avg. Student Marks</span>
            <Percent className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 mt-2">
            {stats?.average_student_marks || 0}%
          </div>
          <div className="text-xs text-indigo-700/70 mt-1">Average scored score</div>
        </div>
      </div>

      {/* Applications Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Filters Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, email, or ID..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="WAITLISTED">Waitlisted</option>
            </select>

            {/* College Filter */}
            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 bg-white"
            >
              <option value="">All Colleges</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applications List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3.5 px-4">Tracking ID</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Applied College</th>
                <th className="py-3.5 px-4">Marks vs Cutoff</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {app.application_id}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{app.student_name}</div>
                      <div className="text-slate-400 text-[11px]">{app.student_email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{app.college_name}</div>
                      <div className="text-slate-400 text-[11px]">{app.course_name || 'General'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{app.marks_percentage}%</span>
                      <span className="text-slate-400 text-[11px] ml-1.5">
                        (Cutoff: {app.college_cutoff}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {app.status !== 'ACCEPTED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'ACCEPTED')}
                            disabled={updatingId === app.id}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-md border border-emerald-200 transition-colors cursor-pointer"
                          >
                            Accept
                          </button>
                        )}
                        {app.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                            disabled={updatingId === app.id}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-md border border-rose-200 transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                        {app.status !== 'WAITLISTED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'WAITLISTED')}
                            disabled={updatingId === app.id}
                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-md border border-indigo-200 transition-colors cursor-pointer"
                          >
                            Waitlist
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add College Modal */}
      {showAddCollegeModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-600" />
                Add New College
              </h3>
              <button
                onClick={() => setShowAddCollegeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollege} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">College Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stanford University"
                  value={newCollegeData.name}
                  onChange={(e) => setNewCollegeData({ ...newCollegeData, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STAN"
                    value={newCollegeData.code}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, code: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cutoff Marks (%) *</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    min="0"
                    max="100"
                    placeholder="e.g. 85.0"
                    value={newCollegeData.min_marks_requirement}
                    onChange={(e) => setNewCollegeData({ ...newCollegeData, min_marks_requirement: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. California, USA"
                  value={newCollegeData.location}
                  onChange={(e) => setNewCollegeData({ ...newCollegeData, location: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
                <input
                  type="url"
                  placeholder="https://www.stanford.edu"
                  value={newCollegeData.website}
                  onChange={(e) => setNewCollegeData({ ...newCollegeData, website: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Short summary of programs and campus facilities..."
                  value={newCollegeData.description}
                  onChange={(e) => setNewCollegeData({ ...newCollegeData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddCollegeModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCollege}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  Save College
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
