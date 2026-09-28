import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const normalized = (status || '').toUpperCase();

  const configs = {
    ACCEPTED: {
      label: 'Accepted',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    REJECTED: {
      label: 'Not Accepted',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
    },
    PENDING_REVIEW: {
      label: 'Under Review',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
    },
    WAITLISTED: {
      label: 'Waitlisted',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: AlertCircle,
    },
  };

  const config = configs[normalized] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };

  const IconComponent = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses}`}>
      <IconComponent className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      <span>{config.label}</span>
    </span>
  );
}

