import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getCurrentCertificateApi, updateDepartmentStatusApi } from '../services/api';

const ClearanceContext = createContext(null);
const CLEARANCE_STORAGE_KEY = 'digiclear_clearance_request';
const NOTIFICATIONS_STORAGE_KEY = 'digiclear_notifications';

const departmentLabels = {
  library: 'Library',
  hostel: 'Hostel',
  sports: 'Sports',
  accounts: 'Accounts'
};

const createNotificationKey = ({ type, relatedRequestId, department }) => (
  [type, relatedRequestId || '', department || ''].join(':')
);

const readStoredValue = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

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

  React.useEffect(() => {
    if (!user || user.role !== 'student') return;

    getCurrentCertificateApi()
      .then((result) => {
        if (!result?.clearance) return;
        setClearanceRequest((previous) => ({
          ...previous,
          ...result.clearance,
          departments: { ...previous.departments, ...result.clearance.departments },
          certificate: result.certificate || previous.certificate || null
        }));
      })
      .catch(() => undefined);
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

  const [clearanceRequest, setClearanceRequest] = useState(() => readStoredValue(CLEARANCE_STORAGE_KEY, {
    id: null,
    appliedAt: null,
    reason: '',
    overallStatus: 'not_started',
    departments: {}
  }));

  const [notifications, setNotifications] = useState(() => readStoredValue(NOTIFICATIONS_STORAGE_KEY, []));

  useEffect(() => {
    try {
      localStorage.setItem(CLEARANCE_STORAGE_KEY, JSON.stringify(clearanceRequest));
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.warn('[DigiClear] Could not persist local workflow state', error);
    }
  }, [clearanceRequest, notifications]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === CLEARANCE_STORAGE_KEY && event.newValue) {
        setClearanceRequest(JSON.parse(event.newValue));
      }
      if (event.key === NOTIFICATIONS_STORAGE_KEY && event.newValue) {
        setNotifications(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const createNotification = (notification) => {
    setNotifications((previous) => {
      const key = createNotificationKey(notification);
      if (previous.some((item) => item.eventKey === key)) return previous;
      const createdAt = new Date().toISOString();
      return [{
        ...notification,
        studentId: notification.studentId || student.studentId || null,
        id: `${createdAt}-${key}`,
        eventKey: key,
        createdAt,
        timestamp: 'Just now',
        read: false
      }, ...previous];
    });
  };

  const deptList = Object.values(clearanceRequest.departments);
  const approvedCount = deptList.filter(d => d.status === 'approved').length;
  const pendingCount = deptList.filter(d => d.status === 'pending').length;
  const rejectedCount = deptList.filter(d => d.status === 'rejected').length;
  const completionPercentage = deptList.length ? Math.round((approvedCount / deptList.length) * 100) : 0;
  const isCompleted = deptList.length === 4 && approvedCount === 4;

<<<<<<< HEAD
  const updateDepartmentStatus = async (deptKey, newStatus, remarks = '') => {
    let backendResult = null;
    try {
      backendResult = await updateDepartmentStatusApi(clearanceRequest.id, newStatus, remarks);
    } catch (error) {
      console.warn('[ClearanceContext] Department API update unavailable; keeping local state.', error.message);
    }

    setClearanceRequest(prev => {
      const updatedDepts = {
        ...prev.departments,
=======
  const updateDepartmentStatus = (deptKey, newStatus, remarks = '') => {
    const previousRequest = clearanceRequest;
    const previousDepartment = previousRequest.departments[deptKey];
    if (!previousDepartment || previousDepartment.status === newStatus) return;

    const updatedDepts = {
        ...previousRequest.departments,
>>>>>>> 0d27172 (final touch)
        [deptKey]: {
          ...previousDepartment,
          status: newStatus,
          verifiedAt: newStatus === 'approved' ? new Date().toLocaleString() : null,
          verifiedBy: newStatus === 'approved' ? 'Designated Department Officer' : null,
          remarks: remarks || previousDepartment.remarks
        }
    };

    const values = Object.values(updatedDepts);
    const anyRejected = values.some(d => d.status === 'rejected');
    const allApproved = values.length === 4 && values.every(d => d.status === 'approved');
    const newOverall = anyRejected ? 'rejected' : allApproved ? 'approved' : 'pending';
    const requestId = previousRequest.id;
    const label = departmentLabels[deptKey] || deptKey;

<<<<<<< HEAD
      let newOverall = 'pending';
      if (anyRejected) newOverall = 'rejected';
      else if (allApproved) newOverall = 'approved';

      return {
        ...prev,
        overallStatus: backendResult?.overallStatus || newOverall,
        departments: updatedDepts,
        certificate: backendResult?.certificate || prev.certificate || null
      };
    });

    return backendResult;
=======
    setClearanceRequest({
      ...previousRequest,
      overallStatus: newOverall,
      departments: updatedDepts,
      certificate: allApproved ? {
        id: previousRequest.certificate?.id || `NDC-${Date.now()}`,
        issuedAt: previousRequest.certificate?.issuedAt || new Date().toISOString(),
        status: 'issued'
      } : previousRequest.certificate
    });

    createNotification({
      title: `${label} Clearance ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
      message: newStatus === 'approved'
        ? `Your ${label} clearance has been approved.`
        : `Your ${label} clearance requires attention.${remarks ? ` Reason: ${remarks}` : ''}`,
      type: newStatus === 'approved' ? 'department_approved' : 'department_rejected',
      relatedRequestId: requestId,
      department: deptKey
    });

    if (allApproved && previousRequest.overallStatus !== 'approved') {
      createNotification({
        title: 'No-Dues Clearance Completed',
        message: 'All departments have approved your No-Dues request. Your certificate is ready.',
        type: 'clearance_completed',
        relatedRequestId: requestId
      });
      createNotification({
        title: 'No-Dues Certificate Ready',
        message: 'Your digitally verified No-Dues Certificate is now available for download.',
        type: 'certificate_ready',
        relatedRequestId: requestId
      });
    }
>>>>>>> 0d27172 (final touch)
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

    if (clearanceRequest.id) {
      createNotification({
        title: 'No-Dues Clearance Completed',
        message: 'All departments have approved your No-Dues request. Your certificate is ready.',
        type: 'clearance_completed',
        relatedRequestId: clearanceRequest.id
      });
      createNotification({
        title: 'No-Dues Certificate Ready',
        message: 'Your digitally verified No-Dues Certificate is now available for download.',
        type: 'certificate_ready',
        relatedRequestId: clearanceRequest.id
      });
    }
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
      departments,
      certificate: null
    });

    createNotification({
      title: 'No-Dues Request Submitted',
      message: 'Your No-Dues clearance request has been submitted successfully.',
      type: 'clearance_submitted',
      relatedRequestId: requestId
    });
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const visibleNotifications = user?.role === 'student'
    ? notifications.filter((notification) => !notification.studentId || notification.studentId === student.studentId)
    : notifications;
  const visibleUnreadCount = visibleNotifications.filter((notification) => !notification.read).length;

  return (
    <ClearanceContext.Provider value={{
      student,
      updateStudentProfile,
      clearanceRequest,
      notifications: visibleNotifications,
      unreadCount: visibleUnreadCount,
      approvedCount,
      pendingCount,
      rejectedCount,
      completionPercentage,
      isCompleted,
      updateDepartmentStatus,
      approveAllDepartments,
      submitClearanceRequest,
      createNotification,
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
