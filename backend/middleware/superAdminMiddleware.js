import College from '../models/College.js';

export const checkSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Super Admin only.' });
  }
};

export const checkCollegeSubscription = async (req, res, next) => {
  if (!req.user || req.user.role === 'superadmin') {
    return next();
  }

  try {
    const college = await College.findOne({ name: req.user.collegeName });
    if (college) {
      if (college.isBlocked) {
        return res.status(403).json({ message: 'Your college has been blocked by the Super Admin.' });
      }
      if (college.subscriptionExpiry && new Date() > new Date(college.subscriptionExpiry)) {
        return res.status(403).json({ message: 'Your college subscription has expired. Please contact support.' });
      }
    }
    next();
  } catch (error) {
    console.error('Error checking college subscription:', error);
    res.status(500).json({ message: 'Server error checking subscription status' });
  }
};
