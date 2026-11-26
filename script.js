function validateform(event) {
    if (event) event.preventDefault();

// Get values
    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;
    let query = document.getElementById("query").value;

    let isValid = true;


    // Check Name
    if (name === "") {
        alert("Please enter your name");
        isValid = false;
    }
    else {
        let lettersOnly = /^[A-Za-z ]+$/;

        if (!lettersOnly.test(name)) {
            alert("Name must contain letters and spaces only");
            isValid = false;
        }
    }

    // Check Phone
    if (phone === "") {
        alert("Please enter your phone number");
        isValid = false;
    }
    else {
        let nineOrTenDigits = /^[0-9]{9,10}$/;

        if (!nineOrTenDigits.test(phone)) {
            alert("Phone number must be 9 or 10 digits");
            isValid = false;
        }
    }


    // Check Email
    if (email === "") {
        alert("Please enter your email");
        isValid = false;
    }
    else {
        if (!email.includes("@") || !email.includes(".")) {
            alert("Please enter a valid email");
            isValid = false;
        }
    }
 // Check Query
    if (query === "") {
        alert("Please select a query");
        isValid = false;
    }


    // Keep this demo form on the page; it does not send messages to a server.
    if (isValid) {
        const feedback = document.getElementById("contactFeedback");
        if (feedback) {
            feedback.textContent = "Your details are valid. Contact messages are not sent or saved in this demo.";
            feedback.hidden = false;
        }
    }

    return false;
}

