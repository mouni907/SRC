import Certificate from '../models/Certificate.js';
import { createVerificationCode } from './qrService.js';

const departmentOrder = ['library', 'hostel', 'sports', 'accounts'];

export const clearanceStore = {
  id: null,
  studentId: null,
  overallStatus: 'not_started',
  departments: {},
  certificate: null
};

export const determineOverallStatus = (departments = clearanceStore.departments) => {
  const statuses = Object.values(departments || {});

  if (statuses.some((department) => department.status === 'rejected')) {
    return 'rejected';
  }

  if (statuses.length === departmentOrder.length && statuses.every((department) => department.status === 'approved')) {
    return 'approved';
  }

  return 'pending';
};

export const canGenerateCertificate = (departments = clearanceStore.departments) => {
  return departmentOrder.every((departmentKey) => (departments[departmentKey]?.status || 'pending') === 'approved');
};

export const generateCertificateIfEligible = (studentId = clearanceStore.studentId, departments = clearanceStore.departments) => {
  if (!canGenerateCertificate(departments)) {
    const overallStatus = determineOverallStatus(departments);
    clearanceStore.overallStatus = overallStatus;
    clearanceStore.certificate = null;
    return {
      overallStatus,
      certificateGenerated: false,
      certificate: null
    };
  }

  if (clearanceStore.certificate?.studentId === studentId) {
    return {
      overallStatus: 'approved',
      certificateGenerated: true,
      certificate: clearanceStore.certificate
    };
  }

  const issuedAt = new Date();
  const certificateId = `NDC-${issuedAt.getUTCFullYear()}-${issuedAt.getTime().toString().slice(-8)}`;
  const certificate = {
    id: certificateId,
    certificateId,
    verificationCode: createVerificationCode(),
    studentId,
    issuedAt: issuedAt.toISOString(),
    status: 'issued',
    departments
  };

  clearanceStore.studentId = studentId;
  clearanceStore.overallStatus = 'approved';
  clearanceStore.certificate = certificate;

  Certificate.create({
    certificateId: certificate.id,
    verificationCode: certificate.verificationCode,
    studentId,
    issuedAt,
    status: 'issued',
    departments
  }).catch((error) => {
    if (error?.code !== 11000) console.warn('[Certificate] Could not persist certificate:', error.message);
  });

  return {
    overallStatus: 'approved',
    certificateGenerated: true,
    certificate
  };
};

export const updateDepartmentStatus = ({ studentId, department, status, reason }) => {
  if (!departmentOrder.includes(department)) {
    throw new Error('Invalid department');
  }

  if (!['approved', 'pending', 'rejected'].includes(status)) {
    throw new Error('Invalid department status');
  }

  const currentStatus = clearanceStore.departments[department]?.status;
  if (currentStatus === 'approved' || currentStatus === 'rejected') {
    throw new Error('Department decision is final and cannot be changed');
  }

  clearanceStore.studentId = studentId || clearanceStore.studentId;
  clearanceStore.departments[department] = {
    status,
    reason: reason || `${department} status updated`
  };

  clearanceStore.overallStatus = determineOverallStatus(clearanceStore.departments);

  if (canGenerateCertificate(clearanceStore.departments)) {
    return generateCertificateIfEligible(clearanceStore.studentId, clearanceStore.departments);
  }

  clearanceStore.certificate = null;
  return {
    overallStatus: clearanceStore.overallStatus,
    certificateGenerated: false,
    certificate: null
  };
};

export const getStudentClearanceSnapshot = (studentId = clearanceStore.studentId) => {
  const snapshot = {
    id: clearanceStore.id,
    studentId,
    overallStatus: determineOverallStatus(clearanceStore.departments),
    departments: { ...clearanceStore.departments },
    certificate: clearanceStore.certificate ? { ...clearanceStore.certificate } : null
  };

  return snapshot;
};

export const findCertificateByVerificationCode = async (verificationCode) => {
  if (clearanceStore.certificate?.verificationCode === verificationCode) {
    return clearanceStore.certificate;
  }

  const certificate = await Certificate.findOne({ verificationCode, status: 'issued' }).lean();
  if (!certificate) return null;

  return {
    id: certificate.certificateId,
    certificateId: certificate.certificateId,
    verificationCode: certificate.verificationCode,
    studentId: certificate.studentId,
    issuedAt: certificate.issuedAt,
    status: certificate.status,
    departments: certificate.departments
  };
};

export default {
  clearanceStore,
  determineOverallStatus,
  canGenerateCertificate,
  generateCertificateIfEligible,
  updateDepartmentStatus,
  getStudentClearanceSnapshot,
  findCertificateByVerificationCode
};
