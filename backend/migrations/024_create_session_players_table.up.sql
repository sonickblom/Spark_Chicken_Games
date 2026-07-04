-- Migration: 024_create_session_players_table.up.sql
-- Create session_players table
CREATE TABLE IF NOT EXISTS session_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    left_at TIMESTAMPTZ,
    UNIQUE (session_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_session_players_session_id ON session_players(session_id);
CREATE INDEX IF NOT EXISTS idx_session_players_user_id ON session_players(user_id);
CREATE INDEX IF NOT EXISTS idx_session_players_joined_at ON session_players(joined_at);
