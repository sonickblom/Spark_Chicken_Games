package server

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	authmiddleware "github.com/kronos/spark-chicken-games/backend/internal/middleware/auth"
	"github.com/kronos/spark-chicken-games/backend/internal/middleware/cors"
	"github.com/kronos/spark-chicken-games/backend/internal/middleware/logging"
	"github.com/kronos/spark-chicken-games/backend/internal/middleware/ratelimit"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
)

func (s *Server) routes() *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(logging.RequestLogger())
	router.Use(cors.CORSMiddleware(&s.cfg.CORS))

	limiter := ratelimit.NewRateLimiter(s.redis.Client, &s.cfg.RateLimit)
	router.Use(limiter.Middleware())

	deps := newContainer(s.cfg, s.db, s.redis)
	authRequired := authmiddleware.AuthMiddleware(deps.jwt)
	authOptional := authmiddleware.OptionalAuthMiddleware(deps.jwt)
	adminRequired := []gin.HandlerFunc{authRequired, authmiddleware.RequireAdmin()}
	adminHandlers := func(handler gin.HandlerFunc) []gin.HandlerFunc {
		handlers := make([]gin.HandlerFunc, 0, len(adminRequired)+1)
		handlers = append(handlers, adminRequired...)
		handlers = append(handlers, handler)
		return handlers
	}

	router.GET("/health", s.health)
	router.GET("/ready", s.ready)

	v1 := router.Group("/api/v1")
	{
		authRoutes := v1.Group("/auth")
		{
			authRoutes.POST("/register", deps.auth.Register)
			authRoutes.POST("/login", deps.auth.Login)
			authRoutes.POST("/refresh", deps.auth.Refresh)
			authRoutes.POST("/logout", authRequired, deps.auth.Logout)
			authRoutes.GET("/me", authRequired, deps.auth.GetMe)
		}

		users := v1.Group("/users", authRequired)
		{
			users.GET("/me", deps.users.GetProfile)
			users.PATCH("/me", deps.users.UpdateProfile)
			users.POST("/me/password", deps.users.ChangePassword)
			users.DELETE("/me", deps.users.DeleteAccount)
		}

		admin := v1.Group("/admin", adminRequired...)
		{
			admin.GET("/users", deps.users.ListUsers)
			admin.GET("/users/:id", deps.users.GetUserByID)
			admin.PATCH("/users/:id", deps.users.AdminUpdateUser)
			admin.DELETE("/users/:id", deps.users.AdminDeleteUser)
			admin.PATCH("/users/:id/role", deps.users.AdminUpdateUserRole)

			admin.POST("/ads", deps.ads.Create)
			admin.GET("/ads", deps.ads.List)
			admin.GET("/ads/:id/stats", deps.ads.GetStats)
			admin.GET("/ads/:id", deps.ads.GetByID)
			admin.PATCH("/ads/:id", deps.ads.Update)
			admin.DELETE("/ads/:id", deps.ads.Delete)

			admin.GET("/analytics/platform", deps.analytics.GetPlatformAnalytics)
			admin.GET("/analytics/games/:game_id", deps.analytics.GetGameAnalytics)
			admin.GET("/analytics/top-games", deps.analytics.GetTopGames)
		}

		games := v1.Group("/games")
		{
			games.GET("", deps.games.List)
			games.GET("/featured", deps.games.GetFeatured)
			games.GET("/new", deps.games.GetNew)
			games.GET("/popular", deps.games.GetPopular)
			games.GET("/slug/:slug", deps.games.GetBySlug)
			games.POST("", adminHandlers(deps.games.Create)...)

			games.GET("/:game_id/reviews", deps.reviews.ListByGame)
			games.GET("/:game_id/reviews/average", deps.reviews.GetAverageRating)
			games.POST("/:game_id/reviews", authRequired, deps.reviews.Create)

			games.GET("/:game_id/leaderboard", deps.leaderboards.GetByGame)
			games.POST("/:game_id/leaderboard", authRequired, deps.leaderboards.SubmitScore)

			games.GET("/:game_id/recommendations/similar", deps.recommendations.GetSimilar)

			games.POST("/:game_id/matchmaking/queue", authRequired, deps.matchmaking.JoinQueue)
			games.DELETE("/:game_id/matchmaking/queue", authRequired, deps.matchmaking.LeaveQueue)
			games.GET("/:game_id/matchmaking/status", authRequired, deps.matchmaking.GetStatus)
			games.POST("/:game_id/matchmaking/match", adminHandlers(deps.matchmaking.TryMatch)...)

			games.POST("/:game_id/play", authOptional, deps.games.PlayGame)
			games.GET("/:game_id", deps.games.GetByID)
			games.PATCH("/:game_id", adminHandlers(deps.games.Update)...)
			games.DELETE("/:game_id", adminHandlers(deps.games.Delete)...)
		}

		categories := v1.Group("/categories")
		{
			categories.GET("", deps.categories.List)
			categories.GET("/with-count", deps.categories.ListWithGameCount)
			categories.GET("/slug/:slug", deps.categories.GetBySlug)
			categories.POST("", adminHandlers(deps.categories.Create)...)
			categories.GET("/:id", deps.categories.GetByID)
			categories.PATCH("/:id", adminHandlers(deps.categories.Update)...)
			categories.DELETE("/:id", adminHandlers(deps.categories.Delete)...)
		}

		tags := v1.Group("/tags")
		{
			tags.GET("", deps.tags.List)
			tags.GET("/with-count", deps.tags.ListWithGameCount)
			tags.GET("/slug/:slug", deps.tags.GetBySlug)
			tags.POST("", adminHandlers(deps.tags.Create)...)
			tags.GET("/:id", deps.tags.GetByID)
			tags.PATCH("/:id", adminHandlers(deps.tags.Update)...)
			tags.DELETE("/:id", adminHandlers(deps.tags.Delete)...)
		}

		favorites := v1.Group("/favorites", authRequired)
		{
			favorites.GET("", deps.favorites.List)
			favorites.POST("", deps.favorites.Add)
			favorites.DELETE("/id/:id", deps.favorites.RemoveByID)
			favorites.GET("/check/:gameId", deps.favorites.Check)
			favorites.GET("/count", deps.favorites.Count)
			favorites.DELETE("/:gameId", deps.favorites.Remove)
		}

		history := v1.Group("/history", authRequired)
		{
			history.GET("", deps.history.GetHistory)
			history.POST("", deps.history.RecordPlay)
			history.GET("/stats", deps.history.GetStats)
			history.DELETE("/:id", deps.history.DeleteEntry)
		}

		progress := v1.Group("/progress", authRequired)
		{
			progress.GET("", deps.progress.ListProgress)
			progress.POST("", deps.progress.SaveProgress)
			progress.GET("/:gameId", deps.progress.GetProgress)
			progress.PUT("/:gameId", deps.progress.UpdateProgress)
			progress.DELETE("/:gameId", deps.progress.DeleteProgress)
		}

		v1.GET("/reviews/:id", deps.reviews.GetByID)
		v1.PATCH("/reviews/:id", authRequired, deps.reviews.Update)
		v1.DELETE("/reviews/:id", authRequired, deps.reviews.Delete)

		v1.GET("/leaderboards", deps.leaderboards.GetGlobal)
		v1.GET("/leaderboards/me/rank", authRequired, deps.leaderboards.GetUserRank)

		v1.GET("/analytics/me", authRequired, deps.analytics.GetUserAnalytics)

		sessions := v1.Group("/sessions")
		{
			sessions.GET("", deps.sessions.List)
			sessions.POST("", authRequired, deps.sessions.Create)
			sessions.GET("/room/:code", deps.sessions.GetByRoomCode)
			sessions.GET("/:id/participants", deps.sessions.GetParticipants)
			sessions.POST("/:id/join", authRequired, deps.sessions.Join)
			sessions.POST("/:id/leave", authRequired, deps.sessions.Leave)
			sessions.POST("/:id/start", authRequired, deps.sessions.Start)
			sessions.POST("/:id/end", authRequired, deps.sessions.End)
			sessions.GET("/:id", deps.sessions.GetByID)
		}

		recommendations := v1.Group("/recommendations")
		{
			recommendations.GET("/personalized", authRequired, deps.recommendations.GetPersonalized)
			recommendations.GET("/trending", deps.recommendations.GetTrending)
			recommendations.GET("/new-releases", deps.recommendations.GetNewReleases)
		}

		ads := v1.Group("/ads", authOptional)
		{
			ads.GET("/active", deps.ads.GetActive)
			ads.POST("/:id/impression", deps.ads.RecordImpression)
			ads.POST("/:id/click", deps.ads.RecordClick)
		}
	}

	return router
}

func (s *Server) health(c *gin.Context) {
	response.WriteSuccess(c.Writer, gin.H{"status": "ok"})
}

func (s *Server) ready(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
	defer cancel()

	if err := s.db.Ping(ctx); err != nil {
		response.WriteError(c.Writer, "DATABASE_UNAVAILABLE", "Database is not ready", http.StatusServiceUnavailable)
		return
	}
	if err := s.redis.Ping(ctx); err != nil {
		response.WriteError(c.Writer, "REDIS_UNAVAILABLE", "Redis is not ready", http.StatusServiceUnavailable)
		return
	}

	response.WriteSuccess(c.Writer, gin.H{"status": "ready"})
}
