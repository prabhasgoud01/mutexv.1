import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Please provide the student name'],
    },
    idNo: {
      type: String,
      required: [true, 'Please provide the student ID number'],
    },
    dateOfPayment: {
      type: Date,
      required: [true, 'Please provide the date of payment'],
    },
    status: {
      type: String,
      required: [true, 'Please provide the payment status'],
      enum: ['Paid', 'Pending', 'Failed', 'Processing'],
      default: 'Paid',
    },
    mode: {
      type: String,
      required: [true, 'Please provide the mode of payment'],
    },
    amountPaid: {
      type: Number,
      required: [true, 'Please provide the amount paid'],
    },
    dueAmount: {
      type: Number,
      required: [true, 'Please provide the due amount'],
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
