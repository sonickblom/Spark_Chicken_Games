package errors

import (
	"errors"
	"fmt"
)

var (
	ErrNotFound             = errors.New("resource not found")
	ErrAlreadyExists        = errors.New("resource already exists")
	ErrInvalidInput         = errors.New("invalid input")
	ErrUnauthorized         = errors.New("unauthorized")
	ErrForbidden            = errors.New("forbidden")
	ErrInternalServer       = errors.New("internal server error")
	ErrValidationFailed     = errors.New("validation failed")
	ErrTokenExpired         = errors.New("token expired")
	ErrTokenInvalid         = errors.New("token invalid")
	ErrTokenRevoked         = errors.New("token revoked")
	ErrInvalidCredentials   = errors.New("invalid credentials")
	ErrAccountInactive      = errors.New("account is inactive")
	ErrRateLimited          = errors.New("rate limit exceeded")
	ErrConflict             = errors.New("resource conflict")
	ErrBadRequest           = errors.New("bad request")
	ErrUnprocessable        = errors.New("unprocessable entity")
	ErrTooManyRequests      = errors.New("too many requests")
	ErrServiceUnavailable   = errors.New("service unavailable")
	ErrTimeout              = errors.New("request timeout")
	ErrNotImplemented       = errors.New("not implemented")
	ErrUnsupportedMedia     = errors.New("unsupported media type")
	ErrForbiddenResource    = errors.New("access to resource forbidden")
	ErrInvalidToken         = errors.New("invalid token")
	ErrRefreshRequired      = errors.New("refresh token required")
	ErrInvalidRefreshToken  = errors.New("invalid refresh token")
	ErrRefreshTokenRevoked  = errors.New("refresh token revoked")
	ErrRefreshTokenExpired  = errors.New("refresh token expired")
	ErrUserNotFound         = errors.New("user not found")
	ErrUserInactive         = errors.New("user is inactive")
	ErrEmailExists          = errors.New("email already exists")
	ErrUsernameExists       = errors.New("username already exists")
	ErrGameNotFound         = errors.New("game not found")
	ErrCategoryNotFound     = errors.New("category not found")
	ErrTagNotFound          = errors.New("tag not found")
	ErrSessionNotFound      = errors.New("session not found")
	ErrSessionFull          = errors.New("session is full")
	ErrSessionNotActive     = errors.New("session is not active")
	ErrAlreadyInSession     = errors.New("user already in session")
	ErrNotInSession         = errors.New("user not in session")
	ErrAlreadyFavorite      = errors.New("game already in favorites")
	ErrNotFavorite          = errors.New("game not in favorites")
	ErrAlreadyReviewed      = errors.New("user already reviewed this game")
	ErrReviewExists         = errors.New("review already exists")
	ErrReviewNotFound       = errors.New("review not found")
	ErrInvalidRating        = errors.New("invalid rating value")
	ErrLeaderboardNotFound  = errors.New("leaderboard not found")
	ErrInvalidProgress      = errors.New("invalid progress data")
	ErrProgressNotFound     = errors.New("progress not found")
	ErrMatchmakingTimeout   = errors.New("matchmaking timeout")
	ErrAlreadyInQueue       = errors.New("already in matchmaking queue")
	ErrNotInQueue           = errors.New("not in matchmaking queue")
	ErrAdPlacementNotFound  = errors.New("ad placement not found")
	ErrRecommendationFailed = errors.New("recommendation generation failed")
)

type AppError struct {
	Code    string
	Message string
	Err     error
	Details map[string]interface{}
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func (e *AppError) Unwrap() error {
	return e.Err
}

func NewAppError(code, message string, err error, details map[string]interface{}) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
		Details: details,
	}
}

func Wrap(err error, code, message string) *AppError {
	return &AppError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}

func IsNotFound(err error) bool {
	return errors.Is(err, ErrNotFound) ||
		errors.Is(err, ErrUserNotFound) ||
		errors.Is(err, ErrGameNotFound) ||
		errors.Is(err, ErrCategoryNotFound) ||
		errors.Is(err, ErrTagNotFound) ||
		errors.Is(err, ErrSessionNotFound) ||
		errors.Is(err, ErrReviewNotFound) ||
		errors.Is(err, ErrLeaderboardNotFound) ||
		errors.Is(err, ErrProgressNotFound) ||
		errors.Is(err, ErrAdPlacementNotFound)
}

func IsAlreadyExists(err error) bool {
	return errors.Is(err, ErrAlreadyExists) || errors.Is(err, ErrEmailExists) || errors.Is(err, ErrUsernameExists) || errors.Is(err, ErrReviewExists) || errors.Is(err, ErrAlreadyFavorite)
}

func IsValidationError(err error) bool {
	return errors.Is(err, ErrValidationFailed) || errors.Is(err, ErrInvalidInput)
}

func IsUnauthorized(err error) bool {
	return errors.Is(err, ErrUnauthorized) || errors.Is(err, ErrTokenExpired) || errors.Is(err, ErrTokenInvalid) || errors.Is(err, ErrTokenRevoked) || errors.Is(err, ErrInvalidToken) || errors.Is(err, ErrRefreshRequired) || errors.Is(err, ErrInvalidRefreshToken) || errors.Is(err, ErrRefreshTokenRevoked) || errors.Is(err, ErrRefreshTokenExpired)
}

func IsForbidden(err error) bool {
	return errors.Is(err, ErrForbidden) || errors.Is(err, ErrForbiddenResource)
}

func IsConflict(err error) bool {
	return errors.Is(err, ErrConflict) || errors.Is(err, ErrAlreadyExists) || errors.Is(err, ErrAlreadyInSession) || errors.Is(err, ErrAlreadyInQueue)
}

func ToHTTPStatus(err error) int {
	switch {
	case IsNotFound(err):
		return 404
	case IsAlreadyExists(err):
		return 409
	case IsValidationError(err):
		return 422
	case IsUnauthorized(err):
		return 401
	case IsForbidden(err):
		return 403
	case IsConflict(err):
		return 409
	case errors.Is(err, ErrRateLimited), errors.Is(err, ErrTooManyRequests):
		return 429
	case errors.Is(err, ErrServiceUnavailable):
		return 503
	case errors.Is(err, ErrTimeout):
		return 504
	default:
		return 500
	}
}
