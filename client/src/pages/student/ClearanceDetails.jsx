import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClearance } from '../../context/ClearanceContext';
import StatusBadge from '../../components/StatusBadge';
import { 
  FileText, 
  Building2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Calendar, 
  UserCheck, 
  Send,
  HelpCircle,
  ArrowLeft,
  Award
} from 'lucide-react';

export default function ClearanceDetails() {
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);
  const [reason, setReason] = useState('Graduation & Degree Award Semester Completion');
  const [submitted, setSubmitted] = useState(false);
  const { 
    student, 
    clearanceRequest, 
    approvedCount, 
    isCompleted,
    submitClearanceRequest
  } = useClearance();

  const depts = Object.entries(clearanceRequest.departments).map(([key, data]) => ({
    key,
    ...data
  }));

  return (
    <div className="space-y-6">
      <section className="bg-slate-900 rounded-xl p-5 sm:p-6 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-300">Start a clearance application</p>
          <h2 className="text-lg sm:text-xl font-bold mt-1">Apply for No-Dues clearance</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">Submit your request once and route it to Library, Hostel, Sports, and Accounts for verification.</p>
        </div>
        {!isApplying && (
          <button onClick={() => { setIsApplying(true); setSubmitted(false); }} className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer">
            <Send className="w-4 h-4" />
            Apply for clearance
          </button>
        )}
      </section>

      {isApplying && (
        <section className="bg-white rounded-xl border border-blue-200 shadow-xs p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">New clearance application</h3>
              <p className="text-xs text-slate-500 mt-1">Choose the purpose for your request before submitting it.</p>
            </div>
            <button type="button" onClick={() => setIsApplying(false)} className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer">Cancel</button>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); submitClearanceRequest(reason); setIsApplying(false); setSubmitted(true); }} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
            <label className="flex-1 text-xs font-semibold text-slate-700">
              Clearance purpose
              <select value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1.5 w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Graduation &amp; Degree Award Semester Completion</option>
                <option>Transfer / Migration Certificate</option>
                <option>Course or Programme Completion</option>
              </select>
            </label>
            <button type="submit" className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer">
              <Send className="w-3.5 h-3.5" />
              Submit application
            </button>
          </form>
        </section>
      )}

      {submitted && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          Your clearance application was submitted and routed to all four departments.
        </div>
      )}

      {/* Header breadcrumb & summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">#{clearanceRequest.id}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">No-Dues Department Review Status</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Submitted for: <strong className="text-slate-700">{clearanceRequest.reason}</strong> on {clearanceRequest.appliedAt}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Department Approvals</span>
            <span className="text-lg font-bold text-slate-900">{approvedCount} of 4 Cleared</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
            isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {clearanceRequest.overallStatus}
          </div>
        </div>
      </div>

      {/* Department Breakdown Cards (Grid of 4) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Independent Department Verifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {depts.map((dept) => {
            const isApproved = dept.status === 'approved';
            const isPending = dept.status === 'pending';
            const isRejected = dept.status === 'rejected';

            return (
              <div 
                key={dept.key} 
                className={`bg-white rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isApproved ? 'border-emerald-200/80 bg-emerald-50/10' :
                  isRejected ? 'border-rose-200 bg-rose-50/10' :
                  'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shadow-xs ${
                        isApproved ? 'bg-emerald-100 text-emerald-700' :
                        isRejected ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {dept.letter}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{dept.name} Clearance</h4>
                        <span className="text-[11px] text-slate-400 font-medium">Department Desk</span>
                      </div>
                    </div>
                    <StatusBadge status={dept.status} />
                  </div>

                  <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <UserCheck className="w-3.5 h-3.5" />
                        Reviewer:
                      </span>
                      <span className="font-medium text-slate-800">
                        {dept.verifiedBy || 'Pending desk assignment'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Timestamp:
                      </span>
                      <span className="font-mono text-[11px] text-slate-600">
                        {dept.verifiedAt || 'Awaiting review'}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Department clearance status message */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isPending && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 w-full">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                      <span>{dept.remarks || 'Pending department review.'}</span>
                    </div>
                  )}

                  {isApproved && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Digitally signed and cleared with zero dues</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Completion Banner */}
      {isCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">All Clearance Approvals Obtained!</h4>
              <p className="text-xs text-emerald-700">Your digitally verified certificate has been generated and is ready for download.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/student/certificate')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shrink-0 flex items-center gap-2 shadow-xs"
          >
            <Award className="w-4 h-4" />
            <span>Open Certificate</span>
          </button>
        </div>
      )}
    </div>
  );
}
