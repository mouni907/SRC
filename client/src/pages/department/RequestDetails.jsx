import React, { useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useClearance } from '../../context/ClearanceContext';
import DepartmentPortalLayout from './DepartmentPortalLayout';
import { getDepartmentMeta, getDepartmentRequest } from './departmentData';

export default function RequestDetails() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const { user } = useAuth();
  const { clearanceRequest, student, updateDepartmentStatus } = useClearance();
  const department = user?.department || 'library';
  const meta = getDepartmentMeta(department);
  const request = getDepartmentRequest(clearanceRequest, student, department);
  const [remarks, setRemarks] = useState('');
  const [decisionClosed, setDecisionClosed] = useState(false);
  const isFinal = request?.status === 'approved' || request?.status === 'rejected' || decisionClosed;

  if (!request || request.id !== requestId) {
    return (
      <DepartmentPortalLayout title={`${meta.label} request details`}>
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold">Request not found</p>
          <button type="button" onClick={() => navigate('/department/requests')} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-600">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to requests
          </button>
        </div>
      </DepartmentPortalLayout>
    );
  }

  const updateStatus = (status) => {
    if (isFinal) return;
    updateDepartmentStatus(
      department,
      status,
      remarks || (status === 'approved' ? 'Department requirements approved.' : 'Department requirements remain outstanding.')
    );
    setRemarks('');
    setDecisionClosed(true);
  };

  return (
    <DepartmentPortalLayout title={`${meta.label} request details`}>
      <button type="button" onClick={() => navigate('/department/requests')} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-4 w-4" /> Back to requests
      </button>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">Incoming clearance request</p>
            <p className="mt-2 font-mono text-xs text-slate-500">#{request.id}</p>
            <p className="mt-1 text-[11px] text-slate-500">Received: {request.appliedAt}</p>
          </div>
          <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${request.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : request.status === 'rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{request.status}</span>
        </div>

        <div className="flex items-center gap-3 border-b border-slate-100 p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">{(request.studentName || 'S').charAt(0)}</div>
          <div>
            <p className="text-sm font-bold">{request.studentName || 'Student name unavailable'}</p>
            <p className="mt-1 text-xs text-slate-500">{request.studentId || 'Student ID unavailable'}</p>
            <p className="mt-1 text-[11px] text-slate-400">{request.course || 'Programme unavailable'}{request.semester ? ` • ${request.semester}` : ''}</p>
          </div>
        </div>

        {!isFinal && <div className="p-5">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wide">Department decision</h2>
            <textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows={5} placeholder="Add verification notes or outstanding requirements..." className="w-full resize-none rounded-lg border border-slate-200 p-3 text-xs outline-none focus:ring-2 focus:ring-blue-100" />
            <div className="mt-3 flex gap-2">
              <button type="button" disabled={isFinal} onClick={() => updateStatus('rejected')} className="flex-1 rounded-lg border border-red-300 bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50">
                <X className="mr-1 inline h-3.5 w-3.5" /> Reject
              </button>
              <button type="button" disabled={isFinal} onClick={() => updateStatus('approved')} className="flex-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                <Check className="mr-1 inline h-3.5 w-3.5" /> Approve
              </button>
            </div>
          </div>}
      </section>
    </DepartmentPortalLayout>
  );
}
