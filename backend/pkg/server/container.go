package server

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	jwtauth "github.com/kronos/spark-chicken-games/backend/pkg/auth"
	"github.com/kronos/spark-chicken-games/backend/pkg/config"
	"github.com/kronos/spark-chicken-games/backend/pkg/db"
	adsmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/ads"
	analyticsmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/analytics"
	authmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/auth"
	categoriesmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/categories"
	favoritesmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/favorites"
	gamesmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/games"
	historymodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/history"
	leaderboardsmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/leaderboards"
	matchmakingmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/matchmaking"
	progressmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/progress"
	recommendationsmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/recommendations"
	reviewsmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/reviews"
	rolesmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/roles"
	sessionsmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/sessions"
	tagsmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/tags"
	usersmodule "github.com/kronos/spark-chicken-games/backend/pkg/modules/users"

	"github.com/rs/zerolog/log"
)

func verifyRoles(ctx context.Context, pool *pgxpool.Pool) {
	ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	rows, err := pool.Query(ctx, "SELECT id, name FROM roles ORDER BY name")
	if err != nil {
		log.Warn().Err(err).Msg("could not verify roles (database not ready yet)")
		return
	}
	defer rows.Close()

	for rows.Next() {
		var id string
		var name string
		if err := rows.Scan(&id, &name); err != nil {
			continue
		}
		log.Info().Str("role", name).Str("uuid", id).Msg("role loaded")
	}
}

type container struct {
	jwt *jwtauth.JWTService

	auth            *authmodule.AuthHandler
	userService     usersmodule.UserService
	users           *usersmodule.UserHandler
	games           *gamesmodule.GameHandler
	categories      *categoriesmodule.CategoryHandler
	tags            *tagsmodule.TagHandler
	favorites       *favoritesmodule.FavoriteHandler
	history         *historymodule.PlayHistoryHandler
	progress        *progressmodule.ProgressHandler
	reviews         *reviewsmodule.ReviewHandler
	leaderboards    *leaderboardsmodule.LeaderboardHandler
	analytics       *analyticsmodule.AnalyticsHandler
	matchmaking     *matchmakingmodule.MatchmakingHandler
	sessions        *sessionsmodule.SessionHandler
	recommendations *recommendationsmodule.RecommendationHandler
	ads             *adsmodule.AdHandler
	roles           *rolesmodule.RoleHandler
}

func newContainer(cfg *config.Config, database *db.DB, redisClient *db.Redis) *container {
	jwtService := jwtauth.NewJWTService(
		cfg.JWT.AccessSecret,
		cfg.JWT.RefreshSecret,
		cfg.JWT.AccessTokenExpiry,
		cfg.JWT.RefreshTokenExpiry,
		cfg.JWT.Issuer,
	)

	userRepo := usersmodule.NewUserRepository(database.Pool)
	userService := usersmodule.NewUserService(userRepo, redisClient, jwtService)

	gameRepo := gamesmodule.NewGameRepository(database.Pool)
	categoryRepo := categoriesmodule.NewCategoryRepository(database.Pool)
	tagRepo := tagsmodule.NewTagRepository(database.Pool)
	favoriteRepo := favoritesmodule.NewFavoriteRepository(database.Pool)
	historyRepo := historymodule.NewPlayHistoryRepository(database.Pool)
	progressRepo := progressmodule.NewProgressRepository(database.Pool)
	reviewRepo := reviewsmodule.NewReviewRepository(database.Pool)
	leaderboardRepo := leaderboardsmodule.NewLeaderboardRepository(database.Pool)
	analyticsRepo := analyticsmodule.NewAnalyticsRepository(database.Pool)
	matchmakingRepo := matchmakingmodule.NewMatchmakingRepository(database.Pool)
	sessionRepo := sessionsmodule.NewSessionRepository(database.Pool)
	recommendationRepo := recommendationsmodule.NewRecommendationRepository(database.Pool)
	adRepo := adsmodule.NewAdRepository(database.Pool)

	// Log roles at startup for debugging
	go verifyRoles(context.Background(), database.Pool)

	roleHandler := rolesmodule.NewRoleHandler(database.Pool)

	return &container{
		jwt: jwtService,

		userService:     userService,
		auth:            authmodule.NewAuthHandler(userService),
		users:           usersmodule.NewUserHandler(userService),
		games:           gamesmodule.NewGameHandler(gamesmodule.NewGameService(gameRepo)),
		categories:      categoriesmodule.NewCategoryHandler(categoriesmodule.NewCategoryService(categoryRepo)),
		tags:            tagsmodule.NewTagHandler(tagsmodule.NewTagService(tagRepo)),
		favorites:       favoritesmodule.NewFavoriteHandler(favoritesmodule.NewFavoriteService(favoriteRepo)),
		history:         historymodule.NewPlayHistoryHandler(historymodule.NewPlayHistoryService(historyRepo)),
		progress:        progressmodule.NewProgressHandler(progressmodule.NewProgressService(progressRepo)),
		reviews:         reviewsmodule.NewReviewHandler(reviewsmodule.NewReviewService(reviewRepo)),
		leaderboards:    leaderboardsmodule.NewLeaderboardHandler(leaderboardsmodule.NewLeaderboardService(leaderboardRepo)),
		analytics:       analyticsmodule.NewAnalyticsHandler(analyticsmodule.NewAnalyticsService(analyticsRepo)),
		matchmaking:     matchmakingmodule.NewMatchmakingHandler(matchmakingmodule.NewMatchmakingService(matchmakingRepo)),
		sessions:        sessionsmodule.NewSessionHandler(sessionsmodule.NewSessionService(sessionRepo)),
		recommendations: recommendationsmodule.NewRecommendationHandler(recommendationsmodule.NewRecommendationService(recommendationRepo)),
		ads:             adsmodule.NewAdHandler(adsmodule.NewAdService(adRepo)),
		roles:           roleHandler,
	}
}
