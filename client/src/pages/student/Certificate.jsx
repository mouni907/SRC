import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClearance } from '../../context/ClearanceContext';
import { downloadCertificatePDF } from '../../utils/pdfGenerator';
import QRCode from 'qrcode';
import { 
  Award, 
  Download, 
  Printer, 
  QrCode, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  ExternalLink, 
  Building2, 
  FileCheck2,
  Calendar,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';

export default function Certificate() {
  const navigate = useNavigate();
  const { 
    student, 
    clearanceRequest, 
    isCompleted, 
    approvedCount, 
    approveAllDepartments,
    resetToDemoState 
  } = useClearance();

  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const certificateId = 'NDC-2026-00001';
  const issueDate = '06 September 2026';
  const verificationUrl = `${window.location.origin}/verify/${certificateId}`;

  // Generate verified QR code image
  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      width: 140,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setQrCodeDataUrl(url))
      .catch(err => console.warn('QR code generation notice', err));
  }, [verificationUrl]);

  const handleDownload = async () => {
    if (!isCompleted) return;
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
      // Fallback to window.print if completely blocked
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
              Official Document
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {certificateId}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Digital No-Dues Certificate</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident institutional clearance verified across all 4 departments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-75"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Generating & Downloading PDF...' : 'Download PDF Certificate'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={approveAllDepartments}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate 4 Approvals (Unlock)</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Download Notification */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-800 text-xs shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Official No-Dues Certificate PDF Downloaded!</p>
            <p className="text-emerald-700 mt-0.5">The file DigiClear_No_Dues_Certificate_{certificateId}.pdf has been saved to your downloads.</p>
          </div>
        </div>
      )}

      {/* If locked, show guidance banner */}
      {!isCompleted && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
              !
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">Certificate Generation Locked</h4>
              <p className="text-xs text-amber-700 mt-0.5">
                {approvedCount} of 4 departments approved. Digital certificates are stamped automatically only after all four institutional channels sign off.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/student/clearance')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5"
          >
            <span>Review Department Desks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* The Printable Official Certificate Frame */}
      <div 
        id="certificate-print-area" 
        className="bg-white rounded-2xl border-4 border-double border-slate-300 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto relative overflow-hidden"
      >
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Award className="w-[500px] h-[500px]" />
        </div>

        {/* Certificate Header */}
        <div className="text-center pb-6 border-b-2 border-slate-200 space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-xl shadow-xs font-bold text-2xl mb-1">
            D
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight uppercase">
            Rajiv Gandhi University of Knowledge Technologies
          </h1>
          <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
            Office of Academic Governance &amp; Student Affairs • Digital Clearance Registry
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1 bg-slate-100 text-slate-800 border border-slate-300 rounded-full font-serif font-bold text-xs sm:text-sm tracking-wider uppercase">
              No-Dues Clearance Certificate
            </span>
          </div>
        </div>

        {/* Body Text */}
        <div className="py-8 space-y-5 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
            This is to certify that <strong>{student.name}</strong>, bearing University Registration Roll No. <strong className="font-mono text-slate-900">{student.collegeId}</strong> (Hall Ticket: <span className="font-mono">{student.hallTicket}</span>), enrolled in the <strong>{student.degree}</strong> in <strong>{student.department}</strong>, Batch <strong>{student.batch}</strong>, has satisfactorily settled all institutional liabilities, returned all issued resources, and obtained formal no-dues clearance.
          </p>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            The respective institutional authorities have performed electronic verification as registered below:
          </p>

          {/* 4-Department Verification Table / Stamps */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {Object.values(clearanceRequest.departments).map((dept) => {
              const isCleared = dept.status === 'approved';
              return (
                <div 
                  key={dept.name} 
                  className={`p-3 rounded-lg border text-center space-y-1.5 transition-all ${
                    isCleared ? 'bg-emerald-50/60 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-800">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dept.name}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {isCleared ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Cleared
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase bg-slate-200 px-2 py-0.5 rounded">
                        <Lock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-[9px] text-slate-500 leading-tight">
                    {isCleared ? dept.verifiedBy || 'Authorized Officer' : 'Awaiting Review'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Footer / QR / Signatures */}
        <div className="pt-6 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          {/* QR Verification Code */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
            <div className="p-2 bg-white border-2 border-slate-200 rounded-xl shadow-xs inline-block">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt={`QR Code for ${certificateId}`} 
                  className="w-24 h-24 rounded-lg block"
                />
              ) : (
                /* Fallback QR pattern */
                <div className="w-24 h-24 bg-slate-900 p-1.5 rounded-lg flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 bg-white rounded-xs p-1 flex items-center justify-center">
                      <div className="w-3 h-3 bg-slate-900 rounded-2xs" />
                    </div>
                    <div className="w-6 h-6 bg-white rounded-xs p-1 flex items-center justify-center">
                      <div className="w-3 h-3 bg-slate-900 rounded-2xs" />
                    </div>
                  </div>
                  <div className="flex justify-center items-center py-1">
                    <div className="w-4 h-4 bg-blue-500 rounded-xs flex items-center justify-center text-[7px] text-white font-bold">D</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 bg-white rounded-xs p-1 flex items-center justify-center">
                      <div className="w-3 h-3 bg-slate-900 rounded-2xs" />
                    </div>
                    <div className="w-4 h-4 bg-white/70 rounded-xs" />
                  </div>
                </div>
              )}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block uppercase">Scan to Verify Authenticity</span>
              <a 
                href={`/verify/${certificateId}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>Online Verification URL</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Certificate Metadata */}
          <div className="text-center space-y-1 text-xs text-slate-500">
            <div className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Tamper-Evident SHA-256</span>
            </div>
            <p className="font-mono text-[11px] text-slate-700">Certificate ID: {certificateId}</p>
            <p className="text-[11px]">Issue Date: {issueDate}</p>
            <p className="text-[10px] text-slate-400">Valid for Semester Completion &amp; Graduation</p>
          </div>

          {/* Institutional Signature */}
          <div className="text-center sm:text-right space-y-2">
            <div className="h-10 flex items-end justify-center sm:justify-end">
              <span className="font-serif italic text-base text-slate-800 border-b border-slate-400 pb-1 px-4">
                Prof. K. V. Narayana
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Controller of Examinations</p>
              <p className="text-[10px] text-slate-500">Rajiv Gandhi University (RGUKT)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
