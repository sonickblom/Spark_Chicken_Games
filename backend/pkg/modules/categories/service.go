package categories

import (
	"context"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/errors"
)

type CategoryService interface {
	Create(ctx context.Context, input CreateCategoryInput) (*Category, error)
	GetByID(ctx context.Context, id uuid.UUID) (*Category, error)
	GetBySlug(ctx context.Context, slug string) (*Category, error)
	Update(ctx context.Context, id uuid.UUID, input UpdateCategoryInput) (*Category, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filters CategoryFilters) ([]*Category, int64, error)
	ListWithGameCount(ctx context.Context, filters CategoryFilters) ([]*CategoryWithGameCount, int64, error)
}

type categoryService struct {
	repo CategoryRepository
}

func NewCategoryService(repo CategoryRepository) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) Create(ctx context.Context, input CreateCategoryInput) (*Category, error) {
	exists, err := s.repo.ExistsBySlug(ctx, input.Slug)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.ErrAlreadyExists
	}

	exists, err = s.repo.ExistsByName(ctx, input.Name)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.ErrAlreadyExists
	}

	category := &Category{
		Slug:        input.Slug,
		Name:        input.Name,
		Description: input.Description,
		IconURL:     input.IconURL,
	}

	if err := s.repo.Create(ctx, category); err != nil {
		return nil, err
	}

	return category, nil
}

func (s *categoryService) GetByID(ctx context.Context, id uuid.UUID) (*Category, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *categoryService) GetBySlug(ctx context.Context, slug string) (*Category, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *categoryService) Update(ctx context.Context, id uuid.UUID, input UpdateCategoryInput) (*Category, error) {
	category, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.ErrCategoryNotFound
	}

	if input.Name != nil {
		exists, err := s.repo.ExistsByName(ctx, *input.Name)
		if err != nil {
			return nil, err
		}
		if exists && *input.Name != category.Name {
			return nil, errors.ErrAlreadyExists
		}
		category.Name = *input.Name
	}
	if input.Description != nil {
		category.Description = input.Description
	}
	if input.IconURL != nil {
		category.IconURL = input.IconURL
	}

	if err := s.repo.Update(ctx, category); err != nil {
		return nil, err
	}

	return category, nil
}

func (s *categoryService) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return errors.ErrCategoryNotFound
	}
	return s.repo.Delete(ctx, id)
}

func (s *categoryService) List(ctx context.Context, filters CategoryFilters) ([]*Category, int64, error) {
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}
	return s.repo.List(ctx, filters)
}

func (s *categoryService) ListWithGameCount(ctx context.Context, filters CategoryFilters) ([]*CategoryWithGameCount, int64, error) {
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}
	return s.repo.ListWithGameCount(ctx, filters)
}
