import React from 'react';
import { BarChart3, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClearance } from '../../context/ClearanceContext';
import DepartmentPortalLayout from './DepartmentPortalLayout';
import { getDepartmentMeta, getDepartmentRequest, getDepartmentStats } from './departmentData';

const statusStyles = { pending: 'bg-amber-50 text-amber-700', approved: 'bg-emerald-50 text-emerald-700', rejected: 'bg-red-50 text-red-700' };

export default function DepartmentReports() {
  const { user } = useAuth();
  const { clearanceRequest, student } = useClearance();
  const department = user?.department || 'library';
  const meta = getDepartmentMeta(department);
  const request = getDepartmentRequest(clearanceRequest, student, department);
  const stats = getDepartmentStats(clearanceRequest, student, department);
  const rate = (value) => stats.total ? `${Math.round((value / stats.total) * 100)}%` : '0%';

  return (
    <DepartmentPortalLayout title={`${meta.label} Department Reports`}>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-lg font-bold">{meta.label} Department Reports</p><p className="mt-1 text-xs text-slate-500">{meta.label} clearance activity and approval statistics</p></section>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4"><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><BarChart3 className="h-4 w-4 text-blue-600" /><p className="mt-3 text-xs text-slate-500">Total Requests</p><p className="mt-1 text-2xl font-bold">{stats.total}</p></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><Clock3 className="h-4 w-4 text-amber-600" /><p className="mt-3 text-xs text-slate-500">Pending</p><p className="mt-1 text-2xl font-bold">{stats.pending}</p></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><p className="mt-3 text-xs text-slate-500">Approved</p><p className="mt-1 text-2xl font-bold">{stats.approved}</p></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><XCircle className="h-4 w-4 text-red-600" /><p className="mt-3 text-xs text-slate-500">Rejected</p><p className="mt-1 text-2xl font-bold">{stats.rejected}</p></div></section>
      <section className="grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-bold">Approval Analytics</h2><div className="mt-5 space-y-4">{[['Approved', stats.approved, 'bg-emerald-500'], ['Pending', stats.pending, 'bg-amber-500'], ['Rejected', stats.rejected, 'bg-red-500']].map(([label, value, color]) => <div key={label}><div className="mb-1 flex justify-between text-xs"><span className="font-medium text-slate-600">{label}</span><span className="font-bold text-slate-800">{value}</span></div><div className="h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${color}`} style={{ width: `${stats.total ? (value / stats.total) * 100 : 0}%` }} /></div></div>)}</div></div><div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="text-sm font-bold">Clearance Statistics</h2><div className="mt-5 grid grid-cols-3 gap-3 text-center"><div className="rounded-lg bg-emerald-50 p-3"><p className="text-lg font-bold text-emerald-700">{rate(stats.approved)}</p><p className="mt-1 text-[10px] text-emerald-700">Approval Rate</p></div><div className="rounded-lg bg-red-50 p-3"><p className="text-lg font-bold text-red-700">{rate(stats.rejected)}</p><p className="mt-1 text-[10px] text-red-700">Rejection Rate</p></div><div className="rounded-lg bg-amber-50 p-3"><p className="text-lg font-bold text-amber-700">{rate(stats.pending)}</p><p className="mt-1 text-[10px] text-amber-700">Pending Rate</p></div></div></div></section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-bold">Recent Report Data</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Student ID</th><th className="px-5 py-3">Request ID</th><th className="px-5 py-3">Applied Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Decision Date</th></tr></thead><tbody>{request && <tr className="border-t border-slate-100"><td className="px-5 py-4 font-semibold">{request.studentName}</td><td className="px-5 py-4 font-mono text-slate-500">{request.studentId}</td><td className="px-5 py-4 font-mono text-slate-500">{request.id}</td><td className="px-5 py-4 text-slate-500">{request.appliedAt}</td><td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[request.status]}`}>{request.status}</span></td><td className="px-5 py-4 text-slate-500">{request.verifiedAt || 'Pending decision'}</td></tr>}</tbody></table></div></section>
    </DepartmentPortalLayout>
  );
}
