const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
    {
        landlordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        label: {
            type: String,
            required: [true, 'Expense label is required'],
            trim: true,
        },
        category: {
            type: String,
            enum: ['maintenance', 'utilities', 'insurance', 'staff', 'other'],
            required: [true, 'Category is required'],
        },
        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be negative'],
        },
        incurredBy: {
            type: String,
            trim: true,
            default: '',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
