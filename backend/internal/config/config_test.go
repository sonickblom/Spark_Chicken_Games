package config

import (
	"testing"
	"time"
)

func TestLoadMapsSnakeCaseKeys(t *testing.T) {
	cfg, err := Load()
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}

	if cfg.Database.MaxOpenConns != 25 {
		t.Fatalf("Database.MaxOpenConns = %d, want 25", cfg.Database.MaxOpenConns)
	}
	if cfg.Database.MaxIdleConns != 5 {
		t.Fatalf("Database.MaxIdleConns = %d, want 5", cfg.Database.MaxIdleConns)
	}
	if cfg.Database.ConnMaxLifetime != 5*time.Minute {
		t.Fatalf("Database.ConnMaxLifetime = %s, want 5m", cfg.Database.ConnMaxLifetime)
	}
	if cfg.Redis.PoolSize != 10 {
		t.Fatalf("Redis.PoolSize = %d, want 10", cfg.Redis.PoolSize)
	}
	if cfg.Server.ReadTimeout != 10*time.Second {
		t.Fatalf("Server.ReadTimeout = %s, want 10s", cfg.Server.ReadTimeout)
	}
	if cfg.RateLimit.RequestsPerMinute != 60 {
		t.Fatalf("RateLimit.RequestsPerMinute = %d, want 60", cfg.RateLimit.RequestsPerMinute)
	}
}
