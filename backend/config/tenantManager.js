import mongoose from 'mongoose';
import { tenantContext } from '../middleware/tenantMiddleware.js';

const connectionPool = {};

export const getTenantModel = (modelName, schema) => {
  // Get the database name from context, default to ERP_MASTER if undefined
  const dbName = tenantContext.getStore() || 'ERP_MASTER';

  // Return the default Mongoose connection if ERP_MASTER is selected to ensure we reuse the main connection
  // Actually, Mongoose 6+ `useDb` on the main connection shares the connection pool
  // But wait, it's safer to always use `useDb(dbName)`
  let tenantDb = connectionPool[dbName];

  if (!tenantDb) {
    tenantDb = mongoose.connection.useDb(dbName, { useCache: true });
    connectionPool[dbName] = tenantDb;
  }

  // Register the schema if it doesn't exist on this DB instance
  if (!tenantDb.models[modelName]) {
    tenantDb.model(modelName, schema);
  }

  return tenantDb.model(modelName);
};
