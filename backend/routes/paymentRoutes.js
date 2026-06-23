import express from 'express';
import { getPayments, addPayment, deletePayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Require admin or super-admin role for all payment routes
router.use(protect);
router.use(authorizeRoles('admin', 'super-admin'));

router.route('/')
  .get(getPayments)
  .post(addPayment);

router.route('/:id')
  .delete(deletePayment);

export default router;
