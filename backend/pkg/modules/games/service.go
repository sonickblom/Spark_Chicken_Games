package games

import (
	"context"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/errors"
)

type GameService interface {
	Create(ctx context.Context, input CreateGameInput) (*GameWithRelations, error)
	GetByID(ctx context.Context, id uuid.UUID) (*GameWithRelations, error)
	GetBySlug(ctx context.Context, slug string) (*GameWithRelations, error)
	Update(ctx context.Context, id uuid.UUID, input UpdateGameInput) (*GameWithRelations, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filters GameFilters) ([]*Game, int64, error)
	GetFeatured(ctx context.Context, limit int) ([]*Game, error)
	GetNew(ctx context.Context, limit int) ([]*Game, error)
	GetPopular(ctx context.Context, limit int) ([]*Game, error)
	IncrementPlayCount(ctx context.Context, id uuid.UUID) error
}

type gameService struct {
	repo GameRepository
}

func NewGameService(repo GameRepository) GameService {
	return &gameService{repo: repo}
}

func (s *gameService) Create(ctx context.Context, input CreateGameInput) (*GameWithRelations, error) {
	game := &Game{
		Slug:            input.Slug,
		Title:           input.Title,
		Description:     input.Description,
		ShortDescription: input.ShortDescription,
		ThumbnailURL:    input.ThumbnailURL,
		BannerURL:       input.BannerURL,
		GameURL:         input.GameURL,
		EmbedURL:        input.EmbedURL,
		Platform:        input.Platform,
		Status:          input.Status,
		IsFeatured:      input.IsFeatured,
		IsNew:           input.IsNew,
		IsPopular:       input.IsPopular,
	}

	if err := s.repo.Create(ctx, game, input.CategoryIDs, input.TagIDs); err != nil {
		return nil, err
	}

	return s.repo.GetWithRelations(ctx, game.ID)
}

func (s *gameService) GetByID(ctx context.Context, id uuid.UUID) (*GameWithRelations, error) {
	return s.repo.GetWithRelations(ctx, id)
}

func (s *gameService) GetBySlug(ctx context.Context, slug string) (*GameWithRelations, error) {
	game, err := s.repo.GetBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	return s.repo.GetWithRelations(ctx, game.ID)
}

func (s *gameService) Update(ctx context.Context, id uuid.UUID, input UpdateGameInput) (*GameWithRelations, error) {
	game, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.ErrGameNotFound
	}

	if input.Title != nil {
		game.Title = *input.Title
	}
	if input.Description != nil {
		game.Description = *input.Description
	}
	if input.ShortDescription != nil {
		game.ShortDescription = input.ShortDescription
	}
	if input.ThumbnailURL != nil {
		game.ThumbnailURL = input.ThumbnailURL
	}
	if input.BannerURL != nil {
		game.BannerURL = input.BannerURL
	}
	if input.GameURL != nil {
		game.GameURL = *input.GameURL
	}
	if input.EmbedURL != nil {
		game.EmbedURL = input.EmbedURL
	}
	if input.Platform != nil {
		game.Platform = input.Platform
	}
	if input.Status != nil {
		game.Status = *input.Status
	}
	if input.IsFeatured != nil {
		game.IsFeatured = *input.IsFeatured
	}
	if input.IsNew != nil {
		game.IsNew = *input.IsNew
	}
	if input.IsPopular != nil {
		game.IsPopular = *input.IsPopular
	}

	if err := s.repo.Update(ctx, game, input.CategoryIDs, input.TagIDs); err != nil {
		return nil, err
	}

	return s.repo.GetWithRelations(ctx, id)
}

func (s *gameService) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return errors.ErrGameNotFound
	}
	return s.repo.Delete(ctx, id)
}

func (s *gameService) List(ctx context.Context, filters GameFilters) ([]*Game, int64, error) {
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

func (s *gameService) GetFeatured(ctx context.Context, limit int) ([]*Game, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return s.repo.GetFeatured(ctx, limit)
}

func (s *gameService) GetNew(ctx context.Context, limit int) ([]*Game, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return s.repo.GetNew(ctx, limit)
}

func (s *gameService) GetPopular(ctx context.Context, limit int) ([]*Game, error) {
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	return s.repo.GetPopular(ctx, limit)
}

func (s *gameService) IncrementPlayCount(ctx context.Context, id uuid.UUID) error {
	_, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return errors.ErrGameNotFound
	}
	return s.repo.IncrementPlayCount(ctx, id)
}
