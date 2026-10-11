const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const customerRoutes = require('./routes/customerRoutes');
const { subscribeToCustomerEvents } = require('./services/customerEvents');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Plumbing Contractor Management API is running' });
});

app.get('/api/customers/events', subscribeToCustomerEvents);
app.use('/api/customers', customerRoutes);
app.use(errorHandler);

module.exports = app;
