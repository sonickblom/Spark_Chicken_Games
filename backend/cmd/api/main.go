package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/charmbracelet/lipgloss"
	"github.com/gin-gonic/gin"
	"github.com/kronos/spark-chicken-games/backend/internal/config"
	"github.com/kronos/spark-chicken-games/backend/internal/db"
	"github.com/kronos/spark-chicken-games/backend/internal/middleware/logging"
	"github.com/kronos/spark-chicken-games/backend/internal/server"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	cfg := config.MustLoad()
	configureLogger(cfg)

	configureGinDebugPrint()

	printBanner(cfg)

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

	fmt.Println()
	stopped := lipgloss.NewStyle().
		Foreground(lipgloss.Color(logging.CyberGray)).
		Render("  ◼ Server stopped gracefully.")
	fmt.Println(stopped)

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := api.Shutdown(shutdownCtx); err != nil {
		log.Error().Err(err).Msg("server shutdown failed")
		return
	}
}

// configureGinDebugPrint customizes the Gin route debug output with Lipgloss.
func configureGinDebugPrint() {
	gin.DebugPrintRouteFunc = func(httpMethod, absolutePath, handlerName string, nuHandlers int) {
		methodStyle := lipgloss.NewStyle().Bold(true)
		switch httpMethod {
		case "GET":
			methodStyle = methodStyle.Foreground(lipgloss.Color(logging.CyberCyan))
		case "POST", "PUT", "PATCH":
			methodStyle = methodStyle.Foreground(lipgloss.Color(logging.CyberYellow))
		case "DELETE":
			methodStyle = methodStyle.Foreground(lipgloss.Color(logging.CyberRed))
		default:
			methodStyle = methodStyle.Foreground(lipgloss.Color(logging.White))
		}

		pathStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color(logging.White))

		// Extract short handler name (last segment after last / or last .)
		short := handlerName
		if idx := strings.LastIndex(short, "/"); idx >= 0 {
			short = short[idx+1:]
		}
		if idx := strings.LastIndex(short, "."); idx >= 0 {
			short = short[idx+1:]
		}

		handlerStyle := lipgloss.NewStyle().
			Foreground(lipgloss.Color(logging.CyberGray)).
			Italic(true)

		fmt.Printf("  %s  %s  %s\n",
			methodStyle.Render(fmt.Sprintf("%-7s", httpMethod)),
			pathStyle.Render(absolutePath),
			handlerStyle.Render(short),
		)
	}
}

func printBanner(cfg *config.Config) {
	logo := `
    ███████╗██████╗  █████╗ ██████╗ ██╗  ██╗
    ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝
    ███████╗██████╔╝███████║██████╔╝█████╔╝
    ╚════██║██╔═══╝ ██╔══██║██╔══██╗██╔═██╗
    ███████║██║     ██║  ██║██║  ██║██║  ██╗
    ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝`

	logoStyled := logging.BannerCyan.Render(logo)

	info := fmt.Sprintf("\n%s\n%s\n%s\n%s\n",
		logging.BannerWhite.Render(cfg.App.Name),
		logging.BannerGreen.Render("Environment:")+" "+logging.MutedStyle.Render(cfg.App.Environment),
		logging.BannerGreen.Render("Version:")+" "+logging.MutedStyle.Render("v"+cfg.App.Version),
		logging.BannerGreen.Render("Listening:")+" "+logging.MutedStyle.Render("http://"+cfg.Server.Addr()),
	)

	banner := lipgloss.JoinVertical(lipgloss.Center, logoStyled, info)
	boxed := logging.BannerBox.Render(banner)

	fmt.Println()
	fmt.Println(boxed)
	fmt.Println()
	fmt.Printf("  %sPress Ctrl+C to stop%s\n",
		logging.BannerGreen.Render("►"),
		logging.MutedStyle.Render(""),
	)
	fmt.Println()
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
