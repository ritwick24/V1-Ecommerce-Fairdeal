-- Database Schema for Wholesale Electronics Platform

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    images TEXT[], -- Array of image URLs
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product pricing tiers
CREATE TABLE product_prices (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER, -- NULL means unlimited
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order logs for WhatsApp orders
CREATE TABLE orders_log (
    id SERIAL PRIMARY KEY,
    products JSONB NOT NULL, -- Store product details as JSON
    quantities JSONB NOT NULL, -- Store quantities as JSON
    total_price DECIMAL(10,2) NOT NULL,
    user_contact VARCHAR(255),
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Users table for future enhancements
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Server-side cart storage
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_product_prices_product_id ON product_prices(product_id);
CREATE INDEX idx_orders_log_created_at ON orders_log(created_at);

-- Sample data insertion
INSERT INTO categories (name, slug, image) VALUES
('Mobile Phones', 'mobiles', '/placeholder.svg?height=200&width=200'),
('Laptops', 'laptops', '/placeholder.svg?height=200&width=200'),
('Tablets', 'tablets', '/placeholder.svg?height=200&width=200'),
('Accessories', 'accessories', '/placeholder.svg?height=200&width=200'),
('Smart Watches', 'smartwatches', '/placeholder.svg?height=200&width=200'),
('Audio Devices', 'audio', '/placeholder.svg?height=200&width=200');

-- Sample products
INSERT INTO products (name, slug, description, images, category_id, stock) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system', 
 ARRAY['/placeholder.svg?height=600&width=600'], 1, 50),
('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Premium Android flagship with S Pen, 200MP camera, and AI features',
 ARRAY['/placeholder.svg?height=600&width=600'], 1, 35),
('MacBook Pro 16"', 'macbook-pro-16', 'Professional laptop with M3 Pro chip, Liquid Retina XDR display',
 ARRAY['/placeholder.svg?height=600&width=600'], 2, 20),
('AirPods Pro 2', 'airpods-pro-2', 'Premium wireless earbuds with active noise cancellation',
 ARRAY['/placeholder.svg?height=600&width=600'], 4, 100);

-- Sample pricing tiers
INSERT INTO product_prices (product_id, min_quantity, max_quantity, price) VALUES
-- iPhone 15 Pro pricing
(1, 1, 5, 89000),
(1, 6, 15, 87000),
(1, 16, 30, 85000),
(1, 31, NULL, 83000),
-- Samsung Galaxy S24 Ultra pricing
(2, 1, 5, 78000),
(2, 6, 15, 76000),
(2, 16, 30, 75000),
(2, 31, NULL, 73000),
-- MacBook Pro 16" pricing
(3, 1, 3, 185000),
(3, 4, 10, 182000),
(3, 11, 20, 180000),
(3, 21, NULL, 178000),
-- AirPods Pro 2 pricing
(4, 1, 10, 19000),
(4, 11, 25, 18500),
(4, 26, 50, 18000),
(4, 51, NULL, 17500);
