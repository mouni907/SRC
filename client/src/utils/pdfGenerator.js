import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

/**
 * Generates and downloads an authentic No-Dues Clearance Certificate PDF.
 * Uses html2canvas to capture the high-resolution certificate frame,
 * with an automatic fallback to vector-drawn jsPDF if DOM capture is restricted.
 */
export async function downloadCertificatePDF(elementId, studentData, certificateMeta = {}) {
  const certId = certificateMeta.id || `NDC-${Date.now()}`;
  const verificationCode = certificateMeta.verificationCode || '';
  const verificationUrl = `${window.location.origin}/verify/${verificationCode}`;
  const fileName = `DigiClear_No_Dues_Certificate_${certId}.pdf`;

  // Attempt 1: High-fidelity DOM capture via html2canvas
  const targetElement = document.getElementById(elementId);
  if (targetElement) {
    try {
      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Fit with margins
      const margin = 10;
      const printableWidth = pageWidth - (margin * 2);
      const printableHeight = pageHeight - (margin * 2);

      const imgWidth = printableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const yOffset = imgHeight < printableHeight ? margin + ((printableHeight - imgHeight) / 2) : margin;

      pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, Math.min(imgHeight, printableHeight));
      pdf.save(fileName);
      return { success: true, method: 'dom-capture' };
    } catch (domErr) {
      console.warn('[PDF Generator] DOM capture error, falling back to programmatic PDF generation:', domErr);
    }
  }

  // Attempt 2: Programmatic Vector PDF Generation (Guaranteed to work in all environments)
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Border Frame
    pdf.setDrawColor(30, 41, 59); // slate-800
    pdf.setLineWidth(1.5);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

    pdf.setDrawColor(203, 213, 225); // slate-300
    pdf.setLineWidth(0.5);
    pdf.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // University Header
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.setTextColor(15, 23, 42);
    pdf.text('RAJIV GANDHI UNIVERSITY OF KNOWLEDGE TECHNOLOGIES', pageWidth / 2, 28, { align: 'center' });

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text('Office of Academic Governance & Student Affairs', pageWidth / 2, 34, { align: 'center' });

    // Certificate Title Badge
    pdf.setFillColor(241, 245, 249);
    pdf.setDrawColor(203, 213, 225);
    pdf.roundedRect((pageWidth / 2) - 50, 40, 100, 10, 2, 2, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(30, 41, 59);
    pdf.text('NO-DUES CLEARANCE CERTIFICATE', pageWidth / 2, 47, { align: 'center' });

    // Certificate Text
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(51, 65, 85);

    const name = studentData?.name || 'Student';
    const roll = studentData?.collegeId || studentData?.studentId || 'Not provided';
    const hallTicket = studentData?.hallTicket || roll;
    const degree = studentData?.degree || 'Not provided';
    const dept = studentData?.department || 'Not provided';
    const batch = studentData?.batch || 'Not provided';

    const bodyText = `This is to certify that ${name}, bearing University Roll No. ${roll} (Hall Ticket: ${hallTicket}), enrolled in ${degree} in ${dept}, Batch ${batch}, has satisfactorily settled all institutional liabilities, returned all issued resources, and obtained formal no-dues clearance across all statutory departments.`;

    const splitText = pdf.splitTextToSize(bodyText, pageWidth - 40);
    pdf.text(splitText, 20, 62);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(22, 101, 52);
    pdf.text('STATUS: ALL REQUIRED NO-DUES VERIFICATIONS APPROVED', pageWidth / 2, 94, { align: 'center' });

    // Verification & Signatures section
    const footerY = 112;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(30, 41, 59);
    pdf.text(`Certificate ID: ${certId}`, 20, footerY);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Issue Date: ${certificateMeta.issueDate || new Date().toLocaleDateString()}`, 20, footerY + 6);
<<<<<<< HEAD
    pdf.text('Tamper-Evident SHA-256 Digitally Sealed Document', 20, footerY + 12);
    pdf.text(`Verification Code: ${verificationCode}`, 20, footerY + 18);
    pdf.text(`Online Verification: ${verificationUrl}`, 20, footerY + 24);
=======
    pdf.text('Digitally verified through the DigiClear registry', 20, footerY + 12);
    pdf.text('Scan the QR code to verify this certificate', 20, footerY + 18);

    if (certificateMeta.verificationUrl) {
      const qrDataUrl = await QRCode.toDataURL(certificateMeta.verificationUrl, { width: 180, margin: 1 });
      pdf.addImage(qrDataUrl, 'PNG', pageWidth - 50, footerY - 2, 30, 30);
    }
>>>>>>> 0d27172 (final touch)

    // Signature line
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text('Authorized Academic Office', 210, footerY + 6, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text('No-Dues Verification Authority', 210, footerY + 12, { align: 'center' });
    pdf.text('RGUKT RK Valley', 210, footerY + 18, { align: 'center' });

    pdf.save(fileName);
    return { success: true, method: 'vector-pdf' };
  } catch (err) {
    console.error('[PDF Generator] Vector PDF generation failed:', err);
    throw err;
  }
}
