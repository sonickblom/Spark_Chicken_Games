package handler

import (
	"net/http"

	"github.com/kronos/spark-chicken-games/backend/internal/config"
	"github.com/kronos/spark-chicken-games/backend/internal/db"
	"github.com/kronos/spark-chicken-games/backend/internal/server"
)

var handler http.Handler

func init() {
	cfg := config.MustLoad()

	database, err := db.NewConnection(&cfg.Database)
	if err != nil {
		panic("failed to connect to database: " + err.Error())
	}

	redisClient, err := db.NewRedisClient(&cfg.Redis)
	if err != nil {
		panic("failed to connect to Redis: " + err.Error())
	}

	srv := server.New(cfg, database, redisClient)
	handler = srv.Handler()
}

func Handler(w http.ResponseWriter, r *http.Request) {
	handler.ServeHTTP(w, r)
}
