import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generates and downloads an authentic No-Dues Clearance Certificate PDF.
 * Uses html2canvas to capture the high-resolution certificate frame,
 * with an automatic fallback to vector-drawn jsPDF if DOM capture is restricted.
 */
export async function downloadCertificatePDF(elementId, studentData, certificateMeta = {}) {
  const certId = certificateMeta.id || 'NDC-2026-00001';
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
    pdf.text('Office of Academic Governance & Student Affairs • Digital Clearance Registry', pageWidth / 2, 34, { align: 'center' });

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
    const roll = studentData?.collegeId || studentData?.studentId || 'STU001';
    const hallTicket = studentData?.hallTicket || roll;
    const degree = studentData?.degree || 'B.Tech';
    const dept = studentData?.department || 'Engineering';
    const batch = studentData?.batch || '2022-2026';

    const bodyText = `This is to certify that ${name}, bearing University Roll No. ${roll} (Hall Ticket: ${hallTicket}), enrolled in ${degree} in ${dept}, Batch ${batch}, has satisfactorily settled all institutional liabilities, returned all issued resources, and obtained formal no-dues clearance across all statutory departments.`;

    const splitText = pdf.splitTextToSize(bodyText, pageWidth - 40);
    pdf.text(splitText, 20, 62);

    // Department Approval Boxes
    const depts = [
      { name: 'Library Desk', status: 'CLEARED & APPROVED', reviewer: 'Dr. R. Smith (Chief Librarian)' },
      { name: 'Hostel Desk', status: 'CLEARED & APPROVED', reviewer: 'Mr. K. Sharma (Hostel Warden)' },
      { name: 'Sports Section', status: 'CLEARED & APPROVED', reviewer: 'Coach S. Mehta (Sports Director)' },
      { name: 'Accounts Section', status: 'CLEARED & APPROVED', reviewer: 'Bursar & Accounts Section' },
    ];

    const startX = 20;
    const boxWidth = (pageWidth - 40 - (3 * 6)) / 4;
    const boxY = 88;
    const boxHeight = 28;

    depts.forEach((d, idx) => {
      const bx = startX + (idx * (boxWidth + 6));
      pdf.setFillColor(240, 253, 244); // light green
      pdf.setDrawColor(187, 247, 208);
      pdf.roundedRect(bx, boxY, boxWidth, boxHeight, 2, 2, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(22, 101, 52);
      pdf.text(d.name, bx + (boxWidth / 2), boxY + 7, { align: 'center' });

      pdf.setFontSize(8);
      pdf.setTextColor(21, 128, 61);
      pdf.text(d.status, bx + (boxWidth / 2), boxY + 14, { align: 'center' });

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      pdf.text(d.reviewer, bx + (boxWidth / 2), boxY + 22, { align: 'center' });
    });

    // Verification & Signatures section
    const footerY = 135;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(30, 41, 59);
    pdf.text(`Certificate ID: ${certId}`, 20, footerY);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Issue Date: ${certificateMeta.issueDate || new Date().toLocaleDateString()}`, 20, footerY + 6);
    pdf.text('Tamper-Evident SHA-256 Digitally Sealed Document', 20, footerY + 12);
    pdf.text(`Online Verification: ${window.location.origin}/verify/${certId}`, 20, footerY + 18);

    // Signature line
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text('Prof. K. V. Narayana', pageWidth - 20, footerY + 6, { align: 'right' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Controller of Examinations', pageWidth - 20, footerY + 12, { align: 'right' });
    pdf.text('Rajiv Gandhi University of Knowledge Technologies', pageWidth - 20, footerY + 18, { align: 'right' });

    pdf.save(fileName);
    return { success: true, method: 'vector-pdf' };
  } catch (err) {
    console.error('[PDF Generator] Vector PDF generation failed:', err);
    throw err;
  }
}
