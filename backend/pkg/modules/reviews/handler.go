package reviews

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/response"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/validator"
)

type ReviewHandler struct {
	reviewService ReviewService
}

func NewReviewHandler(reviewService ReviewService) *ReviewHandler {
	return &ReviewHandler{reviewService: reviewService}
}

type CreateReviewRequest struct {
	Rating  int     `json:"rating" binding:"required,min=1,max=5"`
	Comment *string `json:"comment,omitempty" binding:"omitempty,max=1000"`
}

type UpdateReviewRequest struct {
	Rating  *int    `json:"rating,omitempty" binding:"omitempty,min=1,max=5"`
	Comment *string `json:"comment,omitempty" binding:"omitempty,max=1000"`
}

func (h *ReviewHandler) Create(c *gin.Context) {
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

	var req CreateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Validation failed", 422, err.Error())
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	input := CreateReviewInput{
		UserID:  userUUID,
		GameID:  gameID,
		Rating:  req.Rating,
		Comment: req.Comment,
	}

	review, err := h.reviewService.Create(c.Request.Context(), input)
	if err != nil {
		response.WriteError(c.Writer, "CREATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"review": review}, 201)
}

func (h *ReviewHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid review ID", 400)
		return
	}

	review, err := h.reviewService.GetByID(c.Request.Context(), id)
	if err != nil {
		response.WriteError(c.Writer, "NOT_FOUND", "Review not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"review": review})
}

func (h *ReviewHandler) Update(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid review ID", 400)
		return
	}

	var req UpdateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	input := UpdateReviewInput{
		Rating:  req.Rating,
		Comment: req.Comment,
	}

	review, err := h.reviewService.Update(c.Request.Context(), id, userUUID, input)
	if err != nil {
		response.WriteError(c.Writer, "UPDATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"review": review})
}

func (h *ReviewHandler) Delete(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid review ID", 400)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.reviewService.Delete(c.Request.Context(), id, userUUID); err != nil {
		response.WriteError(c.Writer, "DELETE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Review deleted successfully"})
}

func (h *ReviewHandler) ListByGame(c *gin.Context) {
	gameIDStr := c.Param("game_id")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	filters := ReviewFilters{
		Page:     1,
		PageSize: 20,
	}

	reviews, total, err := h.reviewService.ListByGame(c.Request.Context(), gameID, filters)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccessWithMeta(c.Writer, gin.H{"reviews": reviews}, gin.H{
		"total_items": total,
		"page":        filters.Page,
		"page_size":   filters.PageSize,
	})
}

func (h *ReviewHandler) GetAverageRating(c *gin.Context) {
	gameIDStr := c.Param("game_id")
	gameID, err := uuid.Parse(gameIDStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	avg, count, err := h.reviewService.GetAverageRating(c.Request.Context(), gameID)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{
		"average_rating": avg,
		"review_count":   count,
	})
}
