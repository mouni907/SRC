import React from 'react';

export default function ClearanceCard({ department, status = 'pending', reason }) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-lg">
      <div className="font-semibold capitalize text-slate-800">{department}</div>
      <div className="text-xs text-slate-500 mt-1">Status: {status}</div>
      {reason && <div className="text-xs text-rose-600 mt-1">Reason: {reason}</div>}
    </div>
  );
}
