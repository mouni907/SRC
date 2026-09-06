import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClearance } from '../../context/ClearanceContext';
import { downloadCertificatePDF } from '../../utils/pdfGenerator';
import QRCode from 'qrcode';
import {
  Award,
  Download,
  Printer,
  CheckCircle2,
  Lock,
  Building2,
  ArrowRight,
  AlertTriangle,
  Eye,
  FileText,
} from 'lucide-react';

export default function Certificate() {
  const navigate = useNavigate();
  const {
    student,
    clearanceRequest,
    isCompleted,
    approvedCount
  } = useClearance();

  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [certificateVisible, setCertificateVisible] = useState(false);
  const certificatePreviewRef = useRef(null);

  const certificateId = 'NDC-2026-00001';
  const issueDate = '06 September 2026';
  const verificationUrl = `${window.location.origin}/verify/${certificateId}`;
  const overallStatus = clearanceRequest?.overallStatus || 'pending';
  const certificateApproved = isCompleted || overallStatus === 'approved' || overallStatus === 'completed';
  const rejectedDepartment = Object.values(clearanceRequest?.departments || {}).find((dept) => dept.status === 'rejected');
  const approvalPercent = Math.round((approvedCount / 4) * 100);

  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch(() => undefined);
  }, [verificationUrl]);

  const handleViewCertificate = () => {
    if (!certificateApproved) return;

    if (certificateVisible) {
      setCertificateVisible(false);
      return;
    }

    setCertificateVisible(true);

    requestAnimationFrame(() => {
      const target = certificatePreviewRef.current;
      if (!target) return;

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.focus({ preventScroll: true });
    });
  };

  const handleDownload = async () => {
    if (!certificateApproved || !certificateVisible) return;
    setDownloading(true);
    setDownloadSuccess(false);

    try {
      await downloadCertificatePDF('certificate-print-area', student, {
        id: certificateId,
        issueDate: issueDate
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4500);
    } catch (err) {
      console.error('PDF download error:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const lockedView = (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0">!</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-slate-900">Certificate Generation Pending</h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold uppercase tracking-wide text-amber-700">In progress</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Your certificate will be available after all 4 departments approve your clearance.</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-bold text-slate-800">{approvedCount} / 4</p>
            <p className="text-[10px] text-slate-500">Departments Cleared</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5"><span>Approval progress</span><span>{approvalPercent}%</span></div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${Math.min(approvalPercent, 100)}%` }} /></div>
        </div>
      </div>

      <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        <FileText className="absolute -right-5 -bottom-8 w-44 h-44 text-slate-100 -rotate-12" />
        <div className="relative">
          <h3 className="text-base font-bold text-slate-900">Digital Certificate</h3>
          <p className="text-xs text-slate-500 mt-1">Your No-Dues Clearance Certificate will appear here after all departments approve.</p>
          <div className="min-h-48 mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center text-center p-6">
            <FileText className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-700">Certificate Generation Pending</p>
            <p className="text-xs text-slate-500 max-w-sm mt-1">Your No-Dues Certificate will be generated automatically after all four departments approve your clearance.</p>
          </div>
        </div>
      </section>
    </div>
  );

  const rejectedView = (
    <div className="space-y-6">
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-rose-900">Clearance Rejected</h4>
            <p className="text-xs text-rose-700 mt-1">
              {rejectedDepartment?.name || 'One or more'} department has rejected the request.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(clearanceRequest.departments).map((dept) => (
            <div key={dept.name} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">{dept.letter}</div>
                <span className="font-medium text-slate-800">{dept.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                {dept.status === 'approved' && <span className="text-emerald-700">✓ Approved</span>}
                {dept.status === 'pending' && <span className="text-amber-700">⏳ Pending</span>}
                {dept.status === 'rejected' && <span className="text-rose-700">✕ Rejected</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Rejection Reason</div>
          <p>{rejectedDepartment?.remarks || 'Department requirements remain incomplete.'}</p>
        </div>
      </div>
    </div>
  );

  const completedView = (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">✓</div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900">No-Dues Clearance Completed</h4>
            <p className="text-xs text-slate-600 mt-1">All 4 departments approved your clearance.</p>
          </div>
          <div className="ml-auto text-right shrink-0">
            <p className="text-lg font-bold text-slate-800">{approvedCount} / 4</p>
            <p className="text-[10px] text-slate-500">Departments Cleared</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5"><span>Approval progress</span><span>{approvalPercent}%</span></div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${approvalPercent}%` }} /></div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-xs shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Official No-Dues Certificate PDF Downloaded!</p>
            <p className="text-emerald-700 mt-0.5">The file DigiClear_No_Dues_Certificate_{certificateId}.pdf has been saved to your downloads.</p>
          </div>
        </div>
      )}

      <section className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Digital Certificate</h3>
            <p className="text-xs text-slate-500 mt-1">Your No-Dues Clearance Certificate is ready.</p>
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <button
              type="button"
              onClick={handleViewCertificate}
              aria-label={certificateVisible ? 'Hide Certificate' : 'View Certificate'}
              data-tooltip={certificateVisible ? 'Hide certificate' : 'View certificate'}
              data-tooltip-tone="blue"
              className="tooltip-trigger h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-colors flex items-center justify-center"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || !certificateVisible}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Generating PDF...' : 'Download Certificate'}</span>
            </button>
          </div>
        </div>

      {certificateVisible && <div
        ref={certificatePreviewRef}
        tabIndex={-1}
        id="certificate-print-area"
        className="bg-white rounded-2xl border-4 border-double border-slate-300 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Award className="w-[500px] h-[500px]" />
        </div>

        <div className="text-center pb-6 border-b-2 border-slate-200 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-xl shadow-xs font-bold text-2xl mb-1">D</div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight uppercase">Rajiv Gandhi University of Knowledge Technologies</h1>
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">Office of Academic Governance &amp; Student Affairs • Digital Clearance Registry</p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-full font-serif font-bold text-xs sm:text-sm tracking-wider uppercase">No-Dues Clearance Certificate</span>
          </div>
        </div>

        <div className="py-8 space-y-5 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
            This is to certify that <strong>{student.name}</strong>, bearing University Registration Roll No. <strong className="font-mono text-slate-900">{student.collegeId}</strong> (Hall Ticket: <span className="font-mono">{student.hallTicket}</span>), enrolled in the <strong>{student.degree}</strong> in <strong>{student.department}</strong>, Batch <strong>{student.batch}</strong>, has satisfactorily settled all institutional liabilities and obtained formal no-dues clearance.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {Object.values(clearanceRequest.departments).map((dept) => (
              <div key={dept.name} className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/60 text-center">
                <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{dept.name}</span>
                </div>
                <div className="mt-2 text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Approved
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
            <div className="p-2 bg-white border-2 border-slate-200 rounded-xl shadow-xs inline-block">
              {qrCodeDataUrl ? <img src={qrCodeDataUrl} alt={`QR Code for ${certificateId}`} className="w-24 h-24 rounded-lg block" /> : <div className="w-24 h-24 bg-slate-900 rounded-lg" />}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Verification QR</span>
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2 text-slate-700 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-semibold text-slate-500">Certificate ID</span>
              <span className="font-mono font-bold text-slate-900">{certificateId}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="font-semibold text-slate-500">Issued Date</span>
              <span className="font-mono text-slate-900">{issueDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Verification URL</span>
              <a href={`/verify/${certificateId}`} className="text-blue-600 underline">View Certificate</a>
            </div>
          </div>
        </div>
      </div>}
      </section>
    </div>
  );

  return (
    <div className="space-y-6">
      {certificateApproved && completedView}
      {overallStatus === 'rejected' && rejectedView}
      {overallStatus === 'pending' && lockedView}
    </div>
  );
}
