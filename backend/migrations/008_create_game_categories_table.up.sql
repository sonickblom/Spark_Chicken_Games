-- Migration: 008_create_game_categories_table.up.sql
-- Create game_categories junction table
CREATE TABLE IF NOT EXISTS game_categories (
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, category_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_game_categories_game_id ON game_categories(game_id);
CREATE INDEX IF NOT EXISTS idx_game_categories_category_id ON game_categories(category_id);
