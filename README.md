# Invoice Generator | APIVerve API Tutorial

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933)](src/index.js)
[![Express](https://img.shields.io/badge/Express-4.x-000000)](package.json)
[![APIVerve | Invoice Generator](https://img.shields.io/badge/APIVerve-Invoice_Generator-purple)](https://apiverve.com/marketplace/invoicegenerator?utm_source=github&utm_medium=tutorial&utm_campaign=invoice-generator-node-tutorial)

A complete invoice generation application built with Node.js and Express. Create professional PDF invoices with a beautiful form interface.

![Screenshot](https://raw.githubusercontent.com/apiverve/invoice-generator-node-tutorial/main/screenshot.jpg)

---

### Get Your Free API Key

This tutorial requires an APIVerve API key. **[Sign up free](https://dashboard.apiverve.com?utm_source=github&utm_medium=tutorial&utm_campaign=invoice-generator-node-tutorial)** - no credit card required.

---

## Features

- Professional PDF invoice generation
- Beautiful dark mode form interface
- Dynamic line items (add/remove)
- Auto-calculated totals
- Company and client details
- Custom notes and payment terms
- Downloadable PDF output
- Responsive design

## Quick Start

1. **Clone this repository**
   ```bash
   git clone https://github.com/apiverve/invoice-generator-node-tutorial.git
   cd invoice-generator-node-tutorial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**

   Open `src/config.js` and replace the placeholder:
   ```javascript
   API_KEY: 'your-api-key-here'
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open in browser**

   Navigate to `http://localhost:3000`

## Project Structure

```
invoice-generator-node-tutorial/
├── src/
│   ├── routes/
│   │   └── generate.js  # Invoice generation endpoint
│   ├── config.js        # API key and settings
│   └── index.js         # Express app setup
├── public/
│   └── index.html       # Frontend form and UI
├── package.json         # Dependencies
├── screenshot.jpg       # Preview image
├── LICENSE              # MIT license
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## How It Works

1. **User fills form** - Enter invoice details, company info, line items
2. **Submit to server** - POST request to `/api/generate`
3. **API call** - Server sends data to APIVerve Invoice Generator
4. **PDF generation** - API creates professional PDF invoice
5. **Download** - User receives download link for the PDF

### The API Call

```javascript
const response = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  },
  body: JSON.stringify(invoiceData)
});
```

## API Reference

**Endpoint:** `POST https://api.apiverve.com/v1/invoicegenerator`

**Headers:**

| Header | Value |
|--------|-------|
| `Content-Type` | `application/json` |
| `x-api-key` | Your API key |

**Request Body:**

```json
{
  "invoiceNumber": "INV-001",
  "invoiceDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "currency": "USD",
  "from": {
    "name": "Your Company Inc.",
    "email": "billing@company.com",
    "address": "123 Business St, City, Country"
  },
  "to": {
    "name": "Client Company",
    "email": "client@example.com",
    "address": "456 Client Ave, City, Country"
  },
  "items": [
    {
      "description": "Web Development Services",
      "quantity": 10,
      "unitPrice": 150,
      "amount": 1500
    }
  ],
  "notes": "Payment due within 30 days. Thank you for your business!"
}
```

**Example Response:**

```json
{
  "status": "ok",
  "error": null,
  "data": {
    "downloadURL": "https://storage.apiverve.com/invoices/abc123.pdf",
    "invoiceNumber": "INV-001"
  }
}
```

## Use Cases

Invoice generation is essential for:

- **Freelancers** - Bill clients for projects
- **Small Businesses** - Create professional invoices
- **SaaS Products** - Generate subscription invoices
- **Contractors** - Invoice for hourly work
- **E-commerce** - Order receipts and invoices
- **Service Providers** - Bill for services rendered

## Customization Ideas

- Add company logo upload
- Support multiple currencies
- Add tax calculation
- Email invoice directly to client
- Create recurring invoice templates
- Add payment status tracking
- Generate invoice from saved templates

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Vanilla JS** - Frontend (no framework needed)

## Related APIs

Explore more APIs at [APIVerve](https://apiverve.com/marketplace?utm_source=github&utm_medium=tutorial&utm_campaign=invoice-generator-node-tutorial):

- [QR Code Generator](https://apiverve.com/marketplace/qrcodegenerator?utm_source=github&utm_medium=tutorial&utm_campaign=invoice-generator-node-tutorial) - Add QR codes to invoices
- [HTML to PDF](https://apiverve.com/marketplace/htmltopdf?utm_source=github&utm_medium=tutorial&utm_campaign=invoice-generator-node-tutorial) - Convert custom HTML to PDF
- [Email Validator](https://apiverve.com/marketplace/emailvalidator?utm_source=github&utm_medium=tutorial&utm_campaign=invoice-generator-node-tutorial) - Validate client emails

## License

MIT - see [LICENSE](LICENSE)

## Links

- [Get API Key](https://dashboard.apiverve.com?utm_source=github&utm_medium=tutorial&utm_campaign=invoice-generator-node-tutorial) - Sign up free
- [APIVerve Marketplace](https://apiverve.com/marketplace?utm_source=github&utm_medium=tutorial&utm_campaign=invoice-generator-node-tutorial) - Browse 300+ APIs
- [Invoice Generator API](https://apiverve.com/marketplace/invoicegenerator?utm_source=github&utm_medium=tutorial&utm_campaign=invoice-generator-node-tutorial) - API details
