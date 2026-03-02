const User = require('../models/User');
const Maintenance = require('../models/Maintenance');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Property = require('../models/Property');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/v1/admin/users
const getUsers = asyncHandler(async (req, res) => {
    const { role, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const users = await User.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
});

// @route   GET /api/v1/admin/users/:id
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
});

// @route   PATCH /api/v1/admin/users/:id
const updateUser = asyncHandler(async (req, res) => {
    const { isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive, role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, user });
});

// @route   GET /api/v1/admin/maintenance
const getAllMaintenance = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const requests = await Maintenance.find(filter)
        .populate({ path: 'tenantId', populate: { path: 'userId', select: 'name phone' } })
        .populate({ path: 'landlordId', select: 'name phone' })
        .populate('propertyId', 'name address')
        .sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, requests });
});

// @route   PATCH /api/v1/admin/maintenance/:id
const updateComplaint = asyncHandler(async (req, res) => {
    const { status, adminNotes } = req.body;
    const request = await Maintenance.findByIdAndUpdate(req.params.id, { status, adminNotes }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found.' });
    res.json({ success: true, request });
});

// @route   GET /api/v1/admin/summary
const getSummary = asyncHandler(async (req, res) => {
    const [totalUsers, totalLandlords, totalTenants, totalProperties, openComplaints] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: 'landlord' }),
        User.countDocuments({ role: 'tenant' }),
        Property.countDocuments({ isActive: true }),
        Maintenance.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
    ]);
    res.json({ success: true, totalUsers, totalLandlords, totalTenants, totalProperties, openComplaints });
});

module.exports = { getUsers, getUserById, updateUser, getAllMaintenance, updateComplaint, getSummary };
