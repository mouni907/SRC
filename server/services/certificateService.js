const departmentOrder = ['library', 'hostel', 'sports', 'accounts'];

export const clearanceStore = {
  id: 'REQ-991204',
  studentId: 'STU001',
  overallStatus: 'pending',
  departments: {
    library: { status: 'approved', reason: 'Library dues cleared' },
    hostel: { status: 'pending', reason: 'Hostel inspection pending' },
    sports: { status: 'approved', reason: 'Sports equipment returned' },
    accounts: { status: 'pending', reason: 'Accounts verification pending' }
  },
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
  const overallStatus = determineOverallStatus(departments);

  if (overallStatus !== 'approved') {
    clearanceStore.overallStatus = overallStatus;
    clearanceStore.certificate = null;
    return {
      overallStatus,
      certificateGenerated: false,
      certificate: null
    };
  }

  const certificate = {
    id: 'NDC-2026-00001',
    studentId,
    issuedAt: new Date().toISOString(),
    status: 'issued'
  };

  clearanceStore.studentId = studentId;
  clearanceStore.overallStatus = 'approved';
  clearanceStore.certificate = certificate;

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

  if (snapshot.overallStatus === 'approved' && !snapshot.certificate) {
    snapshot.certificate = {
      id: 'NDC-2026-00001',
      studentId,
      issuedAt: new Date().toISOString(),
      status: 'issued'
    };
    clearanceStore.certificate = { ...snapshot.certificate };
  }

  return snapshot;
};

export default {
  clearanceStore,
  determineOverallStatus,
  canGenerateCertificate,
  generateCertificateIfEligible,
  updateDepartmentStatus,
  getStudentClearanceSnapshot
};
