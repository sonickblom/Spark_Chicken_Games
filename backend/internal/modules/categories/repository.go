package categories

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Category struct {
	ID          uuid.UUID `json:"id" db:"id"`
	Slug        string    `json:"slug" db:"slug"`
	Name        string    `json:"name" db:"name"`
	Description *string   `json:"description,omitempty" db:"description"`
	IconURL     *string   `json:"icon_url,omitempty" db:"icon_url"`
	CreatedAt   string    `json:"created_at" db:"created_at"`
	UpdatedAt   string    `json:"updated_at" db:"updated_at"`
}

type CategoryWithGameCount struct {
	Category
	GameCount int `json:"game_count"`
}

type CreateCategoryInput struct {
	Slug        string  `json:"slug" validate:"required,min=2,max=50"`
	Name        string  `json:"name" validate:"required,min=2,max=100"`
	Description *string `json:"description,omitempty" validate:"omitempty,max=500"`
	IconURL     *string `json:"icon_url,omitempty" validate:"omitempty,url"`
}

type UpdateCategoryInput struct {
	Name        *string `json:"name,omitempty" validate:"omitempty,min=2,max=100"`
	Description *string `json:"description,omitempty" validate:"omitempty,max=500"`
	IconURL     *string `json:"icon_url,omitempty" validate:"omitempty,url"`
}

type CategoryFilters struct {
	Search   string
	Page     int
	PageSize int
	SortBy   string
	SortDesc bool
}

type CategoryRepository interface {
	Create(ctx context.Context, category *Category) error
	GetByID(ctx context.Context, id uuid.UUID) (*Category, error)
	GetBySlug(ctx context.Context, slug string) (*Category, error)
	Update(ctx context.Context, category *Category) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filters CategoryFilters) ([]*Category, int64, error)
	ListWithGameCount(ctx context.Context, filters CategoryFilters) ([]*CategoryWithGameCount, int64, error)
	ExistsBySlug(ctx context.Context, slug string) (bool, error)
	ExistsByName(ctx context.Context, name string) (bool, error)
}

type categoryRepository struct {
	db *pgxpool.Pool
}

func NewCategoryRepository(db *pgxpool.Pool) CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(ctx context.Context, category *Category) error {
	query := `
		INSERT INTO categories (slug, name, description, icon_url)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(ctx, query,
		category.Slug, category.Name, category.Description, category.IconURL,
	).Scan(&category.ID, &category.CreatedAt, &category.UpdatedAt)
}

func (r *categoryRepository) GetByID(ctx context.Context, id uuid.UUID) (*Category, error) {
	query := `SELECT id, slug, name, description, icon_url, created_at, updated_at FROM categories WHERE id = $1`
	category := &Category{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&category.ID, &category.Slug, &category.Name, &category.Description,
		&category.IconURL, &category.CreatedAt, &category.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return category, nil
}

func (r *categoryRepository) GetBySlug(ctx context.Context, slug string) (*Category, error) {
	query := `SELECT id, slug, name, description, icon_url, created_at, updated_at FROM categories WHERE slug = $1`
	category := &Category{}
	err := r.db.QueryRow(ctx, query, slug).Scan(
		&category.ID, &category.Slug, &category.Name, &category.Description,
		&category.IconURL, &category.CreatedAt, &category.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return category, nil
}

func (r *categoryRepository) Update(ctx context.Context, category *Category) error {
	query := `
		UPDATE categories SET name = $2, description = $3, icon_url = $4, updated_at = NOW()
		WHERE id = $1
		RETURNING updated_at
	`
	return r.db.QueryRow(ctx, query,
		category.ID, category.Name, category.Description, category.IconURL,
	).Scan(&category.UpdatedAt)
}

func (r *categoryRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM categories WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *categoryRepository) List(ctx context.Context, filters CategoryFilters) ([]*Category, int64, error) {
	whereClause := `WHERE 1=1`
	args := []interface{}{}
	argIndex := 1

	if filters.Search != "" {
		whereClause += ` AND (name ILIKE $` + string(rune(argIndex+'0')) + ` OR slug ILIKE $` + string(rune(argIndex+'0')) + `)`
		args = append(args, "%"+filters.Search+"%")
		argIndex++
	}

	countQuery := `SELECT COUNT(*) FROM categories ` + whereClause
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

	query := `SELECT id, slug, name, description, icon_url, created_at, updated_at FROM categories ` + whereClause + ` ORDER BY ` + orderBy + ` LIMIT $` + string(rune(argIndex+'0')) + ` OFFSET $` + string(rune(argIndex+1+'0'))
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var categories []*Category
	for rows.Next() {
		category := &Category{}
		err := rows.Scan(&category.ID, &category.Slug, &category.Name, &category.Description, &category.IconURL, &category.CreatedAt, &category.UpdatedAt)
		if err != nil {
			return nil, 0, err
		}
		categories = append(categories, category)
	}
	return categories, total, nil
}

func (r *categoryRepository) ListWithGameCount(ctx context.Context, filters CategoryFilters) ([]*CategoryWithGameCount, int64, error) {
	whereClause := `WHERE 1=1`
	args := []interface{}{}
	argIndex := 1

	if filters.Search != "" {
		whereClause += ` AND (c.name ILIKE $` + string(rune(argIndex+'0')) + ` OR c.slug ILIKE $` + string(rune(argIndex+'0')) + `)`
		args = append(args, "%"+filters.Search+"%")
		argIndex++
	}

	countQuery := `SELECT COUNT(*) FROM categories c ` + whereClause
	var total int64
	err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	orderBy := "c.name ASC"
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
				orderBy = "c." + filters.SortBy + " " + order
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
		SELECT c.id, c.slug, c.name, c.description, c.icon_url, c.created_at, c.updated_at,
		       COUNT(gc.game_id) as game_count
		FROM categories c
		LEFT JOIN game_categories gc ON c.id = gc.category_id
		` + whereClause + `
		GROUP BY c.id
		ORDER BY ` + orderBy + ` LIMIT $` + string(rune(argIndex+'0')) + ` OFFSET $` + string(rune(argIndex+1+'0'))
	args = append(args, filters.PageSize, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var categories []*CategoryWithGameCount
	for rows.Next() {
		category := &CategoryWithGameCount{}
		err := rows.Scan(&category.ID, &category.Slug, &category.Name, &category.Description, &category.IconURL, &category.CreatedAt, &category.UpdatedAt, &category.GameCount)
		if err != nil {
			return nil, 0, err
		}
		categories = append(categories, category)
	}
	return categories, total, nil
}

func (r *categoryRepository) ExistsBySlug(ctx context.Context, slug string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM categories WHERE slug = $1)`
	var exists bool
	err := r.db.QueryRow(ctx, query, slug).Scan(&exists)
	return exists, err
}

func (r *categoryRepository) ExistsByName(ctx context.Context, name string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM categories WHERE name = $1)`
	var exists bool
	err := r.db.QueryRow(ctx, query, name).Scan(&exists)
	return exists, err
}
