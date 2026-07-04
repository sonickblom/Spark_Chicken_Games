package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/kronos/spark-chicken-games/backend/internal/config"
	"github.com/kronos/spark-chicken-games/backend/internal/db"
	"github.com/kronos/spark-chicken-games/backend/internal/server"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	cfg := config.MustLoad()
	configureLogger(cfg)

	database, err := db.NewConnection(&cfg.Database)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to database")
	}
	defer database.Close()

	redisClient, err := db.NewRedisClient(&cfg.Redis)
	if err != nil {
		log.Fatal().Err(err).Msg("failed to connect to Redis")
	}
	defer redisClient.Close()

	api := server.New(cfg, database, redisClient)

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		if err := api.Start(); err != nil {
			log.Fatal().Err(err).Msg("server stopped unexpectedly")
		}
	}()

	<-ctx.Done()

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := api.Shutdown(shutdownCtx); err != nil {
		log.Error().Err(err).Msg("server shutdown failed")
		return
	}

	log.Info().Msg("server stopped")
}

func configureLogger(cfg *config.Config) {
	level := zerolog.InfoLevel
	if cfg.App.Debug {
		level = zerolog.DebugLevel
	}
	zerolog.SetGlobalLevel(level)

	if cfg.App.Environment == "development" {
		log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339})
	}
}
