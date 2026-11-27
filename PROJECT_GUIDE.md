# FitDelivery Project Guide

## What the project does

FitDelivery is a small healthy-food ordering website. It has a home page, a menu of 11 meals, 10 juices, and 5 desserts, a shopping cart, and a simulated checkout. MySQL is used when configured; a local demo catalog and browser cart keep the site usable without it. The checkout does not take payment.

## Work completed

1. **Set up the website pages and routes.** The pages use `.html` names, and Express serves the home, menu, cart, checkout, about, and contact pages. The root `index.html` redirects visitors to the home page inside `views/`. This keeps the pages accessible at addresses such as `/menu.html`.
2. **Added meals, juices, and desserts.** The database catalog is seeded by `database/schema.sql`. When the product API is unavailable, the browser shows the bundled demo catalog, including local food and dessert photos with prices, instead of leaving the menu blank.
3. **Connected cart actions.** With MySQL configured, add, update, and remove actions call Express API routes and the server keeps quantities in the visitor’s session. In demo mode, the cart is saved in that browser’s local storage.
4. **Added simulated checkout.** With MySQL configured, the server saves customer, order, and order-item records together in a transaction. In demo mode, checkout shows a confirmation without saving to MySQL. No card details are requested and no payment is taken.
5. **Kept distinct local product photos.** Product images are stored in `images/` and served by Express. `style.css` controls the page layout and product-card appearance.
6. **Checked the code.** JavaScript syntax and browser behavior were checked previously. Database-backed browsing and order saving still need a successful MySQL login configured on this computer before they can be fully verified.

## Project structure

```text
FitDelivery/
├── index.html                 Root redirect to the home page
├── server.js                  Express API, MySQL queries, sessions, order saving
├── script.js                  Loads database products and calls the store API
├── style.css                  Shared website styling
├── package.json               Start commands and dependencies
├── package-lock.json          Locked dependency versions
├── views/
│   ├── index.html             Home page
│   ├── menu.html              Meal, juice, and dessert product grids
│   ├── cart.html              Cart page
│   ├── checkout.html          Delivery form and order summary
│   ├── order-confirmation.html Confirmation page
│   ├── about.html             About page
│   ├── contact.html           Contact page
│   └── error.html             Error page
├── images/                    Product and page photos
└── database/
    └── schema.sql             Tables and seed data for all 26 products
```

## Methods and tools

- **HTML** provides the page content and the containers where products appear.
- **CSS** keeps the site consistently styled and adapts the layout for smaller screens.
- **Browser JavaScript** renders products from the API or local demo catalog and updates the cart and checkout screens.
- **Express API routes** validate requests and perform database operations. MySQL, rather than browser-submitted prices, is the source for product prices and order totals.
- **MySQL transactions** save each order and its line items together, preventing a partially saved order if one database write fails.
- **Express sessions** keep a visitor’s cart while browsing. The default in-memory session store is suitable for a local demo; carts may be lost when the server restarts.
- **EJS** is configured to render `.html` view files, which are mostly ordinary HTML pages.
- **The MySQL schema** creates tables for products, customers, orders, and order items. Re-running it adds missing product categories and inserts any missing catalog rows.
- **Node.js syntax checks and browser testing** were used to catch script errors and check that images and cart behavior worked.

## Run the demo

To view the menu and use the simulated demo cart, start the app with `npm start`; the bundled catalog works even before MySQL is configured. To save orders to MySQL, first run `database/schema.sql` in MySQL Workbench using a MySQL administrator account. The SQL creates the database and seeds the products. For better security, create a separate MySQL application user and grant it access to the `fitdelivery` database. Then set the app’s credentials in the same PowerShell window where you start the server:

```powershell
$env:DB_HOST = "localhost"
$env:DB_PORT = "3306"
$env:DB_USER = "your_mysql_user"
$env:DB_PASSWORD = "your_mysql_password"
$env:DB_NAME = "fitdelivery"
npm start
```

Then visit `http://localhost:3000`. Check `http://localhost:3000/api/health`; a successful connection responds with `{"status":"ok","database":"connected"}`. Do not put database passwords in source files or share them in chat.

## Database and current limitations

The MySQL service on this computer is running, but no `DB_*` environment variables are configured. The default blank-password `root` login was rejected, so database-backed orders could not yet be tested. Without credentials, the website uses its local demo catalog and browser cart; those demo orders are not saved to MySQL. Set valid credentials locally as shown above, then restart the server to use database-backed ordering.

The checkout saves orders to MySQL but remains a simulated, unpaid checkout. User login/registration and real payment processing are not implemented. For a deployed site, also configure a strong `SESSION_SECRET` and a persistent session store instead of the development in-memory store.
