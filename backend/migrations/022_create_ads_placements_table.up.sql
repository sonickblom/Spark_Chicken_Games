-- Migration: 022_create_ads_placements_table.up.sql
-- Create ads_placements table
CREATE TABLE IF NOT EXISTS ads_placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ads_placements_code ON ads_placements(code);
CREATE INDEX IF NOT EXISTS idx_ads_placements_position ON ads_placements(position);
CREATE INDEX IF NOT EXISTS idx_ads_placements_is_active ON ads_placements(is_active);

-- Trigger for updated_at
CREATE TRIGGER update_ads_placements_updated_at
    BEFORE UPDATE ON ads_placements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Check constraint for position
ALTER TABLE ads_placements ADD CONSTRAINT chk_ads_placements_position
    CHECK (position IN ('header', 'sidebar', 'footer', 'inline', 'interstitial', 'rewarded'));
