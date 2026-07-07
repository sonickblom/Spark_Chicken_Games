package ads

import (
	"context"

	"github.com/google/uuid"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/errors"
)

type AdService interface {
	Create(ctx context.Context, input CreateAdInput) (*Ad, error)
	GetByID(ctx context.Context, id uuid.UUID) (*Ad, error)
	Update(ctx context.Context, id uuid.UUID, input CreateAdInput) (*Ad, error)
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, filters AdFilters) ([]*Ad, int64, error)
	GetActive(ctx context.Context, adType string) ([]*Ad, error)
	RecordImpression(ctx context.Context, adID uuid.UUID, userID, gameID *uuid.UUID) error
	RecordClick(ctx context.Context, adID uuid.UUID, userID *uuid.UUID) error
	GetStats(ctx context.Context, adID uuid.UUID) (map[string]interface{}, error)
}

type adService struct {
	repo AdRepository
}

func NewAdService(repo AdRepository) AdService {
	return &adService{repo: repo}
}

func (s *adService) Create(ctx context.Context, input CreateAdInput) (*Ad, error) {
	ad := &Ad{
		Title:       input.Title,
		Type:        input.Type,
		Status:      AdStatusActive,
		ImageURL:    input.ImageURL,
		TargetURL:   input.TargetURL,
		Description: input.Description,
		Priority:    input.Priority,
		StartsAt:    input.StartsAt,
		EndsAt:      input.EndsAt,
	}
	if err := s.repo.Create(ctx, ad); err != nil {
		return nil, err
	}
	return ad, nil
}

func (s *adService) GetByID(ctx context.Context, id uuid.UUID) (*Ad, error) {
	ad, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.ErrAdPlacementNotFound
	}
	return ad, nil
}

func (s *adService) Update(ctx context.Context, id uuid.UUID, input CreateAdInput) (*Ad, error) {
	ad, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, errors.ErrAdPlacementNotFound
	}

	ad.Title = input.Title
	ad.Type = input.Type
	ad.ImageURL = input.ImageURL
	ad.TargetURL = input.TargetURL
	ad.Description = input.Description
	ad.Priority = input.Priority
	ad.StartsAt = input.StartsAt
	ad.EndsAt = input.EndsAt

	if err := s.repo.Update(ctx, ad); err != nil {
		return nil, err
	}
	return ad, nil
}

func (s *adService) Delete(ctx context.Context, id uuid.UUID) error {
	if _, err := s.repo.GetByID(ctx, id); err != nil {
		return errors.ErrAdPlacementNotFound
	}
	return s.repo.Delete(ctx, id)
}

func (s *adService) List(ctx context.Context, filters AdFilters) ([]*Ad, int64, error) {
	if filters.Page <= 0 {
		filters.Page = 1
	}
	if filters.PageSize <= 0 {
		filters.PageSize = 20
	}
	return s.repo.List(ctx, filters)
}

func (s *adService) GetActive(ctx context.Context, adType string) ([]*Ad, error) {
	var t AdType
	switch adType {
	case "banner":
		t = AdTypeBanner
	case "interstitial":
		t = AdTypeInterstitial
	case "rewarded":
		t = AdTypeRewarded
	case "native":
		t = AdTypeNative
	default:
		t = AdTypeBanner
	}
	return s.repo.GetActive(ctx, t)
}

func (s *adService) RecordImpression(ctx context.Context, adID uuid.UUID, userID, gameID *uuid.UUID) error {
	if _, err := s.repo.GetByID(ctx, adID); err != nil {
		return errors.ErrAdPlacementNotFound
	}
	impression := &AdImpression{
		AdID:   adID,
		UserID: userID,
		GameID: gameID,
	}
	return s.repo.RecordImpression(ctx, impression)
}

func (s *adService) RecordClick(ctx context.Context, adID uuid.UUID, userID *uuid.UUID) error {
	if _, err := s.repo.GetByID(ctx, adID); err != nil {
		return errors.ErrAdPlacementNotFound
	}
	click := &AdClick{
		AdID:   adID,
		UserID: userID,
	}
	return s.repo.RecordClick(ctx, click)
}

func (s *adService) GetStats(ctx context.Context, adID uuid.UUID) (map[string]interface{}, error) {
	impressions, clicks, err := s.repo.GetStats(ctx, adID)
	if err != nil {
		return nil, err
	}

	ctr := 0.0
	if impressions > 0 {
		ctr = float64(clicks) / float64(impressions) * 100
	}

	return map[string]interface{}{
		"impressions": impressions,
		"clicks":      clicks,
		"ctr":         ctr,
	}, nil
}
