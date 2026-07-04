package leaderboards

import (
	"context"

	"github.com/google/uuid"
)

type LeaderboardService interface {
	GetGlobalLeaderboard(ctx context.Context, filters LeaderboardFilters) ([]*LeaderboardEntry, int64, error)
	GetGameLeaderboard(ctx context.Context, gameID uuid.UUID, filters LeaderboardFilters) ([]*LeaderboardEntry, int64, error)
	GetUserRank(ctx context.Context, userID uuid.UUID, gameID *uuid.UUID) (int64, error)
	SubmitScore(ctx context.Context, userID, gameID uuid.UUID, score int64) error
}

type leaderboardService struct {
	repo LeaderboardRepository
}

func NewLeaderboardService(repo LeaderboardRepository) LeaderboardService {
	return &leaderboardService{repo: repo}
}

func (s *leaderboardService) GetGlobalLeaderboard(ctx context.Context, filters LeaderboardFilters) ([]*LeaderboardEntry, int64, error) {
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}
	return s.repo.GetGlobalLeaderboard(ctx, filters)
}

func (s *leaderboardService) GetGameLeaderboard(ctx context.Context, gameID uuid.UUID, filters LeaderboardFilters) ([]*LeaderboardEntry, int64, error) {
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}
	return s.repo.GetGameLeaderboard(ctx, gameID, filters)
}

func (s *leaderboardService) GetUserRank(ctx context.Context, userID uuid.UUID, gameID *uuid.UUID) (int64, error) {
	return s.repo.GetUserRank(ctx, userID, gameID)
}

func (s *leaderboardService) SubmitScore(ctx context.Context, userID, gameID uuid.UUID, score int64) error {
	if score < 0 {
		score = 0
	}
	return s.repo.UpsertScore(ctx, userID, gameID, score)
}
