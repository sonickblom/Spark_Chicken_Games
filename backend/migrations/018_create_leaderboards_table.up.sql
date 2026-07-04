-- Migration: 018_create_leaderboards_table.up.sql
-- Create leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score BIGINT NOT NULL,
    rank_position INT,
    season VARCHAR(50),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leaderboards_game_id ON leaderboards(game_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_user_id ON leaderboards(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboards_score ON leaderboards(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_game_score ON leaderboards(game_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboards_game_season ON leaderboards(game_id, season);
CREATE INDEX IF NOT EXISTS idx_leaderboards_updated_at ON leaderboards(updated_at DESC);

-- Unique constraint for one entry per user per game per season
CREATE UNIQUE INDEX IF NOT EXISTS uniq_leaderboard_user_game_season
    ON leaderboards(user_id, game_id, COALESCE(season, ''));

-- Trigger for updated_at
CREATE TRIGGER update_leaderboards_updated_at
    BEFORE UPDATE ON leaderboards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
