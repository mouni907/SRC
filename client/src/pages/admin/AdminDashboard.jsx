import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, CheckCircle2, Clock3, ShieldCheck, Users, XCircle } from 'lucide-react';
import { useClearance } from '../../context/ClearanceContext';
import StatusBadge from '../../components/StatusBadge';
import AdminPortalLayout from './AdminPortalLayout';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { clearanceRequest, student, pendingCount, rejectedCount } = useClearance();
  const hasRequest = Boolean(clearanceRequest?.id);
  const stats = [['Total Requests', hasRequest ? 1 : 0, Users, 'text-blue-600'], ['Completed', clearanceRequest?.overallStatus === 'approved' ? 1 : 0, CheckCircle2, 'text-emerald-600'], ['Pending', pendingCount, Clock3, 'text-amber-600'], ['Rejected', rejectedCount, XCircle, 'text-red-600']];

  return <AdminPortalLayout title="Governance Dashboard">
    <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600"><ShieldCheck className="h-6 w-6" /></div><div><p className="text-xl font-bold">Dean Administration Desk</p><p className="mt-1 text-xs text-slate-500">Monitoring institutional clearance compliance and student readiness</p></div></div><p className="max-w-sm border-l border-slate-200 pl-4 text-xs leading-relaxed text-slate-500 lg:text-right">Academic governance overview for the current clearance cycle.</p></section>
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([label, value, Icon, tone]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-500">{label}</p><Icon className={`h-4 w-4 ${tone}`} /></div><p className="mt-3 text-2xl font-bold">{value}</p><p className="mt-1 text-[11px] text-slate-500">Institutional registry</p></div>)}</section>
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]"><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="text-sm font-bold">Department Overview</h2><p className="mt-1 text-xs text-slate-500">Current approval state across all desks.</p></div><button type="button" onClick={() => navigate('/admin/statistics')} className="text-xs font-semibold text-blue-600">View statistics</button></div><div className="grid grid-cols-2 gap-3 p-5">{Object.entries(clearanceRequest?.departments || {}).map(([key, item]) => <div key={key} className="rounded-lg border border-slate-100 bg-slate-50/60 p-3"><p className="text-xs font-semibold capitalize">{key}</p><div className="mt-2"><StatusBadge status={item.status} /></div></div>)}</div></div><div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><Activity className="h-4 w-4 text-blue-600" /><h2 className="text-sm font-bold">Recent Activity</h2></div><div className="mt-4 space-y-4 text-xs">{hasRequest ? <div><p className="font-semibold">{student.name} submitted a clearance request</p><p className="mt-1 text-slate-400">{clearanceRequest.appliedAt}</p></div> : <p className="text-slate-500">No recent activity.</p>}<button type="button" onClick={() => navigate('/admin/requests')} className="inline-flex items-center gap-1 font-semibold text-blue-600">Open registry <ArrowRight className="h-3.5 w-3.5" /></button></div></div></section>
  </AdminPortalLayout>;
}
