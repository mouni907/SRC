import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClearance } from '../../context/ClearanceContext';
import StatusBadge from '../../components/StatusBadge';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award, 
  LogOut,
  Building2,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { clearanceRequest, student, pendingCount, rejectedCount } = useClearance();
  const hasRequest = Boolean(clearanceRequest?.id);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Admin Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-xs">
            D
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              Office of the Dean
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Academic Governance &amp; Student Affairs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={logout}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-900">Dean Administration Desk</p>
                <p className="mt-1 text-xs text-slate-500">Monitoring institutional clearance compliance and student readiness</p>
              </div>
            </div>
            <div className="border-l border-slate-200 pl-4 text-xs leading-relaxed text-slate-500 md:text-right">
              “Academic excellence is built on timely compliance, transparent governance, and student accountability.”<br />
              <span className="font-semibold text-slate-400">— Office of the Dean</span>
            </div>
          </div>
        </section>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium uppercase">Total Requests</span>
            <p className="text-2xl font-bold text-slate-900 mt-2">{hasRequest ? 1 : 0}</p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Submitted applications</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium uppercase">Fully Approved</span>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{clearanceRequest?.overallStatus === 'approved' ? 1 : 0}</p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Fully cleared requests</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium uppercase">In Progress</span>
            <p className="text-2xl font-bold text-blue-600 mt-2">{pendingCount}</p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Pending department reviews</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-400 font-medium uppercase">Flagged Dues</span>
            <p className="text-2xl font-bold text-rose-600 mt-2">{rejectedCount}</p>
            <span className="text-[11px] text-slate-500 mt-0.5 block">Flagged department reviews</span>
          </div>
        </div>

        {/* Real-time Clearance Registry Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Academic Clearance Registry</h2>
              <p className="text-xs text-slate-500 mt-0.5">Unified review of all department verification and final clearance decisions</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              Live Governance View
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-200/80">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Library</th>
                  <th className="py-3 px-4">Hostel</th>
                  <th className="py-3 px-4">Sports</th>
                  <th className="py-3 px-4">Accounts</th>
                  <th className="py-3 px-4 text-right">Overall Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {hasRequest && <tr className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-600">#{clearanceRequest.id}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900">{student.name} ({student.collegeId})</td>
                  <td className="py-3.5 px-4">{student.department}</td>
                  <td className="py-3.5 px-4"><StatusBadge status={clearanceRequest.departments.library.status} /></td>
                  <td className="py-3.5 px-4"><StatusBadge status={clearanceRequest.departments.hostel.status} /></td>
                  <td className="py-3.5 px-4"><StatusBadge status={clearanceRequest.departments.sports.status} /></td>
                  <td className="py-3.5 px-4"><StatusBadge status={clearanceRequest.departments.accounts.status} /></td>
                  <td className="py-3.5 px-4 text-right"><StatusBadge status={clearanceRequest.overallStatus} /></td>
                </tr>}
              </tbody>
            </table>
            {!hasRequest && <div className="p-10 text-center text-sm text-slate-500">No clearance requests have been submitted yet.</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
