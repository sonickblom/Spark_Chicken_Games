package sessions

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type SessionStatus string

const (
	StatusWaiting  SessionStatus = "waiting"
	StatusActive   SessionStatus = "active"
	StatusFinished SessionStatus = "finished"
	StatusCanceled SessionStatus = "canceled"
)

type GameSession struct {
	ID          uuid.UUID     `json:"id"`
	GameID      uuid.UUID     `json:"game_id"`
	HostUserID  uuid.UUID     `json:"host_user_id"`
	Status      SessionStatus `json:"status"`
	MaxPlayers  int           `json:"max_players"`
	CurrentPlayers int        `json:"current_players"`
	IsPublic    bool          `json:"is_public"`
	RoomCode    string        `json:"room_code"`
	StartedAt   *time.Time   `json:"started_at,omitempty"`
	EndedAt     *time.Time   `json:"ended_at,omitempty"`
	CreatedAt   time.Time    `json:"created_at"`
}

type SessionParticipant struct {
	ID        uuid.UUID  `json:"id"`
	SessionID uuid.UUID  `json:"session_id"`
	UserID    uuid.UUID  `json:"user_id"`
	Username  string     `json:"username"`
	JoinedAt  time.Time  `json:"joined_at"`
	LeftAt    *time.Time `json:"left_at,omitempty"`
}

type CreateSessionInput struct {
	GameID     uuid.UUID `json:"game_id" validate:"required"`
	HostUserID uuid.UUID `json:"host_user_id" validate:"required"`
	MaxPlayers int       `json:"max_players" validate:"required,min=2,max=100"`
	IsPublic   bool      `json:"is_public"`
}

type SessionFilters struct {
	GameID   *uuid.UUID
	Status   *SessionStatus
	IsPublic *bool
	Page     int
	PageSize int
}

type SessionRepository interface {
	Create(ctx context.Context, session *GameSession) error
	GetByID(ctx context.Context, id uuid.UUID) (*GameSession, error)
	GetByRoomCode(ctx context.Context, code string) (*GameSession, error)
	Update(ctx context.Context, session *GameSession) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filters SessionFilters) ([]*GameSession, int64, error)
	AddParticipant(ctx context.Context, participant *SessionParticipant) error
	RemoveParticipant(ctx context.Context, sessionID, userID uuid.UUID) error
	GetParticipants(ctx context.Context, sessionID uuid.UUID) ([]*SessionParticipant, error)
	IsParticipant(ctx context.Context, sessionID, userID uuid.UUID) (bool, error)
	UpdateParticipantCount(ctx context.Context, sessionID uuid.UUID, delta int) error
}

type sessionRepository struct {
	db *pgxpool.Pool
}

func NewSessionRepository(db *pgxpool.Pool) SessionRepository {
	return &sessionRepository{db: db}
}

func (r *sessionRepository) Create(ctx context.Context, session *GameSession) error {
	query := `
		INSERT INTO game_sessions (game_id, host_user_id, status, max_players, is_public, room_code, current_players)
		VALUES ($1, $2, $3, $4, $5, $6, 1)
		RETURNING id, created_at
	`
	return r.db.QueryRow(ctx, query,
		session.GameID, session.HostUserID, session.Status,
		session.MaxPlayers, session.IsPublic, session.RoomCode,
	).Scan(&session.ID, &session.CreatedAt)
}

