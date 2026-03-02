const Property = require('../models/Property');
const Unit = require('../models/Unit');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Maintenance = require('../models/Maintenance');
const asyncHandler = require('../utils/asyncHandler');

// @route   GET /api/v1/dashboard/stats
const getStats = asyncHandler(async (req, res) => {
    const landlordId = req.user._id;
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [totalProperties, totalUnits, occupiedUnits, openMaintenance, paymentsThisMonth, maintenanceCostAgg] = await Promise.all([
        Property.countDocuments({ landlordId, isActive: true }),
        Unit.countDocuments({ landlordId }),
        Unit.countDocuments({ landlordId, status: 'occupied' }),
        Maintenance.countDocuments({ landlordId, status: { $in: ['open', 'in_progress'] } }),
        Payment.find({ landlordId, month: currentMonth }),
        Maintenance.aggregate([
            {
                $match: {
                    landlordId,
                    status: { $in: ['resolved', 'closed'] },
                    resolvedAt: { $gte: monthStart, $lt: monthEnd },
                },
            },
            { $group: { _id: null, total: { $sum: '$cost' } } },
        ]),
    ]);

    const totalRentDue = paymentsThisMonth.reduce((s, p) => s + p.rentDue, 0);
    const totalReceived = paymentsThisMonth.reduce((s, p) => s + p.amountPaid, 0);
    const collectionPct = totalRentDue > 0 ? Math.round((totalReceived / totalRentDue) * 100) : 0;
    const occupancyPct = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
    const maintenanceCostThisMonth = maintenanceCostAgg[0]?.total ?? 0;

    res.json({
        success: true,
        totalProperties,
        totalUnits,
        occupiedUnits,
        occupancyPct,
        openMaintenance,
        maintenanceCostThisMonth,
        collectionPct,
        collection: {
            month: currentMonth,
            totalDue: totalRentDue,
            received: totalReceived,
            pending: Math.max(0, totalRentDue - totalReceived),
        },
    });
});


// @route   GET /api/v1/dashboard/collection
const getCollectionBreakdown = asyncHandler(async (req, res) => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const payments = await Payment.find({ landlordId: req.user._id, month: currentMonth });

    const received = payments.reduce((s, p) => s + p.amountPaid, 0);
    const totalDue = payments.reduce((s, p) => s + p.rentDue, 0);
    const pending = Math.max(0, totalDue - received);

    res.json({ success: true, month: currentMonth, received, pending, totalDue });
});

// @route   GET /api/v1/dashboard/activity
const getRecentActivity = asyncHandler(async (req, res) => {
    const [recentPayments, recentRequests] = await Promise.all([
        Payment.find({ landlordId: req.user._id })
            .populate({ path: 'tenantId', populate: { path: 'userId', select: 'name' } })
            .sort({ createdAt: -1 }).limit(5).lean(),
        Maintenance.find({ landlordId: req.user._id })
            .populate({ path: 'tenantId', populate: { path: 'userId', select: 'name' } })
            .sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const activity = [
        ...recentPayments.map((p) => ({
            type: 'payment',
            tenantName: p.tenantId?.userId?.name ?? 'Tenant',
            amount: p.amountPaid,
            month: p.month,
            status: p.status,
            createdAt: p.createdAt,
        })),
        ...recentRequests.map((r) => ({
            type: 'maintenance',
            tenantName: r.tenantId?.userId?.name ?? 'Tenant',
            title: r.title,
            status: r.status,
            createdAt: r.createdAt,
        })),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

    res.json({ success: true, activity });
});

module.exports = { getStats, getCollectionBreakdown, getRecentActivity };
