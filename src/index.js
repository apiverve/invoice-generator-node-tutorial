/**
 * Invoice Generator - Tutorial Example
 *
 * Generate professional PDF invoices using the APIVerve Invoice Generator API.
 * https://apiverve.com/marketplace/invoicegenerator
 */

const express = require('express');
const path = require('path');

const { PORT } = require('./config');
const generateRoute = require('./routes/generate');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/generate', generateRoute);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Invoice Generator running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop');
});
