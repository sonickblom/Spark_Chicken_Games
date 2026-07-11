package matchmaking

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type QueueStatus string

const (
	QueueStatusWaiting  QueueStatus = "waiting"
	QueueStatusMatched  QueueStatus = "matched"
	QueueStatusCanceled QueueStatus = "canceled"
)

type QueueEntry struct {
	ID        uuid.UUID   `json:"id"`
	UserID    uuid.UUID   `json:"user_id"`
	GameID    uuid.UUID   `json:"game_id"`
	Status    QueueStatus `json:"status"`
	MatchID   *uuid.UUID  `json:"match_id,omitempty"`
	JoinedAt  time.Time   `json:"joined_at"`
	MatchedAt *time.Time  `json:"matched_at,omitempty"`
}

type Match struct {
	ID        uuid.UUID  `json:"id"`
	GameID    uuid.UUID  `json:"game_id"`
	SessionID *uuid.UUID `json:"session_id,omitempty"`
	Players   []uuid.UUID `json:"players"`
	CreatedAt time.Time  `json:"created_at"`
}

type MatchmakingRepository interface {
	Enqueue(ctx context.Context, userID, gameID uuid.UUID) (*QueueEntry, error)
	Dequeue(ctx context.Context, userID, gameID uuid.UUID) error
	GetQueueEntry(ctx context.Context, userID, gameID uuid.UUID) (*QueueEntry, error)
	GetWaitingPlayers(ctx context.Context, gameID uuid.UUID) ([]*QueueEntry, error)
	CreateMatch(ctx context.Context, match *Match) error
	UpdateQueueStatus(ctx context.Context, entryID uuid.UUID, status QueueStatus, matchID *uuid.UUID) error
}

type matchmakingRepository struct {
	db *pgxpool.Pool
}

func NewMatchmakingRepository(db *pgxpool.Pool) MatchmakingRepository {
	return &matchmakingRepository{db: db}
}

func (r *matchmakingRepository) Enqueue(ctx context.Context, userID, gameID uuid.UUID) (*QueueEntry, error) {
	query := `
		INSERT INTO matchmaking_queue (user_id, game_id, status)
		VALUES ($1, $2, 'waiting')
		ON CONFLICT (user_id, game_id) WHERE status = 'waiting'
		DO UPDATE SET joined_at = NOW()
		RETURNING id, user_id, game_id, status, match_id, joined_at, matched_at
	`
	e := &QueueEntry{}
	err := r.db.QueryRow(ctx, query, userID, gameID).Scan(
		&e.ID, &e.UserID, &e.GameID, &e.Status, &e.MatchID, &e.JoinedAt, &e.MatchedAt,
	)
	return e, err
}

func (r *matchmakingRepository) Dequeue(ctx context.Context, userID, gameID uuid.UUID) error {
	query := `
		UPDATE matchmaking_queue SET status = 'canceled'
		WHERE user_id = $1 AND game_id = $2 AND status = 'waiting'
	`
	_, err := r.db.Exec(ctx, query, userID, gameID)
	return err
}

func (r *matchmakingRepository) GetQueueEntry(ctx context.Context, userID, gameID uuid.UUID) (*QueueEntry, error) {
	query := `
		SELECT id, user_id, game_id, status, match_id, joined_at, matched_at
		FROM matchmaking_queue
		WHERE user_id = $1 AND game_id = $2
		ORDER BY joined_at DESC
		LIMIT 1
	`
	e := &QueueEntry{}
	err := r.db.QueryRow(ctx, query, userID, gameID).Scan(
		&e.ID, &e.UserID, &e.GameID, &e.Status, &e.MatchID, &e.JoinedAt, &e.MatchedAt,
	)
	if err != nil {
		return nil, err
	}
	return e, nil
}

func (r *matchmakingRepository) GetWaitingPlayers(ctx context.Context, gameID uuid.UUID) ([]*QueueEntry, error) {
	query := `
		SELECT id, user_id, game_id, status, match_id, joined_at, matched_at
		FROM matchmaking_queue
		WHERE game_id = $1 AND status = 'waiting'
		ORDER BY joined_at ASC
	`
	rows, err := r.db.Query(ctx, query, gameID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []*QueueEntry
	for rows.Next() {
		e := &QueueEntry{}
		if err := rows.Scan(
			&e.ID, &e.UserID, &e.GameID, &e.Status, &e.MatchID, &e.JoinedAt, &e.MatchedAt,
		); err != nil {
			return nil, err
		}
		entries = append(entries, e)
	}
	return entries, nil
}

func (r *matchmakingRepository) CreateMatch(ctx context.Context, match *Match) error {
	query := `INSERT INTO matches (game_id) VALUES ($1) RETURNING id, created_at`
	return r.db.QueryRow(ctx, query, match.GameID).Scan(&match.ID, &match.CreatedAt)
}

func (r *matchmakingRepository) UpdateQueueStatus(ctx context.Context, entryID uuid.UUID, status QueueStatus, matchID *uuid.UUID) error {
	now := time.Now()
	query := `UPDATE matchmaking_queue SET status = $2, match_id = $3, matched_at = $4 WHERE id = $1`
	_, err := r.db.Exec(ctx, query, entryID, status, matchID, now)
	return err
}
