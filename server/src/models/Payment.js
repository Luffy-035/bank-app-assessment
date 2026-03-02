const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        landlordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        unitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Unit',
            required: true,
        },
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: true,
        },
        month: {
            type: String,
            required: [true, 'Month is required'],
            match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
        },
        rentDue: { type: Number, required: true, min: 0 },
        amountPaid: { type: Number, required: true, min: 0 },
        balance: { type: Number, default: 0 },
        paymentDate: { type: Date, required: true },
        paymentMode: {
            type: String,
            enum: ['cash', 'upi', 'bank_transfer', 'cheque', 'other'],
            required: true,
        },
        description: { type: String, trim: true, default: '' },
        proofImage: { type: String, default: null },
        status: {
            type: String,
            enum: ['paid', 'partial', 'pending'],
            default: 'pending',
        },
        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

// Auto-compute balance and status before saving
paymentSchema.pre('save', function (next) {
    this.balance = Math.max(0, this.rentDue - this.amountPaid);
    if (this.amountPaid <= 0) {
        this.status = 'pending';
    } else if (this.amountPaid >= this.rentDue) {
        this.status = 'paid';
    } else {
        this.status = 'partial';
    }
    next();
});

module.exports = mongoose.model('Payment', paymentSchema);
