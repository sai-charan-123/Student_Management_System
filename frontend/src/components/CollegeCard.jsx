import React from 'react';
import { MapPin, BookOpen, ArrowRight, Eye, Sparkles } from 'lucide-react';

export default function CollegeCard({ college, onViewDetails, onApply }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* College Image Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80'}
          alt={college.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        {/* Cutoff Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-indigo-900 shadow-md backdrop-blur-xs border border-indigo-100">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            Min Cutoff: {college.min_marks_requirement}%
          </span>
        </div>

        {/* Location Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="text-xs font-mono text-indigo-200 tracking-wide uppercase font-semibold">
            {college.code}
          </div>
          <h3 className="text-lg font-bold text-white line-clamp-1 leading-snug">
            {college.name}
          </h3>
        </div>
      </div>

      {/* College Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center text-xs text-slate-500 gap-1 mb-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="line-clamp-1">{college.location}</span>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {college.description || 'Providing quality higher education and technical excellence.'}
          </p>

          {/* Courses chips */}
          {college.courses && college.courses.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100">
              <div className="text-xs font-medium text-slate-500 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  Courses Offered
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {college.courses.length} departments
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {college.courses.slice(0, 2).map((c) => (
                  <span
                    key={c.id}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                  >
                    {c.name.split('(')[0].trim()}
                  </span>
                ))}
                {college.courses.length > 2 && (
                  <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 font-semibold">
                    +{college.courses.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(college)}
            className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            View Details
          </button>
          <button
            onClick={() => onApply(college)}
            className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:shadow transition-all cursor-pointer"
          >
            Apply Now
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
