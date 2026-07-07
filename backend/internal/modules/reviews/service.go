package reviews

import (
	"context"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/errors"
)

type ReviewService interface {
	Create(ctx context.Context, input CreateReviewInput) (*Review, error)
	GetByID(ctx context.Context, id uuid.UUID) (*Review, error)
	Update(ctx context.Context, id uuid.UUID, userID uuid.UUID, input UpdateReviewInput) (*Review, error)
	Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error
	ListByGame(ctx context.Context, gameID uuid.UUID, filters ReviewFilters) ([]*ReviewWithUser, int64, error)
	GetAverageRating(ctx context.Context, gameID uuid.UUID) (float64, int64, error)
}

type reviewService struct {
	repo ReviewRepository
}

func NewReviewService(repo ReviewRepository) ReviewService {
	return &reviewService{repo: repo}
}

func (s *reviewService) Create(ctx context.Context, input CreateReviewInput) (*Review, error) {
	existing, err := s.repo.GetByUserAndGame(ctx, input.UserID, input.GameID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.ErrAlreadyReviewed
	}

	review := &Review{
		UserID:  input.UserID,
		GameID:  input.GameID,
		Rating:  input.Rating,
		Comment: input.Comment,
	}

	if err := s.repo.Create(ctx, review); err != nil {
		return nil, err
	}

	return review, nil
}

func (s *reviewService) GetByID(ctx context.Context, id uuid.UUID) (*Review, error) {
	review, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.ErrNotFound
	}
	return review, nil
}

func (s *reviewService) Update(ctx context.Context, id uuid.UUID, userID uuid.UUID, input UpdateReviewInput) (*Review, error) {
	review, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.ErrNotFound
	}

	if review.UserID != userID {
		return nil, errors.ErrForbidden
	}

	if input.Rating != nil {
		review.Rating = *input.Rating
	}
	if input.Comment != nil {
		review.Comment = input.Comment
	}

	if err := s.repo.Update(ctx, review); err != nil {
		return nil, err
	}

	return review, nil
}

func (s *reviewService) Delete(ctx context.Context, id uuid.UUID, userID uuid.UUID) error {
	review, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return errors.ErrNotFound
	}

	if review.UserID != userID {
		return errors.ErrForbidden
	}

	return s.repo.Delete(ctx, id)
}

func (s *reviewService) ListByGame(ctx context.Context, gameID uuid.UUID, filters ReviewFilters) ([]*ReviewWithUser, int64, error) {
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}
	return s.repo.ListByGame(ctx, gameID, filters)
}

func (s *reviewService) GetAverageRating(ctx context.Context, gameID uuid.UUID) (float64, int64, error) {
	return s.repo.GetAverageRating(ctx, gameID)
}
