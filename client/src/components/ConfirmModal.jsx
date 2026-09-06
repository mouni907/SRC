import React from 'react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl">
        <h3 className="font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
