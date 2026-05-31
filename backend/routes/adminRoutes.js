import express from 'express';
import {
  getUsers,
  deleteUser,
  updateUserRole,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All admin routes are protected and require 'admin' role
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/users', getUsers);
router.delete('/user/:id', deleteUser);
router.put('/role/:id', updateUserRole);

export default router;
