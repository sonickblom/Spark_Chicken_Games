package history

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PlayHistory struct {
	ID              uuid.UUID `json:"id" db:"id"`
	UserID          uuid.UUID `json:"user_id" db:"user_id"`
	GameID          uuid.UUID `json:"game_id" db:"game_id"`
	PlayedAt        string    `json:"played_at" db:"played_at"`
	DurationSeconds int       `json:"duration_seconds" db:"duration_seconds"`
	DeviceType      *string   `json:"device_type,omitempty" db:"device_type"`
	Source          *string   `json:"source,omitempty" db:"source"`
}

type PlayHistoryWithGame struct {
	PlayHistory
	Game GameBasicInfo `json:"game"`
}

type GameBasicInfo struct {
	ID               uuid.UUID `json:"id" db:"id"`
	Slug             string    `json:"slug" db:"slug"`
	Title            string    `json:"title" db:"title"`
	ShortDescription *string   `json:"short_description,omitempty" db:"short_description"`
	ThumbnailURL     *string   `json:"thumbnail_url,omitempty" db:"thumbnail_url"`
	RatingAvg        float64   `json:"rating_avg" db:"rating_avg"`
	PlayCount        int64     `json:"play_count" db:"play_count"`
}

type CreatePlayHistoryInput struct {
	UserID          uuid.UUID `json:"user_id" validate:"required"`
	GameID          uuid.UUID `json:"game_id" validate:"required"`
	DurationSeconds int       `json:"duration_seconds" validate:"omitempty,min=0"`
	DeviceType      *string   `json:"device_type,omitempty" validate:"omitempty,max=50"`
	Source          *string   `json:"source,omitempty" validate:"omitempty,max=50"`
}

type PlayHistoryFilters struct {
	Page      int
	PageSize  int
	SortBy    string
	SortDesc  bool
	StartDate *string
	EndDate   *string
}

type PlayHistoryRepository interface {
	Create(ctx context.Context, history *PlayHistory) error
	GetByID(ctx context.Context, id uuid.UUID) (*PlayHistory, error)
	ListByUser(ctx context.Context, userID uuid.UUID, filters PlayHistoryFilters) ([]*PlayHistoryWithGame, int64, error)
	CountByUser(ctx context.Context, userID uuid.UUID) (int64, error)
	GetTotalPlayTimeByUser(ctx context.Context, userID uuid.UUID) (int64, error)
	GetGamesPlayedCountByUser(ctx context.Context, userID uuid.UUID) (int64, error)
	Delete(ctx context.Context, id uuid.UUID) error
}

type playHistoryRepository struct {
	db *pgxpool.Pool
}

func NewPlayHistoryRepository(db *pgxpool.Pool) PlayHistoryRepository {
	return &playHistoryRepository{db: db}
}

func (r *playHistoryRepository) Create(ctx context.Context, history *PlayHistory) error {
	query := `
		INSERT INTO play_history (user_id, game_id, duration_seconds, device_type, source)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, played_at
	`
	return r.db.QueryRow(ctx, query,
		history.UserID, history.GameID, history.DurationSeconds, history.DeviceType, history.Source,
	).Scan(&history.ID, &history.PlayedAt)
}

func (r *playHistoryRepository) GetByID(ctx context.Context, id uuid.UUID) (*PlayHistory, error) {
	query := `SELECT id, user_id, game_id, played_at, duration_seconds, device_type, source FROM play_history WHERE id = $1`
	history := &PlayHistory{}
	err := r.db.QueryRow(ctx, query, id).Scan(&history.ID, &history.UserID, &history.GameID, &history.PlayedAt, &history.DurationSeconds, &history.DeviceType, &history.Source)
	if err != nil {
		return nil, err
	}
	return history, nil
}

func (r *playHistoryRepository) ListByUser(ctx context.Context, userID uuid.UUID, filters PlayHistoryFilters) ([]*PlayHistoryWithGame, int64, error) {
	whereClause := `WHERE ph.user_id = $1`
	args := []interface{}{userID}
	argIndex := 2

	if filters.StartDate != nil {
		whereClause += ` AND ph.played_at >= $` + string(rune(argIndex+'0'))
		args = append(args, *filters.StartDate)
		argIndex++
	}
	if filters.EndDate != nil {
		whereClause += ` AND ph.played_at <= $` + string(rune(argIndex+'0'))
		args = append(args, *filters.EndDate)
		argIndex++
	}

	countQuery := `SELECT COUNT(*) FROM play_history ph ` + whereClause
	var total int64
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	orderBy := "ph.played_at DESC"
	if filters.SortBy != "" {
		allowedSorts := map[string]bool{"played_at": true, "duration_seconds": true, "title": true}
		if allowedSorts[filters.SortBy] {
			order := "ASC"
			if filters.SortDesc {
				order = "DESC"
			}
			if filters.SortBy == "title" {
				orderBy = "g.title " + order
			} else {
				orderBy = "ph." + filters.SortBy + " " + order
			}
		}
	}

	offset := (filters.Page - 1) * filters.PageSize
	if offset < 0 {
		offset = 0
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}

	query := `
		SELECT ph.id, ph.user_id, ph.game_id, ph.played_at, ph.duration_seconds, ph.device_type, ph.source,
		       g.id, g.slug, g.title, g.short_description, g.thumbnail_url, g.rating_avg, g.play_count
		FROM play_history ph
		JOIN games g ON ph.game_id = g.id
		` + whereClause + `
		ORDER BY ` + orderBy + ` LIMIT $` + string(rune(argIndex+'0')) + ` OFFSET $` + string(rune(argIndex+1+'0'))
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var historyList []*PlayHistoryWithGame
	for rows.Next() {
		h := &PlayHistoryWithGame{}
		err := rows.Scan(
			&h.ID, &h.UserID, &h.GameID, &h.PlayedAt, &h.DurationSeconds, &h.DeviceType, &h.Source,
			&h.Game.ID, &h.Game.Slug, &h.Game.Title, &h.Game.ShortDescription, &h.Game.ThumbnailURL, &h.Game.RatingAvg, &h.Game.PlayCount,
		)
		if err != nil {
			return nil, 0, err
		}
		historyList = append(historyList, h)
	}
	return historyList, total, nil
}

func (r *playHistoryRepository) CountByUser(ctx context.Context, userID uuid.UUID) (int64, error) {
	query := `SELECT COUNT(*) FROM play_history WHERE user_id = $1`
	var count int64
	err := r.db.QueryRow(ctx, query, userID).Scan(&count)
	return count, err
}

func (r *playHistoryRepository) GetTotalPlayTimeByUser(ctx context.Context, userID uuid.UUID) (int64, error) {
	query := `SELECT COALESCE(SUM(duration_seconds), 0) FROM play_history WHERE user_id = $1`
	var totalSeconds int64
	err := r.db.QueryRow(ctx, query, userID).Scan(&totalSeconds)
	return totalSeconds, err
}

func (r *playHistoryRepository) GetGamesPlayedCountByUser(ctx context.Context, userID uuid.UUID) (int64, error) {
	query := `SELECT COUNT(DISTINCT game_id) FROM play_history WHERE user_id = $1`
	var count int64
	err := r.db.QueryRow(ctx, query, userID).Scan(&count)
	return count, err
}

func (r *playHistoryRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM play_history WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}
