-- Migration: 025_seed_development_data.up.sql
-- Development seed data for browsing and smoke tests.

INSERT INTO categories (slug, name, description) VALUES
    ('arcade', 'Arcade', 'Fast games focused on score chasing.'),
    ('puzzle', 'Puzzle', 'Logic games and brain teasers.'),
    ('multiplayer', 'Multiplayer', 'Games designed for more than one player.')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tags (slug, name) VALUES
    ('quick-play', 'Quick Play'),
    ('family-friendly', 'Family Friendly'),
    ('competitive', 'Competitive')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO games (
    slug,
    title,
    description,
    short_description,
    game_url,
    platform,
    status,
    is_featured,
    is_new,
    is_popular,
    published_at
) VALUES (
    'spark-runner',
    'Spark Runner',
    'A lightweight demo game used as development seed data.',
    'A quick demo runner for local development.',
    'https://example.com/games/spark-runner',
    'web',
    'published',
    true,
    true,
    true,
    NOW()
)
ON CONFLICT (slug) DO NOTHING;
