CREATE DATABASE IF NOT EXISTS fitdelivery
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE fitdelivery;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(20) NOT NULL DEFAULT 'meal',
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SET @add_product_category = IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE TABLE_SCHEMA = DATABASE()
     AND TABLE_NAME = 'products'
     AND COLUMN_NAME = 'category') = 0,
  'ALTER TABLE products ADD COLUMN category VARCHAR(20) NOT NULL DEFAULT ''meal'' AFTER id',
  'SELECT 1'
);
PREPARE add_product_category_stmt FROM @add_product_category;
EXECUTE add_product_category_stmt;
DEALLOCATE PREPARE add_product_category_stmt;

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(30),
  delivery_address TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_order_items_order
    FOREIGN KEY (order_id) REFERENCES orders(id),
  CONSTRAINT fk_order_items_product
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (name, description, price, image_url)
SELECT 'Chicken Fitness Meal', 'Grilled chicken with rice and fresh vegetables', 12.00, '/images/chicken-meal.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Fitness Meal');

INSERT INTO products (name, description, price, image_url)
SELECT 'Grilled Salmon Meal', 'Grilled salmon with rice and fresh vegetables', 14.00, '/images/salmon-meal.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Grilled Salmon Meal');

INSERT INTO products (name, description, price, image_url)
SELECT 'Fresh Meal Special', 'A balanced meal made fresh for your training day', 10.00, '/images/Delivered-meal.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fresh Meal Special');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'meal', 'Turkey Quinoa Power Bowl', 'Lean turkey, quinoa, leafy greens and roasted peppers', 13.50, '/images/meal-turkey-quinoa.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Turkey Quinoa Power Bowl');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'meal', 'Tofu Rainbow Bowl', 'Plant-based tofu with brown rice and colourful vegetables', 11.50, '/images/meal-tofu-rainbow.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tofu Rainbow Bowl');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'meal', 'Mediterranean Chickpea Bowl', 'Chickpeas, cucumber, tomato and greens with herbed grains', 11.00, '/images/meal-chickpea-power.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mediterranean Chickpea Bowl');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'meal', 'Lean Beef & Sweet Potato', 'Lean beef with roasted sweet potato and steamed greens', 14.50, '/images/meal-beef-sweet-potato.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lean Beef & Sweet Potato');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'meal', 'Chicken Avocado Plate', 'Grilled chicken, avocado and a crisp garden salad', 13.00, '/images/meal-chicken-avocado.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chicken Avocado Plate');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'meal', 'Tuna & Brown Rice Box', 'Tuna, brown rice, edamame and crunchy vegetables', 12.50, '/images/meal-tuna-rice.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tuna & Brown Rice Box');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'meal', 'Lentil & Veggie Protein Bowl', 'Warm lentils with roasted vegetables and fresh herbs', 10.50, '/images/meal-lentil-veg.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Lentil & Veggie Protein Bowl');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'meal', 'Berry Protein Oats', 'Creamy oats topped with berries, seeds and yoghurt', 8.50, '/images/meal-protein-oats.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Berry Protein Oats');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Orange Sunrise', 'Freshly pressed orange juice', 4.00, '/images/juice-orange-sunrise.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Orange Sunrise');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Green Garden Juice', 'Apple, cucumber, spinach and lemon', 4.75, '/images/juice-green-garden.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Green Garden Juice');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Berry Blast', 'A bright blend of strawberries, blueberries and apple', 5.00, '/images/juice-berry-blast.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Berry Blast');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Pineapple Mint', 'Pineapple juice with a refreshing touch of mint', 4.75, '/images/juice-pineapple-mint.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pineapple Mint');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Carrot Ginger', 'Carrot and apple juice with fresh ginger', 4.25, '/images/juice-carrot-ginger.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Carrot Ginger');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Mango Turmeric', 'Sweet mango with orange and a hint of turmeric', 5.00, '/images/alternate-juice-4.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mango Turmeric');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Watermelon Lime', 'Juicy watermelon balanced with fresh lime', 4.50, '/images/alternate-juice-3.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Watermelon Lime');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Apple Celery Press', 'Crisp green apple, celery and lemon', 4.50, '/images/juice-blueberry-breeze.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Apple Celery Press');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Grapefruit Citrus', 'Pink grapefruit and orange, freshly squeezed', 4.75, '/images/alternate-juice-1.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Grapefruit Citrus');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'juice', 'Blueberry Breeze', 'Blueberries blended with apple and a splash of lemon', 5.00, '/images/alternate-juice-2.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Blueberry Breeze');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'dessert', 'Chocolate Drip Cake', 'Rich chocolate cake finished with smooth chocolate icing', 5.50, '/images/dessert-chocolate-cake.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chocolate Drip Cake');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'dessert', 'Fudgy Chocolate Brownie', 'Soft-centered chocolate brownie with a cocoa finish', 4.00, '/images/dessert-brownie.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Fudgy Chocolate Brownie');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'dessert', 'Strawberry Yogurt Parfait', 'Creamy yogurt layered with fresh strawberries', 4.50, '/images/dessert-yogurt-berry.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Strawberry Yogurt Parfait');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'dessert', 'Cookies & Cream Sundae', 'Creamy chocolate dessert topped with cookie pieces', 5.00, '/images/dessert-ice-cream.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Cookies & Cream Sundae');

INSERT INTO products (category, name, description, price, image_url)
SELECT 'dessert', 'Caramel Brownie Sundae', 'A brownie and ice cream dessert drizzled with caramel', 5.25, '/images/dessert-caramel-sundae.jpg'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Caramel Brownie Sundae');
