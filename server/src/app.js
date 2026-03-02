const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes');
const propertyRoutes = require('./routes/property.routes');
const unitRoutes = require('./routes/unit.routes');
const tenantRoutes = require('./routes/tenant.routes');
const paymentRoutes = require('./routes/payment.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');
const expenseRoutes = require('./routes/expense.routes');

const app = express();

// ── Security & Parsing
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Logging (dev only)
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// ── Rate limiting
const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' } });

app.use('/api/v1', generalLimiter);
app.use('/api/v1/auth', authLimiter);

// ── Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Health check
app.get('/health', (req, res) => res.json({ success: true, message: 'Blew API is running 🚀', timestamp: new Date().toISOString() }));

// ── Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/units', unitRoutes);
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/expenses', expenseRoutes);

// ── 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ── Global error handler
app.use(errorHandler);

module.exports = app;
