package games

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Game struct {
	ID              uuid.UUID  `json:"id" db:"id"`
	Slug            string     `json:"slug" db:"slug"`
	Title           string     `json:"title" db:"title"`
	Description     string     `json:"description" db:"description"`
	ShortDescription *string   `json:"short_description,omitempty" db:"short_description"`
	ThumbnailURL    *string    `json:"thumbnail_url,omitempty" db:"thumbnail_url"`
	BannerURL       *string    `json:"banner_url,omitempty" db:"banner_url"`
	GameURL         string     `json:"game_url" db:"game_url"`
	EmbedURL        *string    `json:"embed_url,omitempty" db:"embed_url"`
	Platform        *string    `json:"platform,omitempty" db:"platform"`
	Status          string     `json:"status" db:"status"`
	IsFeatured      bool       `json:"is_featured" db:"is_featured"`
	IsNew           bool       `json:"is_new" db:"is_new"`
	IsPopular       bool       `json:"is_popular" db:"is_popular"`
	PlayCount       int64      `json:"play_count" db:"play_count"`
	RatingAvg       float64    `json:"rating_avg" db:"rating_avg"`
	RatingCount     int        `json:"rating_count" db:"rating_count"`
	PublishedAt     *time.Time `json:"published_at,omitempty" db:"published_at"`
	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at" db:"updated_at"`
}

type GameWithRelations struct {
	Game
	Categories []Category `json:"categories,omitempty"`
	Tags       []Tag      `json:"tags,omitempty"`
}

type Category struct {
	ID          uuid.UUID `json:"id" db:"id"`
	Slug        string    `json:"slug" db:"slug"`
	Name        string    `json:"name" db:"name"`
	Description *string   `json:"description,omitempty" db:"description"`
	IconURL     *string   `json:"icon_url,omitempty" db:"icon_url"`
}

type Tag struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Slug      string    `json:"slug" db:"slug"`
	Name      string    `json:"name" db:"name"`
}

type CreateGameInput struct {
	Slug            string  `json:"slug" validate:"required,min=3,max=100"`
	Title           string  `json:"title" validate:"required,min=3,max=200"`
	Description     string  `json:"description" validate:"required"`
	ShortDescription *string `json:"short_description,omitempty" validate:"omitempty,max=500"`
	ThumbnailURL    *string `json:"thumbnail_url,omitempty" validate:"omitempty,url"`
	BannerURL       *string `json:"banner_url,omitempty" validate:"omitempty,url"`
	GameURL         string  `json:"game_url" validate:"required,url"`
	EmbedURL        *string `json:"embed_url,omitempty" validate:"omitempty,url"`
	Platform        *string `json:"platform,omitempty" validate:"omitempty,max=50"`
	Status          string  `json:"status" validate:"required,oneof=draft published archived hidden"`
	IsFeatured      bool    `json:"is_featured"`
	IsNew           bool    `json:"is_new"`
	IsPopular       bool    `json:"is_popular"`
	CategoryIDs     []uuid.UUID `json:"category_ids,omitempty"`
	TagIDs          []uuid.UUID `json:"tag_ids,omitempty"`
}

type UpdateGameInput struct {
	Title           *string   `json:"title,omitempty" validate:"omitempty,min=3,max=200"`
	Description     *string   `json:"description,omitempty"`
	ShortDescription *string  `json:"short_description,omitempty" validate:"omitempty,max=500"`
	ThumbnailURL    *string   `json:"thumbnail_url,omitempty" validate:"omitempty,url"`
	BannerURL       *string   `json:"banner_url,omitempty" validate:"omitempty,url"`
	GameURL         *string   `json:"game_url,omitempty" validate:"omitempty,url"`
	EmbedURL        *string   `json:"embed_url,omitempty" validate:"omitempty,url"`
	Platform        *string   `json:"platform,omitempty" validate:"omitempty,max=50"`
	Status          *string   `json:"status,omitempty" validate:"omitempty,oneof=draft published archived hidden"`
	IsFeatured      *bool     `json:"is_featured,omitempty"`
	IsNew           *bool     `json:"is_new,omitempty"`
	IsPopular       *bool     `json:"is_popular,omitempty"`
	CategoryIDs     []uuid.UUID `json:"category_ids,omitempty"`
	TagIDs          []uuid.UUID `json:"tag_ids,omitempty"`
}

type GameFilters struct {
	Search     string
	CategoryID *uuid.UUID
	TagID      *uuid.UUID
	Status     *string
	Platform   *string
	IsFeatured *bool
	IsNew      *bool
	IsPopular  *bool
	SortBy     string
	SortDesc   bool
	Page       int
	PageSize   int
}

