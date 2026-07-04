-- Migration: 001_create_roles_table.up.sql
-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- Trigger for updated_at
CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Seed default roles
INSERT INTO roles (name, description) VALUES
    ('admin', 'Administrator with full access'),
    ('moderator', 'Moderator with limited admin access'),
    ('user', 'Regular user')
ON CONFLICT (name) DO NOTHING;
