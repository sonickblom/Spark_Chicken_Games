package reviews

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Review struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	GameID    uuid.UUID `json:"game_id" db:"game_id"`
	Rating    int       `json:"rating" db:"rating"`
	Comment   *string   `json:"comment,omitempty" db:"comment"`
	CreatedAt string    `json:"created_at" db:"created_at"`
	UpdatedAt string    `json:"updated_at" db:"updated_at"`
}

type ReviewWithUser struct {
	Review
	User UserBasicInfo `json:"user"`
}

type UserBasicInfo struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Username  string    `json:"username" db:"username"`
	AvatarURL *string   `json:"avatar_url,omitempty" db:"avatar_url"`
}

type CreateReviewInput struct {
	UserID  uuid.UUID `json:"user_id" validate:"required"`
	GameID  uuid.UUID `json:"game_id" validate:"required"`
	Rating  int       `json:"rating" validate:"required,min=1,max=5"`
	Comment *string   `json:"comment,omitempty" validate:"omitempty,max=1000"`
}

type UpdateReviewInput struct {
	Rating  *int    `json:"rating,omitempty" validate:"omitempty,min=1,max=5"`
	Comment *string `json:"comment,omitempty" validate:"omitempty,max=1000"`
}

type ReviewFilters struct {
	Page     int
	PageSize int
}

type ReviewRepository interface {
	Create(ctx context.Context, review *Review) error
	GetByID(ctx context.Context, id uuid.UUID) (*Review, error)
	GetByUserAndGame(ctx context.Context, userID, gameID uuid.UUID) (*Review, error)
	Update(ctx context.Context, review *Review) error
	Delete(ctx context.Context, id uuid.UUID) error
	ListByGame(ctx context.Context, gameID uuid.UUID, filters ReviewFilters) ([]*ReviewWithUser, int64, error)
	GetAverageRating(ctx context.Context, gameID uuid.UUID) (float64, int64, error)
}

type reviewRepository struct {
	db *pgxpool.Pool
}

func NewReviewRepository(db *pgxpool.Pool) ReviewRepository {
	return &reviewRepository{db: db}
}

func (r *reviewRepository) Create(ctx context.Context, review *Review) error {
	query := `
		INSERT INTO reviews (user_id, game_id, rating, comment)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, updated_at
	`
	err := r.db.QueryRow(ctx, query, review.UserID, review.GameID, review.Rating, review.Comment).
		Scan(&review.ID, &review.CreatedAt, &review.UpdatedAt)
	if err != nil {
		return err
	}

	// Update average rating and play count in games table
	return r.updateGameRating(ctx, review.GameID)
}

func (r *reviewRepository) GetByID(ctx context.Context, id uuid.UUID) (*Review, error) {
	query := `SELECT id, user_id, game_id, rating, comment, created_at, updated_at FROM reviews WHERE id = $1`
	review := &Review{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&review.ID, &review.UserID, &review.GameID, &review.Rating, &review.Comment, &review.CreatedAt, &review.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, sql.ErrNoRows
		}
		return nil, err
	}
	return review, nil
}

func (r *reviewRepository) GetByUserAndGame(ctx context.Context, userID, gameID uuid.UUID) (*Review, error) {
	query := `SELECT id, user_id, game_id, rating, comment, created_at, updated_at FROM reviews WHERE user_id = $1 AND game_id = $2`
	review := &Review{}
	err := r.db.QueryRow(ctx, query, userID, gameID).Scan(
		&review.ID, &review.UserID, &review.GameID, &review.Rating, &review.Comment, &review.CreatedAt, &review.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil // Return nil, nil when review is not found
		}
		return nil, err
	}
	return review, nil
}

func (r *reviewRepository) Update(ctx context.Context, review *Review) error {
	query := `
		UPDATE reviews SET rating = $2, comment = $3, updated_at = NOW()
		WHERE id = $1
		RETURNING updated_at
	`
	err := r.db.QueryRow(ctx, query, review.ID, review.Rating, review.Comment).Scan(&review.UpdatedAt)
	if err != nil {
		return err
	}

	return r.updateGameRating(ctx, review.GameID)
}

func (r *reviewRepository) Delete(ctx context.Context, id uuid.UUID) error {
	review, err := r.GetByID(ctx, id)
	if err != nil {
		return err
	}

	query := `DELETE FROM reviews WHERE id = $1`
	_, err = r.db.Exec(ctx, query, id)
	if err != nil {
		return err
	}

	return r.updateGameRating(ctx, review.GameID)
}

func (r *reviewRepository) ListByGame(ctx context.Context, gameID uuid.UUID, filters ReviewFilters) ([]*ReviewWithUser, int64, error) {
	countQuery := `SELECT COUNT(*) FROM reviews WHERE game_id = $1`
	var total int64
	err := r.db.QueryRow(ctx, countQuery, gameID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	offset := (filters.Page - 1) * filters.PageSize
	if offset < 0 {
		offset = 0
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}

	query := `
		SELECT r.id, r.user_id, r.game_id, r.rating, r.comment, r.created_at, r.updated_at,
		       u.id, u.name, u.username, u.avatar_url
		FROM reviews r
		JOIN users u ON r.user_id = u.id
		WHERE r.game_id = $1
		ORDER BY r.created_at DESC
		LIMIT $2 OFFSET $3
	`
	rows, err := r.db.Query(ctx, query, gameID, filters.PageSize, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var list []*ReviewWithUser
	for rows.Next() {
		ru := &ReviewWithUser{}
		err := rows.Scan(
			&ru.ID, &ru.UserID, &ru.GameID, &ru.Rating, &ru.Comment, &ru.CreatedAt, &ru.UpdatedAt,
			&ru.User.ID, &ru.User.Name, &ru.User.Username, &ru.User.AvatarURL,
		)
		if err != nil {
			return nil, 0, err
		}
		list = append(list, ru)
	}

	return list, total, nil
}

func (r *reviewRepository) GetAverageRating(ctx context.Context, gameID uuid.UUID) (float64, int64, error) {
	query := `SELECT COALESCE(AVG(rating), 0.0), COUNT(*) FROM reviews WHERE game_id = $1`
	var avg float64
	var count int64
	err := r.db.QueryRow(ctx, query, gameID).Scan(&avg, &count)
	return avg, count, err
}

func (r *reviewRepository) updateGameRating(ctx context.Context, gameID uuid.UUID) error {
	avg, _, err := r.GetAverageRating(ctx, gameID)
	if err != nil {
		return err
	}

	query := `UPDATE games SET rating_avg = $2 WHERE id = $1`
	_, err = r.db.Exec(ctx, query, gameID, avg)
	return err
}
