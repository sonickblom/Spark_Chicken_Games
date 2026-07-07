package server

import (
	"testing"
	"time"

	"github.com/kronos/spark-chicken-games/backend/internal/config"
	"github.com/kronos/spark-chicken-games/backend/internal/db"
	"github.com/redis/go-redis/v9"
)

func TestRoutesRegisterWithoutPanics(t *testing.T) {
	cfg := &config.Config{
		App: config.AppConfig{
			Environment: "test",
		},
		CORS: config.CORSConfig{
			AllowedOrigins: []string{"*"},
			AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
			AllowedHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		},
		RateLimit: config.RateLimitConfig{
			Enabled: false,
		},
		JWT: config.JWTConfig{
			AccessSecret:       "test-access-secret",
			RefreshSecret:      "test-refresh-secret",
			AccessTokenExpiry:  time.Minute,
			RefreshTokenExpiry: time.Hour,
			Issuer:             "test",
		},
	}

	s := &Server{
		cfg: cfg,
		db:  &db.DB{},
		redis: &db.Redis{
			Client: redis.NewClient(&redis.Options{Addr: "localhost:6379"}),
		},
	}

	router := s.routes()
	if router == nil {
		t.Fatal("expected router")
	}
}
