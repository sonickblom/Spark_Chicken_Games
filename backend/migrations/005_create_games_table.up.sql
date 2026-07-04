-- Migration: 005_create_games_table.up.sql
-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    thumbnail_url TEXT,
    banner_url TEXT,
    game_url TEXT,
    embed_url TEXT,
    platform VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_new BOOLEAN NOT NULL DEFAULT FALSE,
    is_popular BOOLEAN NOT NULL DEFAULT FALSE,
    play_count BIGINT NOT NULL DEFAULT 0,
    rating_avg NUMERIC(3,2) NOT NULL DEFAULT 0.00,
    rating_count INT NOT NULL DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_games_slug ON games(slug);
CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_is_featured ON games(is_featured);
CREATE INDEX IF NOT EXISTS idx_games_is_new ON games(is_new);
CREATE INDEX IF NOT EXISTS idx_games_is_popular ON games(is_popular);
CREATE INDEX IF NOT EXISTS idx_games_published_at ON games(published_at);
CREATE INDEX IF NOT EXISTS idx_games_rating_avg ON games(rating_avg DESC);
CREATE INDEX IF NOT EXISTS idx_games_play_count ON games(play_count DESC);

-- Trigger for updated_at
CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Status check constraint
ALTER TABLE games ADD CONSTRAINT chk_games_status
    CHECK (status IN ('draft', 'published', 'archived', 'hidden'));
ALTER TABLE games ADD CONSTRAINT chk_games_rating_avg
    CHECK (rating_avg >= 0 AND rating_avg <= 5);
ALTER TABLE games ADD CONSTRAINT chk_games_rating_count
    CHECK (rating_count >= 0);
