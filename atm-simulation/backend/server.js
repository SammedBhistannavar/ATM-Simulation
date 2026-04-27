const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/superadmin', require('./routes/superadmin.routes'));
app.use('/api/admin',      require('./routes/admin.routes'));
app.use('/api/user',       require('./routes/user.routes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ATM Backend Running ✅' }));

// Connect to MongoDB & Start Server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => { console.error('❌ MongoDB Error:', err); process.exit(1); });
