-- Migration: 015_create_matchmaking_queue_table.up.sql
-- Create matchmaking_queue table
CREATE TABLE IF NOT EXISTS matchmaking_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    skill_level INT,
    region VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'waiting',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_user_id ON matchmaking_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_game_id ON matchmaking_queue(game_id);
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_status ON matchmaking_queue(status);
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_created_at ON matchmaking_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_matchmaking_queue_user_game ON matchmaking_queue(user_id, game_id);
