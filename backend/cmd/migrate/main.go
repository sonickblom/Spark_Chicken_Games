package main

import (
	"context"
	"flag"
	"log"
	"time"

	"github.com/kronos/spark-chicken-games/backend/pkg/config"
	"github.com/kronos/spark-chicken-games/backend/pkg/db"
)

func main() {
	dir := flag.String("dir", "migrations", "directory containing .up.sql migrations")
	flag.Parse()

	cfg := config.MustLoad()
	database, err := db.NewConnection(&cfg.Database)
	if err != nil {
		log.Fatalf("connect database: %v", err)
	}
	defer database.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	if err := db.RunMigrations(ctx, database.Pool, *dir); err != nil {
		log.Fatalf("run migrations: %v", err)
	}

	log.Println("migrations applied")
}
