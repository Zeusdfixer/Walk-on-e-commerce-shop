# WALKON — E-Commerce Website

A complete storefront + admin panel for WALKON Footwear, built from the
site proposal (home, shop, product detail, cart, checkout, about, delivery
& returns, contact, and a secure admin panel).

## How to run it

No build step, no `npm install`. It's plain HTML/CSS/JS.

1. Unzip this folder.
2. Open it in VS Code (or any editor).
3. Serve it with any static server — don't just double-click `index.html`,
   because browsers block some storage/file features on `file://` URLs.
   Easiest options:
   - VS Code: install the **Live Server** extension → right-click
     `index.html` → "Open with Live Server".
   - Or, with Node installed: `npx serve .`
   - Or, with Python installed: `python3 -m http.server 8000`
4. Visit the local URL it gives you (e.g. `http://localhost:5500` or
   `http://localhost:8000`).

## Admin Panel

Go to `/admin/login.html` (there's also an "Admin" link in the footer).

- **Username:** `admin`
- **Password:** `walkon2026`

**Change this password immediately** from Admin → Site Settings →
Admin Password.

From the admin panel you can:
- **Products** — add/edit/delete products, set SKU, price, sale price,
  stock, sizes, colors, category, status (active/draft/archived), whether
  it's featured on the homepage, and upload product photos.
- **Orders** — see every order placed at checkout, view customer/delivery
  details, update order status (pending/confirmed/delivered/cancelled).
- **Messages** — inquiries submitted through the Contact page.
- **Site Settings** — site name, tagline, hero banner text/image, about
  page text, delivery note, contact details (phone/WhatsApp/email/address),
  payment gateway public keys, and admin password.
- **Data** — export a JSON backup of everything, import a backup, or reset
  to demo data.

## How data is stored

This ships as a static site with **no backend**, so all data (products,
orders, messages, settings) is stored in the browser's `localStorage`,
scoped to whatever domain/port you're running it on. This means:

- It works completely offline, with zero setup or hosting cost.
- Data is per-browser — if you open the site in a different browser or
  clear site data, you'll be back to the seed products. **Export a backup
  regularly from Settings** once you're using this for real.
- If you want a real multi-device database (so orders show up on your
  phone too), you'll eventually want to connect a backend — see below.

All data access goes through one file, `js/store.js`, so swapping
localStorage for a real database only means rewriting the functions in
that file — nothing else in the site needs to change.

## Connecting real payments (Paystack / Flutterwave)

The proposal calls for Paystack/Flutterwave checkout. Right now,
`checkout.html` records the order (customer + items + chosen payment
method) but does not charge a card — there's nowhere safe to put a secret
key in a static, client-only site. To take real payments:

1. **Paystack**
   - Create a account at https://paystack.com and get your **public key**
     (starts with `pk_live_` or `pk_test_`) — paste it into Admin →
     Settings → Payment Gateways.
   - Add the Paystack Inline JS script to `checkout.html`
     (`https://js.paystack.co/v1/inline.js`) and call `PaystackPop.setup()`
     with the public key when "Pay with Paystack" is selected.
   - **Important:** verifying that a payment actually succeeded must
     happen server-side (Paystack webhook or a verify call using your
     **secret key**, which must never be shipped to the browser). This
     needs a small backend endpoint — Paystack's docs walk through this:
     https://paystack.com/docs/payments/verify-payments/
2. **Flutterwave** — same shape: public key on the client to open the
   payment modal (`https://checkout.flutterwave.com/v3.js`), secret key
   and verification on a backend you control.
   https://developer.flutterwave.com/docs/getting-started

Because verification needs a secret key, you'll need *some* backend for
this part — even a tiny one (a single serverless function on Vercel/
Netlify/Render works fine). That backend is also a natural place to move
the product/order database to, if you outgrow localStorage.

## Project structure

```
walkon/
├── index.html              Homepage
├── shop.html                Product listing + filters
├── product.html              Product detail page
├── cart.html                Shopping cart
├── checkout.html            Checkout form
├── order-confirmation.html   Order success page
├── about.html                About Us
├── delivery.html            Delivery & Returns
├── contact.html              Contact form
├── css/style.css            Site-wide design system
├── js/store.js               Data layer (the "database")
├── js/ui.js                  Shared header/footer/product card rendering
├── images/                   Product & brand imagery
└── admin/
    ├── login.html            Admin login
    ├── index.html            Dashboard
    ├── products.html         Product CRUD + SKU + image upload
    ├── orders.html            Order management
    ├── messages.html          Contact inquiries
    ├── settings.html          Site content, payment keys, password, backups
    ├── admin.css              Admin-only styling
    └── admin-ui.js            Sidebar nav + login guard
```

## Customizing

- **Branding/colors:** edit the CSS variables at the top of `css/style.css`
  (`--charcoal`, `--tan`, `--brass`, etc).
- **Fonts:** `Fraunces` (display) + `Inter` (body), loaded from Google
  Fonts in `style.css`. Swap the `@import` and `--font-display`/
  `--font-body` variables to change.
- **Domain & hosting:** per the original proposal — a `.com` or `.com.ng`
  domain plus any static host (Netlify, Vercel, GitHub Pages, or your
  existing Netlight Systems hosting) will serve this fine since it's
  just static files.
