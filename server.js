const express = require("express");
const session = require("express-session");
const mysql = require("mysql2/promise");
const ejs = require("ejs");
const path = require("path");

const app = express();
const port = Number(process.env.PORT) || 3000;

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "fitdelivery",
    waitForConnections: true,
    connectionLimit: 10,
    decimalNumbers: true
});

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));
app.use(session({
    secret: process.env.SESSION_SECRET || "fitdelivery-local-development-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
    }
}));

app.get("/style.css", (req, res) => {
    res.sendFile(path.join(__dirname, "style.css"));
});
app.get("/script.js", (req, res) => {
    res.sendFile(path.join(__dirname, "script.js"));
});
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.locals.cartCount = Object.values(req.session.cart || {})
        .reduce((count, quantity) => count + quantity, 0);
    next();
});

app.use("/api", (req, res, next) => {
    if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
        return res.status(503).json({
            error: "Database credentials are not configured. Set DB_USER and DB_PASSWORD before starting the app."
        });
    }
    return next();
});

function getCartCount(cart) {
    return Object.values(cart || {}).reduce((count, quantity) => count + quantity, 0);
}

async function getCartItems(cart) {
    const entries = Object.entries(cart || {}).map(([id, quantity]) => ({
        id: Number(id),
        quantity
    })).filter((item) => Number.isInteger(item.id) && item.id > 0);
    if (entries.length === 0) return [];

    const ids = entries.map((item) => item.id);
    const [products] = await pool.query(
        "SELECT id, category, name, description, price, image_url FROM products WHERE is_active = TRUE AND id IN (?)",
        [ids]
    );
    const quantities = new Map(entries.map((item) => [item.id, item.quantity]));
    return products.map((product) => {
        const quantity = quantities.get(product.id);
        const priceCents = Math.round(Number(product.price) * 100);
        return {
            id: product.id,
            category: product.category,
            name: product.name,
            description: product.description,
            image: product.image_url,
            priceCents,
            quantity,
            lineTotalCents: priceCents * quantity
        };
    });
}

function createRequestError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

async function getCartSummary(req) {
    const items = await getCartItems(req.session.cart);
    const availableIds = new Set(items.map((item) => String(item.id)));
    if (req.session.cart) {
        Object.keys(req.session.cart).forEach((id) => {
            if (!availableIds.has(id)) delete req.session.cart[id];
        });
    }
    return {
        items,
        totalCents: items.reduce((total, item) => total + item.lineTotalCents, 0),
        count: getCartCount(req.session.cart)
    };
}

app.get(["/", "/index.html"], (req, res) => res.render("index"));

app.get(["/menu", "/menu.html"], (req, res) => res.render("menu"));

app.get(["/about", "/about.html"], (req, res) => res.render("about"));
app.get(["/contact", "/contact.html"], (req, res) => res.render("contact"));

app.get("/api/health", async (req, res) => {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
});

app.get("/api/products", async (req, res) => {
    const [products] = await pool.query(
        "SELECT id, category, name, description, price, image_url FROM products WHERE is_active = TRUE ORDER BY id"
    );
    res.json(products.map((product) => ({
        id: product.id,
        category: product.category,
        name: product.name,
        description: product.description,
        priceCents: Math.round(Number(product.price) * 100),
        image: product.image_url
    })));
});

app.get("/api/cart", async (req, res) => {
    res.json(await getCartSummary(req));
});

app.post("/api/cart/items", async (req, res) => {
    const productId = Number(req.body.productId);
    if (!Number.isInteger(productId) || productId < 1) {
        throw createRequestError(400, "Choose a valid product.");
    }
    const [products] = await pool.query(
        "SELECT id FROM products WHERE id = ? AND is_active = TRUE",
        [productId]
    );
    if (products.length === 0) {
        throw createRequestError(404, "That product is no longer available.");
    }

    req.session.cart = req.session.cart || {};
    const currentQuantity = req.session.cart[productId] || 0;
    if (currentQuantity >= 99) {
        throw createRequestError(400, "You can add up to 99 of each product.");
    }
    req.session.cart[productId] = currentQuantity + 1;
    res.json(await getCartSummary(req));
});

app.patch("/api/cart/items/:productId", async (req, res) => {
    const productId = Number(req.params.productId);
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(productId) || productId < 1 ||
        !Number.isInteger(quantity) || quantity < 0 || quantity > 99) {
        throw createRequestError(400, "Enter a product and quantity from 0 to 99.");
    }

    req.session.cart = req.session.cart || {};
    if (quantity === 0) {
        delete req.session.cart[productId];
    } else {
        const [products] = await pool.query(
            "SELECT id FROM products WHERE id = ? AND is_active = TRUE",
            [productId]
        );
        if (products.length === 0) {
            throw createRequestError(404, "That product is no longer available.");
        }
        req.session.cart[productId] = quantity;
    }
    res.json(await getCartSummary(req));
});

app.delete("/api/cart/items/:productId", (req, res) => {
    const productId = Number(req.params.productId);
    if (!Number.isInteger(productId) || productId < 1) {
        throw createRequestError(400, "Choose a valid product.");
    }
    if (req.session.cart) delete req.session.cart[productId];
    res.json({ count: getCartCount(req.session.cart) });
});

