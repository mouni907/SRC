import React from 'react';
import { ClipboardList } from 'lucide-react';
import AdminPortalLayout from './AdminPortalLayout';

export default function AuditLogs() {
  return <AdminPortalLayout title="Audit Logs"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><ClipboardList className="h-5 w-5" /></div><div><h1 className="text-xl font-bold">Audit Logs</h1><p className="mt-1 text-xs text-slate-500">A traceable record of governance actions.</p></div></div></section><section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="text-sm font-semibold text-slate-700">No audit events recorded</p><p className="mt-1 text-xs text-slate-500">New approval and registry events will appear here.</p></section></AdminPortalLayout>;
}
