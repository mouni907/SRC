import React from 'react';
import { Check, Clock3, X } from 'lucide-react';

export default function StatusBadge({ status = 'pending', label }) {
  const normalized = status.toLowerCase();

  const styles = {
    approved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    pending: 'bg-amber-50 text-amber-700 border border-amber-200',
    rejected: 'bg-red-50 text-red-700 border border-red-200',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  };

  const icons = { approved: Check, completed: Check, pending: Clock3, rejected: X };
  const Icon = icons[normalized];

  const displayText = label || (
    normalized === 'approved' ? 'Approved' :
    normalized === 'pending' ? 'Pending' :
    normalized === 'rejected' ? 'Rejected' :
    normalized === 'completed' ? 'Approved' : normalized
  );

  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full tracking-wide inline-flex items-center gap-1 ${styles[normalized] || styles.pending}`}>
      {Icon && <Icon className="h-3 w-3" />}
      {displayText}
    </span>
  );
}
