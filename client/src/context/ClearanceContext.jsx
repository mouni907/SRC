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
      name: user?.name || '',
      studentId: user?.studentId || '',
      collegeId: user?.collegeId || '',
      email: user?.email || '',
      phone: user?.phone || '',
      department: user?.department || '',
      degree: user?.degree || '',
      semester: user?.semester || '',
      batch: user?.batch || '',
      hallTicket: user?.hallTicket || '',
      cgpa: user?.cgpa || '',
      roomNo: user?.roomNo || ''
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
            phone: user.phone || '',
            department: user.department || '',
            degree: user.degree || '',
            semester: user.semester || '',
            batch: user.batch || '',
            hallTicket: user.hallTicket || user.rollNo || '',
            cgpa: user.cgpa || '',
            roomNo: user.roomNo || ''
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
    id: null,
    appliedAt: null,
    reason: '',
    overallStatus: 'not_started',
    departments: {}
  });

  const [notifications, setNotifications] = useState([]);

  const deptList = Object.values(clearanceRequest.departments);
  const approvedCount = deptList.filter(d => d.status === 'approved').length;
  const pendingCount = deptList.filter(d => d.status === 'pending').length;
  const rejectedCount = deptList.filter(d => d.status === 'rejected').length;
  const completionPercentage = deptList.length ? Math.round((approvedCount / deptList.length) * 100) : 0;
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
      else if (allApproved) newOverall = 'approved';

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
        overallStatus: 'approved',
        departments: updatedDepts
      };
    });

    setNotifications(prev => [
      {
        id: Date.now(),
        title: 'Clearance Fully Approved!',
        department: 'system',
        message: 'Congratulations! All four departments have approved your clearance. Your No-Dues Certificate is now ready.',
        timestamp: 'Just now',
        type: 'certificate',
        read: false
      },
      ...prev
    ]);
  };

  const submitClearanceRequest = (reason) => {
    const submittedAt = new Date().toLocaleString();
    const requestId = `REQ-${Date.now().toString().slice(-6)}`;
    const departments = {
      library: {
        name: 'Library',
        letter: 'L',
        status: 'pending',
        verifiedBy: null,
        verifiedAt: null,
        remarks: 'Awaiting library verification.'
      },
      hostel: {
        name: 'Hostel',
        letter: 'H',
        status: 'pending',
        verifiedBy: null,
        verifiedAt: null,
        remarks: 'Awaiting hostel verification.'
      },
      sports: {
        name: 'Sports',
        letter: 'S',
        status: 'pending',
        verifiedBy: null,
        verifiedAt: null,
        remarks: 'Awaiting sports verification.'
      },
      accounts: {
        name: 'Accounts',
        letter: 'A',
        status: 'pending',
        verifiedBy: null,
        verifiedAt: null,
        remarks: 'Awaiting accounts verification.'
      }
    };

    setClearanceRequest({
      id: requestId,
      appliedAt: submittedAt,
      reason,
      overallStatus: 'pending',
      departments
    });

    setNotifications((prev) => [
      {
        id: Date.now(),
        title: 'Clearance Application Submitted',
        department: 'system',
        message: `Your clearance request ${requestId} has been routed to all four departments.`,
        timestamp: 'Just now',
        type: 'system',
        read: false
      },
      ...prev
    ]);
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
      submitClearanceRequest,
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
