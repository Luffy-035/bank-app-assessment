const User = require('../models/User');
const Tenant = require('../models/Tenant');
const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');

// @desc    Register a new landlord
// @route   POST /api/v1/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    const { name, email, phone, password, role, address, bankDetails, signatureUrl } = req.body;

    // Duplicate email check — only when email is actually provided
    if (email) {
        const existing = await User.findOne({ email: email.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }
    }

    // Build payload conditionally — omit email field entirely if not provided
    const userData = { name, phone, password, role };

    if (email) userData.email = email.toLowerCase().trim();
    if (address) userData.address = address;
    if (bankDetails) userData.bankDetails = bankDetails;
    if (signatureUrl) userData.signatureUrl = signatureUrl;

    const user = await User.create(userData);
    const token = generateToken(user._id, user.role);

    res.status(201).json({ success: true, token, user });
});

// @desc    Login
// @route   POST /api/v1/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    const { email, password, tenantId, phone } = req.body;

    let user;

    // Tenant ID login mode (Tenant ID + phone number)
    if (tenantId) {
        const tenant = await Tenant.findOne({ tenantId }).populate('userId');
        if (!tenant) {
            return res.status(401).json({ success: false, message: 'Invalid Tenant ID.' });
        }
        user = await User.findById(tenant.userId).select('+password');
        if (!user || user.phone !== phone) {
            return res.status(401).json({ success: false, message: 'Invalid Tenant ID or phone number.' });
        }
    } else {
        // Standard email + password login (landlords)
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }
        user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
    }

    if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
    }

    const token = generateToken(user._id, user.role);
    const safeUser = user.toJSON();

    res.json({ success: true, token, user: safeUser });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    res.json({ success: true, user: req.user });
});

// @desc    Update push token
// @route   PATCH /api/v1/auth/push-token
// @access  Private
const updatePushToken = asyncHandler(async (req, res) => {
    const { pushToken } = req.body;
    await User.findByIdAndUpdate(req.user._id, { pushToken });
    res.json({ success: true, message: 'Push token updated.' });
});

// @desc    Update profile
// @route   PUT /api/v1/auth/me
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
    const { name, phone, profileImage, address } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, phone, profileImage, address },
        { new: true, runValidators: true }
    );
    res.json({ success: true, user });
});

module.exports = { register, login, getMe, updatePushToken, updateMe };
