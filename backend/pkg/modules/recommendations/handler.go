package recommendations

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/response"
)

type RecommendationHandler struct {
	service RecommendationService
}

func NewRecommendationHandler(service RecommendationService) *RecommendationHandler {
	return &RecommendationHandler{service: service}
}

func (h *RecommendationHandler) GetPersonalized(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	games, err := h.service.GetPersonalized(c.Request.Context(), userUUID, limit)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"recommendations": games})
}

func (h *RecommendationHandler) GetSimilar(c *gin.Context) {
	gameIDStr := c.Param("game_id")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	games, err := h.service.GetSimilar(c.Request.Context(), gameID, limit)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"similar": games})
}

func (h *RecommendationHandler) GetTrending(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	games, err := h.service.GetTrending(c.Request.Context(), limit)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"trending": games})
}

func (h *RecommendationHandler) GetNewReleases(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	games, err := h.service.GetNewReleases(c.Request.Context(), limit)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"new_releases": games})
}
