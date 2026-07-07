package favorites

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Favorite struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	GameID    uuid.UUID `json:"game_id" db:"game_id"`
	CreatedAt string    `json:"created_at" db:"created_at"`
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

type FavoriteWithGame struct {
	Favorite
	Game GameBasicInfo `json:"game"`
}

type FavoriteFilters struct {
	Page     int
	PageSize int
	SortBy   string
	SortDesc bool
}

type FavoriteRepository interface {
	Create(ctx context.Context, favorite *Favorite) error
	GetByID(ctx context.Context, id uuid.UUID) (*Favorite, error)
	Delete(ctx context.Context, id uuid.UUID) error
	DeleteByUserAndGame(ctx context.Context, userID, gameID uuid.UUID) error
	ListByUser(ctx context.Context, userID uuid.UUID, filters FavoriteFilters) ([]*FavoriteWithGame, int64, error)
	ExistsByUserAndGame(ctx context.Context, userID, gameID uuid.UUID) (bool, error)
	CountByUser(ctx context.Context, userID uuid.UUID) (int64, error)
}

type favoriteRepository struct {
	db *pgxpool.Pool
}

func NewFavoriteRepository(db *pgxpool.Pool) FavoriteRepository {
	return &favoriteRepository{db: db}
}

func (r *favoriteRepository) Create(ctx context.Context, favorite *Favorite) error {
	query := `
		INSERT INTO favorites (user_id, game_id)
		VALUES ($1, $2)
		RETURNING id, created_at
	`
	return r.db.QueryRow(ctx, query, favorite.UserID, favorite.GameID).Scan(&favorite.ID, &favorite.CreatedAt)
}

func (r *favoriteRepository) GetByID(ctx context.Context, id uuid.UUID) (*Favorite, error) {
	query := `SELECT id, user_id, game_id, created_at FROM favorites WHERE id = $1`
	favorite := &Favorite{}
	err := r.db.QueryRow(ctx, query, id).Scan(&favorite.ID, &favorite.UserID, &favorite.GameID, &favorite.CreatedAt)
	if err != nil {
		return nil, err
	}
	return favorite, nil
}

func (r *favoriteRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM favorites WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *favoriteRepository) DeleteByUserAndGame(ctx context.Context, userID, gameID uuid.UUID) error {
	query := `DELETE FROM favorites WHERE user_id = $1 AND game_id = $2`
	_, err := r.db.Exec(ctx, query, userID, gameID)
	return err
}

func (r *favoriteRepository) ListByUser(ctx context.Context, userID uuid.UUID, filters FavoriteFilters) ([]*FavoriteWithGame, int64, error) {
	whereClause := `WHERE f.user_id = $1`
	args := []interface{}{userID}
	argIndex := 2

	countQuery := `SELECT COUNT(*) FROM favorites f ` + whereClause
	var total int64
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	orderBy := "f.created_at DESC"
	if filters.SortBy != "" {
		allowedSorts := map[string]bool{"created_at": true, "title": true, "play_count": true, "rating_avg": true}
		if allowedSorts[filters.SortBy] {
			order := "ASC"
			if filters.SortDesc {
				order = "DESC"
			}
			if filters.SortBy == "title" || filters.SortBy == "play_count" || filters.SortBy == "rating_avg" {
				orderBy = "g." + filters.SortBy + " " + order
			} else {
				orderBy = "f." + filters.SortBy + " " + order
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
		SELECT f.id, f.user_id, f.game_id, f.created_at,
		       g.id, g.slug, g.title, g.short_description, g.thumbnail_url, g.rating_avg, g.play_count
		FROM favorites f
		JOIN games g ON f.game_id = g.id
		` + whereClause + `
		ORDER BY ` + orderBy + ` LIMIT $` + string(rune(argIndex+'0')) + ` OFFSET $` + string(rune(argIndex+1+'0'))
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var favorites []*FavoriteWithGame
	for rows.Next() {
		fav := &FavoriteWithGame{}
		err := rows.Scan(
			&fav.ID, &fav.UserID, &fav.GameID, &fav.CreatedAt,
			&fav.Game.ID, &fav.Game.Slug, &fav.Game.Title, &fav.Game.ShortDescription,
			&fav.Game.ThumbnailURL, &fav.Game.RatingAvg, &fav.Game.PlayCount,
		)
		if err != nil {
			return nil, 0, err
		}
		favorites = append(favorites, fav)
	}
	return favorites, total, nil
}

func (r *favoriteRepository) ExistsByUserAndGame(ctx context.Context, userID, gameID uuid.UUID) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM favorites WHERE user_id = $1 AND game_id = $2)`
	var exists bool
	err := r.db.QueryRow(ctx, query, userID, gameID).Scan(&exists)
	return exists, err
}

func (r *favoriteRepository) CountByUser(ctx context.Context, userID uuid.UUID) (int64, error) {
	query := `SELECT COUNT(*) FROM favorites WHERE user_id = $1`
	var count int64
	err := r.db.QueryRow(ctx, query, userID).Scan(&count)
	return count, err
}
