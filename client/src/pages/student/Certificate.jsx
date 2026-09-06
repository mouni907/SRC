import React, { useEffect, useRef, useState } from 'react';
import { useClearance } from '../../context/ClearanceContext';
import { downloadCertificatePDF } from '../../utils/pdfGenerator';
import { buildCertificateVerificationUrl } from '../../utils/certificateVerification';
import QRCode from 'qrcode';
import { Award, CheckCircle2, Download, Eye, FileText, Lock } from 'lucide-react';

const departmentOrder = ['library', 'hostel', 'sports', 'accounts'];

export default function Certificate() {
  const { student, clearanceRequest, approvedCount } = useClearance();
  const [certificateVisible, setCertificateVisible] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const certificatePreviewRef = useRef(null);
  const certificate = clearanceRequest?.certificate;
  const departments = clearanceRequest?.departments || {};
  const allApproved = departmentOrder.every((key) => departments[key]?.status === 'approved');
  const certificateAvailable = Boolean(certificate?.id && certificate?.verificationCode && allApproved);
  const issueDate = certificate?.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : null;
  const verificationUrl = certificateAvailable ? `${window.location.origin}/verify/${certificate.verificationCode}` : '';

  useEffect(() => {
    if (!verificationUrl) {
      setQrCodeDataUrl('');
      return;
    }
    QRCode.toDataURL(verificationUrl, { width: 150, margin: 1, color: { dark: '#0f172a', light: '#ffffff' } })
      .then(setQrCodeDataUrl)
      .catch(() => setQrCodeDataUrl(''));
  }, [verificationUrl]);

  const viewCertificate = () => {
    if (!certificateAvailable) return;
    setCertificateVisible(true);
    requestAnimationFrame(() => certificatePreviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const downloadCertificate = async () => {
    if (!certificateAvailable) return;
    if (!certificateVisible) setCertificateVisible(true);
    setDownloading(true);
    try {
      await downloadCertificatePDF('certificate-print-area', student, {
        id: certificate.id,
        verificationCode: certificate.verificationCode,
        issueDate,
        departments
      });
    } finally {
      setDownloading(false);
    }
  };

  if (!certificateAvailable) {
    return (
      <section className="space-y-5">
        <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm"><div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-700"><Lock className="h-5 w-5" /></div><div><h2 className="text-base font-bold text-slate-900">Certificate Generation Pending</h2><p className="mt-1 text-xs text-slate-600">Your No-Dues Certificate will be available after all four departments approve your clearance.</p><p className="mt-3 text-sm font-bold text-slate-800">{approvedCount} / 4 Departments Cleared</p></div></div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"><FileText className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-700">Certificate not available yet</p><p className="mx-auto mt-1 max-w-md text-xs text-slate-500">Certificate access is unlocked automatically only after Library, Hostel, Sports, and Accounts approvals are recorded by the system.</p></div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-emerald-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><CheckCircle2 className="h-5 w-5" /></div><div><h2 className="text-base font-bold text-slate-900">No-Dues Clearance Completed</h2><p className="mt-1 text-xs text-slate-600">4 / 4 Departments Cleared</p></div></div><div className="flex gap-2"><button type="button" onClick={viewCertificate} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50" aria-label="View Certificate"><Eye className="h-4 w-4" /></button><button type="button" onClick={downloadCertificate} disabled={downloading} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"><Download className="h-4 w-4" />{downloading ? 'Preparing PDF...' : 'Download Certificate'}</button></div></div>
      {certificateVisible && <article ref={certificatePreviewRef} id="certificate-print-area" tabIndex={-1} className="relative mx-auto max-w-4xl overflow-hidden border border-slate-400 bg-[#fffdf8] p-6 shadow-sm sm:p-10 print:shadow-none"><div className="pointer-events-none absolute inset-2 border border-slate-200" /><div className="relative text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700 text-xl font-bold text-white">D</div><h1 className="mt-3 font-serif text-lg font-bold uppercase tracking-wide text-slate-900 sm:text-2xl">Rajiv Gandhi University of Knowledge Technologies</h1><p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Office of Academic Governance &amp; Student Affairs</p><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Digital Clearance Registry</p><h2 className="mt-6 border-y border-slate-300 py-3 font-serif text-base font-bold uppercase tracking-[0.16em] text-slate-900 sm:text-xl">No-Dues Clearance Certificate</h2><div className="mt-4 flex justify-center gap-6 text-[10px] text-slate-600"><span>Certificate ID: <strong className="font-mono text-slate-900">{certificate.id}</strong></span><span>Date of Issue: <strong className="text-slate-900">{issueDate}</strong></span></div><div className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-slate-700">This is to certify that <strong className="text-slate-900">{student.name}</strong> bearing University Registration No. <strong className="font-mono text-slate-900">{student.collegeId}</strong>, enrolled in <strong>{student.degree} in {student.department}</strong>, has successfully completed the institutional No-Dues clearance process.</div><table className="mx-auto mt-7 w-full max-w-2xl border-collapse text-left text-xs"><thead><tr className="border-b-2 border-slate-700"><th className="p-2">Department</th><th className="p-2 text-right">Clearance Status</th></tr></thead><tbody>{departmentOrder.map((key) => <tr key={key} className="border-b border-slate-200"><td className="p-2 font-medium capitalize">{key}</td><td className="p-2 text-right font-bold text-emerald-700">✓ APPROVED</td></tr>)}</tbody></table><p className="mx-auto mt-7 max-w-2xl text-center text-xs leading-5 text-slate-600">The above departments have verified that there are no outstanding dues, pending returns, or unresolved institutional obligations against the student as of the date of issue.</p><div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Certificate Status: Valid</div><div className="mt-8 grid items-end gap-6 border-t border-slate-300 pt-6 text-left sm:grid-cols-[1fr_auto]"><div className="space-y-2 text-xs text-slate-600"><p className="font-bold text-slate-900">Digitally Verified by DigiClear</p><p>Certificate ID: <span className="font-mono font-bold">{certificate.id}</span></p><p>Verification Code: <span className="font-mono font-bold">{certificate.verificationCode}</span></p><p className="font-semibold text-emerald-700">✓ Verified through DigiClear Digital Clearance Registry</p></div><div className="text-center">{qrCodeDataUrl && <img src={qrCodeDataUrl} alt="Certificate verification QR code" className="mx-auto h-28 w-28" />}<p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">Scan to Verify</p><p className="mt-1 text-[9px] text-slate-500">Certificate ID: {certificate.id}</p></div></div><div className="mt-8 border-t border-slate-300 pt-4 text-center text-[10px] uppercase tracking-widest text-slate-500"><p className="font-bold">Authorized Digital Clearance Registry</p><p className="mt-1 normal-case tracking-normal">DigiClear — Automated No-Dues &amp; Digital Clearance System</p><p className="mt-3 normal-case tracking-normal">This digitally generated certificate is valid only when verified through the official DigiClear verification system.</p></div></div></article>}
    </section>
  );
}
