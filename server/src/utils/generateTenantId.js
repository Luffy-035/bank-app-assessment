const Tenant = require('../models/Tenant');

const generateTenantId = async () => {
    const year = new Date().getFullYear();
    const prefix = `T-${year}-`;
    const lastTenant = await Tenant.findOne({ tenantId: { $regex: `^${prefix}` } })
        .sort({ createdAt: -1 })
        .lean();

    let nextNum = 1;
    if (lastTenant) {
        const lastNum = parseInt(lastTenant.tenantId.split('-')[2], 10);
        nextNum = lastNum + 1;
    }

    return `${prefix}${String(nextNum).padStart(3, '0')}`;
};

module.exports = generateTenantId;
