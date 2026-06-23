import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Faculty from '../models/Faculty.js';
import Student from '../models/Student.js';
import SuperAdmin from '../models/SuperAdmin.js';
import { tenantContext } from './tenantMiddleware.js';

// Protect routes - Verify JWT Token
export const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the cookie
  token = req.cookies.jwt;

  // Fallback to Bearer token in headers for mobile apps / alternative clients
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Set the tenant context using the dbName encoded in the JWT
      const dbName = decoded.dbName || 'ERP_MASTER';

      // We need to wrap the rest of the request in the tenantContext!
      // But we can't just await next() inside a context here easily if we want to also fetch req.user?
      // Actually we CAN!
      await tenantContext.run(dbName, async () => {
        // Get user from the token based on role
        if (decoded.role === 'superadmin') {
          req.user = await SuperAdmin.findById(decoded.userId).select('-password');
        } else if (decoded.role === 'admin') {
          req.user = await Admin.findById(decoded.userId).select('-password');
        } else if (decoded.role === 'faculty') {
          req.user = await Faculty.findById(decoded.userId).select('-password');
        } else {
          req.user = await Student.findById(decoded.userId).select('-password');
        }
        
        if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        // We explicitly do NOT call next() inside run() here because next() is called outside?
        // Wait, if we call next() outside, the context is LOST!
        // So we MUST call next() INSIDE the run() callback!
        next();
      });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
