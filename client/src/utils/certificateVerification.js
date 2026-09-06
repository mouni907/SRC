export function buildCertificateVerificationUrl(certificate, student) {
  if (!certificate?.id) return null;

  const payload = {
    certificateId: certificate.id,
    issuedAt: certificate.issuedAt,
    requestId: certificate.requestId || null,
    student: {
      name: student?.name || '',
      registration: student?.collegeId || student?.studentId || '',
      hallTicket: student?.hallTicket || '',
      degree: student?.degree || '',
      department: student?.department || '',
      batch: student?.batch || ''
    }
  };

  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  const encoded = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const origin = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
  return `${origin}/verify/${encodeURIComponent(certificate.id)}?data=${encoded}`;
}
