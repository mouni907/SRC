import React from 'react';
import { Bell } from 'lucide-react';
import { useClearance } from '../../context/ClearanceContext';
import AdminPortalLayout from './AdminPortalLayout';

export default function AdminNotifications() {
  const { notifications } = useClearance();
  return <AdminPortalLayout title="Notifications"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Bell className="h-5 w-5" /></div><div><h1 className="text-xl font-bold">Governance Notifications</h1><p className="mt-1 text-xs text-slate-500">System-wide clearance activity updates.</p></div></div></section><section className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{notifications.length ? notifications.map((item) => <div key={item.id} className="p-5"><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.message}</p><p className="mt-2 text-[10px] text-slate-400">{item.timestamp}</p></div>) : <p className="p-8 text-center text-sm text-slate-500">No notifications.</p>}</section></AdminPortalLayout>;
}
