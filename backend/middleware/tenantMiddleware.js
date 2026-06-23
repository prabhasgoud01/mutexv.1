import { AsyncLocalStorage } from 'async_hooks';

export const tenantContext = new AsyncLocalStorage();

export const setTenantDb = (req, res, next) => {
  let dbName = 'ERP_MASTER'; // Default for Super Admin or unauthenticated routes

  if (req.user && req.user.role !== 'superadmin' && req.user.collegeName) {
    // Sanitize college name for database format: "ABC Engineering College" -> "college_ABC_Engineering_College"
    const sanitizedName = req.user.collegeName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    dbName = `college_${sanitizedName}`;
  } else if (req.user && req.user.role === 'superadmin' && req.body && req.body.targetCollege) {
    // If superadmin explicitly targets a college (e.g. sending SMS)
    const sanitizedName = req.body.targetCollege.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    dbName = `college_${sanitizedName}`;
  }

  tenantContext.run(dbName, () => {
    next();
  });
};