type GameRepository interface {
	Create(ctx context.Context, game *Game, categoryIDs, tagIDs []uuid.UUID) error
	GetByID(ctx context.Context, id uuid.UUID) (*Game, error)
	GetBySlug(ctx context.Context, slug string) (*Game, error)
	GetWithRelations(ctx context.Context, id uuid.UUID) (*GameWithRelations, error)
	Update(ctx context.Context, game *Game, categoryIDs, tagIDs []uuid.UUID) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filters GameFilters) ([]*Game, int64, error)
	GetFeatured(ctx context.Context, limit int) ([]*Game, error)
	GetNew(ctx context.Context, limit int) ([]*Game, error)
	GetPopular(ctx context.Context, limit int) ([]*Game, error)
	IncrementPlayCount(ctx context.Context, id uuid.UUID) error
	UpdateRating(ctx context.Context, id uuid.UUID, newRating float64, newCount int) error
}

type gameRepository struct {
	db *pgxpool.Pool
}

func NewGameRepository(db *pgxpool.Pool) GameRepository {
	return &gameRepository{db: db}
}

func (r *gameRepository) Create(ctx context.Context, game *Game, categoryIDs, tagIDs []uuid.UUID) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	query := `
		INSERT INTO games (slug, title, description, short_description, thumbnail_url, banner_url, game_url, embed_url, platform, status, is_featured, is_new, is_popular)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING id, created_at, updated_at
	`
	err = tx.QueryRow(ctx, query,
		game.Slug, game.Title, game.Description, game.ShortDescription,
		game.ThumbnailURL, game.BannerURL, game.GameURL, game.EmbedURL,
		game.Platform, game.Status, game.IsFeatured, game.IsNew, game.IsPopular,
	).Scan(&game.ID, &game.CreatedAt, &game.UpdatedAt)
	if err != nil {
		return err
	}

	// Add categories
	if len(categoryIDs) > 0 {
		for _, catID := range categoryIDs {
			_, err = tx.Exec(ctx, `INSERT INTO game_categories (game_id, category_id) VALUES ($1, $2)`, game.ID, catID)
			if err != nil {
				return err
			}
		}
	}

	// Add tags
	if len(tagIDs) > 0 {
		for _, tagID := range tagIDs {
			_, err = tx.Exec(ctx, `INSERT INTO game_tags (game_id, tag_id) VALUES ($1, $2)`, game.ID, tagID)
			if err != nil {
				return err
			}
		}
	}

	return tx.Commit(ctx)
}

