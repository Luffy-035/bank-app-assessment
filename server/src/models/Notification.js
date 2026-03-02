const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: ['rent_reminder', 'payment_received', 'maintenance_update', 'general'],
            required: true,
        },
        title: { type: String, trim: true, default: '' },
        message: { type: String, required: true, trim: true },
        isRead: { type: Boolean, default: false },
        relatedId: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
