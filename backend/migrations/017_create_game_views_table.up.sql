-- Migration: 017_create_game_views_table.up.sql
-- Create game_views table
CREATE TABLE IF NOT EXISTS game_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    referrer TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_views_user_id ON game_views(user_id);
CREATE INDEX IF NOT EXISTS idx_game_views_game_id ON game_views(game_id);
CREATE INDEX IF NOT EXISTS idx_game_views_viewed_at ON game_views(viewed_at DESC);
