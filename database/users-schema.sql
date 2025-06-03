-- Create users table with hashed passwords
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a default admin user with bcrypt hashed password
-- Default: username: admin, password: Password@123
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$3euPcmQFCiblsZeEu5s7p.9wdgpt0ggx0KzTCmqTwNvOykLB1DnzW')
ON CONFLICT (username) DO NOTHING;
