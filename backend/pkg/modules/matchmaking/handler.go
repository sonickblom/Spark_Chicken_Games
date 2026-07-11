package matchmaking

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/response"
)

type MatchmakingHandler struct {
	service MatchmakingService
}

func NewMatchmakingHandler(service MatchmakingService) *MatchmakingHandler {
	return &MatchmakingHandler{service: service}
}

func (h *MatchmakingHandler) JoinQueue(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	gameIDStr := c.Param("game_id")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	entry, err := h.service.JoinQueue(c.Request.Context(), userUUID, gameID)
	if err != nil {
		response.WriteError(c.Writer, "JOIN_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"queue_entry": entry}, 201)
}

func (h *MatchmakingHandler) LeaveQueue(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	gameIDStr := c.Param("game_id")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.service.LeaveQueue(c.Request.Context(), userUUID, gameID); err != nil {
		response.WriteError(c.Writer, "LEAVE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Left matchmaking queue"})
}

func (h *MatchmakingHandler) GetStatus(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	gameIDStr := c.Param("game_id")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	entry, err := h.service.GetStatus(c.Request.Context(), userUUID, gameID)
	if err != nil {
		response.WriteError(c.Writer, "NOT_IN_QUEUE", "Not in matchmaking queue", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"queue_entry": entry})
}

func (h *MatchmakingHandler) TryMatch(c *gin.Context) {
	gameIDStr := c.Param("game_id")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	match, err := h.service.TryMatch(c.Request.Context(), gameID)
	if err != nil {
		response.WriteError(c.Writer, "MATCH_FAILED", err.Error(), 500)
		return
	}

	if match == nil {
		response.WriteSuccess(c.Writer, gin.H{"message": "Not enough players yet", "matched": false})
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"match": match, "matched": true})
}
