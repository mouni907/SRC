import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { verifyCertificateApi } from '../services/api';

const departments = ['library', 'hostel', 'sports', 'accounts'];

export default function VerifyCertificate() {
  const { id: verificationCode } = useParams();
  const [state, setState] = useState({ loading: true, certificate: null, error: '' });

  useEffect(() => {
    let active = true;
    if (!verificationCode) {
      setState({ loading: false, certificate: null, error: 'Verification code is required.' });
      return () => { active = false; };
    }
    verifyCertificateApi(verificationCode)
      .then((result) => active && setState({ loading: false, certificate: result.certificate, error: '' }))
      .catch(() => active && setState({ loading: false, certificate: null, error: 'Certificate is not valid or has been revoked.' }));
    return () => { active = false; };
  }, [verificationCode]);

  const { certificate, loading, error } = state;
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 font-sans sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between"><Link to="/login" className="flex items-center gap-1 text-xs font-semibold text-blue-600"><ArrowLeft className="h-3.5 w-3.5" /> DigiClear</Link><span className="text-xs text-slate-400">Public Verification Portal</span></div>
        {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">Verifying certificate...</div> : certificate ? <div className="space-y-5 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8"><div className="border-b border-slate-100 pb-6 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600"><ShieldCheck className="h-8 w-8" /></div><h1 className="mt-4 text-2xl font-bold text-slate-900">Certificate Verified</h1><p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p></div><div className="grid gap-4 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-2"><p><span className="block text-slate-400">Certificate ID</span><strong className="font-mono text-slate-900">{certificate.id}</strong></p><p><span className="block text-slate-400">Issued Date</span><strong className="text-slate-900">{new Date(certificate.issuedAt).toLocaleDateString()}</strong></p><p><span className="block text-slate-400">Student Name</span><strong className="text-slate-900">{certificate.studentName}</strong></p><p><span className="block text-slate-400">Student ID</span><strong className="font-mono text-slate-900">{certificate.studentId}</strong></p></div><div><h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">Department Clearances</h2><div className="grid grid-cols-2 gap-2">{departments.map((department) => <div key={department} className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-xs font-semibold capitalize text-slate-700"><span>{department}</span><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>)}</div></div></div> : <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600"><XCircle className="h-7 w-7" /></div><h1 className="mt-4 text-xl font-bold text-slate-900">Certificate Not Valid</h1><p className="mt-2 text-sm text-slate-600">{error}</p></div>}
      </div>
    </div>
  );
}
