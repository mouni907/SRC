import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock3, FileText, Trophy, XCircle } from 'lucide-react';
import { useClearance } from '../../context/ClearanceContext';
import DepartmentPortalLayout from './DepartmentPortalLayout';
import { getSportsRequest, getSportsStats } from './departmentData';

export default function DepartmentDashboard() {
  const navigate = useNavigate();
  const { clearanceRequest } = useClearance();
  const request = getSportsRequest(clearanceRequest);
  const stats = getSportsStats(clearanceRequest);
  const cards = [
    ['Pending Requests', stats.pending, 'Awaiting verification', Clock3, 'text-amber-600'],
    ['Approved Requests', stats.approved, 'Digitally signed', CheckCircle2, 'text-emerald-600'],
    ['Rejected / Dues', stats.rejected, 'Outstanding actions', XCircle, 'text-red-600'],
    ['Total Requests', stats.total, 'This semester', FileText, 'text-blue-600']
  ];

  return (
    <DepartmentPortalLayout title="Sports Clearance Desk">
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center"><div className="flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Trophy className="h-6 w-6" /></div><div><p className="text-lg font-bold tracking-tight">Sports Clearance Desk</p><p className="mt-1 text-xs text-slate-500">Review and process sports clearance requests</p></div></div><div className="border-l border-slate-200 pl-4 text-xs leading-relaxed text-slate-500 lg:text-right">“Sports build discipline, discipline builds character.”<br /><span className="font-semibold text-slate-400">— Department of Sports</span></div></section>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value, note, Icon, tone]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between"><p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p><Icon className={`h-4 w-4 ${tone}`} /></div><p className="mt-3 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></div>)}</section>
      {/*<section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="text-sm font-bold">Recent Sports Clearance Requests</h2><p className="mt-1 text-xs text-slate-500">Open a request to review documents and make a department decision.</p></div><button type="button" onClick={() => navigate('/department/requests')} className="text-xs font-semibold text-blue-600 hover:text-blue-800">View all</button></div>{request ? <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold">{request.studentName} <span className="font-mono text-xs font-medium text-slate-500">({request.studentId})</span></p><p className="mt-1 text-xs text-slate-500">Request #{request.id} <span className="mx-1">•</span> {request.appliedAt}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${request.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : request.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{request.status}</span><button type="button" onClick={() => navigate(`/department/requests/${request.id}`)} className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700">Open request</button></div></div> : <div className="p-8 text-center text-sm text-slate-500">No Sports requests available.</div>}</section>*/}
    </DepartmentPortalLayout>
  );
}
