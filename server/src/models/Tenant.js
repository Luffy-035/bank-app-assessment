const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
    {
        tenantId: {
            type: String,
            unique: true,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        landlordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: true,
        },
        unitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Unit',
            required: true,
        },
        securityDeposit: { type: Number, default: 0 },
        rentCycle: { type: Number, default: 1, min: 1, max: 31 }, // Day of month rent is due
        rentAmount: { type: Number, required: true, min: 0 },
        leaseStart: { type: Date },
        leaseEnd: { type: Date },
        status: {
            type: String,
            enum: ['active', 'moved_out'],
            default: 'active',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Tenant', tenantSchema);
