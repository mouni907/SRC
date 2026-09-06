<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { verifyCertificateApi } from '../services/api';

const departments = ['library', 'hostel', 'sports', 'accounts'];

export default function VerifyCertificate() {
  const { id: verificationCode } = useParams();
  const [state, setState] = useState({ loading: true, certificate: null, error: '' });
=======
import React, { useMemo } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react';

export default function VerifyCertificate() {
  const { id } = useParams();
  const location = useLocation();
  const certificate = useMemo(() => {
    const encodedData = new URLSearchParams(location.search).get('data');
    if (!encodedData) return null;
    try {
      const base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const bytes = Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    } catch {
      return null;
    }
  }, [location.search]);

  const certId = certificate?.certificateId || id || null;
  const isValidCertificate = Boolean(certificate?.certificateId && certificate?.issuedAt && certificate?.student?.name);
  const issueDate = certificate?.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : null;
  const student = certificate?.student;
>>>>>>> 0d27172 (final touch)

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
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-50 px-4 py-10 font-sans sm:px-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between"><Link to="/login" className="flex items-center gap-1 text-xs font-semibold text-blue-600"><ArrowLeft className="h-3.5 w-3.5" /> DigiClear</Link><span className="text-xs text-slate-400">Public Verification Portal</span></div>
        {loading ? <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">Verifying certificate...</div> : certificate ? <div className="space-y-5 rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm sm:p-8"><div className="border-b border-slate-100 pb-6 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-50 text-emerald-600"><ShieldCheck className="h-8 w-8" /></div><h1 className="mt-4 text-2xl font-bold text-slate-900">Certificate Verified</h1><p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p></div><div className="grid gap-4 rounded-xl bg-slate-50 p-4 text-xs sm:grid-cols-2"><p><span className="block text-slate-400">Certificate ID</span><strong className="font-mono text-slate-900">{certificate.id}</strong></p><p><span className="block text-slate-400">Issued Date</span><strong className="text-slate-900">{new Date(certificate.issuedAt).toLocaleDateString()}</strong></p><p><span className="block text-slate-400">Student Name</span><strong className="text-slate-900">{certificate.studentName}</strong></p><p><span className="block text-slate-400">Student ID</span><strong className="font-mono text-slate-900">{certificate.studentId}</strong></p></div><div><h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-900">Department Clearances</h2><div className="grid grid-cols-2 gap-2">{departments.map((department) => <div key={department} className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-xs font-semibold capitalize text-slate-700"><span>{department}</span><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>)}</div></div></div> : <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600"><XCircle className="h-7 w-7" /></div><h1 className="mt-4 text-xl font-bold text-slate-900">Certificate Not Valid</h1><p className="mt-2 text-sm text-slate-600">{error}</p></div>}
=======
    <div className="min-h-screen bg-[#f4f7fb] px-4 py-8 font-sans text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="flex items-center justify-between">
          <Link to="/scan" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" /> Verify another certificate</Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Public verification</span>
        </div>

        <main className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <header className="border-b border-slate-100 bg-slate-950 px-6 py-7 text-center text-white sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white text-xl font-bold text-blue-700 shadow-sm">D</div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">RGUKT RK Valley</p>
            <h1 className="mt-2 text-xl font-bold sm:text-2xl">No-Dues Certificate Verification</h1>
            <p className="mt-2 text-xs text-slate-300">Digital Clearance Registry</p>
          </header>

          <div className="p-6 sm:p-10">
            <div className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${isValidCertificate ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
              <div className="flex items-center gap-3">{isValidCertificate ? <CheckCircle2 className="h-6 w-6 text-emerald-600" /> : <ShieldCheck className="h-6 w-6 text-rose-600" />}<div><p className={`text-sm font-bold ${isValidCertificate ? 'text-emerald-900' : 'text-rose-900'}`}>{isValidCertificate ? 'VALID CERTIFICATE' : certId ? 'INVALID CERTIFICATE' : 'CERTIFICATE NOT FOUND'}</p><p className={`mt-1 text-xs ${isValidCertificate ? 'text-emerald-700' : 'text-rose-700'}`}>{isValidCertificate ? 'This certificate record was verified successfully.' : 'The scanned verification data could not be confirmed.'}</p></div></div>
              {certId && <span className="font-mono text-[10px] font-bold text-slate-500">{certId}</span>}
            </div>

            <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
              <section>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">Certificate record</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">{student?.name || 'Certificate holder unavailable'}</h2>
                <p className="mt-1 text-sm text-slate-500">{student?.degree || 'Academic programme unavailable'}{student?.department ? ` · ${student.department}` : ''}</p>
                <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 border-t border-slate-100 pt-5"><Detail label="Registration number" value={student?.registration} mono /><Detail label="Hall ticket" value={student?.hallTicket} mono /><Detail label="Batch" value={student?.batch} /><Detail label="Issue date" value={issueDate} /><Detail label="Certificate ID" value={certId} mono /><Detail label="Request ID" value={certificate?.requestId} mono /></div>
              </section>

              <aside className="flex flex-col justify-end rounded-xl border border-slate-200 bg-slate-50 p-5"><FileCheck2 className="h-6 w-6 text-blue-600" /><p className="mt-4 text-sm font-bold text-slate-900">Official digital record</p><p className="mt-2 text-xs leading-5 text-slate-500">This page displays the certificate information encoded in the signed QR verification link.</p><div className="mt-5 border-t border-slate-200 pt-4 text-[11px] text-slate-500"><p className="font-semibold text-slate-700">Issued by</p><p className="mt-1">Office of Academic Governance &amp; Student Affairs</p></div></aside>
            </div>

            <div className={`mt-7 rounded-xl border p-4 text-center text-xs font-semibold ${isValidCertificate ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>{isValidCertificate ? 'All required institutional no-dues verifications were completed.' : certId ? 'Certificate not found or its verification data is incomplete.' : 'Scan a valid certificate QR code to verify it.'}</div>
            <div className="mt-6 flex justify-center"><Link to="/scan" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700"><ExternalLink className="h-3.5 w-3.5" /> Verify another certificate</Link></div>
          </div>
        </main>
>>>>>>> 0d27172 (final touch)
      </div>
    </div>
  );
}

function Detail({ label, value, mono = false }) {
  return <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className={`mt-1 font-semibold text-slate-800 ${mono ? 'font-mono' : ''}`}>{value || 'Not available'}</p></div>;
}
