package pagination

import (
	"math"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type Page struct {
	Page       int         `json:"page"`
	PageSize   int         `json:"page_size"`
	TotalItems int64       `json:"total_items"`
	TotalPages int         `json:"total_pages"`
	Items      interface{} `json:"items"`
}

type Params struct {
	Page     int    `form:"page" binding:"omitempty,min=1"`
	PageSize int    `form:"page_size" binding:"omitempty,min=1,max=100"`
	SortBy   string `form:"sort_by"`
	SortDesc bool   `form:"sort_desc"`
	Search   string `form:"search"`
}

func DefaultParams() Params {
	return Params{
		Page:     1,
		PageSize: 20,
		SortBy:   "created_at",
		SortDesc: true,
	}
}

func (p *Params) Bind(c *gin.Context) error {
	if err := c.ShouldBindQuery(p); err != nil {
		return err
	}
	if p.Page <= 0 {
		p.Page = 1
	}
	if p.PageSize <= 0 {
		p.PageSize = 20
	}
	if p.PageSize > 100 {
		p.PageSize = 100
	}
	if p.SortBy == "" {
		p.SortBy = "created_at"
	}
	return nil
}

func (p *Params) Offset() int {
	return (p.Page - 1) * p.PageSize
}

func (p *Params) Limit() int {
	return p.PageSize
}

func (p *Params) OrderBy() string {
	order := "ASC"
	if p.SortDesc {
		order = "DESC"
	}
	// Validate sort column to prevent SQL injection
	allowedColumns := map[string]bool{
		"created_at":    true,
		"updated_at":    true,
		"name":          true,
		"title":         true,
		"email":         true,
		"username":      true,
		"play_count":    true,
		"score":         true,
		"rating_avg":    true,
		"published_at":  true,
		"last_login_at": true,
	}
	col := strings.ToLower(p.SortBy)
	if !allowedColumns[col] {
		p.SortBy = "created_at"
	}
	return p.SortBy + " " + order
}

func NewPage(items interface{}, totalItems int64, params Params) *Page {
	totalPages := int(math.Ceil(float64(totalItems) / float64(params.PageSize)))
	if totalPages < 1 {
		totalPages = 1
	}
	return &Page{
		Page:       params.Page,
		PageSize:   params.PageSize,
		TotalItems: totalItems,
		TotalPages: totalPages,
		Items:      items,
	}
}

func ParseParams(c *gin.Context) Params {
	params := DefaultParams()
	_ = c.ShouldBindQuery(&params)
	return params
}

func ParseCursor(c *gin.Context) (cursor string, limit int) {
	cursor = c.Query("cursor")
	limitStr := c.Query("limit")
	limit = 20
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
			limit = l
		}
	}
	return cursor, limit
}

type CursorPage struct {
	Items      interface{} `json:"items"`
	NextCursor string      `json:"next_cursor,omitempty"`
	HasMore    bool        `json:"has_more"`
}

func NewCursorPage(items interface{}, nextCursor string, hasMore bool) *CursorPage {
	return &CursorPage{
		Items:      items,
		NextCursor: nextCursor,
		HasMore:    hasMore,
	}
}
