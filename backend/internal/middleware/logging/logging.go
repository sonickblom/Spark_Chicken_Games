package logging

import (
	"fmt"
	"strings"
	"time"

	"github.com/charmbracelet/lipgloss"
	"github.com/gin-gonic/gin"
)

// ─── Latency visualization ──────────────────────────────────────────────────

// latencyBar returns a string of dots proportional to the request duration.
//   - <200ms:  " ····" (one dot ≈ 10ms)
//   - <1000ms: " 0.5s" in red
//   - >=1s:    " 1.2s" in red
func latencyBar(d time.Duration) string {
	ms := d.Milliseconds()
	if ms < 200 {
		if ms <= 0 {
			return ""
		}
		n := int(ms / 10)
		if n < 1 {
			n = 1
		}
		if n > 20 {
			n = 20
		}
		return " " + lipgloss.NewStyle().
			Foreground(lipgloss.Color(CyberGray)).
			Render(strings.Repeat("·", n))
	}
	return " " + lipgloss.NewStyle().
		Foreground(lipgloss.Color(CyberRed)).
		Bold(true).
		Render(fmt.Sprintf("%.1fs", float64(ms)/1000))
}

// ─── Request logger middleware ──────────────────────────────────────────────

func RequestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()
		method := c.Request.Method
		clientIP := c.ClientIP()

		if raw != "" {
			path = path + "?" + raw
		}

		latStr := latencyStyle(latency).Render(latency.Round(time.Millisecond).String())
		dots := latencyBar(latency)

		// ƒuneline output:
		//   🟢 ┌────┐  GET    /api/v1/games/featured      12ms  ·
		//      └────┘
		//   🟡 ┌────┐  POST   /api/v1/auth/register        5ms  ·
		//      └────┘
		//   🔴 ┌────┐  GET    /api/v1/games              150ms  ···············
		//      └────┘

		badge := StatusBadge(status)
		emoji := StatusIndicator(status)
		methodStr := MethodLabel(method)

		fmt.Printf("  %s %s  %s  %s  %s%s\n",
			emoji,
			badge,
			methodStr,
			PathStyle.Render(path),
			latStr,
			dots,
		)

		// Slow request warning (>500ms)
		if latency > 500*time.Millisecond && clientIP != "" {
			warn := lipgloss.NewStyle().
				Foreground(lipgloss.Color(CyberYellow)).
				Bold(true).
				Render("SLOW")
			fmt.Printf("  %s  ⚠ %s from %s\n",
				strings.Repeat(" ", 9),
				warn,
				MutedStyle.Render(clientIP),
			)
		}
	}
}
