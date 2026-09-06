import React from 'react';

export default function NotificationPanel({ notifications = [] }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <h4 className="font-semibold text-sm mb-2 text-slate-800">Notifications</h4>
      {notifications.length === 0 ? (
        <p className="text-xs text-slate-500">No new notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n, i) => (
            <li key={i} className="text-xs p-2 bg-slate-50 rounded border border-slate-100">
              <span className="font-semibold">{n.title}:</span> {n.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
