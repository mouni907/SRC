import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const ClearanceContext = createContext(null);

export const ClearanceProvider = ({ children }) => {
  const { user, updateUser } = useAuth();

  const [student, setStudent] = useState(() => {
    const saved = localStorage.getItem('digiclear_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing saved student profile', e);
      }
    }
    return {
      name: user?.name || 'Arjun Sharma',
      studentId: user?.studentId || 'STU001',
      collegeId: user?.collegeId || 'STU/2024/772',
      email: user?.email || 'student1@college.edu',
      phone: '+91 98765 43210',
      department: user?.department || 'Computer Science & Engineering',
      degree: user?.degree || 'B.Tech (Honours)',
      semester: user?.semester || 'Semester VIII',
      batch: user?.batch || '2022 - 2026',
      hallTicket: user?.hallTicket || '22041A0589',
      cgpa: '8.84',
      roomNo: 'Hostel Block B - Room 314'
    };
  });

  // Keep student in sync if another student user signs in
  React.useEffect(() => {
    if (user && user.role === 'student') {
      setStudent(prev => {
        // If current profile is for another student, switch to current user
        if (user.studentId && prev.studentId !== user.studentId) {
          return {
            name: user.name,
            studentId: user.studentId,
            collegeId: user.collegeId || user.studentId,
            email: user.email,
            phone: '+91 98765 43210',
            department: user.department || 'Computer Science & Engineering',
            degree: user.degree || 'B.Tech',
            semester: user.semester || 'Semester VIII',
            batch: user.batch || '2022 - 2026',
            hallTicket: user.hallTicket || user.rollNo || user.studentId,
            cgpa: '8.84',
            roomNo: 'Hostel Block B - Room 314'
          };
        }
        return prev;
      });
    }
  }, [user]);

  const updateStudentProfile = (newProfile) => {
    const updated = { ...student, ...newProfile };
    setStudent(updated);
    try {
      localStorage.setItem('digiclear_student_profile', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }

    if (updateUser) {
      updateUser({
        name: updated.name,
        email: updated.email,
        department: updated.department,
        degree: updated.degree,
        semester: updated.semester,
        batch: updated.batch,
        hallTicket: updated.hallTicket,
        collegeId: updated.collegeId
      });
    }

    return true;
  };

  const [clearanceRequest, setClearanceRequest] = useState({
    id: 'REQ-991204',
    appliedAt: '03 Sep 2026, 10:15 AM',
    reason: 'Graduation & Degree Award Semester Completion',
    overallStatus: 'pending',
    departments: {
      library: {
        name: 'Library',
        letter: 'L',
        status: 'approved',
        verifiedBy: 'Dr. R. Smith (Chief Librarian)',
        verifiedAt: '04 Sep 2026, 04:30 PM',
        remarks: 'All 6 catalog books returned in pristine condition. Zero overdue fines.'
      },
      hostel: {
        name: 'Hostel',
        letter: 'H',
        status: 'pending',
        verifiedBy: null,
        verifiedAt: null,
        remarks: 'Room inventory check scheduled for Sep 07. Key handover inspection pending.'
      },
      sports: {
        name: 'Sports',
        letter: 'S',
        status: 'approved',
        verifiedBy: 'Coach S. Mehta (Sports Director)',
        verifiedAt: '04 Sep 2026, 11:20 AM',
        remarks: 'Sports facility locker inspected & vacated. Badminton tournament kit returned.'
      },
      accounts: {
        name: 'Accounts',
        letter: 'A',
        status: 'pending',
        verifiedBy: null,
        verifiedAt: null,
        remarks: 'Pending semester mess dues of $40.00. Can be cleared at Bursar Desk or online.'
      }
    }
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Accounts: Dues Action Required',
      department: 'accounts',
      message: 'Pending mess bill dues of $40.00 recorded. Please settle at administrative counter or online gateway to proceed.',
      timestamp: '2 hours ago',
      type: 'warning',
      read: false
    },
    {
      id: 2,
      title: 'Library: Clearance Approved',
      department: 'library',
      message: 'Verified by Chief Librarian Dr. R. Smith. All textbooks accounted for with zero dues.',
      timestamp: 'Yesterday at 4:30 PM',
      type: 'approval',
      read: false
    },
    {
      id: 3,
      title: 'Sports: Clearance Approved',
      department: 'sports',
      message: 'Verified by Sports Director Coach S. Mehta. Badminton kit and equipment inspected successfully.',
      timestamp: '04 Sep 2026, 11:20 AM',
      type: 'approval',
      read: true
    },
    {
      id: 4,
      title: 'Clearance Application Submitted',
      department: 'system',
      message: 'Your No-Dues clearance request #REQ-991204 has been routed to Library, Hostel, Sports, and Accounts.',
      timestamp: '03 Sep 2026, 10:15 AM',
      type: 'system',
      read: true
    }
  ]);

  const deptList = Object.values(clearanceRequest.departments);
  const approvedCount = deptList.filter(d => d.status === 'approved').length;
  const pendingCount = deptList.filter(d => d.status === 'pending').length;
  const rejectedCount = deptList.filter(d => d.status === 'rejected').length;
  const completionPercentage = Math.round((approvedCount / deptList.length) * 100);
  const isCompleted = approvedCount === deptList.length;

  const updateDepartmentStatus = (deptKey, newStatus, remarks = '') => {
    setClearanceRequest(prev => {
      const updatedDepts = {
        ...prev.departments,
        [deptKey]: {
          ...prev.departments[deptKey],
          status: newStatus,
          verifiedAt: newStatus === 'approved' ? new Date().toLocaleString() : null,
          verifiedBy: newStatus === 'approved' ? 'Designated Department Officer' : null,
          remarks: remarks || prev.departments[deptKey].remarks
        }
      };

      const values = Object.values(updatedDepts);
      const anyRejected = values.some(d => d.status === 'rejected');
      const allApproved = values.every(d => d.status === 'approved');

      let newOverall = 'pending';
      if (anyRejected) newOverall = 'rejected';
      else if (allApproved) newOverall = 'completed';

      return {
        ...prev,
        overallStatus: newOverall,
        departments: updatedDepts
      };
    });
  };

  const approveAllDepartments = () => {
    setClearanceRequest(prev => {
      const updatedDepts = { ...prev.departments };
      Object.keys(updatedDepts).forEach(key => {
        updatedDepts[key] = {
          ...updatedDepts[key],
          status: 'approved',
          verifiedAt: new Date().toLocaleString(),
          verifiedBy: `Verified Official (${key.toUpperCase()})`,
          remarks: 'Institutional dues cleared and approved.'
        };
      });
      return {
        ...prev,
        overallStatus: 'completed',
        departments: updatedDepts
      };
    });

    setNotifications(prev => [
      {
        id: Date.now(),
        title: 'Clearance Fully Approved!',
        department: 'system',
        message: 'Congratulations! All four departments have approved your clearance. Your No-Dues Certificate is now unlocked.',
        timestamp: 'Just now',
        type: 'certificate',
        read: false
      },
      ...prev
    ]);
  };

  const resetToDemoState = () => {
    setClearanceRequest({
      id: 'REQ-991204',
      appliedAt: '03 Sep 2026, 10:15 AM',
      reason: 'Graduation & Degree Award Semester Completion',
      overallStatus: 'pending',
      departments: {
        library: {
          name: 'Library',
          letter: 'L',
          status: 'approved',
          verifiedBy: 'Dr. R. Smith (Chief Librarian)',
          verifiedAt: '04 Sep 2026, 04:30 PM',
          remarks: 'All 6 catalog books returned in pristine condition. Zero overdue fines.'
        },
        hostel: {
          name: 'Hostel',
          letter: 'H',
          status: 'pending',
          verifiedBy: null,
          verifiedAt: null,
          remarks: 'Room inventory check scheduled for Sep 07. Key handover inspection pending.'
        },
        sports: {
          name: 'Sports',
          letter: 'S',
          status: 'approved',
          verifiedBy: 'Coach S. Mehta (Sports Director)',
          verifiedAt: '04 Sep 2026, 11:20 AM',
          remarks: 'Sports facility locker inspected & vacated. Badminton tournament kit returned.'
        },
        accounts: {
          name: 'Accounts',
          letter: 'A',
          status: 'pending',
          verifiedBy: null,
          verifiedAt: null,
          remarks: 'Pending semester mess dues of $40.00. Can be cleared at Bursar Desk or online.'
        }
      }
    });
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <ClearanceContext.Provider value={{
      student,
      updateStudentProfile,
      clearanceRequest,
      notifications,
      approvedCount,
      pendingCount,
      rejectedCount,
      completionPercentage,
      isCompleted,
      updateDepartmentStatus,
      approveAllDepartments,
      resetToDemoState,
      markNotificationAsRead,
      markAllNotificationsAsRead
    }}>
      {children}
    </ClearanceContext.Provider>
  );
};

export const useClearance = () => {
  const context = useContext(ClearanceContext);
  if (!context) {
    throw new Error('useClearance must be used within a ClearanceProvider');
  }
  return context;
};

export default ClearanceContext;
