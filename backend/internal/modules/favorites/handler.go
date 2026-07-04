package favorites

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/pagination"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/validator"
)

type FavoriteHandler struct {
	favoriteService FavoriteService
}

func NewFavoriteHandler(favoriteService FavoriteService) *FavoriteHandler {
	return &FavoriteHandler{favoriteService: favoriteService}
}

type AddFavoriteRequest struct {
	GameID uuid.UUID `json:"game_id" binding:"required"`
}

func (h *FavoriteHandler) Add(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	var req AddFavoriteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Validation failed", 422, err.Error())
		return
	}

	favorite, err := h.favoriteService.Add(c.Request.Context(), userUUID, req.GameID)
	if err != nil {
		response.WriteError(c.Writer, "ADD_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"favorite": favorite}, 201)
}

func (h *FavoriteHandler) Remove(c *gin.Context) {
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

	if err := h.favoriteService.Remove(c.Request.Context(), userUUID, gameID); err != nil {
		response.WriteError(c.Writer, "REMOVE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Removed from favorites"})
}

func (h *FavoriteHandler) RemoveByID(c *gin.Context) {
	_, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	favoriteIDStr := c.Param("id")
	favoriteID, err := uuid.Parse(favoriteIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid favorite ID", 400)
		return
	}

	if err := h.favoriteService.RemoveByID(c.Request.Context(), favoriteID); err != nil {
		response.WriteError(c.Writer, "REMOVE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Removed from favorites"})
}

func (h *FavoriteHandler) List(c *gin.Context) {
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

	filters := FavoriteFilters{
		Page:     params.Page,
		PageSize: params.PageSize,
		SortBy:   params.SortBy,
		SortDesc: params.SortDesc,
	}

	favoritesList, total, err := h.favoriteService.ListByUser(c.Request.Context(), userUUID, filters)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	meta := pagination.NewPage(favoritesList, total, params)
	response.WriteSuccessWithMeta(c.Writer, favoritesList, meta)
}

func (h *FavoriteHandler) Check(c *gin.Context) {
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

	isFavorite, err := h.favoriteService.Check(c.Request.Context(), userUUID, gameID)
	if err != nil {
		response.WriteError(c.Writer, "CHECK_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"is_favorite": isFavorite})
}

func (h *FavoriteHandler) Count(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	count, err := h.favoriteService.CountByUser(c.Request.Context(), userUUID)
	if err != nil {
		response.WriteError(c.Writer, "COUNT_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"count": count})
}
