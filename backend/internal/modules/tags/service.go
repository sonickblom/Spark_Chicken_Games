package tags

import (
	"context"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/errors"
)

type TagService interface {
	Create(ctx context.Context, input CreateTagInput) (*Tag, error)
	GetByID(ctx context.Context, id uuid.UUID) (*Tag, error)
	GetBySlug(ctx context.Context, slug string) (*Tag, error)
	Update(ctx context.Context, id uuid.UUID, input UpdateTagInput) (*Tag, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filters TagFilters) ([]*Tag, int64, error)
	ListWithGameCount(ctx context.Context, filters TagFilters) ([]*TagWithGameCount, int64, error)
}

type tagService struct {
	repo TagRepository
}

func NewTagService(repo TagRepository) TagService {
	return &tagService{repo: repo}
}

func (s *tagService) Create(ctx context.Context, input CreateTagInput) (*Tag, error) {
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

	tag := &Tag{
		Slug: input.Slug,
		Name: input.Name,
	}

	if err := s.repo.Create(ctx, tag); err != nil {
		return nil, err
	}

	return tag, nil
}

func (s *tagService) GetByID(ctx context.Context, id uuid.UUID) (*Tag, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *tagService) GetBySlug(ctx context.Context, slug string) (*Tag, error) {
	return s.repo.GetBySlug(ctx, slug)
}

func (s *tagService) Update(ctx context.Context, id uuid.UUID, input UpdateTagInput) (*Tag, error) {
	tag, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.ErrTagNotFound
	}

	if input.Name != nil {
		exists, err := s.repo.ExistsByName(ctx, *input.Name)
		if err != nil {
			return nil, err
		}
		if exists && *input.Name != tag.Name {
			return nil, errors.ErrAlreadyExists
		}
		tag.Name = *input.Name
	}

	if err := s.repo.Update(ctx, tag); err != nil {
		return nil, err
	}

	return tag, nil
}

func (s *tagService) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return errors.ErrTagNotFound
	}
	return s.repo.Delete(ctx, id)
}

func (s *tagService) List(ctx context.Context, filters TagFilters) ([]*Tag, int64, error) {
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

func (s *tagService) ListWithGameCount(ctx context.Context, filters TagFilters) ([]*TagWithGameCount, int64, error) {
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
