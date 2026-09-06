import React from 'react';
import { Building2, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useClearance } from '../../context/ClearanceContext';
import DepartmentPortalLayout from './DepartmentPortalLayout';
import { getDepartmentMeta, getDepartmentRequest, getDepartmentStats } from './departmentData';

export default function MyDepartment() {
  const { user } = useAuth();
  const { clearanceRequest, student } = useClearance();
  const department = user?.department || 'library';
  const meta = getDepartmentMeta(department);
  const request = getDepartmentRequest(clearanceRequest, student, department);
  const stats = getDepartmentStats(clearanceRequest, student, department);

  return (
    <DepartmentPortalLayout title={meta.title}>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Building2 className="h-5 w-5" /></div>
          <div><p className="text-lg font-bold">{meta.label} department</p><p className="mt-1 text-xs text-slate-500">{meta.description}</p></div>
        </div>
        <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
          <Info label="Department" value={meta.label} />
          <Info label="Department officer" value={user?.name || 'Not assigned'} />
          <Info label="Position" value={meta.officerTitle} />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total requests" value={stats.total} />
        <Stat label="Pending" value={stats.pending} tone="text-amber-600" />
        <Stat label="Approved" value={stats.approved} tone="text-emerald-600" />
        <Stat label="Rejected" value={stats.rejected} tone="text-red-600" />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-bold">Department activity</h2>
        {request ? (
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600"><ClipboardCheck className="h-4 w-4" /></div>
            <div><p className="text-xs font-semibold">Request {request.id}</p><p className="mt-1 text-[11px] text-slate-500">{request.studentName || 'Student'} · {request.status}</p></div>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500">No requests have been assigned to this department.</div>
        )}
      </section>
    </DepartmentPortalLayout>
  );
}

function Info({ label, value }) {
  return <div><p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>;
}

function Stat({ label, value, tone = '' }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs text-slate-500">{label}</p><p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p></div>;
}
