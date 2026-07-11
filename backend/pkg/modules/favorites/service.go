package favorites

import (
	"context"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/pkg/shared/errors"
)

type FavoriteService interface {
	Add(ctx context.Context, userID, gameID uuid.UUID) (*FavoriteWithGame, error)
	Remove(ctx context.Context, userID, gameID uuid.UUID) error
	RemoveByID(ctx context.Context, favoriteID uuid.UUID) error
	ListByUser(ctx context.Context, userID uuid.UUID, filters FavoriteFilters) ([]*FavoriteWithGame, int64, error)
	Check(ctx context.Context, userID, gameID uuid.UUID) (bool, error)
	CountByUser(ctx context.Context, userID uuid.UUID) (int64, error)
}

type favoriteService struct {
	repo FavoriteRepository
}

func NewFavoriteService(repo FavoriteRepository) FavoriteService {
	return &favoriteService{repo: repo}
}

func (s *favoriteService) Add(ctx context.Context, userID, gameID uuid.UUID) (*FavoriteWithGame, error) {
	exists, err := s.repo.ExistsByUserAndGame(ctx, userID, gameID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.ErrAlreadyFavorite
	}

	favorite := &Favorite{
		UserID: userID,
		GameID: gameID,
	}

	if err := s.repo.Create(ctx, favorite); err != nil {
		return nil, err
	}

	// Return with game info
	favorites, _, err := s.repo.ListByUser(ctx, userID, FavoriteFilters{Page: 1, PageSize: 1})
	if err != nil {
		return nil, err
	}

	if len(favorites) > 0 && favorites[0].GameID == gameID {
		return favorites[0], nil
	}

	return &FavoriteWithGame{Favorite: *favorite}, nil
}

func (s *favoriteService) Remove(ctx context.Context, userID, gameID uuid.UUID) error {
	exists, err := s.repo.ExistsByUserAndGame(ctx, userID, gameID)
	if err != nil {
		return err
	}
	if !exists {
		return errors.ErrNotFavorite
	}

	return s.repo.DeleteByUserAndGame(ctx, userID, gameID)
}

func (s *favoriteService) RemoveByID(ctx context.Context, favoriteID uuid.UUID) error {
	_, err := s.repo.GetByID(ctx, favoriteID)
	if err != nil {
		return errors.ErrNotFound
	}
	return s.repo.Delete(ctx, favoriteID)
}

func (s *favoriteService) ListByUser(ctx context.Context, userID uuid.UUID, filters FavoriteFilters) ([]*FavoriteWithGame, int64, error) {
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	if filters.PageSize > 100 {
		filters.PageSize = 100
	}
	return s.repo.ListByUser(ctx, userID, filters)
}

func (s *favoriteService) Check(ctx context.Context, userID, gameID uuid.UUID) (bool, error) {
	return s.repo.ExistsByUserAndGame(ctx, userID, gameID)
}

func (s *favoriteService) CountByUser(ctx context.Context, userID uuid.UUID) (int64, error) {
	return s.repo.CountByUser(ctx, userID)
}
