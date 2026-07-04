package users

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/auth"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/errors"
)

type UserService interface {
	Register(ctx context.Context, input CreateUserInput) (*UserProfile, *auth.TokenPair, error)
	Login(ctx context.Context, email, password string) (*UserProfile, *auth.TokenPair, error)
	RefreshToken(ctx context.Context, refreshToken string) (*auth.TokenPair, error)
	Logout(ctx context.Context, userID uuid.UUID, refreshToken string) error
	GetProfile(ctx context.Context, userID uuid.UUID) (*UserProfile, error)
	UpdateProfile(ctx context.Context, userID uuid.UUID, input UpdateUserInput) (*UserProfile, error)
	ChangePassword(ctx context.Context, userID uuid.UUID, oldPassword, newPassword string) error
	DeleteAccount(ctx context.Context, userID uuid.UUID) error
	ListUsers(ctx context.Context, offset, limit int) ([]*User, int64, error)
	GetUserByID(ctx context.Context, userID uuid.UUID) (*User, error)
	AdminUpdateUser(ctx context.Context, userID uuid.UUID, input UpdateUserInput) (*User, error)
	AdminDeleteUser(ctx context.Context, userID uuid.UUID) error
}

type userService struct {
	repo       UserRepository
	redis      RedisClient
	jwtService *auth.JWTService
}

type RedisClient interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	Delete(ctx context.Context, keys ...string) error
}

func NewUserService(repo UserRepository, redis RedisClient, jwtService *auth.JWTService) UserService {
	return &userService{
		repo:       repo,
		redis:      redis,
		jwtService: jwtService,
	}
}

func (s *userService) Register(ctx context.Context, input CreateUserInput) (*UserProfile, *auth.TokenPair, error) {
	exists, err := s.repo.ExistsByEmail(ctx, input.Email)
	if err != nil {
		return nil, nil, err
	}
	if exists {
		return nil, nil, errors.ErrEmailExists
	}

	exists, err = s.repo.ExistsByUsername(ctx, input.Username)
	if err != nil {
		return nil, nil, err
	}
	if exists {
		return nil, nil, errors.ErrUsernameExists
	}

	passwordHash, err := auth.HashPassword(input.Password)
	if err != nil {
		return nil, nil, err
	}

	user := &User{
		RoleID:       input.RoleID,
		Name:         input.Name,
		Username:     input.Username,
		Email:        input.Email,
		PasswordHash: passwordHash,
		IsActive:     true,
	}

	if err := s.repo.Create(ctx, user); err != nil {
		return nil, nil, err
	}

	roleName := "user"

	tokens, err := s.jwtService.GenerateTokenPair(user.ID, user.Username, user.Email, roleName)
	if err != nil {
		return nil, nil, err
	}

	refreshKey := "refresh_token:" + tokens.RefreshToken
	if err := s.redis.Set(ctx, refreshKey, user.ID.String(), s.jwtService.GetRefreshTokenExpiry()); err != nil {
		return nil, nil, err
	}

	profile, err := s.repo.GetProfileByID(ctx, user.ID)
	if err != nil {
		return nil, nil, err
	}

	return profile, tokens, nil
}

func (s *userService) Login(ctx context.Context, email, password string) (*UserProfile, *auth.TokenPair, error) {
	user, err := s.repo.GetByEmail(ctx, email)
	if err != nil {
		return nil, nil, errors.ErrInvalidCredentials
	}

	if !user.IsActive {
		return nil, nil, errors.ErrAccountInactive
	}

	if !auth.CheckPasswordHash(password, user.PasswordHash) {
		return nil, nil, errors.ErrInvalidCredentials
	}

	roleName := "user"

	tokens, err := s.jwtService.GenerateTokenPair(user.ID, user.Username, user.Email, roleName)
	if err != nil {
		return nil, nil, err
	}

	refreshKey := "refresh_token:" + tokens.RefreshToken
	if err := s.redis.Set(ctx, refreshKey, user.ID.String(), s.jwtService.GetRefreshTokenExpiry()); err != nil {
		return nil, nil, err
	}

	if err := s.repo.UpdateLastLogin(ctx, user.ID); err != nil {
		// Log error but don't fail login
	}

	profile, err := s.repo.GetProfileByID(ctx, user.ID)
	if err != nil {
		return nil, nil, err
	}

	return profile, tokens, nil
}

