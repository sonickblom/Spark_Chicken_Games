package auth

import (
	"context"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/auth"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/errors"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
)

const (
	ContextUserID   = "user_id"
	ContextUsername = "username"
	ContextEmail    = "email"
	ContextRole     = "role"
)

// RoleChecker is an interface for looking up a user's role name from the database.
// This allows the middleware to freshen the role claim from the DB on every request,
// ensuring admin permissions are always up-to-date.
type RoleChecker interface {
	GetUserRoleName(ctx context.Context, userID uuid.UUID) (string, error)
}

func AuthMiddleware(jwtService *auth.JWTService, roleChecker ...RoleChecker) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.WriteError(c.Writer, errors.ErrUnauthorized.Error(), "Authorization header required", 401)
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			response.WriteError(c.Writer, errors.ErrInvalidToken.Error(), "Invalid authorization header format", 401)
			c.Abort()
			return
		}

		claims, err := jwtService.ValidateAccessToken(parts[1])
		if err != nil {
			switch err {
			case auth.ErrExpiredToken:
				response.WriteError(c.Writer, errors.ErrTokenExpired.Error(), "Token has expired", 401)
			case auth.ErrInvalidToken:
				response.WriteError(c.Writer, errors.ErrInvalidToken.Error(), "Invalid token", 401)
			default:
				response.WriteError(c.Writer, errors.ErrInvalidToken.Error(), "Token validation failed", 401)
			}
			c.Abort()
			return
		}

		c.Set(ContextUserID, claims.UserID)
		c.Set(ContextUsername, claims.Username)
		c.Set(ContextEmail, claims.Email)
		c.Set(ContextRole, claims.Role)

		// If a RoleChecker was provided, freshen the role from the database.
		// This ensures admin endpoints always see the latest role assignment,
		// even if the JWT was issued before a role change.
		if len(roleChecker) > 0 && roleChecker[0] != nil {
			if roleName, err := roleChecker[0].GetUserRoleName(c.Request.Context(), claims.UserID); err == nil && roleName != "" {
				c.Set(ContextRole, roleName)
			}
		}

		c.Next()
	}
}

func OptionalAuthMiddleware(jwtService *auth.JWTService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.Next()
			return
		}

		claims, err := jwtService.ValidateAccessToken(parts[1])
		if err != nil {
			c.Next()
			return
		}

		c.Set(ContextUserID, claims.UserID)
		c.Set(ContextUsername, claims.Username)
		c.Set(ContextEmail, claims.Email)
		c.Set(ContextRole, claims.Role)

		c.Next()
	}
}

func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get(ContextRole)
		if !exists {
			response.WriteError(c.Writer, errors.ErrForbidden.Error(), "Role not found in context", 403)
			c.Abort()
			return
		}

		role, ok := roleVal.(string)
		if !ok {
			response.WriteError(c.Writer, errors.ErrForbidden.Error(), "Invalid role format", 403)
			c.Abort()
			return
		}

		allowed := false
		for _, r := range roles {
			if r == role {
				allowed = true
				break
			}
		}

		if !allowed {
			response.WriteError(c.Writer, errors.ErrForbidden.Error(), "Insufficient permissions", 403)
			c.Abort()
			return
		}

		c.Next()
	}
}

func RequireAdmin() gin.HandlerFunc {
	return RequireRole("admin")
}

func RequireModerator() gin.HandlerFunc {
	return RequireRole("admin", "moderator")
}

func GetUserID(c *gin.Context) (string, bool) {
	val, exists := c.Get(ContextUserID)
	if !exists {
		return "", false
	}
	id, ok := val.(string)
	return id, ok
}

func GetUserUUID(c *gin.Context) (string, bool) {
	val, exists := c.Get(ContextUserID)
	if !exists {
		return "", false
	}
	id, ok := val.(string)
	return id, ok
}
