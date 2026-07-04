package matchmaking

import (
	"context"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/errors"
)

const defaultPlayersPerMatch = 2

type MatchmakingService interface {
	JoinQueue(ctx context.Context, userID, gameID uuid.UUID) (*QueueEntry, error)
	LeaveQueue(ctx context.Context, userID, gameID uuid.UUID) error
	GetStatus(ctx context.Context, userID, gameID uuid.UUID) (*QueueEntry, error)
	TryMatch(ctx context.Context, gameID uuid.UUID) (*Match, error)
}

type matchmakingService struct {
	repo MatchmakingRepository
}

func NewMatchmakingService(repo MatchmakingRepository) MatchmakingService {
	return &matchmakingService{repo: repo}
}

func (s *matchmakingService) JoinQueue(ctx context.Context, userID, gameID uuid.UUID) (*QueueEntry, error) {
	existing, _ := s.repo.GetQueueEntry(ctx, userID, gameID)
	if existing != nil && existing.Status == QueueStatusWaiting {
		return nil, errors.ErrAlreadyInQueue
	}

	entry, err := s.repo.Enqueue(ctx, userID, gameID)
	if err != nil {
		return nil, err
	}

	return entry, nil
}

func (s *matchmakingService) LeaveQueue(ctx context.Context, userID, gameID uuid.UUID) error {
	existing, _ := s.repo.GetQueueEntry(ctx, userID, gameID)
	if existing == nil || existing.Status != QueueStatusWaiting {
		return errors.ErrNotInQueue
	}
	return s.repo.Dequeue(ctx, userID, gameID)
}

func (s *matchmakingService) GetStatus(ctx context.Context, userID, gameID uuid.UUID) (*QueueEntry, error) {
	entry, err := s.repo.GetQueueEntry(ctx, userID, gameID)
	if err != nil {
		return nil, errors.ErrNotInQueue
	}
	return entry, nil
}

func (s *matchmakingService) TryMatch(ctx context.Context, gameID uuid.UUID) (*Match, error) {
	waiting, err := s.repo.GetWaitingPlayers(ctx, gameID)
	if err != nil {
		return nil, err
	}

	if len(waiting) < defaultPlayersPerMatch {
		return nil, nil // Not enough players yet
	}

	match := &Match{
		GameID: gameID,
	}
	if err := s.repo.CreateMatch(ctx, match); err != nil {
		return nil, err
	}

	// Mark first N players as matched
	matchID := match.ID
	for i := 0; i < defaultPlayersPerMatch && i < len(waiting); i++ {
		match.Players = append(match.Players, waiting[i].UserID)
		if err := s.repo.UpdateQueueStatus(ctx, waiting[i].ID, QueueStatusMatched, &matchID); err != nil {
			return nil, err
		}
	}

	return match, nil
}
