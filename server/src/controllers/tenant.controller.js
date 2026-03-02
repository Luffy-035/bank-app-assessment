const User = require('../models/User');
const Tenant = require('../models/Tenant');
const Unit = require('../models/Unit');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const generateTenantId = require('../utils/generateTenantId');

// @route   GET /api/v1/tenants
const getTenants = asyncHandler(async (req, res) => {
    const filter = { landlordId: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.propertyId) filter.propertyId = req.query.propertyId;

    let tenants = await Tenant.find(filter)
        .populate('userId', 'name phone email profileImage')
        .populate('unitId', 'unitNumber floorNumber unitConfig')
        .populate('propertyId', 'name address')
        .sort({ createdAt: -1 });

    if (req.query.search) {
        const s = req.query.search.toLowerCase();
        tenants = tenants.filter((t) => {
            const name = t.userId?.name?.toLowerCase() ?? '';
            return name.includes(s) || t.tenantId.toLowerCase().includes(s);
        });
    }

    res.json({ success: true, count: tenants.length, tenants });
});

// @route   GET /api/v1/tenants/me  (Tenant self)
const getMyProfile = asyncHandler(async (req, res) => {
    const tenant = await Tenant.findOne({ userId: req.user._id, status: 'active' })
        .populate('userId', 'name phone email profileImage address')
        .populate('unitId', 'unitNumber floorNumber unitConfig rentAmount')
        .populate('propertyId', 'name address type')
        .populate('landlordId', 'name phone email');
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant profile not found.' });
    res.json({ success: true, tenant });
});

// @route   GET /api/v1/tenants/:id
const getTenant = asyncHandler(async (req, res) => {
    const tenant = await Tenant.findOne({ _id: req.params.id, landlordId: req.user._id })
        .populate('userId', 'name phone email profileImage address')
        .populate('unitId', 'unitNumber floorNumber unitConfig rentAmount status')
        .populate('propertyId', 'name address type');
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
    res.json({ success: true, tenant });
});

// @route   POST /api/v1/tenants
const addTenant = asyncHandler(async (req, res) => {
    const { name, phone, email, unitId, securityDeposit, rentCycle, rentAmount, leaseStart, leaseEnd } = req.body;

    // Verify unit belongs to landlord and is vacant
    const unit = await Unit.findOne({ _id: unitId, landlordId: req.user._id });
    if (!unit) return res.status(404).json({ success: false, message: 'Unit not found.' });
    if (unit.status === 'occupied') return res.status(400).json({ success: false, message: 'Unit is already occupied.' });

    // Create user account for tenant (default password = phone number)
    let tenantUser = await User.findOne({ phone });
    if (!tenantUser) {
        tenantUser = await User.create({
            name, phone,
            email: email || `${phone}@blew.in`,
            password: phone, // hashed by pre-save hook
            role: 'tenant',
        });
    }

    // Guard: check if this user is already an active tenant under this landlord
    const existingTenant = await Tenant.findOne({ userId: tenantUser._id, landlordId: req.user._id, status: 'active' });
    if (existingTenant) {
        return res.status(409).json({
            success: false,
            message: `This tenant (phone: ${phone}) is already active under your account with Tenant ID: ${existingTenant.tenantId}.`,
        });
    }

    // Generate unique Tenant ID
    const tenantId = await generateTenantId();

    // Create Tenant record
    const tenant = await Tenant.create({
        tenantId,
        userId: tenantUser._id,
        landlordId: req.user._id,
        propertyId: unit.propertyId,
        unitId: unit._id,
        securityDeposit, rentCycle, rentAmount, leaseStart, leaseEnd,
    });

    // Mark unit as occupied
    await Unit.findByIdAndUpdate(unitId, { status: 'occupied', currentTenantId: tenant._id });

    // Send welcome notification
    await Notification.create({
        fromUserId: req.user._id,
        toUserId: tenantUser._id,
        type: 'general',
        title: 'Welcome to Blew!',
        message: `Your tenant account is ready. Your Tenant ID is ${tenantId}. Use it with your phone number to log in.`,
    });

    res.status(201).json({
        success: true,
        tenant,
        tenantId,
        loginInfo: { tenantId, phone, defaultPassword: phone },
    });
});

// @route   PATCH /api/v1/tenants/:id
const updateTenant = asyncHandler(async (req, res) => {
    const { securityDeposit, rentAmount, rentCycle, leaseEnd } = req.body;
    const tenant = await Tenant.findOneAndUpdate(
        { _id: req.params.id, landlordId: req.user._id },
        { securityDeposit, rentAmount, rentCycle, leaseEnd },
        { new: true, runValidators: true }
    );
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
    res.json({ success: true, tenant });
});

// @route   PATCH /api/v1/tenants/:id/moveout
const moveTenantOut = asyncHandler(async (req, res) => {
    const tenant = await Tenant.findOne({ _id: req.params.id, landlordId: req.user._id });
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });

    tenant.status = 'moved_out';
    await tenant.save();

    await Unit.findByIdAndUpdate(tenant.unitId, { status: 'vacant', currentTenantId: null });

    res.json({ success: true, message: 'Tenant moved out successfully.' });
});

module.exports = { getTenants, getMyProfile, getTenant, addTenant, updateTenant, moveTenantOut };
