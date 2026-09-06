export const getSportsRequest = (clearanceRequest) => {
  const sports = clearanceRequest?.departments?.sports;
  if (!sports) return null;

  return {
    id: clearanceRequest.id,
    studentName: 'Arjun Sharma',
    studentId: 'STU/2024/772',
    course: 'B.Tech Computer Science',
    semester: 'Semester VIII',
    appliedAt: clearanceRequest.appliedAt,
    status: sports.status,
    remarks: sports.remarks,
    verifiedAt: sports.verifiedAt,
    verifiedBy: sports.verifiedBy
  };
};

export const getSportsStats = (clearanceRequest) => {
  const request = getSportsRequest(clearanceRequest);
  const counts = { total: request ? 1 : 0, pending: 0, approved: 0, rejected: 0 };
  if (request?.status && counts[request.status] !== undefined) counts[request.status] += 1;
  return counts;
};
