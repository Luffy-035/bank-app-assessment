const Notification = require('../models/Notification');
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/v1/notifications
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ toUserId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    res.json({ success: true, unreadCount, notifications });
});

// @route   POST /api/v1/notifications/reminder
const sendReminder = asyncHandler(async (req, res) => {
    const { tenantId, message } = req.body;

    const tenant = await Tenant.findOne({ _id: tenantId, landlordId: req.user._id }).populate('userId');
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });

    const currentMonth = new Date().toISOString().slice(0, 7);
    const defaultMsg = message ?? `Reminder: Your rent for ${currentMonth} is due. Please pay at the earliest.`;

    const notification = await Notification.create({
        fromUserId: req.user._id,
        toUserId: tenant.userId._id,
        type: 'rent_reminder',
        title: 'Rent Reminder',
        message: defaultMsg,
    });

    // Push notification via Expo (if user has push token)
    try {
        const tenantUser = await User.findById(tenant.userId._id);
        if (tenantUser?.pushToken) {
            const { Expo } = require('expo-server-sdk');
            const expo = new Expo();
            const chunks = expo.chunkPushNotifications([{
                to: tenantUser.pushToken,
                sound: 'default',
                title: 'Rent Reminder',
                body: defaultMsg,
            }]);
            for (const chunk of chunks) {
                await expo.sendPushNotificationsAsync(chunk);
            }
        }
    } catch (e) {
        // Push failed silently — DB notification already saved
    }

    res.status(201).json({ success: true, notification });
});

// @route   PATCH /api/v1/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
    await Notification.findOneAndUpdate({ _id: req.params.id, toUserId: req.user._id }, { isRead: true });
    res.json({ success: true, message: 'Marked as read.' });
});

// @route   PATCH /api/v1/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ toUserId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read.' });
});

module.exports = { getNotifications, sendReminder, markAsRead, markAllAsRead };
