package progress

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/response"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/validator"
)

type ProgressHandler struct {
	progressService ProgressService
}

func NewProgressHandler(progressService ProgressService) *ProgressHandler {
	return &ProgressHandler{progressService: progressService}
}

type SaveProgressRequest struct {
	GameID       uuid.UUID `json:"game_id" binding:"required"`
	ProgressData string    `json:"progress_data" binding:"required"`
}

type UpdateProgressRequest struct {
	ProgressData string `json:"progress_data" binding:"required"`
}

func (h *ProgressHandler) SaveProgress(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	var req SaveProgressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Validation failed", 422, err.Error())
		return
	}

	input := CreateProgressInput{
		UserID:       userUUID,
		GameID:       req.GameID,
		ProgressData: req.ProgressData,
	}

	progress, err := h.progressService.SaveProgress(c.Request.Context(), input)
	if err != nil {
		response.WriteError(c.Writer, "SAVE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"progress": progress})
}

func (h *ProgressHandler) GetProgress(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	gameIDStr := c.Param("gameId")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	progress, err := h.progressService.GetProgress(c.Request.Context(), userUUID, gameID)
	if err != nil {
		response.WriteError(c.Writer, "PROGRESS_NOT_FOUND", "Progress not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"progress": progress})
}

func (h *ProgressHandler) UpdateProgress(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	gameIDStr := c.Param("gameId")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	var req UpdateProgressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Validation failed", 422, err.Error())
		return
	}

	input := UpdateProgressInput{
		ProgressData: req.ProgressData,
	}

	progress, err := h.progressService.UpdateProgress(c.Request.Context(), userUUID, gameID, input)
	if err != nil {
		response.WriteError(c.Writer, "UPDATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"progress": progress})
}

func (h *ProgressHandler) DeleteProgress(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	gameIDStr := c.Param("gameId")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	if err := h.progressService.DeleteProgress(c.Request.Context(), userUUID, gameID); err != nil {
		response.WriteError(c.Writer, "DELETE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Progress deleted"})
}

func (h *ProgressHandler) ListProgress(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	progressList, err := h.progressService.ListProgress(c.Request.Context(), userUUID)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"progress": progressList})
}
