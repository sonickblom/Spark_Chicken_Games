package server

import (
	"context"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kronos/spark-chicken-games/backend/internal/config"
	"github.com/kronos/spark-chicken-games/backend/internal/db"
)

type Server struct {
	cfg   *config.Config
	db    *db.DB
	redis *db.Redis
	http  *http.Server
}

func New(cfg *config.Config, database *db.DB, redisClient *db.Redis) *Server {
	if cfg.App.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	s := &Server{
		cfg:   cfg,
		db:    database,
		redis: redisClient,
	}

	router := s.routes()
	s.http = &http.Server{
		Addr:         cfg.Server.Addr(),
		Handler:      router,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	return s
}

func (s *Server) Start() error {
	if err := s.http.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return err
	}
	return nil
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.http.Shutdown(ctx)
}