(function setupDatabaseStore() {
    const demoProducts = [
        { id: 1, category: "meal", name: "Chicken Fitness Meal", description: "Grilled chicken with rice and fresh vegetables", priceCents: 1200, image: "/images/chicken-meal.jpg" },
        { id: 2, category: "meal", name: "Grilled Salmon Meal", description: "Grilled salmon with rice and fresh vegetables", priceCents: 1400, image: "/images/salmon-meal.jpg" },
        { id: 3, category: "meal", name: "Fresh Meal Special", description: "A balanced meal made fresh for your training day", priceCents: 1000, image: "/images/Delivered-meal.jpg" },
        { id: 4, category: "meal", name: "Turkey Quinoa Power Bowl", description: "Lean turkey, quinoa, leafy greens and roasted peppers", priceCents: 1350, image: "/images/meal-turkey-quinoa.jpg" },
        { id: 5, category: "meal", name: "Tofu Rainbow Bowl", description: "Plant-based tofu with brown rice and colourful vegetables", priceCents: 1150, image: "/images/meal-tofu-rainbow.jpg" },
        { id: 6, category: "meal", name: "Mediterranean Chickpea Bowl", description: "Chickpeas, cucumber, tomato and greens with herbed grains", priceCents: 1100, image: "/images/meal-chickpea-power.jpg" },
        { id: 7, category: "meal", name: "Lean Beef & Sweet Potato", description: "Lean beef with roasted sweet potato and steamed greens", priceCents: 1450, image: "/images/meal-beef-sweet-potato.jpg" },
        { id: 8, category: "meal", name: "Chicken Avocado Plate", description: "Grilled chicken, avocado and a crisp garden salad", priceCents: 1300, image: "/images/meal-chicken-avocado.jpg" },
        { id: 9, category: "meal", name: "Tuna & Brown Rice Box", description: "Tuna, brown rice, edamame and crunchy vegetables", priceCents: 1250, image: "/images/meal-tuna-rice.jpg" },
        { id: 10, category: "meal", name: "Lentil & Veggie Protein Bowl", description: "Warm lentils with roasted vegetables and fresh herbs", priceCents: 1050, image: "/images/meal-lentil-veg.jpg" },
        { id: 11, category: "meal", name: "Berry Protein Oats", description: "Creamy oats topped with berries, seeds and yoghurt", priceCents: 850, image: "/images/meal-protein-oats.jpg" },
        { id: 12, category: "juice", name: "Orange Sunrise", description: "Freshly pressed orange juice", priceCents: 400, image: "/images/juice-orange-sunrise.jpg" },
        { id: 13, category: "juice", name: "Green Garden Juice", description: "Apple, cucumber, spinach and lemon", priceCents: 475, image: "/images/juice-green-garden.jpg" },
        { id: 14, category: "juice", name: "Berry Blast", description: "A bright blend of strawberries, blueberries and apple", priceCents: 500, image: "/images/juice-berry-blast.jpg" },
        { id: 15, category: "juice", name: "Pineapple Mint", description: "Pineapple juice with a refreshing touch of mint", priceCents: 475, image: "/images/juice-pineapple-mint.jpg" },
        { id: 16, category: "juice", name: "Carrot Ginger", description: "Carrot and apple juice with fresh ginger", priceCents: 425, image: "/images/juice-carrot-ginger.jpg" },
        { id: 17, category: "juice", name: "Mango Turmeric", description: "Sweet mango with orange and a hint of turmeric", priceCents: 500, image: "/images/alternate-juice-4.jpg" },
        { id: 18, category: "juice", name: "Watermelon Lime", description: "Juicy watermelon balanced with fresh lime", priceCents: 450, image: "/images/alternate-juice-3.jpg" },
        { id: 19, category: "juice", name: "Apple Celery Press", description: "Crisp green apple, celery and lemon", priceCents: 450, image: "/images/juice-blueberry-breeze.jpg" },
        { id: 20, category: "juice", name: "Grapefruit Citrus", description: "Pink grapefruit and orange, freshly squeezed", priceCents: 475, image: "/images/alternate-juice-1.jpg" },
        { id: 21, category: "juice", name: "Blueberry Breeze", description: "Blueberries blended with apple and a splash of lemon", priceCents: 500, image: "/images/alternate-juice-2.jpg" },
        { id: 22, category: "dessert", name: "Chocolate Drip Cake", description: "Rich chocolate cake finished with smooth chocolate icing", priceCents: 550, image: "/images/dessert-chocolate-cake.jpg" },
        { id: 23, category: "dessert", name: "Fudgy Chocolate Brownie", description: "Soft-centered chocolate brownie with a cocoa finish", priceCents: 400, image: "/images/dessert-brownie.jpg" },
        { id: 24, category: "dessert", name: "Strawberry Yogurt Parfait", description: "Creamy yogurt layered with fresh strawberries", priceCents: 450, image: "/images/dessert-yogurt-berry.jpg" },
        { id: 25, category: "dessert", name: "Cookies & Cream Sundae", description: "Creamy chocolate dessert topped with cookie pieces", priceCents: 500, image: "/images/dessert-ice-cream.jpg" },
        { id: 26, category: "dessert", name: "Caramel Brownie Sundae", description: "A brownie and ice cream dessert drizzled with caramel", priceCents: 525, image: "/images/dessert-caramel-sundae.jpg" }
    ];
    let products = demoProducts;
    let cart = {};
    let storeMode = "database";

    async function apiRequest(url, options) {
        const response = await fetch(url, {
            credentials: "same-origin",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options && options.headers)
            }
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) {
            const message = result && result.error
                ? result.error
                : response.status === 404
                    ? "The FitDelivery API was not found. Start the app from its project folder with npm start."
                    : `Request failed (${response.status}).`;
            throw new Error(message);
        }
        return result;
    }

    function createElement(tagName, className, text) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    }

    function showMessage(container, message) {
        if (!container) return;
        const error = createElement("p", "form-error", message);
        error.setAttribute("role", "alert");
        container.replaceChildren(error);
    }

    function updateCartCount(count) {
        document.querySelectorAll(".cart-count").forEach((counter) => {
            counter.textContent = String(count);
            counter.removeAttribute("title");
        });
    }

    function showDemoModeNotice(error) {
        const feedback = document.getElementById("cartFeedback");
        if (feedback) {
            feedback.textContent = `Showing the demo menu because the product API is unavailable: ${error.message} Your cart is saved in this browser; demo orders are not saved to MySQL.`;
        }
    }

    function cartFromSummary(summary) {
        return Object.fromEntries(summary.items.map((item) => [String(item.id), item]));
    }

    function loadLocalCart() {
        const saved = localStorage.getItem("fitdelivery-cart");
        if (!saved) return {};

        const parsed = JSON.parse(saved);
        const entries = Array.isArray(parsed)
            ? parsed.map((item) => [String(item.id), item])
            : Object.entries(parsed);
        const storedCart = {};

        entries.forEach(([id, value]) => {
            const product = products.find((item) => String(item.id) === String(id));
            const quantity = typeof value === "number"
                ? value
                : Number(value && (value.quantity || value.count));
            if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) return;
            storedCart[id] = {
                ...product,
                quantity,
                lineTotalCents: product.priceCents * quantity
            };
        });
        return storedCart;
    }

    function localCartCount() {
        return Object.values(cart).reduce((count, item) => count + item.quantity, 0);
    }

    function setLocalCartQuantity(productId, quantity) {
        const key = String(productId);
        const product = products.find((item) => String(item.id) === key);
        if (!product) throw new Error("That product is not in the demo menu.");

        if (quantity === 0) {
            delete cart[key];
        } else {
            cart[key] = {
                ...product,
                quantity,
                lineTotalCents: product.priceCents * quantity
            };
        }
        localStorage.setItem("fitdelivery-cart", JSON.stringify(cart));
        updateCartCount(localCartCount());
        renderCart();
        renderCheckout();
    }

    async function refreshCart() {
        const summary = await apiRequest("/api/cart");
        cart = cartFromSummary(summary);
        updateCartCount(summary.count);
        return summary;
    }

    function renderProductCatalog() {
        document.querySelectorAll("[data-product-list]").forEach((container) => {
            const listType = container.dataset.productList;
            const category = {
                meals: "meal",
                juices: "juice",
                desserts: "dessert"
            }[listType];
            const visibleProducts = listType === "featured"
                ? products.filter((product) => product.category === "meal").slice(0, 3)
                : products.filter((product) => product.category === category);
            if (visibleProducts.length === 0) {
                container.append(createElement("p", "empty-state", "No products are available right now."));
                return;
            }

            visibleProducts.forEach((product) => {
                const card = createElement("article", "product-card");
                const image = document.createElement("img");
                image.src = product.image;
                image.alt = product.name;
                card.append(image);

                const info = createElement("div", "product-info");
                info.append(
                    createElement("h3", "", product.name),
                    createElement("p", "", product.description)
                );
                const actions = createElement("div", "product-actions");
                actions.append(createElement("strong", "", `€${(product.priceCents / 100).toFixed(2)}`));

                const addButton = createElement("button", "button button-small", "Add to cart");
                addButton.type = "button";
                addButton.dataset.addToCart = "";
                addButton.dataset.id = String(product.id);
                actions.append(addButton);
                info.append(actions);
                card.append(info);
                container.append(card);
            });
        });

        document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
            button.addEventListener("click", async () => {
                button.disabled = true;
                try {
                    if (storeMode === "local") {
                        const id = button.dataset.id;
                        const quantity = (cart[id] ? cart[id].quantity : 0) + 1;
                        if (quantity > 99) throw new Error("You can add up to 99 of each product.");
                        setLocalCartQuantity(id, quantity);
                    } else {
                        const summary = await apiRequest("/api/cart/items", {
                            method: "POST",
                            body: JSON.stringify({ productId: Number(button.dataset.id) })
                        });
                        cart = cartFromSummary(summary);
                        updateCartCount(summary.count);
                    }
                    const feedback = document.getElementById("cartFeedback");
                    if (feedback) feedback.textContent = "Product added to your cart.";
                    button.textContent = "Added";
                } catch (error) {
                    const feedback = document.getElementById("cartFeedback");
                    if (feedback) feedback.textContent = error.message;
                    else setDatabaseUnavailable(error);
                } finally {
                    button.disabled = false;
                }
            });
        });
    }

    function renderCart() {
        const container = document.getElementById("cartContents");
        if (!container) return;

        const items = Object.values(cart);
        container.replaceChildren();
        if (items.length === 0) {
            const emptyState = createElement("section", "empty-state");
            emptyState.append(
                createElement("h2", "", "Your cart is empty"),
                createElement("p", "", "Take a look at the menu and find something delicious.")
            );
            const menuLink = createElement("a", "button button-primary", "Browse the menu");
            menuLink.href = "/menu.html";
            emptyState.append(menuLink);
            container.append(emptyState);
            return;
        }

        const layout = createElement("div", "cart-layout");
        const cartItems = createElement("div", "cart-items");
        let totalCents = 0;

        items.forEach((item) => {
            totalCents += item.lineTotalCents;
            const article = createElement("article", "cart-item");
            const image = document.createElement("img");
            image.src = item.image;
            image.alt = item.name;

            const info = createElement("div", "cart-item-info");
            info.append(
                createElement("h2", "", item.name),
                createElement("p", "", `€${(item.priceCents / 100).toFixed(2)} each`)
            );

            const quantityControls = createElement("div", "quantity-form");
            const label = createElement("label", "", "Quantity");
            const quantity = document.createElement("input");
            quantity.type = "number";
            quantity.min = "0";
            quantity.max = "99";
            quantity.value = String(item.quantity);
            label.append(quantity);

            const updateButton = createElement("button", "button button-small button-outline", "Update");
            updateButton.type = "button";
            updateButton.addEventListener("click", async () => {
                const nextQuantity = Number(quantity.value);
                if (!Number.isInteger(nextQuantity) || nextQuantity < 0 || nextQuantity > 99) {
                    quantity.setCustomValidity("Enter a quantity from 0 to 99.");
                    quantity.reportValidity();
                    return;
                }
                quantity.setCustomValidity("");
                updateButton.disabled = true;
                try {
                    if (storeMode === "local") {
                        setLocalCartQuantity(item.id, nextQuantity);
                        return;
                    }
                    const summary = await apiRequest(`/api/cart/items/${item.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({ quantity: nextQuantity })
                    });
                    cart = cartFromSummary(summary);
                    updateCartCount(summary.count);
                    renderCart();
                } catch (error) {
                    showMessage(container, error.message);
                } finally {
                    updateButton.disabled = false;
                }
            });

            const removeButton = createElement("button", "button button-small button-outline", "Remove");
            removeButton.type = "button";
            removeButton.addEventListener("click", async () => {
                removeButton.disabled = true;
                try {
                    if (storeMode === "local") {
                        setLocalCartQuantity(item.id, 0);
                        return;
                    }
                    await apiRequest(`/api/cart/items/${item.id}`, { method: "DELETE" });
                    await refreshCart();
                    renderCart();
                } catch (error) {
                    showMessage(container, error.message);
                    removeButton.disabled = false;
                }
            });
            quantityControls.append(label, updateButton, removeButton);
            info.append(quantityControls);

            article.append(
                image,
                info,
                createElement("strong", "line-total", `€${(item.lineTotalCents / 100).toFixed(2)}`)
            );
            cartItems.append(article);
        });

        const summary = createElement("aside", "summary-card");
        summary.append(createElement("h2", "", "Order summary"));
        const totalLine = createElement("div", "summary-line summary-total");
        totalLine.append(
            createElement("span", "", "Total"),
            createElement("strong", "", `€${(totalCents / 100).toFixed(2)}`)
        );
        summary.append(totalLine);
        summary.append(createElement("p", "small-note", "Simulated checkout only. No payment is collected."));
        const checkoutLink = createElement("a", "button button-primary button-full", "Continue to checkout");
        checkoutLink.href = "checkout.html";
        summary.append(checkoutLink);
        const continueLink = createElement("a", "text-link", "Continue shopping");
        continueLink.href = "menu.html";
        summary.append(continueLink);
        layout.append(cartItems, summary);
        container.append(layout);
    }

    function renderCheckout() {
        const layout = document.getElementById("checkoutLayout");
        if (!layout) return;

        const items = Object.values(cart);
        const emptyState = document.getElementById("checkoutEmpty");
        if (items.length === 0) {
            layout.hidden = true;
            emptyState.hidden = false;
            return;
        }

        emptyState.hidden = true;
        layout.hidden = false;
        const itemList = document.getElementById("checkoutItems");
        const totalCents = items.reduce((total, item) => total + item.lineTotalCents, 0);
        itemList.replaceChildren();
        items.forEach((item) => {
            const line = createElement("div", "summary-line");
            line.append(
                createElement("span", "", `${item.name} × ${item.quantity}`),
                createElement("strong", "", `€${(item.lineTotalCents / 100).toFixed(2)}`)
            );
            itemList.append(line);
        });
        document.getElementById("checkoutTotal").textContent = `€${(totalCents / 100).toFixed(2)}`;

        const form = document.getElementById("checkoutForm");
        const submitButton = document.getElementById("placeOrderButton");
        submitButton.disabled = false;
        if (form.dataset.databaseSubmitBound) return;
        form.dataset.databaseSubmitBound = "true";
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            const errorMessage = document.getElementById("checkoutError");
            errorMessage.hidden = true;
            if (!form.reportValidity()) return;

            submitButton.disabled = true;
            try {
                if (storeMode === "local") {
                    const orderId = `FD-${Date.now()}`;
                    const query = new URLSearchParams({
                        order: orderId,
                        total: String(totalCents)
                    });
                    localStorage.removeItem("fitdelivery-cart");
                    cart = {};
                    updateCartCount(0);
                    window.location.href = `order-confirmation.html?${query}`;
                    return;
                }
                const order = await apiRequest("/api/orders", {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(new FormData(form).entries()))
                });
                const query = new URLSearchParams({
                    order: order.id,
                    total: String(order.totalCents)
                });
                window.location.href = `order-confirmation.html?${query}`;
            } catch (error) {
                errorMessage.textContent = error.message;
                errorMessage.hidden = false;
                submitButton.disabled = false;
            }
        });
    }

    function renderOrderConfirmation() {
        const details = document.getElementById("confirmationDetails");
        if (!details) return;

        const query = new URLSearchParams(window.location.search);
        const order = {
            id: query.get("order"),
            totalCents: Number(query.get("total"))
        };
        const isValidOrder = /^FD-\d+$/.test(order.id || "") &&
            Number.isInteger(order.totalCents) &&
            order.totalCents >= 0;
        details.hidden = !isValidOrder;
        document.getElementById("confirmationEmpty").hidden = Boolean(isValidOrder);
        if (!isValidOrder) return;

        document.getElementById("confirmationOrderId").textContent = order.id;
        document.getElementById("confirmationTotal").textContent =
            `€${(order.totalCents / 100).toFixed(2)}`;
    }

    async function initializeStore() {
        renderOrderConfirmation();
        const productContainers = document.querySelectorAll("[data-product-list]");
        const cartContainer = document.getElementById("cartContents");
        const checkoutForm = document.getElementById("checkoutForm");
        if (productContainers.length === 0 && !cartContainer && !checkoutForm) return;

        try {
            if (productContainers.length > 0) {
                products = await apiRequest("/api/products");
                if (!Array.isArray(products)) throw new Error("The product response was not valid.");
            }
            await refreshCart();
            storeMode = "database";
            if (productContainers.length > 0) renderProductCatalog();
            renderCart();
            renderCheckout();
        } catch (error) {
            storeMode = "local";
            products = demoProducts;
            let noticeError = error;
            try {
                cart = loadLocalCart();
            } catch (storageError) {
                cart = {};
                noticeError = new Error(`${error.message} The saved browser cart could not be read: ${storageError.message}`);
            }
            updateCartCount(localCartCount());
            if (productContainers.length > 0) renderProductCatalog();
            renderCart();
            renderCheckout();
            showDemoModeNotice(noticeError);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeStore, { once: true });
    } else {
        initializeStore();
    }
})();