func (s *userService) RefreshToken(ctx context.Context, refreshToken string) (*auth.TokenPair, error) {
	_, err := s.jwtService.ValidateRefreshToken(refreshToken)
	if err != nil {
		return nil, err
	}

	refreshKey := "refresh_token:" + refreshToken
	userIDStr, err := s.redis.Get(ctx, refreshKey)
	if err != nil {
		return nil, errors.ErrRefreshTokenRevoked
	}

	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return nil, errors.ErrInvalidRefreshToken
	}

	user, err := s.repo.GetByID(ctx, userID)
	if err != nil {
		return nil, errors.ErrUserNotFound
	}

	if !user.IsActive {
		return nil, errors.ErrAccountInactive
	}

	roleName := "user"

	newTokens, err := s.jwtService.GenerateTokenPair(user.ID, user.Username, user.Email, roleName)
	if err != nil {
		return nil, err
	}

	if err := s.redis.Delete(ctx, refreshKey); err != nil {
		return nil, err
	}

	newRefreshKey := "refresh_token:" + newTokens.RefreshToken
	if err := s.redis.Set(ctx, newRefreshKey, user.ID.String(), s.jwtService.GetRefreshTokenExpiry()); err != nil {
		return nil, err
	}

	return newTokens, nil
}

func (s *userService) Logout(ctx context.Context, userID uuid.UUID, refreshToken string) error {
	refreshKey := "refresh_token:" + refreshToken
	return s.redis.Delete(ctx, refreshKey)
}

func (s *userService) GetProfile(ctx context.Context, userID uuid.UUID) (*UserProfile, error) {
	return s.repo.GetProfileByID(ctx, userID)
}

func (s *userService) UpdateProfile(ctx context.Context, userID uuid.UUID, input UpdateUserInput) (*UserProfile, error) {
	user, err := s.repo.GetByID(ctx, userID)
	if err != nil {
		return nil, errors.ErrUserNotFound
	}

	if input.Email != nil && *input.Email != user.Email {
		exists, err := s.repo.ExistsByEmail(ctx, *input.Email)
		if err != nil {
			return nil, err
		}
		if exists {
			return nil, errors.ErrEmailExists
		}
		user.Email = *input.Email
	}

	if input.Username != nil && *input.Username != user.Username {
		exists, err := s.repo.ExistsByUsername(ctx, *input.Username)
		if err != nil {
			return nil, err
		}
		if exists {
			return nil, errors.ErrUsernameExists
		}
		user.Username = *input.Username
	}

	if input.Name != nil {
		user.Name = *input.Name
	}
	if input.AvatarURL != nil {
		user.AvatarURL = input.AvatarURL
	}
	if input.Bio != nil {
		user.Bio = input.Bio
	}
	if input.IsActive != nil {
		user.IsActive = *input.IsActive
	}

	if err := s.repo.Update(ctx, user); err != nil {
		return nil, err
	}

	return s.repo.GetProfileByID(ctx, userID)
}

func (s *userService) ChangePassword(ctx context.Context, userID uuid.UUID, oldPassword, newPassword string) error {
	user, err := s.repo.GetByID(ctx, userID)
	if err != nil {
		return errors.ErrUserNotFound
	}

	if !auth.CheckPasswordHash(oldPassword, user.PasswordHash) {
		return errors.ErrInvalidCredentials
	}

	newHash, err := auth.HashPassword(newPassword)
	if err != nil {
		return err
	}

	user.PasswordHash = newHash
	return s.repo.Update(ctx, user)
}

func (s *userService) DeleteAccount(ctx context.Context, userID uuid.UUID) error {
	return s.repo.Delete(ctx, userID)
}

func (s *userService) ListUsers(ctx context.Context, offset, limit int) ([]*User, int64, error) {
	return s.repo.List(ctx, offset, limit)
}

func (s *userService) GetUserByID(ctx context.Context, userID uuid.UUID) (*User, error) {
	return s.repo.GetByID(ctx, userID)
}

func (s *userService) AdminUpdateUser(ctx context.Context, userID uuid.UUID, input UpdateUserInput) (*User, error) {
	user, err := s.repo.GetByID(ctx, userID)
	if err != nil {
		return nil, errors.ErrUserNotFound
	}

	if input.Email != nil && *input.Email != user.Email {
		exists, err := s.repo.ExistsByEmail(ctx, *input.Email)
		if err != nil {
			return nil, err
		}
		if exists {
			return nil, errors.ErrEmailExists
		}
		user.Email = *input.Email
	}

	if input.Username != nil && *input.Username != user.Username {
		exists, err := s.repo.ExistsByUsername(ctx, *input.Username)
		if err != nil {
			return nil, err
		}
		if exists {
			return nil, errors.ErrUsernameExists
		}
		user.Username = *input.Username
	}

	if input.Name != nil {
		user.Name = *input.Name
	}
	if input.AvatarURL != nil {
		user.AvatarURL = input.AvatarURL
	}
	if input.Bio != nil {
		user.Bio = input.Bio
	}
	if input.IsActive != nil {
		user.IsActive = *input.IsActive
	}

	if err := s.repo.Update(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *userService) AdminDeleteUser(ctx context.Context, userID uuid.UUID) error {
	return s.repo.Delete(ctx, userID)
}
