package ads

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AdType string

const (
	AdTypeBanner       AdType = "banner"
	AdTypeInterstitial AdType = "interstitial"
	AdTypeRewarded     AdType = "rewarded"
	AdTypeNative       AdType = "native"
)

type AdStatus string

const (
	AdStatusActive   AdStatus = "active"
	AdStatusInactive AdStatus = "inactive"
	AdStatusArchived AdStatus = "archived"
)

type Ad struct {
	ID          uuid.UUID  `json:"id"`
	Title       string     `json:"title"`
	Type        AdType     `json:"type"`
	Status      AdStatus   `json:"status"`
	ImageURL    *string    `json:"image_url,omitempty"`
	TargetURL   *string    `json:"target_url,omitempty"`
	Description *string    `json:"description,omitempty"`
	Priority    int        `json:"priority"`
	StartsAt    *time.Time `json:"starts_at,omitempty"`
	EndsAt      *time.Time `json:"ends_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
}

type AdImpression struct {
	ID        uuid.UUID  `json:"id"`
	AdID      uuid.UUID  `json:"ad_id"`
	UserID    *uuid.UUID `json:"user_id,omitempty"`
	GameID    *uuid.UUID `json:"game_id,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
}

type AdClick struct {
	ID        uuid.UUID  `json:"id"`
	AdID      uuid.UUID  `json:"ad_id"`
	UserID    *uuid.UUID `json:"user_id,omitempty"`
	CreatedAt time.Time  `json:"created_at"`
}

type CreateAdInput struct {
	Title       string     `json:"title" validate:"required,max=200"`
	Type        AdType     `json:"type" validate:"required,oneof=banner interstitial rewarded native"`
	ImageURL    *string    `json:"image_url,omitempty"`
	TargetURL   *string    `json:"target_url,omitempty"`
	Description *string    `json:"description,omitempty"`
	Priority    int        `json:"priority"`
	StartsAt    *time.Time `json:"starts_at,omitempty"`
	EndsAt      *time.Time `json:"ends_at,omitempty"`
}

type AdFilters struct {
	Type     *AdType
	Status   *AdStatus
	Page     int
	PageSize int
}

type AdRepository interface {
	Create(ctx context.Context, ad *Ad) error
	GetByID(ctx context.Context, id uuid.UUID) (*Ad, error)
	Update(ctx context.Context, ad *Ad) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filters AdFilters) ([]*Ad, int64, error)
	GetActive(ctx context.Context, adType AdType) ([]*Ad, error)
	RecordImpression(ctx context.Context, impression *AdImpression) error
	RecordClick(ctx context.Context, click *AdClick) error
	GetStats(ctx context.Context, adID uuid.UUID) (int64, int64, error) // impressions, clicks
}

type adRepository struct {
	db *pgxpool.Pool
}

func NewAdRepository(db *pgxpool.Pool) AdRepository {
	return &adRepository{db: db}
}

func (r *adRepository) Create(ctx context.Context, ad *Ad) error {
	query := `
		INSERT INTO ads (title, type, status, image_url, target_url, description, priority, starts_at, ends_at)
		VALUES ($1, $2, 'active', $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at
	`
	return r.db.QueryRow(ctx, query,
		ad.Title, ad.Type, ad.ImageURL, ad.TargetURL, ad.Description,
		ad.Priority, ad.StartsAt, ad.EndsAt,
	).Scan(&ad.ID, &ad.CreatedAt)
}

func (r *adRepository) GetByID(ctx context.Context, id uuid.UUID) (*Ad, error) {
	query := `
		SELECT id, title, type, status, image_url, target_url, description,
		       priority, starts_at, ends_at, created_at
		FROM ads WHERE id = $1
	`
	ad := &Ad{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&ad.ID, &ad.Title, &ad.Type, &ad.Status, &ad.ImageURL, &ad.TargetURL,
		&ad.Description, &ad.Priority, &ad.StartsAt, &ad.EndsAt, &ad.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return ad, nil
}

func (r *adRepository) Update(ctx context.Context, ad *Ad) error {
	query := `
		UPDATE ads
		SET title = $2, type = $3, status = $4, image_url = $5, target_url = $6,
		    description = $7, priority = $8, starts_at = $9, ends_at = $10
		WHERE id = $1
	`
	_, err := r.db.Exec(ctx, query,
		ad.ID, ad.Title, ad.Type, ad.Status, ad.ImageURL, ad.TargetURL,
		ad.Description, ad.Priority, ad.StartsAt, ad.EndsAt,
	)
	return err
}

func (r *adRepository) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `DELETE FROM ads WHERE id = $1`, id)
	return err
}

