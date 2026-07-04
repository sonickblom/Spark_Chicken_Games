-- Migration: 023_create_game_sessions_table.up.sql
-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    host_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'waiting',
    region VARCHAR(50),
    max_players INT NOT NULL DEFAULT 2,
    current_players INT NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_host_user_id ON game_sessions(host_user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_game_sessions_region ON game_sessions(region);

-- Check constraint for status
ALTER TABLE game_sessions ADD CONSTRAINT chk_game_sessions_status
    CHECK (status IN ('waiting', 'active', 'completed', 'cancelled'));
ALTER TABLE game_sessions ADD CONSTRAINT chk_game_sessions_players
    CHECK (current_players <= max_players AND current_players >= 0);
