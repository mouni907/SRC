import React from 'react';
import { BarChart3, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { useClearance } from '../../context/ClearanceContext';
import AdminPortalLayout from './AdminPortalLayout';

export default function Statistics() {
  const { clearanceRequest, pendingCount, rejectedCount } = useClearance();
  const total = Object.keys(clearanceRequest?.departments || {}).length;
  const approved = total - pendingCount - rejectedCount;
  const rate = (value) => total ? `${Math.round((value / total) * 100)}%` : '0%';
  return <AdminPortalLayout title="Statistics"><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h1 className="text-xl font-bold">Governance Statistics</h1><p className="mt-1 text-xs text-slate-500">Approval, pending, and rejection signals across the clearance registry.</p></section><section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{[['Total Requests', total, BarChart3, 'text-blue-600'], ['Approved', approved, CheckCircle2, 'text-emerald-600'], ['Pending', pendingCount, Clock3, 'text-amber-600'], ['Rejected', rejectedCount, XCircle, 'text-red-600']].map(([label, value, Icon, tone]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><Icon className={`h-4 w-4 ${tone}`} /><p className="mt-3 text-xs text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}</section><section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-bold">Clearance Completion Rate</h2><div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: rate(approved) }} /></div><div className="mt-3 grid grid-cols-3 gap-3 text-xs"><div><p className="text-emerald-700 font-bold">{rate(approved)}</p><p className="text-slate-500">Approved</p></div><div><p className="text-amber-700 font-bold">{rate(pendingCount)}</p><p className="text-slate-500">Pending</p></div><div><p className="text-red-700 font-bold">{rate(rejectedCount)}</p><p className="text-slate-500">Rejected</p></div></div></section></AdminPortalLayout>;
}