func (r *adRepository) List(ctx context.Context, filters AdFilters) ([]*Ad, int64, error) {
	where := `WHERE 1=1`
	args := []interface{}{}
	argIdx := 1

	if filters.Status != nil {
		where += ` AND status = $` + string(rune('0'+argIdx))
		args = append(args, *filters.Status)
		argIdx++
	}
	if filters.Type != nil {
		where += ` AND type = $` + string(rune('0'+argIdx))
		args = append(args, *filters.Type)
		argIdx++
	}

	var total int64
	if err := r.db.QueryRow(ctx, `SELECT COUNT(*) FROM ads `+where, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	offset := (filters.Page - 1) * filters.PageSize
	if offset < 0 {
		offset = 0
	}

	query := `SELECT id, title, type, status, image_url, target_url, description,
	                 priority, starts_at, ends_at, created_at
	          FROM ads ` + where + ` ORDER BY priority DESC, created_at DESC
	          LIMIT $` + string(rune('0'+argIdx)) + ` OFFSET $` + string(rune('0'+argIdx+1))
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var ads []*Ad
	for rows.Next() {
		ad := &Ad{}
		if err := rows.Scan(
			&ad.ID, &ad.Title, &ad.Type, &ad.Status, &ad.ImageURL, &ad.TargetURL,
			&ad.Description, &ad.Priority, &ad.StartsAt, &ad.EndsAt, &ad.CreatedAt,
		); err != nil {
			return nil, 0, err
		}
		ads = append(ads, ad)
	}
	return ads, total, nil
}

func (r *adRepository) GetActive(ctx context.Context, adType AdType) ([]*Ad, error) {
	query := `
		SELECT id, title, type, status, image_url, target_url, description,
		       priority, starts_at, ends_at, created_at
		FROM ads
		WHERE status = 'active' AND type = $1
		  AND (starts_at IS NULL OR starts_at <= NOW())
		  AND (ends_at IS NULL OR ends_at >= NOW())
		ORDER BY priority DESC
	`
	rows, err := r.db.Query(ctx, query, adType)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ads []*Ad
	for rows.Next() {
		ad := &Ad{}
		if err := rows.Scan(
			&ad.ID, &ad.Title, &ad.Type, &ad.Status, &ad.ImageURL, &ad.TargetURL,
			&ad.Description, &ad.Priority, &ad.StartsAt, &ad.EndsAt, &ad.CreatedAt,
		); err != nil {
			return nil, err
		}
		ads = append(ads, ad)
	}
	return ads, nil
}

func (r *adRepository) RecordImpression(ctx context.Context, impression *AdImpression) error {
	query := `INSERT INTO ad_impressions (ad_id, user_id, game_id) VALUES ($1, $2, $3) RETURNING id, created_at`
	return r.db.QueryRow(ctx, query, impression.AdID, impression.UserID, impression.GameID).
		Scan(&impression.ID, &impression.CreatedAt)
}

func (r *adRepository) RecordClick(ctx context.Context, click *AdClick) error {
	query := `INSERT INTO ad_clicks (ad_id, user_id) VALUES ($1, $2) RETURNING id, created_at`
	return r.db.QueryRow(ctx, query, click.AdID, click.UserID).
		Scan(&click.ID, &click.CreatedAt)
}

func (r *adRepository) GetStats(ctx context.Context, adID uuid.UUID) (int64, int64, error) {
	var impressions, clicks int64
	r.db.QueryRow(ctx, `SELECT COUNT(*) FROM ad_impressions WHERE ad_id = $1`, adID).Scan(&impressions)
	r.db.QueryRow(ctx, `SELECT COUNT(*) FROM ad_clicks WHERE ad_id = $1`, adID).Scan(&clicks)
	return impressions, clicks, nil
}
