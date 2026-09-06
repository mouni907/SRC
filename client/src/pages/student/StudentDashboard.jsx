import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClearance } from '../../context/ClearanceContext';
import { downloadCertificatePDF } from '../../utils/pdfGenerator';
import StatusBadge from '../../components/StatusBadge';
import { 
  Lock, 
  Award, 
  Download,
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  ShieldCheck,
  Building2,
  FileCheck2,
  UserPen
} from 'lucide-react';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { 
    student, 
    clearanceRequest, 
    notifications, 
    completionPercentage, 
    approvedCount, 
    isCompleted,
    approveAllDepartments,
    resetToDemoState
  } = useClearance();

  const depts = Object.entries(clearanceRequest.departments).map(([key, data]) => ({
    key,
    ...data
  }));

  const [downloadingCert, setDownloadingCert] = useState(false);

  const handleDownloadCertificate = async () => {
    setDownloadingCert(true);
    try {
      await downloadCertificatePDF(null, student, {
        id: 'NDC-2026-00001',
        issueDate: '06 September 2026'
      });
    } catch (e) {
      console.error(e);
      navigate('/student/certificate');
    } finally {
      setDownloadingCert(false);
    }
  };

  return (
    <div className="space-y-6">


      {/* Top Grid: Progress Card + Certificate Status Card */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Clearance Progress Card (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Clearance Progress</h2>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-50 text-blue-700'}`}>
                    {clearanceRequest.overallStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Request ID: <span className="font-mono font-semibold text-slate-700">#{clearanceRequest.id}</span> • Applied: {clearanceRequest.appliedAt}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-bold ${isCompleted ? 'text-emerald-600' : 'text-blue-600'}`}>
                  {completionPercentage}%
                </span>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Completion</p>
              </div>
            </div>

            {/* Sleek Blue/Green Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full mb-6 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${isCompleted ? 'bg-emerald-600' : 'bg-blue-600'}`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            {/* 4 Department Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {depts.map((dept) => {
                const isApproved = dept.status === 'approved';
                const isPending = dept.status === 'pending';
                const iconColor = isApproved 
                  ? 'bg-green-100 text-green-600' 
                  : dept.status === 'rejected' 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-yellow-100 text-yellow-600';

                return (
                  <div 
                    key={dept.name}
                    onClick={() => navigate('/student/clearance')}
                    className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-200/80 rounded-lg hover:border-blue-300 hover:bg-slate-50 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg ${iconColor} flex items-center justify-center font-bold text-sm shrink-0`}>
                        {dept.letter}
                      </div>
                      <div className="truncate">
                        <span className="font-medium text-sm text-slate-900 block leading-tight">{dept.name}</span>
                        <span className="text-[11px] text-slate-500 truncate block mt-0.5">
                          {isApproved ? 'Approved by officer' : dept.remarks}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      <StatusBadge status={dept.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Auto-generates certificate when all 4 approve
            </span>
            <button 
              onClick={() => navigate('/student/clearance')}
              className="font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View Department Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Certificate Card (1 Col) */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            isCompleted ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-400 border border-slate-200'
          }`}>
            {isCompleted ? <Award className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>

          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">
              {isCompleted ? 'No-Dues Certificate Ready' : 'Certificate Locked'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              {isCompleted 
                ? 'Your No-Dues Clearance Certificate with digital verification QR code is verified and ready.' 
                : 'Obtain clearance approvals from Library, Hostel, Sports, and Accounts to unlock official certificate.'}
            </p>
          </div>

          {isCompleted ? (
            <div className="w-full space-y-2">
              <button 
                onClick={handleDownloadCertificate}
                disabled={downloadingCert}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                <Download className="w-4 h-4" />
                <span>{downloadingCert ? 'Generating & Downloading PDF...' : 'Download PDF Certificate'}</span>
              </button>
              <button 
                onClick={() => navigate('/student/certificate')}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>View Certificate Document</span>
              </button>
            </div>
          ) : (
            <button 
              disabled 
              className="w-full py-2.5 px-4 bg-slate-100 text-slate-400 rounded-lg text-xs font-semibold cursor-not-allowed border border-slate-200/60"
            >
              Requires 4 Approvals ({approvedCount}/4)
            </button>
          )}
        </div>
      </section>

      {/* Recent Notifications Section */}
      <section className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Recent Clearance Updates</h3>
          </div>
          <button 
            onClick={() => navigate('/student/notifications')}
            className="text-xs text-blue-600 font-semibold hover:underline"
          >
            View All ({notifications.length})
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              onClick={() => navigate('/student/notifications')}
              className="p-4 flex gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
            >
              <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-sm border ${
                item.type === 'warning' ? 'bg-red-50 text-red-600 border-red-100' :
                item.type === 'approval' ? 'bg-green-50 text-green-600 border-green-100' :
                'bg-blue-50 text-blue-600 border-blue-100'
              }`}>
                {item.type === 'warning' ? '!' : item.type === 'approval' ? '✓' : 'i'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Student Profile Overview Card */}
      <section className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Student Academic Credentials</h3>
            <p className="text-xs text-slate-500 mt-0.5">Verified university enrollment records &amp; hostel allocation</p>
          </div>
          <button
            onClick={() => navigate('/student/profile')}
            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UserPen className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Roll Number</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{student.collegeId}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Department</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{student.department}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Degree &amp; Semester</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{student.degree} • {student.semester}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Hostel &amp; Room</span>
            <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{student.roomNo || student.batch}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
