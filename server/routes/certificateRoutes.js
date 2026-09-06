import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/roleMiddleware.js';
import { getStudentClearanceSnapshot } from '../services/certificateService.js';

const router = express.Router();

router.get('/:id', verifyToken, checkRole('student'), (req, res) => {
  const { id } = req.params;
  const snapshot = getStudentClearanceSnapshot(req.user.studentId || 'STU001');

  if (snapshot.certificate?.id !== id) {
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
