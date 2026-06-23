import jwt from 'jsonwebtoken';

const generateToken = (res, userId, role, dbName = 'ERP_MASTER') => {
  const token = jwt.sign({ userId, role, dbName }, process.env.JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  });

  // Set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: process.env.NODE_ENV !== 'development' ? 'none' : 'strict', // Prevent CSRF attacks but allow cross-site on Render
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

export default generateToken;
