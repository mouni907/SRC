import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';
import { findCertificateByVerificationCode, getStudentClearanceSnapshot } from '../services/certificateService.js';
import User from '../models/User.js';
import { USERS } from '../controllers/authController.js';

const router = express.Router();

router.get('/current', verifyToken, checkRole('student'), (req, res) => {
  const snapshot = getStudentClearanceSnapshot(req.user.studentId || 'STU001');
  return res.status(200).json({ success: true, certificate: snapshot.certificate, clearance: snapshot });
});

router.get('/verify/:verificationCode', async (req, res) => {
  const certificate = await findCertificateByVerificationCode(req.params.verificationCode);

  if (!certificate) {
    return res.status(404).json({ success: false, message: 'Certificate is not valid or has been revoked.' });
  }

  const storedUser = await User.findOne({ $or: [{ studentId: certificate.studentId }, { collegeId: certificate.studentId }] }).lean().catch(() => null);
  const fallbackUser = USERS.find((user) => user.studentId === certificate.studentId || user.collegeId === certificate.studentId);

  return res.status(200).json({
    success: true,
    certificate: {
      ...certificate,
      studentName: storedUser?.name || fallbackUser?.name || 'Verified Student',
      studentProgram: storedUser?.degree || fallbackUser?.degree || null,
      studentDepartment: storedUser?.department || fallbackUser?.department || null
    }
  });
});

router.get('/:id', verifyToken, checkRole('student'), (req, res) => {
  const { id } = req.params;
  const snapshot = getStudentClearanceSnapshot(req.user.studentId || 'STU001');

  if (!snapshot.certificate || snapshot.certificate.id !== id) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to view this certificate.'
    });
  }

  return res.status(200).json({ success: true, certificate: snapshot.certificate, clearance: snapshot });
});

router.get('/download/:id', verifyToken, checkRole('student'), (req, res) => {
  const { id } = req.params;
  const snapshot = getStudentClearanceSnapshot(req.user.studentId || 'STU001');

  if (snapshot.certificate?.id !== id) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to download this certificate.'
    });
  }

  return res.status(200).json({ success: true, downloadUrl: `/verify/${id}`, certificate: snapshot.certificate });
});

export default router;
