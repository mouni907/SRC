import React from 'react';

export default function LoadingSpinner({ size = 'w-6 h-6' }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`${size} border-2 border-indigo-600 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}
