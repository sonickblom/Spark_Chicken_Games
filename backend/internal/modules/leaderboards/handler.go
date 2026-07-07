package leaderboards

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
)

type LeaderboardHandler struct {
	service LeaderboardService
}

func NewLeaderboardHandler(service LeaderboardService) *LeaderboardHandler {
	return &LeaderboardHandler{service: service}
}

type SubmitScoreRequest struct {
	Score int64 `json:"score" binding:"required,min=0"`
}

func (h *LeaderboardHandler) GetGlobal(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	filters := LeaderboardFilters{
		Page:     page,
		PageSize: pageSize,
		Period:   c.DefaultQuery("period", "all_time"),
	}

	entries, total, err := h.service.GetGlobalLeaderboard(c.Request.Context(), filters)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccessWithMeta(c.Writer, gin.H{"leaderboard": entries}, gin.H{
		"total_items": total,
		"page":        filters.Page,
		"page_size":   filters.PageSize,
	})
}

func (h *LeaderboardHandler) GetByGame(c *gin.Context) {
	gameIDStr := c.Param("game_id")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("page_size", "20"))

	filters := LeaderboardFilters{
		Page:     page,
		PageSize: pageSize,
		Period:   c.DefaultQuery("period", "all_time"),
	}

	entries, total, err := h.service.GetGameLeaderboard(c.Request.Context(), gameID, filters)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccessWithMeta(c.Writer, gin.H{"leaderboard": entries}, gin.H{
		"total_items": total,
		"page":        filters.Page,
		"page_size":   filters.PageSize,
	})
}

func (h *LeaderboardHandler) GetUserRank(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	var gameID *uuid.UUID
	if gameIDStr := c.Query("game_id"); gameIDStr != "" {
		id, err := uuid.Parse(gameIDStr)
		if err != nil {
			response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
			return
		}
		gameID = &id
	}

	rank, err := h.service.GetUserRank(c.Request.Context(), userUUID, gameID)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"rank": rank})
}

func (h *LeaderboardHandler) SubmitScore(c *gin.Context) {
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

	var req SubmitScoreRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.service.SubmitScore(c.Request.Context(), userUUID, gameID, req.Score); err != nil {
		response.WriteError(c.Writer, "SUBMIT_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Score submitted successfully"})
}
