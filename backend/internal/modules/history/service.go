package history

import (
	"context"

	"github.com/google/uuid"
)

type PlayHistoryService interface {
	RecordPlay(ctx context.Context, input CreatePlayHistoryInput) (*PlayHistoryWithGame, error)
	GetHistory(ctx context.Context, userID uuid.UUID, filters PlayHistoryFilters) ([]*PlayHistoryWithGame, int64, error)
	GetStats(ctx context.Context, userID uuid.UUID) (map[string]interface{}, error)
	DeleteEntry(ctx context.Context, id uuid.UUID) error
}

type playHistoryService struct {
	repo PlayHistoryRepository
}

func NewPlayHistoryService(repo PlayHistoryRepository) PlayHistoryService {
	return &playHistoryService{repo: repo}
}

func (s *playHistoryService) RecordPlay(ctx context.Context, input CreatePlayHistoryInput) (*PlayHistoryWithGame, error) {
	history := &PlayHistory{
		UserID:          input.UserID,
		GameID:          input.GameID,
		DurationSeconds: input.DurationSeconds,
		DeviceType:      input.DeviceType,
		Source:          input.Source,
	}

	if err := s.repo.Create(ctx, history); err != nil {
		return nil, err
	}

	// Return with game info
	historyList, _, err := s.repo.ListByUser(ctx, input.UserID, PlayHistoryFilters{Page: 1, PageSize: 1})
	if err != nil {
		return nil, err
	}

	if len(historyList) > 0 && historyList[0].GameID == input.GameID {
		return historyList[0], nil
	}

	return &PlayHistoryWithGame{PlayHistory: *history}, nil
}

func (s *playHistoryService) GetHistory(ctx context.Context, userID uuid.UUID, filters PlayHistoryFilters) ([]*PlayHistoryWithGame, int64, error) {
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}
	return s.repo.ListByUser(ctx, userID, filters)
}

func (s *playHistoryService) GetStats(ctx context.Context, userID uuid.UUID) (map[string]interface{}, error) {
	totalPlays, err := s.repo.CountByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	totalTime, err := s.repo.GetTotalPlayTimeByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	gamesPlayed, err := s.repo.GetGamesPlayedCountByUser(ctx, userID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"total_plays":      totalPlays,
		"total_play_time":  totalTime,
		"games_played":     gamesPlayed,
		"avg_session_time": float64(totalTime) / float64(totalPlays),
	}, nil
}

func (s *playHistoryService) DeleteEntry(ctx context.Context, id uuid.UUID) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return err
	}
	return s.repo.Delete(ctx, id)
}
