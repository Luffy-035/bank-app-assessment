const Payment = require('../models/Payment');
const Tenant = require('../models/Tenant');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const { paginate, paginateMeta } = require('../utils/paginate');
const { Parser } = require('json2csv');

// @route   GET /api/v1/payments
const getPayments = asyncHandler(async (req, res) => {
    const { page, limit, skip } = paginate(req.query);
    const filter = { landlordId: req.user._id };
    if (req.query.tenantId) filter.tenantId = req.query.tenantId;
    if (req.query.month) filter.month = req.query.month;
    if (req.query.propertyId) filter.propertyId = req.query.propertyId;
    if (req.query.status) filter.status = req.query.status;

    const [payments, total] = await Promise.all([
        Payment.find(filter)
            .populate({ path: 'tenantId', populate: { path: 'userId', select: 'name phone' } })
            .populate('unitId', 'unitNumber')
            .populate('propertyId', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        Payment.countDocuments(filter),
    ]);

    res.json({ success: true, ...paginateMeta(total, page, limit), payments });
});

// @route   GET /api/v1/payments/dues
const getDues = asyncHandler(async (req, res) => {
    const tenants = await Tenant.find({ landlordId: req.user._id, status: 'active' })
        .populate('userId', 'name phone')
        .populate('unitId', 'unitNumber')
        .populate('propertyId', 'name');

    const currentMonth = new Date().toISOString().slice(0, 7);

    const dues = await Promise.all(
        tenants.map(async (t) => {
            const payment = await Payment.findOne({ tenantId: t._id, month: currentMonth });
            const amountPaid = payment?.amountPaid ?? 0;
            const balance = Math.max(0, t.rentAmount - amountPaid);
            return {
                tenant: t,
                month: currentMonth,
                rentDue: t.rentAmount,
                amountPaid,
                balance,
                status: payment?.status ?? 'pending',
            };
        })
    );

    res.json({ success: true, dues });
});

// @route   GET /api/v1/payments/tenant/:tenantId
const getPaymentsByTenant = asyncHandler(async (req, res) => {
    const filter =
        req.user.role === 'tenant'
            ? { userId: req.user._id }
            : { landlordId: req.user._id, tenantId: req.params.tenantId };

    const payments = await Payment.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, payments });
});

// @route   POST /api/v1/payments
const recordPayment = asyncHandler(async (req, res) => {
    const { tenantId, month, amountPaid, paymentMode, paymentDate, description } = req.body;

    const tenant = await Tenant.findOne({ _id: tenantId, landlordId: req.user._id });
    if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });

    const payment = await Payment.create({
        tenantId: tenant._id,
        userId: tenant.userId,
        landlordId: req.user._id,
        unitId: tenant.unitId,
        propertyId: tenant.propertyId,
        month,
        rentDue: tenant.rentAmount,
        amountPaid,
        paymentDate: paymentDate ?? Date.now(),
        paymentMode,
        description,
        recordedBy: req.user._id,
    });

    // Notify tenant
    await Notification.create({
        fromUserId: req.user._id,
        toUserId: tenant.userId,
        type: 'payment_received',
        title: 'Payment Recorded',
        message: `Your payment of ₹${amountPaid.toLocaleString('en-IN')} for ${month} has been recorded.`,
        relatedId: payment._id,
    });

    res.status(201).json({ success: true, payment });
});

// @route   PATCH /api/v1/payments/:id
const updatePayment = asyncHandler(async (req, res) => {
    const { amountPaid, paymentMode, description, paymentDate } = req.body;
    const payment = await Payment.findOneAndUpdate(
        { _id: req.params.id, landlordId: req.user._id },
        { amountPaid, paymentMode, description, paymentDate },
        { new: true, runValidators: true }
    );
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });
    res.json({ success: true, payment });
});

// @route   GET /api/v1/payments/export
const exportPayments = asyncHandler(async (req, res) => {
    const filter = { landlordId: req.user._id };
    if (req.query.month) filter.month = req.query.month;
    if (req.query.propertyId) filter.propertyId = req.query.propertyId;

    const payments = await Payment.find(filter)
        .populate({ path: 'tenantId', populate: { path: 'userId', select: 'name phone' } })
        .populate('unitId', 'unitNumber')
        .sort({ createdAt: -1 })
        .lean();

    const rows = payments.map((p) => ({
        'Tenant Name': p.tenantId?.userId?.name ?? '',
        Phone: p.tenantId?.userId?.phone ?? '',
        Month: p.month,
        'Rent Due': p.rentDue,
        'Amount Paid': p.amountPaid,
        Balance: p.balance,
        Mode: p.paymentMode,
        Status: p.status,
        Date: new Date(p.paymentDate).toLocaleDateString('en-IN'),
    }));

    const parser = new Parser();
    const csv = parser.parse(rows);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=payments-${Date.now()}.csv`);
    res.send(csv);
});

module.exports = { getPayments, getDues, getPaymentsByTenant, recordPayment, updatePayment, exportPayments };
