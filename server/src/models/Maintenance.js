const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
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
        propertyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
        },
        unitId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Unit',
        },
        title: { type: String, required: [true, 'Title is required'], trim: true },
        description: { type: String, required: [true, 'Description is required'], trim: true },
        category: {
            type: String,
            enum: ['plumbing', 'electrical', 'appliance', 'structural', 'other'],
            required: true,
        },
        status: {
            type: String,
            enum: ['open', 'in_progress', 'resolved', 'closed'],
            default: 'open',
        },
        adminNotes: { type: String, trim: true, default: '' },
        cost: { type: Number, default: 0, min: 0 }, // repair cost filled in by landlord on resolution
        resolvedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
