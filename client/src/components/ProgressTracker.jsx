import React from 'react';

export default function ProgressTracker({ departments = {} }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <h4 className="font-semibold text-sm mb-2 text-slate-800">Clearance Progress</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {['library', 'hostel', 'sports', 'accounts'].map((dept) => (
          <div key={dept} className="p-2 bg-slate-50 border border-slate-200 rounded text-center text-xs capitalize">
            {dept}: {departments[dept]?.status || 'Pending'}
          </div>
        ))}
      </div>
    </div>
  );
}
