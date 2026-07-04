package users

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/modules/users"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/validator"
)

type UserHandler struct {
	userService users.UserService
}

func NewUserHandler(userService users.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

type UpdateProfileRequest struct {
	Name      *string `json:"name,omitempty" binding:"omitempty,min=2,max=100"`
	Username  *string `json:"username,omitempty" binding:"omitempty,min=3,max=50,alphanum"`
	Email     *string `json:"email,omitempty" binding:"omitempty,email"`
	AvatarURL *string `json:"avatar_url,omitempty" binding:"omitempty,url"`
	Bio       *string `json:"bio,omitempty" binding:"omitempty,max=500"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=8"`
}

func (h *UserHandler) GetProfile(c *gin.Context) {
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

func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	input := users.UpdateUserInput{
		Name:      req.Name,
		Username:  req.Username,
		Email:     req.Email,
		AvatarURL: req.AvatarURL,
		Bio:       req.Bio,
	}

	profile, err := h.userService.UpdateProfile(c.Request.Context(), userUUID, input)
	if err != nil {
		response.WriteError(c.Writer, "UPDATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"user": profile})
}

func (h *UserHandler) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.userService.ChangePassword(c.Request.Context(), userUUID, req.OldPassword, req.NewPassword); err != nil {
		response.WriteError(c.Writer, "PASSWORD_CHANGE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Password changed successfully"})
}

func (h *UserHandler) DeleteAccount(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.userService.DeleteAccount(c.Request.Context(), userUUID); err != nil {
		response.WriteError(c.Writer, "DELETE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Account deleted successfully"})
}

// Admin endpoints
func (h *UserHandler) ListUsers(c *gin.Context) {
	offset := 0
	limit := 20
	// Parse pagination params
	// ... pagination logic

	usersList, total, err := h.userService.ListUsers(c.Request.Context(), offset, limit)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{
		"users": usersList,
		"pagination": gin.H{
			"page":        1,
			"page_size":   limit,
			"total_items": total,
			"total_pages": (total + int64(limit) - 1) / int64(limit),
		},
	})
}

func (h *UserHandler) GetUserByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid user ID", 400)
		return
	}

	user, err := h.userService.GetUserByID(c.Request.Context(), id)
	if err != nil {
		response.WriteError(c.Writer, "USER_NOT_FOUND", "User not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"user": user})
}

func (h *UserHandler) AdminUpdateUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid user ID", 400)
		return
	}

	var req UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	input := users.UpdateUserInput{
		Name:      req.Name,
		Username:  req.Username,
		Email:     req.Email,
		AvatarURL: req.AvatarURL,
		Bio:       req.Bio,
	}

	user, err := h.userService.AdminUpdateUser(c.Request.Context(), id, input)
	if err != nil {
		response.WriteError(c.Writer, "UPDATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"user": user})
}

func (h *UserHandler) AdminDeleteUser(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid user ID", 400)
		return
	}

	if err := h.userService.AdminDeleteUser(c.Request.Context(), id); err != nil {
		response.WriteError(c.Writer, "DELETE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "User deleted successfully"})
}
