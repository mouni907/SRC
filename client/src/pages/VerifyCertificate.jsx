import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Award, 
  ArrowLeft,
  Calendar,
  UserCheck
} from 'lucide-react';

export default function VerifyCertificate() {
  const { id } = useParams();
  const certId = id || 'NDC-2026-00001';

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/student/dashboard" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to DigiClear Portal</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono">Public Verification Portal</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Verification Badge Header */}
          <div className="text-center pb-6 border-b border-slate-100 space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Digitally Verified No-Dues Certificate
            </h1>
            <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider bg-emerald-50 border border-emerald-200 inline-block px-3 py-1 rounded-full">
              Authentic Institutional Record • Valid
            </p>
          </div>

          {/* Certificate metadata */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[11px]">Certificate Number</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{certId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Issue Date</span>
                <span className="font-semibold text-slate-900 text-sm">06 September 2026</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Student Name</span>
                <span className="font-semibold text-slate-900 text-sm">Arjun Sharma</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Roll No / Registration</span>
                <span className="font-mono font-bold text-slate-900 text-sm">STU/2024/772</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Academic Program</span>
                <span className="font-semibold text-slate-900 text-sm">B.Tech Computer Science</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Institution</span>
                <span className="font-semibold text-slate-900 text-sm">RGUKT RK Valley</span>
              </div>
            </div>

            {/* Department Approvals Breakdown */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Institutional Approvals Log</h3>
              <div className="space-y-2">
                {[
                  { name: 'Library Department', officer: 'Dr. R. Smith (Chief Librarian)', status: 'Approved' },
                  { name: 'Hostel Department', officer: 'Hostel Warden Block B', status: 'Approved' },
                  { name: 'Sports Department', officer: 'Coach S. Mehta (Sports Director)', status: 'Approved' },
                  { name: 'Accounts Department', officer: 'Bursar & Accounts Section', status: 'Approved' },
                ].map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-800 block text-xs">{dept.name}</span>
                        <span className="text-[10px] text-slate-500">{dept.officer}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                      {dept.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400 space-y-1">
            <p>Signed electronically by the Controller of Examinations, RGUKT.</p>
            <p className="font-mono text-[10px]">Cryptographic Digest: 8f4b2c9a1e7d0f3e6a5b8c7d9e0f1a2b</p>
          </div>
        </div>
      </div>
    </div>
  );
}
