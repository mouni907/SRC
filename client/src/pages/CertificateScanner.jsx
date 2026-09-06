import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, ExternalLink, FileSearch, QrCode, ShieldCheck } from 'lucide-react';
import QrScanner from 'qr-scanner';

const getVerificationUrl = (rawValue) => {
  try {
    const value = rawValue.trim();
    if (!value) return null;
    if (/^https?:\/\//i.test(value)) return value;
    return `${window.location.origin}/verify/${encodeURIComponent(value)}`;
  } catch {
    return null;
  }
};

export default function CertificateScanner() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [manualId, setManualId] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('Allow camera access to scan a certificate QR code.');
  const [detectedValue, setDetectedValue] = useState('');
  const [cameraSupported, setCameraSupported] = useState(true);

  const stopCamera = () => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => () => stopCamera(), []);

  const handleDetected = (rawValue) => {
    const verificationUrl = getVerificationUrl(rawValue);
    if (!verificationUrl) {
      setStatus('invalid');
      setMessage('Invalid QR code');
      return;
    }
    stopCamera();
    setDetectedValue(rawValue);
    setStatus('detected');
    setMessage('QR code detected');
    window.setTimeout(() => navigate(verificationUrl.replace(window.location.origin, '')), 250);
  };

  const startCamera = async () => {
    if (!window.isSecureContext && window.location.hostname !== 'localhost') {
      setStatus('error');
      setMessage('Camera access requires HTTPS or localhost.');
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraSupported(false);
      setStatus('error');
      setMessage('Camera access is not supported in this browser. Enter the Certificate ID manually.');
      return;
    }
    try {
      setStatus('scanning');
      setMessage('Scanning...');
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) throw new DOMException('No camera found', 'NotFoundError');
      scannerRef.current = new QrScanner(videoRef.current, (result) => handleDetected(result.data), {
        preferredCamera: 'environment',
        highlightScanRegion: false,
        returnDetailedScanResult: true
      });
      await scannerRef.current.start();
    } catch (error) {
      stopCamera();
      setStatus(error.name === 'NotAllowedError' ? 'permission' : 'error');
      setMessage(error.name === 'NotAllowedError' ? 'Camera permission required' : 'Unable to open the camera. Check browser permissions and try again.');
    }
  };

  const handleManualSubmit = (event) => {
    event.preventDefault();
    const verificationUrl = getVerificationUrl(manualId);
    if (!verificationUrl) {
      setStatus('invalid');
      setMessage('Enter a valid Certificate ID');
      return;
    }
    navigate(verificationUrl.replace(window.location.origin, ''));
  };

  const isSuccess = status === 'detected';
  const isError = ['invalid', 'error', 'permission'].includes(status);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 font-sans text-slate-900 sm:px-6">
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center justify-between">
          <Link to="/login" className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700"><ArrowLeft className="h-4 w-4" /> Back to portal</Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Public certificate verification</span>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><QrCode className="h-6 w-6" /></div>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-blue-600">DigiClear</p><h1 className="mt-1 text-xl font-bold text-slate-900">Verify No-Dues Certificate</h1><p className="mt-1 text-xs text-slate-500">Scan the certificate QR code or enter its certificate ID.</p></div>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl bg-slate-950">
            <div className="relative aspect-video min-h-[230px] flex items-center justify-center">
              <video ref={videoRef} muted playsInline className="h-full w-full object-cover" aria-label="Certificate QR scanner camera" />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center"><div className="h-44 w-44 rounded-2xl border-2 border-blue-400 shadow-[0_0_0_999px_rgba(2,6,23,0.48)]" /></div>
              {!['scanning', 'detected'].includes(status) && <div className="absolute inset-x-6 bottom-5 rounded-lg bg-slate-900/85 px-4 py-3 text-center text-xs text-white">{message}</div>}
              {status === 'scanning' && <span className="absolute left-1/2 top-1/2 h-0.5 w-40 -translate-x-1/2 bg-blue-400 shadow-[0_0_14px_#60a5fa]" />}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" onClick={status === 'scanning' ? stopCamera : startCamera} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"> <Camera className="h-4 w-4" /> {status === 'scanning' ? 'Stop camera' : 'Start camera'}</button>
            <p className={`text-xs ${isSuccess ? 'text-emerald-700' : isError ? 'text-rose-700' : 'text-slate-500'}`}>{isSuccess ? 'QR code detected' : message}</p>
          </div>
          {detectedValue && <p className="mt-3 break-all rounded-lg bg-slate-50 p-3 text-[11px] text-slate-500">Detected: {detectedValue}</p>}
          {!cameraSupported && <p className="mt-3 text-[11px] text-slate-500">Use Chrome on Android or Safari on iPhone with camera permission enabled for camera scanning.</p>}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-2"><FileSearch className="h-4 w-4 text-slate-500" /><h2 className="text-sm font-bold text-slate-900">Manual verification</h2></div>
          <form onSubmit={handleManualSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row"><input value={manualId} onChange={(event) => setManualId(event.target.value)} placeholder="Certificate ID or verification URL" className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-500" /><button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"><ExternalLink className="h-3.5 w-3.5" /> Verify</button></form>
        </section>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400"><ShieldCheck className="h-3.5 w-3.5" /> Certificate verification portal</div>
      </div>
    </div>
  );
}