func (r *sessionRepository) GetByID(ctx context.Context, id uuid.UUID) (*GameSession, error) {
	query := `
		SELECT id, game_id, host_user_id, status, max_players, current_players,
		       is_public, room_code, started_at, ended_at, created_at
		FROM game_sessions WHERE id = $1
	`
	s := &GameSession{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&s.ID, &s.GameID, &s.HostUserID, &s.Status, &s.MaxPlayers, &s.CurrentPlayers,
		&s.IsPublic, &s.RoomCode, &s.StartedAt, &s.EndedAt, &s.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return s, nil
}

func (r *sessionRepository) GetByRoomCode(ctx context.Context, code string) (*GameSession, error) {
	query := `
		SELECT id, game_id, host_user_id, status, max_players, current_players,
		       is_public, room_code, started_at, ended_at, created_at
		FROM game_sessions WHERE room_code = $1
	`
	s := &GameSession{}
	err := r.db.QueryRow(ctx, query, code).Scan(
		&s.ID, &s.GameID, &s.HostUserID, &s.Status, &s.MaxPlayers, &s.CurrentPlayers,
		&s.IsPublic, &s.RoomCode, &s.StartedAt, &s.EndedAt, &s.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return s, nil
}

func (r *sessionRepository) Update(ctx context.Context, session *GameSession) error {
	query := `
		UPDATE game_sessions
		SET status = $2, started_at = $3, ended_at = $4
		WHERE id = $1
	`
	_, err := r.db.Exec(ctx, query, session.ID, session.Status, session.StartedAt, session.EndedAt)
	return err
}

func (r *sessionRepository) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.Exec(ctx, `DELETE FROM game_sessions WHERE id = $1`, id)
	return err
}

func (r *sessionRepository) List(ctx context.Context, filters SessionFilters) ([]*GameSession, int64, error) {
	where := `WHERE 1=1`
	args := []interface{}{}
	argIdx := 1

	if filters.IsPublic != nil {
		where += ` AND is_public = $` + string(rune('0'+argIdx))
		args = append(args, *filters.IsPublic)
		argIdx++
	}
	if filters.Status != nil {
		where += ` AND status = $` + string(rune('0'+argIdx))
		args = append(args, *filters.Status)
		argIdx++
	}

	var total int64
	countQ := `SELECT COUNT(*) FROM game_sessions ` + where
	if err := r.db.QueryRow(ctx, countQ, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	offset := (filters.Page - 1) * filters.PageSize
	if offset < 0 {
		offset = 0
	}

	query := `SELECT id, game_id, host_user_id, status, max_players, current_players,
	                 is_public, room_code, started_at, ended_at, created_at
	          FROM game_sessions ` + where + ` ORDER BY created_at DESC LIMIT $` +
		string(rune('0'+argIdx)) + ` OFFSET $` + string(rune('0'+argIdx+1))
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var sessions []*GameSession
	for rows.Next() {
		s := &GameSession{}
		if err := rows.Scan(
			&s.ID, &s.GameID, &s.HostUserID, &s.Status, &s.MaxPlayers, &s.CurrentPlayers,
			&s.IsPublic, &s.RoomCode, &s.StartedAt, &s.EndedAt, &s.CreatedAt,
		); err != nil {
			return nil, 0, err
		}
		sessions = append(sessions, s)
	}
	return sessions, total, nil
}

func (r *sessionRepository) AddParticipant(ctx context.Context, participant *SessionParticipant) error {
	query := `
		INSERT INTO session_participants (session_id, user_id)
		VALUES ($1, $2)
		RETURNING id, joined_at
	`
	return r.db.QueryRow(ctx, query, participant.SessionID, participant.UserID).
		Scan(&participant.ID, &participant.JoinedAt)
}

func (r *sessionRepository) RemoveParticipant(ctx context.Context, sessionID, userID uuid.UUID) error {
	query := `
		UPDATE session_participants SET left_at = NOW()
		WHERE session_id = $1 AND user_id = $2 AND left_at IS NULL
	`
	_, err := r.db.Exec(ctx, query, sessionID, userID)
	return err
}

func (r *sessionRepository) GetParticipants(ctx context.Context, sessionID uuid.UUID) ([]*SessionParticipant, error) {
	query := `
		SELECT sp.id, sp.session_id, sp.user_id, u.username, sp.joined_at, sp.left_at
		FROM session_participants sp
		JOIN users u ON sp.user_id = u.id
		WHERE sp.session_id = $1 AND sp.left_at IS NULL
		ORDER BY sp.joined_at ASC
	`
	rows, err := r.db.Query(ctx, query, sessionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var participants []*SessionParticipant
	for rows.Next() {
		p := &SessionParticipant{}
		if err := rows.Scan(&p.ID, &p.SessionID, &p.UserID, &p.Username, &p.JoinedAt, &p.LeftAt); err != nil {
			return nil, err
		}
		participants = append(participants, p)
	}
	return participants, nil
}

func (r *sessionRepository) IsParticipant(ctx context.Context, sessionID, userID uuid.UUID) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM session_participants WHERE session_id = $1 AND user_id = $2 AND left_at IS NULL)`
	var exists bool
	err := r.db.QueryRow(ctx, query, sessionID, userID).Scan(&exists)
	return exists, err
}

func (r *sessionRepository) UpdateParticipantCount(ctx context.Context, sessionID uuid.UUID, delta int) error {
	query := `UPDATE game_sessions SET current_players = current_players + $2 WHERE id = $1`
	_, err := r.db.Exec(ctx, query, sessionID, delta)
	return err
}
