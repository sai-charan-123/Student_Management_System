import React, { useState } from 'react';
import { Calculator, CheckCircle, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { collegeApi } from '../api/client';

export default function EligibilityChecker({ onApplyCollege }) {
  const [marks, setMarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e?.preventDefault();
    if (!marks || isNaN(marks) || marks < 0 || marks > 100) {
      setError('Please enter a valid percentage between 0 and 100.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await collegeApi.checkEligibility(marks);
      setResult(response.data);
    } catch {
      setError('Failed to check eligibility. Please ensure backend is connected.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900">Instant Eligibility Calculator</h3>
          <p className="text-sm text-slate-500">
            Enter your high school or entrance score to discover colleges you qualify for
          </p>
        </div>
      </div>

      <form onSubmit={handleCheck} className="mt-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Enter your Marks / Percentage (e.g. 78.5)"
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 font-medium"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Check Eligibility
        </button>
      </form>

      {error && (
        <div className="mt-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              Analysis for <strong className="text-indigo-600">{result.student_marks}%</strong> Score:
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              {result.eligible_count} Eligible College{result.eligible_count !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Eligible colleges */}
            {result.eligible_colleges.map((col) => (
              <div
                key={col.id}
                className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-sm">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Eligible</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{col.name}</h4>
                  <p className="text-xs text-slate-500">
                    Cutoff: <span className="font-semibold text-emerald-700">{col.min_marks_requirement}%</span> | Location: {col.location}
                  </p>
                </div>
                <button
                  onClick={() => onApplyCollege?.(col)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  Apply
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}

            {/* Ineligible colleges */}
            {result.ineligible_colleges.map((col) => {
              const diff = (col.min_marks_requirement - result.student_marks).toFixed(1);
              return (
                <div
                  key={col.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 opacity-80"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Need {diff}% more</span>
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">{col.name}</h4>
                    <p className="text-xs text-slate-500">
                      Cutoff: <span className="font-semibold text-slate-700">{col.min_marks_requirement}%</span>
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded shrink-0 font-medium">
                    Cutoff: {col.min_marks_requirement}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
