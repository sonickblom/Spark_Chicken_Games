package recommendations

import (
	"context"

	"github.com/google/uuid"
)

type RecommendationService interface {
	GetPersonalized(ctx context.Context, userID uuid.UUID, limit int) ([]*RecommendedGame, error)
	GetSimilar(ctx context.Context, gameID uuid.UUID, limit int) ([]*RecommendedGame, error)
	GetTrending(ctx context.Context, limit int) ([]*RecommendedGame, error)
	GetNewReleases(ctx context.Context, limit int) ([]*RecommendedGame, error)
}

type recommendationService struct {
	repo RecommendationRepository
}

func NewRecommendationService(repo RecommendationRepository) RecommendationService {
	return &recommendationService{repo: repo}
}

func (s *recommendationService) GetPersonalized(ctx context.Context, userID uuid.UUID, limit int) ([]*RecommendedGame, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return s.repo.GetPersonalized(ctx, userID, limit)
}

func (s *recommendationService) GetSimilar(ctx context.Context, gameID uuid.UUID, limit int) ([]*RecommendedGame, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return s.repo.GetSimilar(ctx, gameID, limit)
}

func (s *recommendationService) GetTrending(ctx context.Context, limit int) ([]*RecommendedGame, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return s.repo.GetTrending(ctx, limit)
}

func (s *recommendationService) GetNewReleases(ctx context.Context, limit int) ([]*RecommendedGame, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return s.repo.GetNewReleases(ctx, limit)
}
