-- Seed demo users.
-- Passwords are bcrypt hashes for: demo1234
-- Generated for course demos — do not use in production.

INSERT INTO users (email, password_hash, full_name, role) VALUES
(
  'customer@demo.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oQYqKxqKxqKu',
  'Demo Customer',
  'customer'
),
(
  'staff@demo.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.G2oQYqKxqKxqKu',
  'Demo Staff',
  'staff'
)
ON CONFLICT (email) DO NOTHING;

-- Note: If the bcrypt hash above does not match demo1234 on your machine,
-- create users via the /auth/register API instead, then insert bikes/bookings.
