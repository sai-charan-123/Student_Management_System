import React from 'react';
import { X, MapPin, Calendar, Globe, BookOpen, Users, ArrowRight } from 'lucide-react';

export default function CollegeModal({ college, onClose, onApply }) {
  if (!college) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header Image */}
        <div className="relative h-48 sm:h-56 rounded-t-2xl overflow-hidden bg-slate-800">
          <img
            src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80'}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-600/90 text-xs font-semibold tracking-wide uppercase mb-1">
              Code: {college.code}
            </span>
            <h2 className="text-2xl font-bold">{college.name}</h2>
            <p className="text-xs text-slate-200 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              {college.location}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <div>
              <div className="text-xs text-slate-500 font-medium">Cutoff Requirement</div>
              <div className="text-lg font-bold text-indigo-600">{college.min_marks_requirement}%</div>
            </div>
            <div className="border-x border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Est. Year</div>
              <div className="text-lg font-bold text-slate-800">{college.established_year || 'N/A'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium">Total Applicants</div>
              <div className="text-lg font-bold text-emerald-600">{college.total_applications || 0}</div>
            </div>
          </div>

          {/* Description */}
          {college.description && (
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-1">About the Institution</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{college.description}</p>
            </div>
          )}

          {/* Courses Offered */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Available Courses & Departments ({college.courses?.length || 0})
              </h4>
            </div>

            <div className="space-y-2.5">
              {college.courses && college.courses.length > 0 ? (
                college.courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{course.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {course.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {course.duration_years} Years
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.seats_available} Seats
                        </span>
                        {course.tuition_fee > 0 && (
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            ₹{Number(course.tuition_fee).toLocaleString()}/yr
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Cutoff: {course.effective_cutoff || college.min_marks_requirement}%
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No specific courses listed. General admission cutoff applies.</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          {college.website ? (
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              Visit Official Website
            </a>
          ) : <span />}

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onApply(college);
              }}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              Apply to College
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
