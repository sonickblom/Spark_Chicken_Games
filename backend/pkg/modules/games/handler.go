package games

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/pagination"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/response"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/validator"
)

type GameHandler struct {
	gameService GameService
}

func NewGameHandler(gameService GameService) *GameHandler {
	return &GameHandler{gameService: gameService}
}

type CreateGameRequest struct {
	Slug             string      `json:"slug" binding:"required,min=3,max=100"`
	Title            string      `json:"title" binding:"required,min=3,max=200"`
	Description      string      `json:"description" binding:"required"`
	ShortDescription *string     `json:"short_description,omitempty" binding:"omitempty,max=500"`
	ThumbnailURL     *string     `json:"thumbnail_url,omitempty" binding:"omitempty,url"`
	BannerURL        *string     `json:"banner_url,omitempty" binding:"omitempty,url"`
	GameURL          string      `json:"game_url" binding:"required,url"`
	EmbedURL         *string     `json:"embed_url,omitempty" binding:"omitempty,url"`
	Platform         *string     `json:"platform,omitempty" binding:"omitempty,max=50"`
	Status           string      `json:"status" binding:"required,oneof=draft published archived hidden"`
	IsFeatured       bool        `json:"is_featured"`
	IsNew            bool        `json:"is_new"`
	IsPopular        bool        `json:"is_popular"`
	CategoryIDs      []uuid.UUID `json:"category_ids,omitempty"`
	TagIDs           []uuid.UUID `json:"tag_ids,omitempty"`
}

type UpdateGameRequest struct {
	Title            *string     `json:"title,omitempty" binding:"omitempty,min=3,max=200"`
	Description      *string     `json:"description,omitempty"`
	ShortDescription *string     `json:"short_description,omitempty" binding:"omitempty,max=500"`
	ThumbnailURL     *string     `json:"thumbnail_url,omitempty" binding:"omitempty,url"`
	BannerURL        *string     `json:"banner_url,omitempty" binding:"omitempty,url"`
	GameURL          *string     `json:"game_url,omitempty" binding:"omitempty,url"`
	EmbedURL         *string     `json:"embed_url,omitempty" binding:"omitempty,url"`
	Platform         *string     `json:"platform,omitempty" binding:"omitempty,max=50"`
	Status           *string     `json:"status,omitempty" binding:"omitempty,oneof=draft published archived hidden"`
	IsFeatured       *bool       `json:"is_featured,omitempty"`
	IsNew            *bool       `json:"is_new,omitempty"`
	IsPopular        *bool       `json:"is_popular,omitempty"`
	CategoryIDs      []uuid.UUID `json:"category_ids,omitempty"`
	TagIDs           []uuid.UUID `json:"tag_ids,omitempty"`
}

