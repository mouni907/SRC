import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Activity, ArrowLeft, Check, FileCheck2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClearance } from '../../context/ClearanceContext';
import DepartmentPortalLayout from './DepartmentPortalLayout';
import { getSportsRequest } from './departmentData';

const documents = ['Sports Equipment Return Form', 'Locker Clearance Slip', 'Sports Participation Summary'];
const timeline = [
  ['Request submitted', '03 Sep 2026, 10:15 AM', 'Student submitted the sports clearance request.'],
  ['Under review', '03 Sep 2026, 10:16 AM', 'Assigned to Coach S. Mehta (Sports Director).'],
  ['Documents verified', '04 Sep 2026, 11:20 AM', 'Sports facility locker inspected & vacated.'],
  ['Pending final decision', 'Review and approve/reject the request.', '']
];

export default function RequestDetails() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const { user } = useAuth();
  const { clearanceRequest, updateDepartmentStatus } = useClearance();
  const request = getSportsRequest(clearanceRequest);
  const [remarks, setRemarks] = useState('');
  const isFinal = request?.status === 'approved' || request?.status === 'rejected';
  const isValidRequest = request && request.id === requestId;

  const updateStatus = (status) => {
    if (!request || isFinal) return;
    updateDepartmentStatus('sports', status, remarks || (status === 'approved' ? 'All sports equipment returned. No pending dues.' : 'Sports clearance requirements remain outstanding.'));
    setRemarks('');
  };

  if (!isValidRequest) {
    return <DepartmentPortalLayout title="Sports Clearance Requests"><div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="text-sm font-semibold">Sports request not found</p><button type="button" onClick={() => navigate('/department/requests')} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-600"><ArrowLeft className="h-3.5 w-3.5" /> Back to requests</button></div></DepartmentPortalLayout>;
  }

  return (
    <DepartmentPortalLayout title="Sports Request Details">
      <button type="button" onClick={() => navigate('/department/requests')} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800"><ArrowLeft className="h-4 w-4" /> Back to Sports Requests</button>
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex items-center gap-2"><span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">Incoming Clearance Request</span><span className="font-mono text-xs text-slate-400">#{request.id}</span></div><p className="mt-2 text-[11px] text-slate-500">Received: {request.appliedAt}</p></div><span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${request.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : request.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{request.status}</span></div><div className="flex items-center gap-3 border-b border-slate-100 p-5"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">AS</div><div><p className="text-sm font-bold">{request.studentName} <span className="font-mono text-xs font-medium text-slate-500">({request.studentId})</span></p><p className="mt-1 text-xs text-slate-500">{request.course} <span className="mx-1">•</span> {request.semester}</p><p className="mt-1 text-[11px] text-slate-400">Applied on: {request.appliedAt}</p></div></div><div className="grid gap-6 p-5 lg:grid-cols-2"><div><h2 className="mb-3 text-xs font-bold uppercase tracking-wide">Submitted Documents</h2><div className="space-y-2">{documents.map((document) => <div key={document} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"><div className="flex items-center gap-2 text-xs font-medium text-slate-700"><FileCheck2 className="h-4 w-4 text-emerald-600" />{document}</div><span className="text-[10px] font-semibold text-emerald-600">Uploaded</span></div>)}</div></div><div><div className="flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-wide">Current Desk Record</h2><span className="text-[10px] text-slate-400">Last updated: {request.verifiedAt || 'Awaiting review'}</span></div><p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">{request.remarks || 'Sports facility locker inspected & vacated. Badminton tournament kit returned.'}</p><label className="mt-5 block text-xs font-bold">Department Official Decision / Dues Remark<textarea disabled={isFinal} maxLength={500} rows={4} value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="e.g. All sports equipment returned. No pending dues." className="mt-2 w-full resize-none rounded-lg border border-slate-200 p-3 text-xs font-normal outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:bg-slate-100" /></label><p className="mt-1 text-right text-[10px] text-slate-400">{remarks.length}/500</p></div></div><div className="flex flex-col justify-end gap-2 border-t border-slate-100 p-5 sm:flex-row"><button disabled={isFinal} type="button" onClick={() => updateStatus('rejected')} className="flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"><X className="h-4 w-4" /> Reject Request</button><button disabled={isFinal} type="button" onClick={() => updateStatus('approved')} className="flex h-9 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"><Check className="h-4 w-4" /> Approve Clearance</button></div></section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-sm font-bold">Activity Timeline</h2><Activity className="h-4 w-4 text-slate-400" /></div><div className="relative mt-5 space-y-5 pl-1 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-slate-200">{timeline.map(([title, date, detail], index) => <div key={title} className="relative pl-6"><span className={`absolute left-0 top-0.5 h-3 w-3 rounded-full border-2 border-white ring-1 ${index === 2 ? 'bg-blue-600 ring-blue-200' : index === 3 ? 'bg-white ring-slate-300' : 'bg-slate-400 ring-slate-200'}`} /><p className={`text-xs font-semibold ${index === 2 ? 'text-blue-700' : 'text-slate-700'}`}>{title}</p><p className="mt-1 text-[10px] text-slate-400">{date}</p>{detail && <p className="mt-1 text-[11px] text-slate-500">{detail}</p>}</div>)}</div></section>
    </DepartmentPortalLayout>
  );
}
