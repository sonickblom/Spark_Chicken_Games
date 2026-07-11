package leaderboards

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LeaderboardEntry struct {
	Rank      int       `json:"rank"`
	UserID    uuid.UUID `json:"user_id"`
	Username  string    `json:"username"`
	AvatarURL *string   `json:"avatar_url,omitempty"`
	Score     int64     `json:"score"`
	GameID    uuid.UUID `json:"game_id,omitempty"`
}

type LeaderboardFilters struct {
	GameID   *uuid.UUID
	Period   string // "daily", "weekly", "monthly", "all_time"
	Page     int
	PageSize int
}

type LeaderboardRepository interface {
	GetGlobalLeaderboard(ctx context.Context, filters LeaderboardFilters) ([]*LeaderboardEntry, int64, error)
	GetGameLeaderboard(ctx context.Context, gameID uuid.UUID, filters LeaderboardFilters) ([]*LeaderboardEntry, int64, error)
	GetUserRank(ctx context.Context, userID uuid.UUID, gameID *uuid.UUID) (int64, error)
	UpsertScore(ctx context.Context, userID, gameID uuid.UUID, score int64) error
}

type leaderboardRepository struct {
	db *pgxpool.Pool
}

func NewLeaderboardRepository(db *pgxpool.Pool) LeaderboardRepository {
	return &leaderboardRepository{db: db}
}

func (r *leaderboardRepository) GetGlobalLeaderboard(ctx context.Context, filters LeaderboardFilters) ([]*LeaderboardEntry, int64, error) {
	countQuery := `SELECT COUNT(DISTINCT user_id) FROM leaderboard_scores`
	var total int64
	if err := r.db.QueryRow(ctx, countQuery).Scan(&total); err != nil {
		return nil, 0, err
	}

	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	offset := (filters.Page - 1) * filters.PageSize
	if offset < 0 {
		offset = 0
	}

	query := `
		SELECT ROW_NUMBER() OVER (ORDER BY SUM(score) DESC) as rank,
		       ls.user_id, u.username, u.avatar_url, SUM(ls.score) as total_score
		FROM leaderboard_scores ls
		JOIN users u ON ls.user_id = u.id
		GROUP BY ls.user_id, u.username, u.avatar_url
		ORDER BY total_score DESC
		LIMIT $1 OFFSET $2
	`
	rows, err := r.db.Query(ctx, query, filters.PageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var entries []*LeaderboardEntry
	for rows.Next() {
		e := &LeaderboardEntry{}
		if err := rows.Scan(&e.Rank, &e.UserID, &e.Username, &e.AvatarURL, &e.Score); err != nil {
			return nil, 0, err
		}
		entries = append(entries, e)
	}
	return entries, total, nil
}

func (r *leaderboardRepository) GetGameLeaderboard(ctx context.Context, gameID uuid.UUID, filters LeaderboardFilters) ([]*LeaderboardEntry, int64, error) {
	countQuery := `SELECT COUNT(*) FROM leaderboard_scores WHERE game_id = $1`
	var total int64
	if err := r.db.QueryRow(ctx, countQuery, gameID).Scan(&total); err != nil {
		return nil, 0, err
	}

	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	offset := (filters.Page - 1) * filters.PageSize
	if offset < 0 {
		offset = 0
	}

	query := `
		SELECT ROW_NUMBER() OVER (ORDER BY ls.score DESC) as rank,
		       ls.user_id, u.username, u.avatar_url, ls.score, ls.game_id
		FROM leaderboard_scores ls
		JOIN users u ON ls.user_id = u.id
		WHERE ls.game_id = $1
		ORDER BY ls.score DESC
		LIMIT $2 OFFSET $3
	`
	rows, err := r.db.Query(ctx, query, gameID, filters.PageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var entries []*LeaderboardEntry
	for rows.Next() {
		e := &LeaderboardEntry{}
		if err := rows.Scan(&e.Rank, &e.UserID, &e.Username, &e.AvatarURL, &e.Score, &e.GameID); err != nil {
			return nil, 0, err
		}
		entries = append(entries, e)
	}
	return entries, total, nil
}

func (r *leaderboardRepository) GetUserRank(ctx context.Context, userID uuid.UUID, gameID *uuid.UUID) (int64, error) {
	var query string
	var rank int64

	if gameID != nil {
		query = `
			SELECT COUNT(*) + 1 FROM leaderboard_scores
			WHERE game_id = $2 AND score > (
				SELECT COALESCE(score, 0) FROM leaderboard_scores WHERE user_id = $1 AND game_id = $2 LIMIT 1
			)
		`
		if err := r.db.QueryRow(ctx, query, userID, *gameID).Scan(&rank); err != nil {
			return 0, err
		}
	} else {
		query = `
			SELECT COUNT(*) + 1 FROM (
				SELECT user_id, SUM(score) as total FROM leaderboard_scores GROUP BY user_id
			) sub WHERE total > (
				SELECT COALESCE(SUM(score), 0) FROM leaderboard_scores WHERE user_id = $1
			)
		`
		if err := r.db.QueryRow(ctx, query, userID).Scan(&rank); err != nil {
			return 0, err
		}
	}
	return rank, nil
}

func (r *leaderboardRepository) UpsertScore(ctx context.Context, userID, gameID uuid.UUID, score int64) error {
	query := fmt.Sprintf(`
		INSERT INTO leaderboard_scores (user_id, game_id, score)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, game_id) DO UPDATE
		SET score = GREATEST(leaderboard_scores.score, $3), updated_at = NOW()
	`)
	_, err := r.db.Exec(ctx, query, userID, gameID, score)
	return err
}
