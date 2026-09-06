export const DEPARTMENT_META = {
  sports: {
    key: 'sports',
    label: 'Sports',
    title: 'Sports Clearance Desk',
    description: 'Review and process sports clearance requests',
    quote: '“Sports build discipline, discipline builds character.”',
    quoteBy: '— Department of Sports',
    officerTitle: 'Sports Director',
    badge: 'Sports only'
  },
  hostel: {
    key: 'hostel',
    label: 'Hostel',
    title: 'Hostel Clearance Desk',
    description: 'Review and process hostel clearance requests',
    quote: '“A well-managed hostel creates discipline, safety, and belonging.”',
    quoteBy: '— Department of Hostel Affairs',
    officerTitle: 'Hostel Warden',
    badge: 'Hostel only'
  },
  library: {
    key: 'library',
    label: 'Library',
    title: 'Library Clearance Desk',
    description: 'Review and process library clearance requests',
    quote: '“Knowledge grows when every book, resource, and reader is accounted for.”',
    quoteBy: '— Department of Library Services',
    officerTitle: 'Chief Librarian',
    badge: 'Library only'
  },
  accounts: {
    key: 'accounts',
    label: 'Accounts',
    title: 'Accounts Clearance Desk',
    description: 'Review and process accounts clearance requests',
    quote: '“Financial discipline ensures trust, transparency, and timely closure.”',
    quoteBy: '— Accounts & Finance Office',
    officerTitle: 'Accounts Officer',
    badge: 'Accounts only'
  }
};

export const getDepartmentMeta = (department = 'sports') => (
  DEPARTMENT_META[department] || DEPARTMENT_META.sports
);

export const getDepartmentRequest = (clearanceRequest, department = 'sports') => {
  const deptData = clearanceRequest?.departments?.[department];
  if (!deptData) return null;

  return {
    id: clearanceRequest.id,
    studentName: 'Arjun Sharma',
    studentId: 'STU/2024/772',
    course: 'B.Tech Computer Science',
    semester: 'Semester VIII',
    appliedAt: clearanceRequest.appliedAt,
    status: deptData.status,
    remarks: deptData.remarks,
    verifiedAt: deptData.verifiedAt,
    verifiedBy: deptData.verifiedBy
  };
};

export const getDepartmentStats = (clearanceRequest, department = 'sports') => {
  const request = getDepartmentRequest(clearanceRequest, department);
  const counts = { total: request ? 1 : 0, pending: 0, approved: 0, rejected: 0 };
  if (request?.status && counts[request.status] !== undefined) counts[request.status] += 1;
  return counts;
};

export const getSportsRequest = (clearanceRequest) => getDepartmentRequest(clearanceRequest, 'sports');
export const getSportsStats = (clearanceRequest) => getDepartmentStats(clearanceRequest, 'sports');
