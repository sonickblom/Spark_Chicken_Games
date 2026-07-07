package sessions

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"time"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/errors"
)

type SessionService interface {
	Create(ctx context.Context, input CreateSessionInput) (*GameSession, error)
	GetByID(ctx context.Context, id uuid.UUID) (*GameSession, error)
	GetByRoomCode(ctx context.Context, code string) (*GameSession, error)
	List(ctx context.Context, filters SessionFilters) ([]*GameSession, int64, error)
	Join(ctx context.Context, sessionID, userID uuid.UUID) error
	Leave(ctx context.Context, sessionID, userID uuid.UUID) error
	Start(ctx context.Context, sessionID, hostUserID uuid.UUID) error
	End(ctx context.Context, sessionID, hostUserID uuid.UUID) error
	GetParticipants(ctx context.Context, sessionID uuid.UUID) ([]*SessionParticipant, error)
}

type sessionService struct {
	repo SessionRepository
}

func NewSessionService(repo SessionRepository) SessionService {
	return &sessionService{repo: repo}
}

func generateRoomCode() (string, error) {
	b := make([]byte, 3)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func (s *sessionService) Create(ctx context.Context, input CreateSessionInput) (*GameSession, error) {
	code, err := generateRoomCode()
	if err != nil {
		return nil, err
	}

	session := &GameSession{
		GameID:     input.GameID,
		HostUserID: input.HostUserID,
		Status:     StatusWaiting,
		MaxPlayers: input.MaxPlayers,
		IsPublic:   input.IsPublic,
		RoomCode:   code,
	}

	if err := s.repo.Create(ctx, session); err != nil {
		return nil, err
	}

	// Auto-add host as first participant
	participant := &SessionParticipant{
		SessionID: session.ID,
		UserID:    input.HostUserID,
	}
	if err := s.repo.AddParticipant(ctx, participant); err != nil {
		return nil, err
	}

	return session, nil
}

func (s *sessionService) GetByID(ctx context.Context, id uuid.UUID) (*GameSession, error) {
	session, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.ErrSessionNotFound
	}
	return session, nil
}

func (s *sessionService) GetByRoomCode(ctx context.Context, code string) (*GameSession, error) {
	session, err := s.repo.GetByRoomCode(ctx, code)
	if err != nil {
		return nil, errors.ErrSessionNotFound
	}
	return session, nil
}

func (s *sessionService) List(ctx context.Context, filters SessionFilters) ([]*GameSession, int64, error) {
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	return s.repo.List(ctx, filters)
}

func (s *sessionService) Join(ctx context.Context, sessionID, userID uuid.UUID) error {
	session, err := s.repo.GetByID(ctx, sessionID)
	if err != nil {
		return errors.ErrSessionNotFound
	}

	if session.Status != StatusWaiting {
		return errors.ErrSessionNotActive
	}

	if session.CurrentPlayers >= session.MaxPlayers {
		return errors.ErrSessionFull
	}

	already, err := s.repo.IsParticipant(ctx, sessionID, userID)
	if err != nil {
		return err
	}
	if already {
		return errors.ErrAlreadyInSession
	}

	participant := &SessionParticipant{
		SessionID: sessionID,
		UserID:    userID,
	}
	if err := s.repo.AddParticipant(ctx, participant); err != nil {
		return err
	}

	return s.repo.UpdateParticipantCount(ctx, sessionID, 1)
}

func (s *sessionService) Leave(ctx context.Context, sessionID, userID uuid.UUID) error {
	_, err := s.repo.GetByID(ctx, sessionID)
	if err != nil {
		return errors.ErrSessionNotFound
	}

	in, err := s.repo.IsParticipant(ctx, sessionID, userID)
	if err != nil {
		return err
	}
	if !in {
		return errors.ErrNotInSession
	}

	if err := s.repo.RemoveParticipant(ctx, sessionID, userID); err != nil {
		return err
	}

	return s.repo.UpdateParticipantCount(ctx, sessionID, -1)
}

func (s *sessionService) Start(ctx context.Context, sessionID, hostUserID uuid.UUID) error {
	session, err := s.repo.GetByID(ctx, sessionID)
	if err != nil {
		return errors.ErrSessionNotFound
	}

	if session.HostUserID != hostUserID {
		return errors.ErrForbidden
	}

	if session.Status != StatusWaiting {
		return errors.ErrSessionNotActive
	}

	now := time.Now()
	session.Status = StatusActive
	session.StartedAt = &now

	return s.repo.Update(ctx, session)
}

func (s *sessionService) End(ctx context.Context, sessionID, hostUserID uuid.UUID) error {
	session, err := s.repo.GetByID(ctx, sessionID)
	if err != nil {
		return errors.ErrSessionNotFound
	}

	if session.HostUserID != hostUserID {
		return errors.ErrForbidden
	}

	now := time.Now()
	session.Status = StatusFinished
	session.EndedAt = &now

	return s.repo.Update(ctx, session)
}

func (s *sessionService) GetParticipants(ctx context.Context, sessionID uuid.UUID) ([]*SessionParticipant, error) {
	_, err := s.repo.GetByID(ctx, sessionID)
	if err != nil {
		return nil, errors.ErrSessionNotFound
	}
	return s.repo.GetParticipants(ctx, sessionID)
}
