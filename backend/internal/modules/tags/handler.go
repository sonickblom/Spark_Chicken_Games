package tags

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/pagination"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/validator"
)

type TagHandler struct {
	tagService TagService
}

func NewTagHandler(tagService TagService) *TagHandler {
	return &TagHandler{tagService: tagService}
}

type CreateTagRequest struct {
	Slug string `json:"slug" binding:"required,min=2,max=50"`
	Name string `json:"name" binding:"required,min=2,max=50"`
}

type UpdateTagRequest struct {
	Name *string `json:"name,omitempty" binding:"omitempty,min=2,max=50"`
}

func (h *TagHandler) Create(c *gin.Context) {
	var req CreateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Validation failed", 422, err.Error())
		return
	}

	input := CreateTagInput{
		Slug: req.Slug,
		Name: req.Name,
	}

	tag, err := h.tagService.Create(c.Request.Context(), input)
	if err != nil {
		response.WriteError(c.Writer, "CREATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"tag": tag}, 201)
}

func (h *TagHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid tag ID", 400)
		return
	}

	tag, err := h.tagService.GetByID(c.Request.Context(), id)
	if err != nil {
		response.WriteError(c.Writer, "TAG_NOT_FOUND", "Tag not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"tag": tag})
}

func (h *TagHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	tag, err := h.tagService.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		response.WriteError(c.Writer, "TAG_NOT_FOUND", "Tag not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"tag": tag})
}

func (h *TagHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid tag ID", 400)
		return
	}

	var req UpdateTagRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	input := UpdateTagInput{
		Name: req.Name,
	}

	tag, err := h.tagService.Update(c.Request.Context(), id, input)
	if err != nil {
		response.WriteError(c.Writer, "UPDATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"tag": tag})
}

func (h *TagHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid tag ID", 400)
		return
	}

	if err := h.tagService.Delete(c.Request.Context(), id); err != nil {
		response.WriteError(c.Writer, "DELETE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Tag deleted successfully"})
}

func (h *TagHandler) List(c *gin.Context) {
	params := pagination.ParseParams(c)

	filters := TagFilters{
		Search:   params.Search,
		SortBy:   params.SortBy,
		SortDesc: params.SortDesc,
		Page:     params.Page,
		PageSize: params.PageSize,
	}

	tagsList, total, err := h.tagService.List(c.Request.Context(), filters)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	meta := pagination.NewPage(tagsList, total, params)
	response.WriteSuccessWithMeta(c.Writer, tagsList, meta)
}

func (h *TagHandler) ListWithGameCount(c *gin.Context) {
	params := pagination.ParseParams(c)

	filters := TagFilters{
		Search:   params.Search,
		SortBy:   params.SortBy,
		SortDesc: params.SortDesc,
		Page:     params.Page,
		PageSize: params.PageSize,
	}

	tagsList, total, err := h.tagService.ListWithGameCount(c.Request.Context(), filters)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	meta := pagination.NewPage(tagsList, total, params)
	response.WriteSuccessWithMeta(c.Writer, tagsList, meta)
}
