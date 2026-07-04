package sessions

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
)

type SessionHandler struct {
	service SessionService
}

func NewSessionHandler(service SessionService) *SessionHandler {
	return &SessionHandler{service: service}
}

type CreateSessionRequest struct {
	GameID     string `json:"game_id" binding:"required"`
	MaxPlayers int    `json:"max_players" binding:"required,min=2,max=100"`
	IsPublic   bool   `json:"is_public"`
}

func (h *SessionHandler) Create(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	var req CreateSessionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.WriteError(c.Writer, "VALIDATION_ERROR", "Invalid request body", 422, err.Error())
		return
	}

	gameID, err := uuid.Parse(req.GameID)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid game ID", 400)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	input := CreateSessionInput{
		GameID:     gameID,
		HostUserID: userUUID,
		MaxPlayers: req.MaxPlayers,
		IsPublic:   req.IsPublic,
	}

	session, err := h.service.Create(c.Request.Context(), input)
	if err != nil {
		response.WriteError(c.Writer, "CREATE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"session": session}, 201)
}

func (h *SessionHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid session ID", 400)
		return
	}

	session, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		response.WriteError(c.Writer, "NOT_FOUND", "Session not found", 404)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"session": session})
}

func (h *SessionHandler) GetByRoomCode(c *gin.Context) {
	code := c.Param("code")
	session, err := h.service.GetByRoomCode(c.Request.Context(), code)
	if err != nil {
		response.WriteError(c.Writer, "NOT_FOUND", "Session not found", 404)
		return
	}
	response.WriteSuccess(c.Writer, gin.H{"session": session})
}

func (h *SessionHandler) List(c *gin.Context) {
	isPublic := true
	filters := SessionFilters{
		IsPublic: &isPublic,
		Status:   statusPtr(StatusWaiting),
		Page:     1,
		PageSize: 20,
	}

	sessions, total, err := h.service.List(c.Request.Context(), filters)
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccessWithMeta(c.Writer, gin.H{"sessions": sessions}, gin.H{
		"total_items": total,
		"page":        filters.Page,
		"page_size":   filters.PageSize,
	})
}

func (h *SessionHandler) Join(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid session ID", 400)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.service.Join(c.Request.Context(), id, userUUID); err != nil {
		response.WriteError(c.Writer, "JOIN_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Joined session successfully"})
}

func (h *SessionHandler) Leave(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid session ID", 400)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.service.Leave(c.Request.Context(), id, userUUID); err != nil {
		response.WriteError(c.Writer, "LEAVE_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Left session successfully"})
}

func (h *SessionHandler) Start(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid session ID", 400)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.service.Start(c.Request.Context(), id, userUUID); err != nil {
		response.WriteError(c.Writer, "START_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Session started"})
}

func (h *SessionHandler) End(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.WriteError(c.Writer, "UNAUTHORIZED", "User not authenticated", 401)
		return
	}

	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid session ID", 400)
		return
	}

	userUUID, ok := userID.(uuid.UUID)
	if !ok {
		userUUID, _ = uuid.Parse(userID.(string))
	}

	if err := h.service.End(c.Request.Context(), id, userUUID); err != nil {
		response.WriteError(c.Writer, "END_FAILED", err.Error(), 400)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"message": "Session ended"})
}

func (h *SessionHandler) GetParticipants(c *gin.Context) {
	idStr := c.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		response.WriteError(c.Writer, "INVALID_ID", "Invalid session ID", 400)
		return
	}

	participants, err := h.service.GetParticipants(c.Request.Context(), id)
	if err != nil {
		response.WriteError(c.Writer, "FETCH_FAILED", err.Error(), 500)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"participants": participants})
}

func statusPtr(s SessionStatus) *SessionStatus { return &s }
