import React, { useState, useEffect } from 'react';
import {
  Send,
  Building2,
  BookOpen,
  User,
  Mail,
  Phone,
  Percent,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import { collegeApi, applicationApi } from '../api/client';

export default function ApplyPage({
  selectedCollegeForApply,
  setSelectedCollegeForApply,
  setActiveTab,
}) {
  const [colleges, setColleges] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    college: selectedCollegeForApply?.id || '',
    course: '',
    student_name: '',
    student_email: '',
    student_phone: '',
    marks_percentage: '',
  });

  // Fetch all colleges
  useEffect(() => {
    async function loadColleges() {
      try {
        const res = await collegeApi.getAll();
        const list = res.data.results || res.data || [];
        setColleges(list);

        if (selectedCollegeForApply) {
          setFormData((prev) => ({
            ...prev,
            college: selectedCollegeForApply.id,
          }));
        } else if (list.length > 0) {
          setFormData((prev) => ({
            ...prev,
            college: prev.college || list[0].id,
          }));
        }
      } catch (err) {
        console.error('Error fetching colleges for apply form:', err);
      }
    }
    loadColleges();
  }, [selectedCollegeForApply]);

  // Selected College object & courses
  const currentCollege = colleges.find((c) => String(c.id) === String(formData.college));
  const currentCourses = currentCollege?.courses || [];

  // Selected Course object
  const currentCourse = currentCourses.find((c) => String(c.id) === String(formData.course));
  const effectiveCutoff = currentCourse?.effective_cutoff || currentCollege?.min_marks_requirement || 0;

  // Real-time cutoff comparison
  const studentMarks = parseFloat(formData.marks_percentage);
  const isMarksValid = !isNaN(studentMarks) && studentMarks >= 0 && studentMarks <= 100;
  const isEligible = isMarksValid && effectiveCutoff > 0 && studentMarks >= effectiveCutoff;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCollegeChange = (e) => {
    const newColId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      college: newColId,
      course: '', // Reset course on college change
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.college) {
      setError('Please select a college.');
      return;
    }
    if (!formData.student_name.trim()) {
      setError('Please enter student name.');
      return;
    }
    if (!formData.student_email.trim()) {
      setError('Please enter a valid email.');
      return;
    }
    if (!isMarksValid) {
      setError('Please enter a valid marks percentage between 0 and 100.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        college: formData.college,
        course: formData.course || null,
        student_name: formData.student_name.trim(),
        student_email: formData.student_email.trim(),
        student_phone: formData.student_phone.trim(),
        marks_percentage: studentMarks,
      };

      const res = await applicationApi.create(payload);
      setSubmittedApplication(res.data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        'Failed to submit application. Please verify your inputs.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedApplication(null);
    setSelectedCollegeForApply(null);
    setFormData({
      college: colleges[0]?.id || '',
      course: '',
      student_name: '',
      student_email: '',
      student_phone: '',
      marks_percentage: '',
    });
  };

  const copyTrackingId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
          <Send className="w-3.5 h-3.5" />
          Direct Admission Application Form
        </span>
        <h1 className="text-3xl font-bold text-slate-900">Apply for College Admission</h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Submit your academic percentage and details to evaluate instant admission eligibility.
        </p>
      </div>

      {submittedApplication ? (
        /* Confirmation Receipt View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div
            className={`p-8 text-white text-center ${
              submittedApplication.status === 'ACCEPTED'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                : 'bg-gradient-to-r from-slate-800 to-slate-900'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto mb-4">
              {submittedApplication.status === 'ACCEPTED' ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : (
                <Clock className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold">Application Successfully Submitted!</h2>
            <p className="text-sm text-white/80 mt-1">
              Your application has been processed by the admissions engine.
            </p>
          </div>

          <div className="p-8 space-y-6">
            {/* Tracking ID Bar */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-indigo-700 font-semibold uppercase tracking-wider block">
                  Application Tracking Number
                </span>
                <span className="text-2xl font-mono font-extrabold text-indigo-950">
                  {submittedApplication.application_id}
                </span>
              </div>
              <button
                onClick={() => copyTrackingId(submittedApplication.application_id)}
                className="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-100 text-xs font-semibold rounded-xl border border-indigo-300 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied ID' : 'Copy Tracking ID'}
              </button>
            </div>

            {/* Application Details Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Applicant Name</span>
                <span className="font-bold text-slate-800 text-base">{submittedApplication.student_name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Applied College</span>
                <span className="font-bold text-slate-800 text-base">{submittedApplication.college_name}</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Selected Course / Department</span>
                <span className="font-semibold text-slate-700">
                  {submittedApplication.course_name || 'General Admission Program'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Student Marks Scored</span>
                <span className="font-bold text-indigo-600">{submittedApplication.marks_percentage}%</span>
                <span className="text-xs text-slate-500 ml-2">
                  (Cutoff: {submittedApplication.college_cutoff}%)
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Admission Status</span>
                <div className="mt-1">
                  <StatusBadge status={submittedApplication.status} />
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-medium">Contact Email</span>
                <span className="text-slate-700 font-medium">{submittedApplication.student_email}</span>
              </div>
            </div>

            {/* Remarks note */}
            {submittedApplication.remarks && (
              <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-700">
                <strong>System Note: </strong>
                {submittedApplication.remarks}
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Submit Another Application
              </button>

              <button
                onClick={() => setActiveTab('track')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Track Status
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Application Form */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Institution Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  Target College / University *
                </label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleCollegeChange}
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white font-medium text-slate-800"
                >
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Cutoff: {c.min_marks_requirement}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Course / Program (Optional)
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white font-medium text-slate-800"
                >
                  <option value="">-- General Admission (College Cutoff) --</option>
                  {currentCourses.map((crs) => (
                    <option key={crs.id} value={crs.id}>
                      {crs.name} (Cutoff: {crs.effective_cutoff}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student Personal Info */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" />
                  Student Full Name *
                </label>
                <input
                  type="text"
                  name="student_name"
                  value={formData.student_name}
                  onChange={handleChange}
                  placeholder="e.g. Sai Charan"
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-500" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="student_email"
                  value={formData.student_email}
                  onChange={handleChange}
                  placeholder="e.g. saicharan@example.com"
                  required
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800 font-medium placeholder:text-slate-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="student_phone"
                  value={formData.student_phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-slate-800 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Marks & Live Cutoff Feedback Section */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-indigo-600" />
                  Marks Percentage Scored (0 - 100) *
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="number"
                    name="marks_percentage"
                    value={formData.marks_percentage}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g. 82.5"
                    required
                    className="w-full p-3 pr-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base font-bold text-slate-900"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
              </div>

              {/* Real-time Cutoff Preview Card */}
              {isMarksValid && currentCollege && (
                <div
                  className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                    isEligible
                      ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50/90 border-rose-300 text-rose-900'
                  }`}
                >
                  {isEligible ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-bold text-sm">
                      {isEligible ? 'Eligibility Confirmed!' : 'Cutoff Requirement Notice'}
                    </h4>
                    <p className="text-xs mt-0.5 opacity-90">
                      {isEligible ? (
                        <>
                          Your score of <strong>{studentMarks}%</strong> meets the required cutoff of{' '}
                          <strong>{effectiveCutoff}%</strong> for {currentCollege.name}. Your application will be{' '}
                          <strong>ACCEPTED</strong> upon submission!
                        </>
                      ) : (
                        <>
                          Your score of <strong>{studentMarks}%</strong> is below the required cutoff of{' '}
                          <strong>{effectiveCutoff}%</strong> for {currentCollege.name}.
                        </>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Submit Admission Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
