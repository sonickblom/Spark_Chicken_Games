package auth

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/modules/users"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/errors"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/validator"
)

type AuthHandler struct {
	userService users.UserService
}

func NewAuthHandler(userService users.UserService) *AuthHandler {
	return &AuthHandler{userService: userService}
}

type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=2,max=100" validate:"required,min=2,max=100"`
	Username string `json:"username" binding:"required,min=3,max=50,alphanum" validate:"required,min=3,max=50,alphanum"`
	Email    string `json:"email" binding:"required,email" validate:"required,email"`
	Password string `json:"password" binding:"required,min=8" validate:"required,min=8"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email" validate:"required,email"`
	Password string `json:"password" binding:"required" validate:"required"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type LogoutRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=8"`
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	if err := validator.Validate.Struct(req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Validation failed", 422, err.Error())
		return
	}

	// Auto-assign admin role only if username is "Samuteg" (case-insensitive)
	// Use dynamic role ID lookup from database for robustness
	ctx := c.Request.Context()
	userRoleID, err := h.userService.GetRoleIDByName(ctx, "user")
	if err != nil {
		userRoleID = uuid.MustParse("00000000-0000-0000-0000-000000000003") // fallback hardcoded
	}

	roleID := userRoleID
	if strings.EqualFold(req.Username, "Samuteg") {
		adminRoleID, err := h.userService.GetRoleIDByName(ctx, "admin")
		if err != nil {
			adminRoleID = uuid.MustParse("00000000-0000-0000-0000-000000000001") // fallback hardcoded
		}
		roleID = adminRoleID
	}

	input := users.CreateUserInput{
		RoleID:   roleID,
		Name:     req.Name,
		Username: req.Username,
		Email:    req.Email,
		Password: req.Password,
	}

	profile, tokens, err := h.userService.Register(c.Request.Context(), input)
	if err != nil {
		status := errors.ToHTTPStatus(err)
		response.WriteError(c.Writer, "REGISTRATION_FAILED", err.Error(), status)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{
		"user":   profile,
		"tokens": tokens,
	}, 201)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	profile, tokens, err := h.userService.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		status := errors.ToHTTPStatus(err)
		response.WriteError(c.Writer, "LOGIN_FAILED", err.Error(), status)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{
		"user":   profile,
		"tokens": tokens,
	})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	var req RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	tokens, err := h.userService.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		response.WriteError(c.Writer, "TOKEN_REFRESH_FAILED", "Failed to refresh token", 401)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"tokens": tokens})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	var req LogoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		// Try parsing from string
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.userService.Logout(c.Request.Context(), userUUID, req.RefreshToken); err != nil {
		response.WriteError(c.Writer, "LOGOUT_FAILED", "Failed to logout", 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Logged out successfully"})
}

func (h *AuthHandler) GetMe(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	profile, err := h.userService.GetProfile(c.Request.Context(), userUUID)
	if err != nil {
		response.WriteError(c.Writer, "USER_NOT_FOUND", "User not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"user": profile})
}
