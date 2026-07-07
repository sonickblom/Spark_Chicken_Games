package tags

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Tag struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Slug      string    `json:"slug" db:"slug"`
	Name      string    `json:"name" db:"name"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type TagWithGameCount struct {
	Tag
	GameCount int `json:"game_count"`
}

type CreateTagInput struct {
	Slug string `json:"slug" validate:"required,min=2,max=50"`
	Name string `json:"name" validate:"required,min=2,max=50"`
}

type UpdateTagInput struct {
	Name *string `json:"name,omitempty" validate:"omitempty,min=2,max=50"`
}

type TagFilters struct {
	Search   string
	Page     int
	PageSize int
	SortBy   string
	SortDesc bool
}

type TagRepository interface {
	Create(ctx context.Context, tag *Tag) error
	GetByID(ctx context.Context, id uuid.UUID) (*Tag, error)
	GetBySlug(ctx context.Context, slug string) (*Tag, error)
	Update(ctx context.Context, tag *Tag) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filters TagFilters) ([]*Tag, int64, error)
	ListWithGameCount(ctx context.Context, filters TagFilters) ([]*TagWithGameCount, int64, error)
	ExistsBySlug(ctx context.Context, slug string) (bool, error)
	ExistsByName(ctx context.Context, name string) (bool, error)
}

type tagRepository struct {
	db *pgxpool.Pool
}

func NewTagRepository(db *pgxpool.Pool) TagRepository {
	return &tagRepository{db: db}
}

func (r *tagRepository) Create(ctx context.Context, tag *Tag) error {
	query := `
		INSERT INTO tags (slug, name)
		VALUES ($1, $2)
		RETURNING id, created_at
	`
	return r.db.QueryRow(ctx, query, tag.Slug, tag.Name).Scan(&tag.ID, &tag.CreatedAt)
}

func (r *tagRepository) GetByID(ctx context.Context, id uuid.UUID) (*Tag, error) {
	query := `SELECT id, slug, name, created_at FROM tags WHERE id = $1`
	tag := &Tag{}
	err := r.db.QueryRow(ctx, query, id).Scan(&tag.ID, &tag.Slug, &tag.Name, &tag.CreatedAt)
	if err != nil {
		return nil, err
	}
	return tag, nil
}

func (r *tagRepository) GetBySlug(ctx context.Context, slug string) (*Tag, error) {
	query := `SELECT id, slug, name, created_at FROM tags WHERE slug = $1`
	tag := &Tag{}
	err := r.db.QueryRow(ctx, query, slug).Scan(&tag.ID, &tag.Slug, &tag.Name, &tag.CreatedAt)
	if err != nil {
		return nil, err
	}
	return tag, nil
}

func (r *tagRepository) Update(ctx context.Context, tag *Tag) error {
	query := `UPDATE tags SET name = $2, updated_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(ctx, query, tag.ID, tag.Name)
	return err
}

func (r *tagRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM tags WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *tagRepository) List(ctx context.Context, filters TagFilters) ([]*Tag, int64, error) {
	whereClause := `WHERE 1=1`
	args := []interface{}{}
	argIndex := 1

	if filters.Search != "" {
		whereClause += ` AND (name ILIKE $` + string(rune(argIndex+'0')) + ` OR slug ILIKE $` + string(rune(argIndex+'0')) + `)`
		args = append(args, "%"+filters.Search+"%")
		argIndex++
	}

	countQuery := `SELECT COUNT(*) FROM tags ` + whereClause
	var total int64
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	orderBy := "name ASC"
	if filters.SortBy != "" {
		allowedSorts := map[string]bool{"name": true, "slug": true, "created_at": true}
		if allowedSorts[filters.SortBy] {
			order := "ASC"
			if filters.SortDesc {
				order = "DESC"
			}
			orderBy = filters.SortBy + " " + order
		}
	}

	offset := (filters.Page - 1) * filters.PageSize
	if offset < 0 {
		offset = 0
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}

	query := `SELECT id, slug, name, created_at FROM tags ` + whereClause + ` ORDER BY ` + orderBy + ` LIMIT $` + string(rune(argIndex+'0')) + ` OFFSET $` + string(rune(argIndex+1+'0'))
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var tags []*Tag
	for rows.Next() {
		tag := &Tag{}
		err := rows.Scan(&tag.ID, &tag.Slug, &tag.Name, &tag.CreatedAt)
		if err != nil {
			return nil, 0, err
		}
		tags = append(tags, tag)
	}
	return tags, total, nil
}

func (r *tagRepository) ListWithGameCount(ctx context.Context, filters TagFilters) ([]*TagWithGameCount, int64, error) {
	whereClause := `WHERE 1=1`
	args := []interface{}{}
	argIndex := 1

	if filters.Search != "" {
		whereClause += ` AND (t.name ILIKE $` + string(rune(argIndex+'0')) + ` OR t.slug ILIKE $` + string(rune(argIndex+'0')) + `)`
		args = append(args, "%"+filters.Search+"%")
		argIndex++
	}

	countQuery := `SELECT COUNT(*) FROM tags t ` + whereClause
	var total int64
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	orderBy := "t.name ASC"
	if filters.SortBy != "" {
		allowedSorts := map[string]bool{"name": true, "slug": true, "created_at": true, "game_count": true}
		if allowedSorts[filters.SortBy] {
			order := "ASC"
			if filters.SortDesc {
				order = "DESC"
			}
			if filters.SortBy == "game_count" {
				orderBy = "game_count " + order
			} else {
				orderBy = "t." + filters.SortBy + " " + order
			}
		}
	}

	offset := (filters.Page - 1) * filters.PageSize
	if offset < 0 {
		offset = 0
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}

	query := `
		SELECT t.id, t.slug, t.name, t.created_at, COUNT(gt.game_id) as game_count
		FROM tags t
		LEFT JOIN game_tags gt ON t.id = gt.tag_id
		` + whereClause + `
		GROUP BY t.id
		ORDER BY ` + orderBy + ` LIMIT $` + string(rune(argIndex+'0')) + ` OFFSET $` + string(rune(argIndex+1+'0'))
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var tags []*TagWithGameCount
	for rows.Next() {
		tag := &TagWithGameCount{}
		err := rows.Scan(&tag.ID, &tag.Slug, &tag.Name, &tag.CreatedAt, &tag.GameCount)
		if err != nil {
			return nil, 0, err
		}
		tags = append(tags, tag)
	}
	return tags, total, nil
}

func (r *tagRepository) ExistsBySlug(ctx context.Context, slug string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM tags WHERE slug = $1)`
	var exists bool
	err := r.db.QueryRow(ctx, query, slug).Scan(&exists)
	return exists, err
}

func (r *tagRepository) ExistsByName(ctx context.Context, name string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM tags WHERE name = $1)`
	var exists bool
	err := r.db.QueryRow(ctx, query, name).Scan(&exists)
	return exists, err
}
