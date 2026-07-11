package roles

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/response"
)

type RoleResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type RoleHandler struct {
	db *pgxpool.Pool
}

func NewRoleHandler(db *pgxpool.Pool) *RoleHandler {
	return &RoleHandler{db: db}
}

func (h *RoleHandler) List(c *gin.Context) {
	rows, err := h.db.Query(c.Request.Context(), "SELECT id::text, name FROM roles ORDER BY name")
	if err != nil {
		response.WriteError(c.Writer, "LIST_FAILED", err.Error(), 500)
		return
	}
	defer rows.Close()

	var roles []RoleResponse
	for rows.Next() {
		var r RoleResponse
		if err := rows.Scan(&r.ID, &r.Name); err != nil {
			continue
		}
		roles = append(roles, r)
	}

	if roles == nil {
		roles = []RoleResponse{}
	}

	response.WriteSuccess(c.Writer, gin.H{"roles": roles})
}