func (h *GameHandler) Create(c *gin.Context) {
	var req CreateGameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Validation failed", 422, err.Error())
		return
	}

	input := CreateGameInput{
		Slug:             req.Slug,
		Title:            req.Title,
		Description:      req.Description,
		ShortDescription: req.ShortDescription,
		ThumbnailURL:     req.ThumbnailURL,
		BannerURL:        req.BannerURL,
		GameURL:          req.GameURL,
		EmbedURL:         req.EmbedURL,
		Platform:         req.Platform,
		Status:           req.Status,
		IsFeatured:       req.IsFeatured,
		IsNew:            req.IsNew,
		IsPopular:        req.IsPopular,
		CategoryIDs:      req.CategoryIDs,
		TagIDs:           req.TagIDs,
	}

	game, err := h.gameService.Create(c.Request.Context(), input)
	if err != nil {
		response.WriteError(c.Writer, "CREATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"game": game}, 201)
}

func (h *GameHandler) GetByID(c *gin.Context) {
	idStr := gameIDParam(c)
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	game, err := h.gameService.GetByID(c.Request.Context(), id)
	if err != nil {
		response.WriteError(c.Writer, "GAME_NOT_FOUND", "Game not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"game": game})
}

func (h *GameHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	game, err := h.gameService.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		response.WriteError(c.Writer, "GAME_NOT_FOUND", "Game not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"game": game})
}

func (h *GameHandler) Update(c *gin.Context) {
	idStr := gameIDParam(c)
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	var req UpdateGameRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	input := UpdateGameInput{
		Title:            req.Title,
		Description:      req.Description,
		ShortDescription: req.ShortDescription,
		ThumbnailURL:     req.ThumbnailURL,
		BannerURL:        req.BannerURL,
		GameURL:          req.GameURL,
		EmbedURL:         req.EmbedURL,
		Platform:         req.Platform,
		Status:           req.Status,
		IsFeatured:       req.IsFeatured,
		IsNew:            req.IsNew,
		IsPopular:        req.IsPopular,
		CategoryIDs:      req.CategoryIDs,
		TagIDs:           req.TagIDs,
	}

	game, err := h.gameService.Update(c.Request.Context(), id, input)
	if err != nil {
		response.WriteError(c.Writer, "UPDATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"game": game})
}

func (h *GameHandler) Delete(c *gin.Context) {
	idStr := gameIDParam(c)
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	if err := h.gameService.Delete(c.Request.Context(), id); err != nil {
		response.WriteError(c.Writer, "DELETE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Game deleted successfully"})
}

func (h *GameHandler) List(c *gin.Context) {
	params := pagination.ParseParams(c)

	filters := GameFilters{
		Search:   params.Search,
		SortBy:   params.SortBy,
		SortDesc: params.SortDesc,
		Page:     params.Page,
		PageSize: params.PageSize,
	}

	// Parse optional filters
	if catIDStr := c.Query("category_id"); catIDStr != "" {
		if catID, err := uuid.Parse(catIDStr); err == nil {
			filters.CategoryID = &catID
		}
	}
	if tagIDStr := c.Query("tag_id"); tagIDStr != "" {
		if tagID, err := uuid.Parse(tagIDStr); err == nil {
			filters.TagID = &tagID
		}
	}
	if status := c.Query("status"); status != "" {
		filters.Status = &status
	}
	if platform := c.Query("platform"); platform != "" {
		filters.Platform = &platform
	}
	if isFeaturedStr := c.Query("is_featured"); isFeaturedStr != "" {
		if val, err := strconv.ParseBool(isFeaturedStr); err == nil {
			filters.IsFeatured = &val
		}
	}
	if isNewStr := c.Query("is_new"); isNewStr != "" {
		if val, err := strconv.ParseBool(isNewStr); err == nil {
			filters.IsNew = &val
		}
	}
	if isPopularStr := c.Query("is_popular"); isPopularStr != "" {
		if val, err := strconv.ParseBool(isPopularStr); err == nil {
			filters.IsPopular = &val
		}
	}

	gamesList, total, err := h.gameService.List(c.Request.Context(), filters)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	meta := pagination.NewPage(gamesList, total, params)
	response.WriteSuccessWithMeta(c.Writer, gamesList, meta)
}

func (h *GameHandler) GetFeatured(c *gin.Context) {
	limit := 10
	if limitStr := c.Query("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 50 {
			limit = l
		}
	}

	gamesList, err := h.gameService.GetFeatured(c.Request.Context(), limit)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"games": gamesList})
}

func (h *GameHandler) GetNew(c *gin.Context) {
	limit := 10
	if limitStr := c.Query("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 50 {
			limit = l
		}
	}

	gamesList, err := h.gameService.GetNew(c.Request.Context(), limit)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"games": gamesList})
}

func (h *GameHandler) GetPopular(c *gin.Context) {
	limit := 10
	if limitStr := c.Query("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 50 {
			limit = l
		}
	}

	gamesList, err := h.gameService.GetPopular(c.Request.Context(), limit)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"games": gamesList})
}

func (h *GameHandler) PlayGame(c *gin.Context) {
	idStr := gameIDParam(c)
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	if err := h.gameService.IncrementPlayCount(c.Request.Context(), id); err != nil {
		response.WriteError(c.Writer, "PLAY_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Play count incremented"})
}

func gameIDParam(c *gin.Context) string {
	if id := c.Param("id"); id != "" {
		return id
	}
	return c.Param("game_id")
}
