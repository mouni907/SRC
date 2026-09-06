import React from 'react';
import { Bell, CheckCircle2, Clock3 } from 'lucide-react';
import { useClearance } from '../../context/ClearanceContext';
import DepartmentPortalLayout from './DepartmentPortalLayout';

export default function DepartmentNotifications() {
  const { notifications } = useClearance();
  const sportsNotifications = notifications.filter((notification) => notification.department === 'sports');

  return (
    <DepartmentPortalLayout title="Sports Notifications">
      <section className="dept-notifications-card rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Bell className="h-5 w-5" /></div>
          <div><h1 className="text-lg font-bold">Sports Notifications</h1><p className="mt-1 text-xs text-slate-500">Updates for the Sports Department clearance desk.</p></div>
        </div>
      </section>
      <section className="dept-notifications-card overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {sportsNotifications.length ? sportsNotifications.map((notification) => (
          <div key={notification.id} className="flex gap-3 border-b border-slate-100 p-5 last:border-b-0">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${notification.type === 'approval' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              {notification.type === 'approval' ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
            </div>
            <div><p className="text-sm font-semibold text-slate-800">{notification.title}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">{notification.message}</p><p className="mt-2 text-[10px] text-slate-400">{notification.timestamp}</p></div>
          </div>
        )) : <p className="p-8 text-center text-sm text-slate-500">No Sports notifications yet.</p>}
      </section>
    </DepartmentPortalLayout>
  );
}
