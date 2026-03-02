const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
    {
        landlordId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Landlord ID is required'],
        },
        name: { type: String, required: [true, 'Property name is required'], trim: true },
        type: {
            type: String,
            enum: ['building', 'floor', 'pg'],
            required: [true, 'Property type is required'],
        },
        address: { type: String, required: [true, 'Address is required'], trim: true },
        totalFloors: { type: Number, default: 1 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
