import React from 'react';

export default function StatusBadge({ status = 'pending', label }) {
  const normalized = status.toLowerCase();

  const styles = {
    approved: 'bg-green-100 text-green-700 border border-green-200/60',
    pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200/60',
    rejected: 'bg-red-100 text-red-700 border border-red-200/60',
    completed: 'bg-green-100 text-green-700 border border-green-200/60'
  };

  const displayText = label || (
    normalized === 'approved' ? 'Approved' :
    normalized === 'pending' ? 'Pending' :
    normalized === 'rejected' ? 'Rejected' :
    normalized === 'completed' ? 'Approved' : normalized
  );

  return (
    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded tracking-wider inline-flex items-center gap-1 ${styles[normalized] || styles.pending}`}>
      {displayText}
    </span>
  );
}
