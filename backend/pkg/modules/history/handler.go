package history

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/pagination"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/response"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/validator"
)

type PlayHistoryHandler struct {
	historyService PlayHistoryService
}

func NewPlayHistoryHandler(historyService PlayHistoryService) *PlayHistoryHandler {
	return &PlayHistoryHandler{historyService: historyService}
}

type RecordPlayRequest struct {
	GameID          uuid.UUID `json:"game_id" binding:"required"`
	DurationSeconds int       `json:"duration_seconds" binding:"omitempty,min=0"`
	DeviceType      *string   `json:"device_type,omitempty" binding:"omitempty,max=50"`
	Source          *string   `json:"source,omitempty" binding:"omitempty,max=50"`
}

func (h *PlayHistoryHandler) RecordPlay(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	var req RecordPlayRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Validation failed", 422, err.Error())
		return
	}

	input := CreatePlayHistoryInput{
		UserID:          userUUID,
		GameID:          req.GameID,
		DurationSeconds: req.DurationSeconds,
		DeviceType:      req.DeviceType,
		Source:          req.Source,
	}

	historyEntry, err := h.historyService.RecordPlay(c.Request.Context(), input)
	if err != nil {
		response.WriteError(c.Writer, "RECORD_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"history": historyEntry}, 201)
}

func (h *PlayHistoryHandler) GetHistory(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	params := pagination.ParseParams(c)

	filters := PlayHistoryFilters{
		Page:     params.Page,
		PageSize: params.PageSize,
		SortBy:   params.SortBy,
		SortDesc: params.SortDesc,
	}

	if startDate := c.Query("start_date"); startDate != "" {
		filters.StartDate = &startDate
	}
	if endDate := c.Query("end_date"); endDate != "" {
		filters.EndDate = &endDate
	}

	historyList, total, err := h.historyService.GetHistory(c.Request.Context(), userUUID, filters)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	meta := pagination.NewPage(historyList, total, params)
	response.WriteSuccessWithMeta(c.Writer, historyList, meta)
}

func (h *PlayHistoryHandler) GetStats(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	stats, err := h.historyService.GetStats(c.Request.Context(), userUUID)
	if err != nil {
		response.WriteError(c.Writer, "STATS_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"stats": stats})
}

func (h *PlayHistoryHandler) DeleteEntry(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid history ID", 400)
		return
	}

	if err := h.historyService.DeleteEntry(c.Request.Context(), id); err != nil {
		response.WriteError(c.Writer, "DELETE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "History entry deleted"})
}
