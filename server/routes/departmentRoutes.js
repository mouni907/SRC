import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole, requireDepartment } from '../middleware/roleMiddleware.js';
import { updateDepartmentStatus, getStudentClearanceSnapshot } from '../services/certificateService.js';

const router = express.Router();

router.get('/requests', verifyToken, checkRole('department'), (req, res) => {
  const snapshot = getStudentClearanceSnapshot(req.user.studentId || 'STU001');
  res.status(200).json({ success: true, request: snapshot });
});

router.patch('/requests/:id/approve', verifyToken, checkRole('department'), requireDepartment, (req, res) => {
  const department = req.user.department;
  const { reason } = req.body || {};

  try {
    const result = updateDepartmentStatus({
      studentId: req.user.studentId || 'STU001',
      department,
      status: 'approved',
      reason: reason || `${department} department approved the request.`
    });

    return res.status(200).json({
      success: true,
      message: 'Department approved clearance successfully',
      ...result
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

router.patch('/requests/:id/reject', verifyToken, checkRole('department'), requireDepartment, (req, res) => {
  const department = req.user.department;
  const { reason } = req.body || {};

  try {
    const result = updateDepartmentStatus({
      studentId: req.user.studentId || 'STU001',
      department,
      status: 'rejected',
      reason: reason || `${department} department rejected the request.`
    });

    return res.status(200).json({
      success: true,
      message: 'Department rejected clearance successfully',
      ...result
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
