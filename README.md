# Invoice Generator | APIVerve Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933)](package.json)
[![Express](https://img.shields.io/badge/Express-4-000000)](package.json)
[![APIVerve | Invoice Generator](https://img.shields.io/badge/APIVerve-Invoice_Generator-purple)](https://apiverve.com/marketplace/invoicegenerator?utm_source=github&utm_medium=template&utm_campaign=invoice-generator-node-tutorial)

Turn a form into a PDF invoice. Fill in who it's from and who it's for, add line items, sales tax and a discount, and download a PDF ready to send.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fapiverve%2Finvoice-generator-node-tutorial&project-name=invoice-generator&repository-name=invoice-generator&env=APIVERVE_API_KEY&envDescription=Your%20APIVerve%20API%20key.%20Free%20to%20create%2C%20no%20card%20needed.&envLink=https%3A%2F%2Fdashboard.apiverve.com%2Fsignup%3Fapi%3Dinvoicegenerator%26utm_source%3Dvercel%26utm_medium%3Dtemplate%26utm_campaign%3Dinvoice-generator-node-tutorial)

![Invoice Generator form with a generated PDF ready to download](https://raw.githubusercontent.com/apiverve/invoice-generator-node-tutorial/main/screenshot.png)

---

### Get your free API key

This template needs an APIVerve API key. **[Sign up free](https://dashboard.apiverve.com/signup?api=invoicegenerator&utm_source=github&utm_medium=template&utm_campaign=invoice-generator-node-tutorial)**, no credit card required.

---

## Deploy in one click

Click **Deploy with Vercel** above. Vercel copies this repo to your GitHub account, asks for your `APIVERVE_API_KEY`, and gives you a live URL about a minute later.

## Run it locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/apiverve/invoice-generator-node-tutorial.git
   cd invoice-generator-node-tutorial
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your API key**
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and set `APIVERVE_API_KEY`.

4. **Start the server**
   ```bash
   npm run dev
   ```

5. **Open** `http://localhost:3000`

## How it works

1. The page in `public/index.html` calls `POST /api/generate` on this server.
2. `server.js` checks the input, then calls Invoice Generator. Your API key stays on the server and never reaches the browser.
3. The page shows the result.

The server passes on only the fields the Invoice Generator accepts, and caps their lengths and the number of line items, so a deployed copy can't be used to send anything else on your key.

```
├── server.js            # Express: the /api route that calls APIVerve
├── public/index.html    # The page (HTML, CSS and JavaScript)
├── .env.example         # Copy to .env and add your key
└── package.json
```

### The API call

```javascript
const res = await fetch('https://api.apiverve.com/v1/invoicegenerator', {
  method: 'POST',
  headers: { 'x-api-key': process.env.APIVERVE_API_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    invoiceNumber: 'INV-001',
    from_name: 'Northwind Studio', from_street: '500 Congress Ave', from_city: 'Austin', from_state: 'TX', from_zip: '78701',
    to_name: 'Contoso Retail', to_street: '1200 17th St', to_city: 'Denver', to_state: 'CO', to_zip: '80202',
    items: [{ description: 'Homepage design', qty: 1, unit_price: 2400 }],
    salesTax: 8.25
  })
});
const { data } = await res.json();
// data.downloadURL → the PDF
```

The download link the API returns expires, so save the PDF if you need to keep it.

## Before you share your URL

Once deployed, anyone who finds your URL can use it on your API key. Each visitor can make 10 requests a minute, which is fine for a demo. The limit is kept in memory, so it isn't shared between serverless instances. For production:

- Put the page behind your own sign-in, or
- Move the limit to a shared store such as [Upstash Redis](https://upstash.com/), or
- Call the route only from your own backend.

## Ideas to extend it

- Create the invoice when an order is paid, and email the PDF
- Add your logo with the `logoURL` field
- Keep a record of each invoice number so they never repeat

## API reference

- [Invoice Generator](https://apiverve.com/marketplace/invoicegenerator?utm_source=github&utm_medium=template&utm_campaign=invoice-generator-node-tutorial): `POST https://api.apiverve.com/v1/invoicegenerator`
- [Full documentation](https://docs.apiverve.com?utm_source=github&utm_medium=template&utm_campaign=invoice-generator-node-tutorial)

## Tech stack

- **Node.js 20+** and **Express 4**
- Plain HTML, CSS and JavaScript, no build step
- Deploys to Vercel as-is: `server.js` becomes one function and `public/` is served from the CDN

## License

MIT. See [LICENSE](LICENSE).
