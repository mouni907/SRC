export const checkRole = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied for this role'
    });
  }

  next();
};

export const requireDepartment = (req, res, next) => {
  if (!req.user || req.user.role !== 'department') {
    return res.status(403).json({
      success: false,
      message: 'Department access is restricted to department staff only'
    });
  }

  const requestedDepartment = req.body.department || req.params.department;
  if (requestedDepartment && requestedDepartment !== req.user.department) {
    return res.status(403).json({
      success: false,
      message: 'Department mismatch: you can only act on your assigned department'
    });
  }

  next();
};

export default checkRole;
