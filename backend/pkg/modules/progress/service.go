package progress

import (
	"context"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/errors"
)

type ProgressService interface {
	SaveProgress(ctx context.Context, input CreateProgressInput) (*UserGameProgress, error)
	GetProgress(ctx context.Context, userID, gameID uuid.UUID) (*UserGameProgress, error)
	UpdateProgress(ctx context.Context, userID, gameID uuid.UUID, input UpdateProgressInput) (*UserGameProgress, error)
	DeleteProgress(ctx context.Context, userID, gameID uuid.UUID) error
	ListProgress(ctx context.Context, userID uuid.UUID) ([]*UserGameProgress, error)
}

type progressService struct {
	repo ProgressRepository
}

func NewProgressService(repo ProgressRepository) ProgressService {
	return &progressService{repo: repo}
}

func (s *progressService) SaveProgress(ctx context.Context, input CreateProgressInput) (*UserGameProgress, error) {
	progress := &UserGameProgress{
		UserID:       input.UserID,
		GameID:       input.GameID,
		ProgressData: input.ProgressData,
	}

	// Try to get existing progress first
	existing, err := s.repo.GetByUserAndGame(ctx, input.UserID, input.GameID)
	if err == nil {
		// Update existing
		existing.ProgressData = input.ProgressData
		if err := s.repo.Update(ctx, existing); err != nil {
			return nil, err
		}
		return existing, nil
	}

	// Create new
	if err := s.repo.Create(ctx, progress); err != nil {
		return nil, err
	}
	return progress, nil
}

func (s *progressService) GetProgress(ctx context.Context, userID, gameID uuid.UUID) (*UserGameProgress, error) {
	return s.repo.GetByUserAndGame(ctx, userID, gameID)
}

func (s *progressService) UpdateProgress(ctx context.Context, userID, gameID uuid.UUID, input UpdateProgressInput) (*UserGameProgress, error) {
	progress, err := s.repo.GetByUserAndGame(ctx, userID, gameID)
	if err != nil {
		return nil, errors.ErrProgressNotFound
	}

	progress.ProgressData = input.ProgressData
	if err := s.repo.Update(ctx, progress); err != nil {
		return nil, err
	}

	return progress, nil
}

func (s *progressService) DeleteProgress(ctx context.Context, userID, gameID uuid.UUID) error {
	_, err := s.repo.GetByUserAndGame(ctx, userID, gameID)
	if err != nil {
		return errors.ErrProgressNotFound
	}
	return s.repo.Delete(ctx, userID, gameID)
}

func (s *progressService) ListProgress(ctx context.Context, userID uuid.UUID) ([]*UserGameProgress, error) {
	return s.repo.ListByUser(ctx, userID)
}
