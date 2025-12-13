/**
 * Invoice Generation Route
 *
 * Handles invoice PDF generation using the APIVerve Invoice Generator API.
 */

const express = require('express');
const { API_KEY, API_URL } = require('../config');

const router = express.Router();

/**
 * POST /api/generate
 * Generates a PDF invoice from the provided data
 */
router.post('/', async (req, res) => {
  // Check API key
  if (API_KEY === 'your-api-key-here') {
    return res.status(400).json({
      error: 'Please add your API key to src/config.js'
    });
  }

  try {
    const invoiceData = req.body;

    // Call the APIVerve Invoice Generator API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify(invoiceData)
    });

    const data = await response.json();

    if (data.status === 'ok' && data.data) {
      res.json({
        success: true,
        pdfUrl: data.data.downloadURL || data.data.url,
        invoiceNumber: invoiceData.invoiceNumber
      });
    } else {
      res.status(400).json({
        error: data.error || 'Failed to generate invoice'
      });
    }
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({
      error: 'Failed to generate invoice. Check your API key.'
    });
  }
});

module.exports = router;
