package recommendations

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type RecommendedGame struct {
	ID               uuid.UUID `json:"id"`
	Slug             string    `json:"slug"`
	Title            string    `json:"title"`
	ShortDescription *string   `json:"short_description,omitempty"`
	ThumbnailURL     *string   `json:"thumbnail_url,omitempty"`
	RatingAvg        float64   `json:"rating_avg"`
	PlayCount        int64     `json:"play_count"`
	Score            float64   `json:"score"` // recommendation score
}

type RecommendationRepository interface {
	GetPersonalized(ctx context.Context, userID uuid.UUID, limit int) ([]*RecommendedGame, error)
	GetSimilar(ctx context.Context, gameID uuid.UUID, limit int) ([]*RecommendedGame, error)
	GetTrending(ctx context.Context, limit int) ([]*RecommendedGame, error)
	GetNewReleases(ctx context.Context, limit int) ([]*RecommendedGame, error)
}

type recommendationRepository struct {
	db *pgxpool.Pool
}

func NewRecommendationRepository(db *pgxpool.Pool) RecommendationRepository {
	return &recommendationRepository{db: db}
}

func (r *recommendationRepository) GetPersonalized(ctx context.Context, userID uuid.UUID, limit int) ([]*RecommendedGame, error) {
	// Content-based: recommend games from categories the user has played
	query := `
		SELECT DISTINCT g.id, g.slug, g.title, g.short_description, g.thumbnail_url,
		       g.rating_avg, g.play_count,
		       (g.rating_avg * 0.4 + LOG(g.play_count + 1) * 0.3 + 0.3) as score
		FROM games g
		JOIN game_categories gc ON g.id = gc.game_id
		WHERE gc.category_id IN (
			SELECT DISTINCT gc2.category_id
			FROM play_history ph
			JOIN game_categories gc2 ON ph.game_id = gc2.game_id
			WHERE ph.user_id = $1
		)
		AND g.status = 'published'
		AND g.id NOT IN (
			SELECT game_id FROM play_history WHERE user_id = $1
		)
		AND g.id NOT IN (
			SELECT game_id FROM favorites WHERE user_id = $1
		)
		ORDER BY score DESC
		LIMIT $2
	`
	return r.scanGames(ctx, query, userID, limit)
}

func (r *recommendationRepository) GetSimilar(ctx context.Context, gameID uuid.UUID, limit int) ([]*RecommendedGame, error) {
	query := `
		SELECT DISTINCT g.id, g.slug, g.title, g.short_description, g.thumbnail_url,
		       g.rating_avg, g.play_count,
		       (g.rating_avg * 0.5 + LOG(g.play_count + 1) * 0.5) as score
		FROM games g
		JOIN game_categories gc ON g.id = gc.game_id
		WHERE gc.category_id IN (
			SELECT category_id FROM game_categories WHERE game_id = $1
		)
		AND g.id != $1
		AND g.status = 'published'
		ORDER BY score DESC
		LIMIT $2
	`
	return r.scanGames(ctx, query, gameID, limit)
}

func (r *recommendationRepository) GetTrending(ctx context.Context, limit int) ([]*RecommendedGame, error) {
	query := `
		SELECT g.id, g.slug, g.title, g.short_description, g.thumbnail_url,
		       g.rating_avg, g.play_count,
		       COUNT(ph.id) as recent_plays
		FROM games g
		LEFT JOIN play_history ph ON g.id = ph.game_id
		  AND ph.played_at > NOW() - INTERVAL '7 days'
		WHERE g.status = 'published'
		GROUP BY g.id
		ORDER BY recent_plays DESC, g.rating_avg DESC
		LIMIT $1
	`
	rows, err := r.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var games []*RecommendedGame
	for rows.Next() {
		g := &RecommendedGame{}
		var recentPlays int64
		if err := rows.Scan(&g.ID, &g.Slug, &g.Title, &g.ShortDescription, &g.ThumbnailURL, &g.RatingAvg, &g.PlayCount, &recentPlays); err != nil {
			return nil, err
		}
		g.Score = float64(recentPlays)
		games = append(games, g)
	}
	return games, nil
}

func (r *recommendationRepository) GetNewReleases(ctx context.Context, limit int) ([]*RecommendedGame, error) {
	query := `
		SELECT g.id, g.slug, g.title, g.short_description, g.thumbnail_url,
		       g.rating_avg, g.play_count,
		       EXTRACT(EPOCH FROM (NOW() - g.created_at)) as age_seconds
		FROM games g
		WHERE g.status = 'published'
		ORDER BY g.created_at DESC
		LIMIT $1
	`
	rows, err := r.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var games []*RecommendedGame
	for rows.Next() {
		g := &RecommendedGame{}
		var ageSeconds float64
		if err := rows.Scan(&g.ID, &g.Slug, &g.Title, &g.ShortDescription, &g.ThumbnailURL, &g.RatingAvg, &g.PlayCount, &ageSeconds); err != nil {
			return nil, err
		}
		g.Score = 1.0 / (ageSeconds + 1)
		games = append(games, g)
	}
	return games, nil
}

func (r *recommendationRepository) scanGames(ctx context.Context, query string, arg interface{}, limit int) ([]*RecommendedGame, error) {
	rows, err := r.db.Query(ctx, query, arg, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var games []*RecommendedGame
	for rows.Next() {
		g := &RecommendedGame{}
		if err := rows.Scan(&g.ID, &g.Slug, &g.Title, &g.ShortDescription, &g.ThumbnailURL, &g.RatingAvg, &g.PlayCount, &g.Score); err != nil {
			return nil, err
		}
		games = append(games, g)
	}
	return games, nil
}
