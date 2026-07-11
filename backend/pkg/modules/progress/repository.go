package progress

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserGameProgress struct {
	ID           uuid.UUID `json:"id" db:"id"`
	UserID       uuid.UUID `json:"user_id" db:"user_id"`
	GameID       uuid.UUID `json:"game_id" db:"game_id"`
	ProgressData string    `json:"progress_data" db:"progress_data"`
	UpdatedAt    string    `json:"updated_at" db:"updated_at"`
}

type CreateProgressInput struct {
	UserID       uuid.UUID `json:"user_id" validate:"required"`
	GameID       uuid.UUID `json:"game_id" validate:"required"`
	ProgressData string    `json:"progress_data" validate:"required"`
}

type UpdateProgressInput struct {
	ProgressData string `json:"progress_data" validate:"required"`
}

type ProgressRepository interface {
	Create(ctx context.Context, progress *UserGameProgress) error
	GetByUserAndGame(ctx context.Context, userID, gameID uuid.UUID) (*UserGameProgress, error)
	Update(ctx context.Context, progress *UserGameProgress) error
	Delete(ctx context.Context, userID, gameID uuid.UUID) error
	ListByUser(ctx context.Context, userID uuid.UUID) ([]*UserGameProgress, error)
}

type progressRepository struct {
	db *pgxpool.Pool
}

func NewProgressRepository(db *pgxpool.Pool) ProgressRepository {
	return &progressRepository{db: db}
}

func (r *progressRepository) Create(ctx context.Context, progress *UserGameProgress) error {
	query := `
		INSERT INTO user_game_progress (user_id, game_id, progress_data)
		VALUES ($1, $2, $3)
		RETURNING id, updated_at
	`
	return r.db.QueryRow(ctx, query, progress.UserID, progress.GameID, progress.ProgressData).Scan(&progress.ID, &progress.UpdatedAt)
}

func (r *progressRepository) GetByUserAndGame(ctx context.Context, userID, gameID uuid.UUID) (*UserGameProgress, error) {
	query := `SELECT id, user_id, game_id, progress_data, updated_at FROM user_game_progress WHERE user_id = $1 AND game_id = $2`
	progress := &UserGameProgress{}
	err := r.db.QueryRow(ctx, query, userID, gameID).Scan(&progress.ID, &progress.UserID, &progress.GameID, &progress.ProgressData, &progress.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return progress, nil
}

func (r *progressRepository) Update(ctx context.Context, progress *UserGameProgress) error {
	query := `UPDATE user_game_progress SET progress_data = $3, updated_at = NOW() WHERE user_id = $1 AND game_id = $2 RETURNING updated_at`
	return r.db.QueryRow(ctx, query, progress.UserID, progress.GameID, progress.ProgressData).Scan(&progress.UpdatedAt)
}

func (r *progressRepository) Delete(ctx context.Context, userID, gameID uuid.UUID) error {
	query := `DELETE FROM user_game_progress WHERE user_id = $1 AND game_id = $2`
	_, err := r.db.Exec(ctx, query, userID, gameID)
	return err
}

func (r *progressRepository) ListByUser(ctx context.Context, userID uuid.UUID) ([]*UserGameProgress, error) {
	query := `SELECT id, user_id, game_id, progress_data, updated_at FROM user_game_progress WHERE user_id = $1 ORDER BY updated_at DESC`
	rows, err := r.db.Query(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var progressList []*UserGameProgress
	for rows.Next() {
		progress := &UserGameProgress{}
		err := rows.Scan(&progress.ID, &progress.UserID, &progress.GameID, &progress.ProgressData, &progress.UpdatedAt)
		if err != nil {
			return nil, err
		}
		progressList = append(progressList, progress)
	}
	return progressList, nil
}