func (r *gameRepository) GetByID(ctx context.Context, id uuid.UUID) (*Game, error) {
	query := `SELECT id, slug, title, description, short_description, thumbnail_url, banner_url, game_url, embed_url, platform, status, is_featured, is_new, is_popular, play_count, rating_avg, rating_count, published_at, created_at, updated_at FROM games WHERE id = $1`
	game := &Game{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
		&game.ThumbnailURL, &game.BannerURL, &game.GameURL, &game.EmbedURL,
		&game.Platform, &game.Status, &game.IsFeatured, &game.IsNew, &game.IsPopular,
		&game.PlayCount, &game.RatingAvg, &game.RatingCount, &game.PublishedAt,
		&game.CreatedAt, &game.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return game, nil
}

func (r *gameRepository) GetBySlug(ctx context.Context, slug string) (*Game, error) {
	query := `SELECT id, slug, title, description, short_description, thumbnail_url, banner_url, game_url, embed_url, platform, status, is_featured, is_new, is_popular, play_count, rating_avg, rating_count, published_at, created_at, updated_at FROM games WHERE slug = $1`
	game := &Game{}
	err := r.db.QueryRow(ctx, query, slug).Scan(
		&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
		&game.ThumbnailURL, &game.BannerURL, &game.GameURL, &game.EmbedURL,
		&game.Platform, &game.Status, &game.IsFeatured, &game.IsNew, &game.IsPopular,
		&game.PlayCount, &game.RatingAvg, &game.RatingCount, &game.PublishedAt,
		&game.CreatedAt, &game.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return game, nil
}

func (r *gameRepository) GetWithRelations(ctx context.Context, id uuid.UUID) (*GameWithRelations, error) {
	game, err := r.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Get categories
	catQuery := `
		SELECT c.id, c.slug, c.name, c.description, c.icon_url
		FROM categories c
		JOIN game_categories gc ON c.id = gc.category_id
		WHERE gc.game_id = $1
	`
	catRows, err := r.db.Query(ctx, catQuery, id)
	if err != nil {
		return nil, err
	}
	defer catRows.Close()

	var categories []Category
	for catRows.Next() {
		var cat Category
		err := catRows.Scan(&cat.ID, &cat.Slug, &cat.Name, &cat.Description, &cat.IconURL)
		if err != nil {
			return nil, err
		}
		categories = append(categories, cat)
	}

	// Get tags
	tagQuery := `
		SELECT t.id, t.slug, t.name
		FROM tags t
		JOIN game_tags gt ON t.id = gt.tag_id
		WHERE gt.game_id = $1
	`
	tagRows, err := r.db.Query(ctx, tagQuery, id)
	if err != nil {
		return nil, err
	}
	defer tagRows.Close()

	var tags []Tag
	for tagRows.Next() {
		var tag Tag
		err := tagRows.Scan(&tag.ID, &tag.Slug, &tag.Name)
		if err != nil {
			return nil, err
		}
		tags = append(tags, tag)
	}

	return &GameWithRelations{
		Game:       *game,
		Categories: categories,
		Tags:       tags,
	}, nil
}

func (r *gameRepository) Update(ctx context.Context, game *Game, categoryIDs, tagIDs []uuid.UUID) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	query := `
		UPDATE games SET
			title = $2, description = $3, short_description = $4, thumbnail_url = $5,
			banner_url = $6, game_url = $7, embed_url = $8, platform = $9,
			status = $10, is_featured = $11, is_new = $12, is_popular = $13,
			updated_at = NOW()
		WHERE id = $1
		RETURNING updated_at
	`
	err = tx.QueryRow(ctx, query,
		game.ID, game.Title, game.Description, game.ShortDescription,
		game.ThumbnailURL, game.BannerURL, game.GameURL, game.EmbedURL,
		game.Platform, game.Status, game.IsFeatured, game.IsNew, game.IsPopular,
	).Scan(&game.UpdatedAt)
	if err != nil {
		return err
	}

	// Update categories
	if categoryIDs != nil {
		_, err = tx.Exec(ctx, `DELETE FROM game_categories WHERE game_id = $1`, game.ID)
		if err != nil {
			return err
		}
		for _, catID := range categoryIDs {
			_, err = tx.Exec(ctx, `INSERT INTO game_categories (game_id, category_id) VALUES ($1, $2)`, game.ID, catID)
			if err != nil {
				return err
			}
		}
	}

	// Update tags
	if tagIDs != nil {
		_, err = tx.Exec(ctx, `DELETE FROM game_tags WHERE game_id = $1`, game.ID)
		if err != nil {
			return err
		}
		for _, tagID := range tagIDs {
			_, err = tx.Exec(ctx, `INSERT INTO game_tags (game_id, tag_id) VALUES ($1, $2)`, game.ID, tagID)
			if err != nil {
				return err
			}
		}
	}

	return tx.Commit(ctx)
}

func (r *gameRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM games WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *gameRepository) List(ctx context.Context, filters GameFilters) ([]*Game, int64, error) {
	whereClause := `WHERE 1=1`
	args := []interface{}{}
	argIndex := 1

	if filters.Search != "" {
		whereClause += ` AND (title ILIKE $` + string(rune(argIndex+'0')) + ` OR description ILIKE $` + string(rune(argIndex+'0')) + `)`
		args = append(args, "%"+filters.Search+"%")
		argIndex++
	}

	if filters.CategoryID != nil {
		whereClause += ` AND id IN (SELECT game_id FROM game_categories WHERE category_id = $` + string(rune(argIndex+'0')) + `)`
		args = append(args, *filters.CategoryID)
		argIndex++
	}

	if filters.TagID != nil {
		whereClause += ` AND id IN (SELECT game_id FROM game_tags WHERE tag_id = $` + string(rune(argIndex+'0')) + `)`
		args = append(args, *filters.TagID)
		argIndex++
	}

	if filters.Status != nil {
		whereClause += ` AND status = $` + string(rune(argIndex+'0'))
		args = append(args, *filters.Status)
		argIndex++
	}

	if filters.Platform != nil {
		whereClause += ` AND platform = $` + string(rune(argIndex+'0'))
		args = append(args, *filters.Platform)
		argIndex++
	}

	if filters.IsFeatured != nil {
		whereClause += ` AND is_featured = $` + string(rune(argIndex+'0'))
		args = append(args, *filters.IsFeatured)
		argIndex++
	}

	if filters.IsNew != nil {
		whereClause += ` AND is_new = $` + string(rune(argIndex+'0'))
		args = append(args, *filters.IsNew)
		argIndex++
	}

	if filters.IsPopular != nil {
		whereClause += ` AND is_popular = $` + string(rune(argIndex+'0'))
		args = append(args, *filters.IsPopular)
		argIndex++
	}

	// Count total
	countQuery := `SELECT COUNT(*) FROM games ` + whereClause
	var total int64
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	// Build order by
	orderBy := "created_at DESC"
	if filters.SortBy != "" {
		allowedSorts := map[string]bool{
			"created_at": true, "updated_at": true, "title": true,
			"play_count": true, "rating_avg": true, "published_at": true,
		}
		if allowedSorts[filters.SortBy] {
			order := "ASC"
			if filters.SortDesc {
				order = "DESC"
			}
			orderBy = filters.SortBy + " " + order
		}
	}

	// Add pagination
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
		SELECT id, slug, title, description, short_description, thumbnail_url, banner_url, game_url, embed_url, platform, status, is_featured, is_new, is_popular, play_count, rating_avg, rating_count, published_at, created_at, updated_at
		FROM games ` + whereClause + ` ORDER BY ` + orderBy + ` LIMIT $` + string(rune(argIndex+'0')) + ` OFFSET $` + string(rune(argIndex+1+'0'))
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var games []*Game
	for rows.Next() {
		game := &Game{}
		err := rows.Scan(
			&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
			&game.ThumbnailURL, &game.BannerURL, &game.GameURL, &game.EmbedURL,
			&game.Platform, &game.Status, &game.IsFeatured, &game.IsNew, &game.IsPopular,
			&game.PlayCount, &game.RatingAvg, &game.RatingCount, &game.PublishedAt,
			&game.CreatedAt, &game.UpdatedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		games = append(games, game)
	}
	return games, total, nil
}

func (r *gameRepository) GetFeatured(ctx context.Context, limit int) ([]*Game, error) {
	query := `SELECT id, slug, title, description, short_description, thumbnail_url, banner_url, game_url, embed_url, platform, status, is_featured, is_new, is_popular, play_count, rating_avg, rating_count, published_at, created_at, updated_at FROM games WHERE is_featured = true AND status = 'published' ORDER BY created_at DESC LIMIT $1`
	rows, err := r.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var games []*Game
	for rows.Next() {
		game := &Game{}
		err := rows.Scan(
			&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
			&game.ThumbnailURL, &game.BannerURL, &game.GameURL, &game.EmbedURL,
			&game.Platform, &game.Status, &game.IsFeatured, &game.IsNew, &game.IsPopular,
			&game.PlayCount, &game.RatingAvg, &game.RatingCount, &game.PublishedAt,
			&game.CreatedAt, &game.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		games = append(games, game)
	}
	return games, nil
}

func (r *gameRepository) GetNew(ctx context.Context, limit int) ([]*Game, error) {
	query := `SELECT id, slug, title, description, short_description, thumbnail_url, banner_url, game_url, embed_url, platform, status, is_featured, is_new, is_popular, play_count, rating_avg, rating_count, published_at, created_at, updated_at FROM games WHERE is_new = true AND status = 'published' ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT $1`
	rows, err := r.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var games []*Game
	for rows.Next() {
		game := &Game{}
		err := rows.Scan(
			&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
			&game.ThumbnailURL, &game.BannerURL, &game.GameURL, &game.EmbedURL,
			&game.Platform, &game.Status, &game.IsFeatured, &game.IsNew, &game.IsPopular,
			&game.PlayCount, &game.RatingAvg, &game.RatingCount, &game.PublishedAt,
			&game.CreatedAt, &game.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		games = append(games, game)
	}
	return games, nil
}

func (r *gameRepository) GetPopular(ctx context.Context, limit int) ([]*Game, error) {
	query := `SELECT id, slug, title, description, short_description, thumbnail_url, banner_url, game_url, embed_url, platform, status, is_featured, is_new, is_popular, play_count, rating_avg, rating_count, published_at, created_at, updated_at FROM games WHERE is_popular = true AND status = 'published' ORDER BY play_count DESC, rating_avg DESC LIMIT $1`
	rows, err := r.db.Query(ctx, query, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var games []*Game
	for rows.Next() {
		game := &Game{}
		err := rows.Scan(
			&game.ID, &game.Slug, &game.Title, &game.Description, &game.ShortDescription,
			&game.ThumbnailURL, &game.BannerURL, &game.GameURL, &game.EmbedURL,
			&game.Platform, &game.Status, &game.IsFeatured, &game.IsNew, &game.IsPopular,
			&game.PlayCount, &game.RatingAvg, &game.RatingCount, &game.PublishedAt,
			&game.CreatedAt, &game.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		games = append(games, game)
	}
	return games, nil
}

func (r *gameRepository) IncrementPlayCount(ctx context.Context, id uuid.UUID) error {
	query := `UPDATE games SET play_count = play_count + 1 WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *gameRepository) UpdateRating(ctx context.Context, id uuid.UUID, newRating float64, newCount int) error {
	query := `UPDATE games SET rating_avg = $2, rating_count = $3 WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id, newRating, newCount)
	return err
}
