const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema(
    {
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: [true, 'Property ID is required'],
        },
        landlordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        floorNumber: { type: Number, required: [true, 'Floor number is required'] },
        unitNumber: { type: String, required: [true, 'Unit number is required'], trim: true },
        unitConfig: { type: String, trim: true, default: '' }, // e.g. "2BHK", "1RK"
        rentAmount: { type: Number, required: [true, 'Rent amount is required'], min: 0 },
        status: {
            type: String,
            enum: ['occupied', 'vacant'],
            default: 'vacant',
        },
        currentTenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
            default: null,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Unit', unitSchema);
