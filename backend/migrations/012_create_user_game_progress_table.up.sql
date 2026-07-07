-- Migration: 012_create_user_game_progress_table.up.sql
-- Create user_game_progress table
CREATE TABLE IF NOT EXISTS user_game_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    progress_data JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, game_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_game_progress_user_id ON user_game_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_game_progress_game_id ON user_game_progress(game_id);
CREATE INDEX IF NOT EXISTS idx_user_game_progress_updated_at ON user_game_progress(updated_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_user_game_progress_updated_at
    BEFORE UPDATE ON user_game_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
