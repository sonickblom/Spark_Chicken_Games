package ads

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
)

type AdHandler struct {
	service AdService
}

func NewAdHandler(service AdService) *AdHandler {
	return &AdHandler{service: service}
}

type CreateAdRequest struct {
	Title       string  `json:"title" binding:"required,max=200"`
	Type        string  `json:"type" binding:"required,oneof=banner interstitial rewarded native"`
	ImageURL    *string `json:"image_url,omitempty"`
	TargetURL   *string `json:"target_url,omitempty"`
	Description *string `json:"description,omitempty"`
	Priority    int     `json:"priority"`
}

func (h *AdHandler) Create(c *gin.Context) {
	var req CreateAdRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	input := CreateAdInput{
		Title:       req.Title,
		Type:        AdType(req.Type),
		ImageURL:    req.ImageURL,
		TargetURL:   req.TargetURL,
		Description: req.Description,
		Priority:    req.Priority,
	}

	ad, err := h.service.Create(c.Request.Context(), input)
	if err != nil {
		response.WriteError(c.Writer, "CREATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"ad": ad}, 201)
}

func (h *AdHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid ad ID", 400)
		return
	}

	ad, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		response.WriteError(c.Writer, "NOT_FOUND", "Ad not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"ad": ad})
}

func (h *AdHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid ad ID", 400)
		return
	}

	var req CreateAdRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	input := CreateAdInput{
		Title:       req.Title,
		Type:        AdType(req.Type),
		ImageURL:    req.ImageURL,
		TargetURL:   req.TargetURL,
		Description: req.Description,
		Priority:    req.Priority,
	}

	ad, err := h.service.Update(c.Request.Context(), id, input)
	if err != nil {
		response.WriteError(c.Writer, "UPDATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"ad": ad})
}

func (h *AdHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid ad ID", 400)
		return
	}

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		response.WriteError(c.Writer, "DELETE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Ad deleted successfully"})
}

func (h *AdHandler) List(c *gin.Context) {
	ads, total, err := h.service.List(c.Request.Context(), AdFilters{Page: 1, PageSize: 20})
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccessWithMeta(c.Writer, gin.H{"ads": ads}, gin.H{"total_items": total})
}

func (h *AdHandler) GetActive(c *gin.Context) {
	adType := c.DefaultQuery("type", "banner")

	ads, err := h.service.GetActive(c.Request.Context(), adType)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"ads": ads})
}

func (h *AdHandler) RecordImpression(c *gin.Context) {
	idStr := c.Param("id")
	adID, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid ad ID", 400)
		return
	}

	var userID *uuid.UUID
	if uid, exists := c.Get("user_id"); exists {
		id, ok := uid.(uuid.UUID)
		if !ok {
			parsedID, _ := uuid.Parse(uid.(string))
			id = parsedID
		}
		userID = &id
	}

	if err := h.service.RecordImpression(c.Request.Context(), adID, userID, nil); err != nil {
		response.WriteError(c.Writer, "RECORD_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Impression recorded"})
}

func (h *AdHandler) RecordClick(c *gin.Context) {
	idStr := c.Param("id")
	adID, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid ad ID", 400)
		return
	}

	var userID *uuid.UUID
	if uid, exists := c.Get("user_id"); exists {
		id, ok := uid.(uuid.UUID)
		if !ok {
			parsedID, _ := uuid.Parse(uid.(string))
			id = parsedID
		}
		userID = &id
	}

	if err := h.service.RecordClick(c.Request.Context(), adID, userID); err != nil {
		response.WriteError(c.Writer, "RECORD_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Click recorded"})
}

func (h *AdHandler) GetStats(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid ad ID", 400)
		return
	}

	stats, err := h.service.GetStats(c.Request.Context(), id)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"stats": stats})
}