app.post("/api/orders", async (req, res) => {
    const fullName = typeof req.body.fullName === "string" ? req.body.fullName.trim() : "";
    const email = typeof req.body.email === "string" ? req.body.email.trim() : "";
    const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
    const address = typeof req.body.address === "string" ? req.body.address.trim() : "";
    if (!fullName || fullName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 255 || phone.length > 30 || !address) {
        throw createRequestError(400, "Enter a valid name, email, and delivery address.");
    }

    const cartEntries = Object.entries(req.session.cart || {}).map(([id, quantity]) => ({
        id: Number(id),
        quantity
    }));
    if (cartEntries.length === 0 ||
        cartEntries.some((item) => !Number.isInteger(item.id) || item.id < 1 ||
            !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99)) {
        throw createRequestError(400, "Your cart is empty or invalid. Add products before checkout.");
    }

    const connection = await pool.getConnection();
    let order;
    let transactionStarted = false;
    try {
        await connection.beginTransaction();
        transactionStarted = true;
        const ids = cartEntries.map((item) => item.id);
        const [products] = await connection.query(
            "SELECT id, price FROM products WHERE is_active = TRUE AND id IN (?) FOR UPDATE",
            [ids]
        );
        const productsById = new Map(products.map((product) => [product.id, product]));
        if (productsById.size !== cartEntries.length) {
            throw createRequestError(400, "A product in your cart is no longer available. Review your cart.");
        }

        const orderItems = cartEntries.map((item) => {
            const product = productsById.get(item.id);
            const priceCents = Math.round(Number(product.price) * 100);
            return { ...item, priceCents };
        });
        const totalCents = orderItems.reduce(
            (total, item) => total + item.priceCents * item.quantity,
            0
        );

        const [customerResult] = await connection.query(
            "INSERT INTO customers (full_name, email, phone, delivery_address) VALUES (?, ?, ?, ?)",
            [fullName, email, phone || null, address]
        );
        const [orderResult] = await connection.query(
            "INSERT INTO orders (customer_id, status, total) VALUES (?, 'pending', ?)",
            [customerResult.insertId, (totalCents / 100).toFixed(2)]
        );
        const orderItemValues = orderItems.map((item) => [
            orderResult.insertId,
            item.id,
            item.quantity,
            (item.priceCents / 100).toFixed(2)
        ]);
        await connection.query(
            "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ?",
            [orderItemValues]
        );
        await connection.commit();
        transactionStarted = false;
        order = { id: `FD-${orderResult.insertId}`, totalCents };
    } catch (error) {
        if (transactionStarted) {
            try {
                await connection.rollback();
            } catch (rollbackError) {
                console.error("Could not roll back the failed order transaction.", rollbackError);
            }
        }
        throw error;
    } finally {
        connection.release();
    }

    req.session.cart = {};
    await new Promise((resolve, reject) => {
        req.session.save((error) => error ? reject(error) : resolve());
    });
    res.status(201).json(order);
});

app.post("/cart/add", async (req, res) => {
    const productId = Number(req.body.productId);
    if (!Number.isInteger(productId) || productId < 1) {
        return res.status(400).render("error", { message: "Please choose a valid meal." });
    }
    const [products] = await pool.query(
        "SELECT id FROM products WHERE id = ? AND is_active = TRUE",
        [productId]
    );
    if (products.length === 0) {
        return res.status(404).render("error", { message: "That meal is no longer available." });
    }

    req.session.cart = req.session.cart || {};
    const currentQuantity = req.session.cart[productId] || 0;
    if (currentQuantity >= 99) {
        return res.status(400).render("error", { message: "You can order up to 99 of each meal." });
    }
    req.session.cart[productId] = currentQuantity + 1;
    return res.redirect("/cart.html");
});

app.get(["/cart", "/cart.html"], (req, res) => res.render("cart"));

app.post("/cart/update", (req, res) => {
    const productId = Number(req.body.productId);
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(productId) || productId < 1 ||
        !Number.isInteger(quantity) || quantity < 0 || quantity > 99) {
        return res.status(400).render("error", { message: "Please enter a quantity from 0 to 99." });
    }

    req.session.cart = req.session.cart || {};
    if (quantity === 0) {
        delete req.session.cart[productId];
    } else {
        req.session.cart[productId] = quantity;
    }
    return res.redirect("/cart.html");
});

app.get(["/checkout", "/checkout.html"], (req, res) => res.render("checkout"));

app.get(["/order-confirmation", "/order-confirmation.html"], (req, res) => {
    res.render("order-confirmation");
});

app.use((error, req, res, next) => {
    console.error(error);
    if (res.headersSent) return next(error);
    const status = Number(error.status) || 500;
    const databaseMessages = {
        ER_ACCESS_DENIED_ERROR: "MySQL rejected the app login. Set DB_USER and DB_PASSWORD in the same PowerShell window before starting the app.",
        ECONNREFUSED: "The app could not reach MySQL. Start the MySQL service and check DB_HOST and DB_PORT.",
        ER_BAD_DB_ERROR: "The FitDelivery database is missing. Run database/schema.sql in MySQL Workbench.",
        ER_NO_SUCH_TABLE: "The FitDelivery tables are missing. Run database/schema.sql in MySQL Workbench."
    };
    const message = databaseMessages[error.code] ||
        (status >= 500
            ? "Something went wrong. Check the server console for details."
            : error.message);
    if (req.path.startsWith("/api/")) {
        return res.status(status).json({ error: message });
    }
    return res.status(status).render("error", { message });
});

app.listen(port, () => {
    console.log(`FitDelivery is running at http://localhost:${port}`);
});
