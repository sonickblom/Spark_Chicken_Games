-- Migration: 009_create_game_tags_table.up.sql
-- Create game_tags junction table
CREATE TABLE IF NOT EXISTS game_tags (
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, tag_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_tags_game_id ON game_tags(game_id);
CREATE INDEX IF NOT EXISTS idx_game_tags_tag_id ON game_tags(tag_id);
