import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock3, Search, XCircle } from 'lucide-react';
import { useClearance } from '../../context/ClearanceContext';
import DepartmentPortalLayout from './DepartmentPortalLayout';
import { getDepartmentMeta, getDepartmentRequest, getDepartmentStats } from './departmentData';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700'
};

export default function DepartmentRequests() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { clearanceRequest, student } = useClearance();
  const department = user?.department || 'library';
  const meta = getDepartmentMeta(department);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const request = getDepartmentRequest(clearanceRequest, student, department);
  const stats = getDepartmentStats(clearanceRequest, student, department);
  const visibleRequest = request && (statusFilter === 'all' || request.status === statusFilter) && `${request.studentName} ${request.studentId} ${request.id}`.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <DepartmentPortalLayout title={`${meta.label} Clearance Requests`}>
      <section className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div><p className="text-lg font-bold tracking-tight">{meta.label} Clearance Requests</p><p className="mt-1 text-xs text-slate-500">Review requests assigned to the {meta.label} Department.</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">{meta.label} only</span></section>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3"><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><Clock3 className="h-4 w-4 text-amber-600" /><p className="mt-3 text-2xl font-bold">{stats.pending}</p><p className="text-xs text-slate-500">Pending</p></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><CheckCircle2 className="h-4 w-4 text-emerald-600" /><p className="mt-3 text-2xl font-bold">{stats.approved}</p><p className="text-xs text-slate-500">Approved</p></div><div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><XCircle className="h-4 w-4 text-red-600" /><p className="mt-3 text-2xl font-bold">{stats.rejected}</p><p className="text-xs text-slate-500">Rejected</p></div></section>
      <section className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm lg:flex-row"><div className="flex gap-1"><button type="button" onClick={() => setStatusFilter('all')} className={`rounded-md px-3 py-2 text-xs font-semibold ${statusFilter === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}>All Requests</button>{['pending', 'approved', 'rejected'].map((status) => <button key={status} type="button" onClick={() => setStatusFilter(status)} className={`rounded-md px-3 py-2 text-xs font-semibold capitalize ${statusFilter === status ? 'bg-blue-50 text-blue-700' : 'text-slate-500'}`}>{status}</button>)}</div><label className="relative block lg:w-80"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search student, ID or request..." className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-blue-100" /></label></section>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="text-sm font-bold">{meta.label} Requests</h2></div>{visibleRequest ? <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold">{request.studentName} <span className="font-mono text-xs font-medium text-slate-500">({request.studentId})</span></p><p className="mt-1 text-xs text-slate-500">Request #{request.id} <span className="mx-1">•</span> Applied {request.appliedAt}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyles[request.status]}`}>{request.status}</span><button type="button" onClick={() => navigate(`/department/requests/${request.id}`)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">Open request</button></div></div> : <div className="p-10 text-center text-sm text-slate-500">No {meta.label} requests match this filter.</div>}</section>
    </DepartmentPortalLayout>
  );
}
