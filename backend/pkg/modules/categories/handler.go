package categories

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/pagination"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/response"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/validator"
)

type CategoryHandler struct {
	categoryService CategoryService
}

func NewCategoryHandler(categoryService CategoryService) *CategoryHandler {
	return &CategoryHandler{categoryService: categoryService}
}

type CreateCategoryRequest struct {
	Slug        string  `json:"slug" binding:"required,min=2,max=50"`
	Name        string  `json:"name" binding:"required,min=2,max=100"`
	Description *string `json:"description,omitempty" binding:"omitempty,max=500"`
	IconURL     *string `json:"icon_url,omitempty" binding:"omitempty,url"`
}

type UpdateCategoryRequest struct {
	Name        *string `json:"name,omitempty" binding:"omitempty,min=2,max=100"`
	Description *string `json:"description,omitempty" binding:"omitempty,max=500"`
	IconURL     *string `json:"icon_url,omitempty" binding:"omitempty,url"`
}

func (h *CategoryHandler) Create(c *gin.Context) {
	var req CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Validation failed", 422, err.Error())
		return
	}

	input := CreateCategoryInput{
		Slug:        req.Slug,
		Name:        req.Name,
		Description: req.Description,
		IconURL:     req.IconURL,
	}

	category, err := h.categoryService.Create(c.Request.Context(), input)
	if err != nil {
		response.WriteError(c.Writer, "CREATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"category": category}, 201)
}

func (h *CategoryHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid category ID", 400)
		return
	}

	category, err := h.categoryService.GetByID(c.Request.Context(), id)
	if err != nil {
		response.WriteError(c.Writer, "CATEGORY_NOT_FOUND", "Category not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"category": category})
}

func (h *CategoryHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	category, err := h.categoryService.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		response.WriteError(c.Writer, "CATEGORY_NOT_FOUND", "Category not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"category": category})
}

func (h *CategoryHandler) Update(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid category ID", 400)
		return
	}

	var req UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	input := UpdateCategoryInput{
		Name:        req.Name,
		Description: req.Description,
		IconURL:     req.IconURL,
	}

	category, err := h.categoryService.Update(c.Request.Context(), id, input)
	if err != nil {
		response.WriteError(c.Writer, "UPDATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"category": category})
}

func (h *CategoryHandler) Delete(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid category ID", 400)
		return
	}

	if err := h.categoryService.Delete(c.Request.Context(), id); err != nil {
		response.WriteError(c.Writer, "DELETE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Category deleted successfully"})
}

func (h *CategoryHandler) List(c *gin.Context) {
	params := pagination.ParseParams(c)

	filters := CategoryFilters{
		Search:   params.Search,
		SortBy:   params.SortBy,
		SortDesc: params.SortDesc,
		Page:     params.Page,
		PageSize: params.PageSize,
	}

	categoriesList, total, err := h.categoryService.List(c.Request.Context(), filters)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	meta := pagination.NewPage(categoriesList, total, params)
	response.WriteSuccessWithMeta(c.Writer, categoriesList, meta)
}

func (h *CategoryHandler) ListWithGameCount(c *gin.Context) {
	params := pagination.ParseParams(c)

	filters := CategoryFilters{
		Search:   params.Search,
		SortBy:   params.SortBy,
		SortDesc: params.SortDesc,
		Page:     params.Page,
		PageSize: params.PageSize,
	}

	categoriesList, total, err := h.categoryService.ListWithGameCount(c.Request.Context(), filters)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	meta := pagination.NewPage(categoriesList, total, params)
	response.WriteSuccessWithMeta(c.Writer, categoriesList, meta)
}
