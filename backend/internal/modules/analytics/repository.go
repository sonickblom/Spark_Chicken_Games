package analytics

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type GameAnalytics struct {
	GameID       uuid.UUID `json:"game_id"`
	TotalPlays   int64     `json:"total_plays"`
	UniquePlayers int64    `json:"unique_players"`
	AvgPlayTime  float64   `json:"avg_play_time_seconds"`
	RatingAvg    float64   `json:"rating_avg"`
	RatingCount  int64     `json:"rating_count"`
	FavoriteCount int64    `json:"favorite_count"`
	Date         string    `json:"date,omitempty"`
}

type UserAnalytics struct {
	UserID        uuid.UUID `json:"user_id"`
	TotalPlays    int64     `json:"total_plays"`
	TotalPlayTime int64     `json:"total_play_time_seconds"`
	GamesPlayed   int64     `json:"games_played"`
	FavoriteCount int64     `json:"favorite_count"`
	ReviewCount   int64     `json:"review_count"`
}

type PlatformAnalytics struct {
	TotalUsers       int64   `json:"total_users"`
	ActiveUsers      int64   `json:"active_users"`
	TotalGames       int64   `json:"total_games"`
	TotalPlays       int64   `json:"total_plays"`
	AvgSessionLength float64 `json:"avg_session_length_seconds"`
}

type AnalyticsFilters struct {
	StartDate *time.Time
	EndDate   *time.Time
	Period    string
}

type AnalyticsRepository interface {
	GetGameAnalytics(ctx context.Context, gameID uuid.UUID, filters AnalyticsFilters) (*GameAnalytics, error)
	GetUserAnalytics(ctx context.Context, userID uuid.UUID) (*UserAnalytics, error)
	GetPlatformAnalytics(ctx context.Context, filters AnalyticsFilters) (*PlatformAnalytics, error)
	GetTopGames(ctx context.Context, limit int, metric string) ([]*GameAnalytics, error)
}

type analyticsRepository struct {
	db *pgxpool.Pool
}

func NewAnalyticsRepository(db *pgxpool.Pool) AnalyticsRepository {
	return &analyticsRepository{db: db}
}

func (r *analyticsRepository) GetGameAnalytics(ctx context.Context, gameID uuid.UUID, filters AnalyticsFilters) (*GameAnalytics, error) {
	query := `
		SELECT g.id,
		       COUNT(ph.id) as total_plays,
		       COUNT(DISTINCT ph.user_id) as unique_players,
		       COALESCE(AVG(ph.duration_seconds), 0) as avg_play_time,
		       COALESCE(g.rating_avg, 0) as rating_avg,
		       COUNT(DISTINCT rv.id) as rating_count,
		       COUNT(DISTINCT f.id) as favorite_count
		FROM games g
		LEFT JOIN play_history ph ON g.id = ph.game_id
		LEFT JOIN reviews rv ON g.id = rv.game_id
		LEFT JOIN favorites f ON g.id = f.game_id
		WHERE g.id = $1
		GROUP BY g.id
	`
	ga := &GameAnalytics{}
	err := r.db.QueryRow(ctx, query, gameID).Scan(
		&ga.GameID, &ga.TotalPlays, &ga.UniquePlayers,
		&ga.AvgPlayTime, &ga.RatingAvg, &ga.RatingCount, &ga.FavoriteCount,
	)
	if err != nil {
		return nil, err
	}
	return ga, nil
}

func (r *analyticsRepository) GetUserAnalytics(ctx context.Context, userID uuid.UUID) (*UserAnalytics, error) {
	query := `
		SELECT u.id,
		       COUNT(ph.id) as total_plays,
		       COALESCE(SUM(ph.duration_seconds), 0) as total_play_time,
		       COUNT(DISTINCT ph.game_id) as games_played,
		       COUNT(DISTINCT f.id) as favorite_count,
		       COUNT(DISTINCT rv.id) as review_count
		FROM users u
		LEFT JOIN play_history ph ON u.id = ph.user_id
		LEFT JOIN favorites f ON u.id = f.user_id
		LEFT JOIN reviews rv ON u.id = rv.user_id
		WHERE u.id = $1
		GROUP BY u.id
	`
	ua := &UserAnalytics{}
	err := r.db.QueryRow(ctx, query, userID).Scan(
		&ua.UserID, &ua.TotalPlays, &ua.TotalPlayTime,
		&ua.GamesPlayed, &ua.FavoriteCount, &ua.ReviewCount,
	)
	if err != nil {
		return nil, err
	}
	return ua, nil
}

func (r *analyticsRepository) GetPlatformAnalytics(ctx context.Context, filters AnalyticsFilters) (*PlatformAnalytics, error) {
	query := `
		SELECT
		  (SELECT COUNT(*) FROM users) as total_users,
		  (SELECT COUNT(*) FROM users WHERE last_login_at > NOW() - INTERVAL '30 days') as active_users,
		  (SELECT COUNT(*) FROM games WHERE status = 'published') as total_games,
		  (SELECT COUNT(*) FROM play_history) as total_plays,
		  (SELECT COALESCE(AVG(duration_seconds), 0) FROM play_history) as avg_session_length
	`
	pa := &PlatformAnalytics{}
	err := r.db.QueryRow(ctx, query).Scan(
		&pa.TotalUsers, &pa.ActiveUsers, &pa.TotalGames,
		&pa.TotalPlays, &pa.AvgSessionLength,
	)
	if err != nil {
		return nil, err
	}
	return pa, nil
}

func (r *analyticsRepository) GetTopGames(ctx context.Context, limit int, metric string) ([]*GameAnalytics, error) {
	orderCol := "total_plays"
	switch metric {
	case "rating":
		orderCol = "rating_avg"
	case "favorites":
		orderCol = "favorite_count"
	}

	query := `
		SELECT g.id,
		       COUNT(ph.id) as total_plays,
		       COUNT(DISTINCT ph.user_id) as unique_players,
		       COALESCE(AVG(ph.duration_seconds), 0) as avg_play_time,
		       COALESCE(g.rating_avg, 0) as rating_avg,
		       COUNT(DISTINCT rv.id) as rating_count,
		       COUNT(DISTINCT f.id) as favorite_count
		FROM games g
		LEFT JOIN play_history ph ON g.id = ph.game_id
		LEFT JOIN reviews rv ON g.id = rv.game_id
		LEFT JOIN favorites f ON g.id = f.game_id
		WHERE g.status = 'published'
		GROUP BY g.id
		ORDER BY ` + orderCol + ` DESC
		LIMIT $1
	`
	rows, err := r.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*GameAnalytics
	for rows.Next() {
		ga := &GameAnalytics{}
		if err := rows.Scan(
			&ga.GameID, &ga.TotalPlays, &ga.UniquePlayers,
			&ga.AvgPlayTime, &ga.RatingAvg, &ga.RatingCount, &ga.FavoriteCount,
		); err != nil {
			return nil, err
		}
		results = append(results, ga)
	}
	return results, nil
}
