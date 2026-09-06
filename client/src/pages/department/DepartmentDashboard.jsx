import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClearance } from '../../context/ClearanceContext';
import StatusBadge from '../../components/StatusBadge';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  User, 
  LogOut,
  AlertCircle,
  FileCheck2,
  Calendar
} from 'lucide-react';

export default function DepartmentDashboard() {
  const { user, logout } = useAuth();
  const { clearanceRequest, updateDepartmentStatus } = useClearance();

  const deptKey = user?.department || 'library';
  const deptInfo = clearanceRequest.departments[deptKey] || {
    name: user?.name || 'Department Desk',
    status: 'pending',
    remarks: ''
  };

  const [remarksInput, setRemarksInput] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleApprove = () => {
    updateDepartmentStatus(
      deptKey, 
      'approved', 
      remarksInput || `Verified by ${user.name}. Institutional requirements fulfilled with zero dues.`
    );
    setRemarksInput('');
  };

  const handleReject = () => {
    updateDepartmentStatus(
      deptKey, 
      'rejected', 
      remarksInput || `Clearance suspended by ${user.name}. Pending clearance requirements.`
    );
    setRemarksInput('');
  };

  const currentStatus = deptInfo.status;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Top Department Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-xs">
            {deptKey.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {deptInfo.name} Clearance Desk
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Reviewing Officer: {user?.name || 'Department Officer'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200 font-medium hidden sm:inline-block">
            Role: Department Staff
          </span>
          <button
            onClick={logout}
            className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-6">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium uppercase">
              <span>Pending Reviews</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {currentStatus === 'pending' ? '1' : '0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Awaiting verification</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium uppercase">
              <span>Approved Applications</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {currentStatus === 'approved' ? '1' : '0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Digitally signed</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium uppercase">
              <span>Rejected / Dues</span>
              <XCircle className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {currentStatus === 'rejected' ? '1' : '0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Outstanding actions</p>
          </div>
        </div>

        {/* Action Panel for Active Application */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                  Incoming Clearance Request
                </span>
                <span className="font-mono text-xs text-slate-500">#REQ-991204</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">Student: Arjun Sharma (STU/2024/772)</h2>
              <p className="text-xs text-slate-500">Degree: B.Tech Computer Science • Semester VIII • Applied 03 Sep 2026</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Desk Status:</span>
              <StatusBadge status={currentStatus} />
            </div>
          </div>

          {/* Department Note / History */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Current Desk Record
              </span>
              <span className="text-slate-400 text-[11px]">
                {deptInfo.verifiedAt ? `Last stamped: ${deptInfo.verifiedAt}` : 'Awaiting officer sign-off'}
              </span>
            </div>
            <p className="text-slate-700 italic">
              "{deptInfo.remarks || 'No notes currently entered for this desk.'}"
            </p>
          </div>

          {/* Decision Review Form */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-semibold text-slate-700">
              Department Official Decision Notes / Dues Remark:
            </label>
            <textarea
              rows={3}
              value={remarksInput}
              onChange={(e) => setRemarksInput(e.target.value)}
              placeholder="e.g. All laboratory equipment accounted for, no outstanding fines."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleReject}
                className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject / Flag Institutional Dues</span>
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="w-full sm:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sign &amp; Approve Clearance</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
