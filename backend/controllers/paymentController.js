import Payment from '../models/Payment.js';

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Server error fetching payments' });
  }
};

// @desc    Add a new payment
// @route   POST /api/payments
// @access  Private/Admin
export const addPayment = async (req, res) => {
  try {
    const { studentName, idNo, dateOfPayment, status, mode, amountPaid, dueAmount } = req.body;

    if (!studentName || !idNo || !dateOfPayment || !status || !mode || amountPaid === undefined || dueAmount === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const newPayment = await Payment.create({
      studentName,
      idNo,
      dateOfPayment,
      status,
      mode,
      amountPaid,
      dueAmount,
    });

    res.status(201).json({ success: true, data: newPayment, message: 'Payment record created successfully' });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ success: false, message: 'Server error creating payment' });
  }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }

    await payment.deleteOne();
    res.status(200).json({ success: true, message: 'Payment record deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ success: false, message: 'Server error deleting payment' });
  }
};
