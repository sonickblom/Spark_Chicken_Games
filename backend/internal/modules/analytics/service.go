package analytics

import (
	"context"

	"github.com/google/uuid"
)

type AnalyticsService interface {
	GetGameAnalytics(ctx context.Context, gameID uuid.UUID, filters AnalyticsFilters) (*GameAnalytics, error)
	GetUserAnalytics(ctx context.Context, userID uuid.UUID) (*UserAnalytics, error)
	GetPlatformAnalytics(ctx context.Context, filters AnalyticsFilters) (*PlatformAnalytics, error)
	GetTopGames(ctx context.Context, limit int, metric string) ([]*GameAnalytics, error)
}

type analyticsService struct {
	repo AnalyticsRepository
}

func NewAnalyticsService(repo AnalyticsRepository) AnalyticsService {
	return &analyticsService{repo: repo}
}

func (s *analyticsService) GetGameAnalytics(ctx context.Context, gameID uuid.UUID, filters AnalyticsFilters) (*GameAnalytics, error) {
	return s.repo.GetGameAnalytics(ctx, gameID, filters)
}

func (s *analyticsService) GetUserAnalytics(ctx context.Context, userID uuid.UUID) (*UserAnalytics, error) {
	return s.repo.GetUserAnalytics(ctx, userID)
}

func (s *analyticsService) GetPlatformAnalytics(ctx context.Context, filters AnalyticsFilters) (*PlatformAnalytics, error) {
	return s.repo.GetPlatformAnalytics(ctx, filters)
}

func (s *analyticsService) GetTopGames(ctx context.Context, limit int, metric string) ([]*GameAnalytics, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 100 {
		limit = 100
	}
	validMetrics := map[string]bool{"plays": true, "rating": true, "favorites": true}
	if !validMetrics[metric] {
		metric = "plays"
	}
	return s.repo.GetTopGames(ctx, limit, metric)
}
