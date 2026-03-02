const Maintenance = require('../models/Maintenance');
const Tenant = require('../models/Tenant');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/v1/maintenance
const getRequests = asyncHandler(async (req, res) => {
    let filter = {};

    if (req.user.role === 'tenant') {
        const tenant = await Tenant.findOne({ userId: req.user._id, status: 'active' });
        if (!tenant) return res.json({ success: true, requests: [] });
        filter.tenantId = tenant._id;
    } else {
        filter.landlordId = req.user._id;
    }

    if (req.query.status) filter.status = req.query.status;
    if (req.query.propertyId) filter.propertyId = req.query.propertyId;
    if (req.query.category) filter.category = req.query.category;

    const requests = await Maintenance.find(filter)
        .populate({ path: 'tenantId', populate: { path: 'userId', select: 'name phone' } })
        .populate('unitId', 'unitNumber')
        .populate('propertyId', 'name')
        .sort({ createdAt: -1 });

    res.json({ success: true, count: requests.length, requests });
});

// @route   GET /api/v1/maintenance/:id
const getRequest = asyncHandler(async (req, res) => {
    const request = await Maintenance.findById(req.params.id)
        .populate({ path: 'tenantId', populate: { path: 'userId', select: 'name phone email' } })
        .populate('unitId', 'unitNumber floorNumber')
        .populate('propertyId', 'name address');
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, request });
});

// @route   POST /api/v1/maintenance
const raiseRequest = asyncHandler(async (req, res) => {
    const tenant = await Tenant.findOne({ userId: req.user._id, status: 'active' });
    if (!tenant) return res.status(400).json({ success: false, message: 'No active tenant profile found.' });

    const { title, description, category } = req.body;

    const request = await Maintenance.create({
        tenantId: tenant._id,
        userId: req.user._id,
        landlordId: tenant.landlordId,
        propertyId: tenant.propertyId,
        unitId: tenant.unitId,
        title, description, category,
    });

    // Notify landlord
    await Notification.create({
        fromUserId: req.user._id,
        toUserId: tenant.landlordId,
        type: 'maintenance_update',
        title: 'New Maintenance Request',
        message: `${req.user.name} has raised a request: "${title}"`,
        relatedId: request._id,
    });

    res.status(201).json({ success: true, request });
});

// @route   PATCH /api/v1/maintenance/:id/status
const updateStatus = asyncHandler(async (req, res) => {
    const { status, adminNotes, cost } = req.body;

    const update = { status, adminNotes };
    if (cost !== undefined && cost !== null) update.cost = Number(cost);
    if (status === 'resolved' || status === 'closed') {
        update.resolvedAt = new Date();
    }

    const request = await Maintenance.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });

    // Notify tenant of status change
    await Notification.create({
        fromUserId: req.user._id,
        toUserId: request.userId,
        type: 'maintenance_update',
        title: 'Maintenance Request Updated',
        message: `Your request "${request.title}" is now ${status.replace('_', ' ')}.`,
        relatedId: request._id,
    });

    res.json({ success: true, request });
});

module.exports = { getRequests, getRequest, raiseRequest, updateStatus };
