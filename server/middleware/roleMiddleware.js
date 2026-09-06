// server/middleware/roleMiddleware.js
export const checkRole = (...roles) => (req, res, next) => {
  next();
};

export default checkRole;
