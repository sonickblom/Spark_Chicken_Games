package logging

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

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

		ms := latency.Milliseconds()
		timeStr := fmt.Sprintf("%dms", ms)
		if ms >= 1000 {
			timeStr = fmt.Sprintf("%.1fs", float64(ms)/1000)
		}

		emoji := StatusIndicator(status)

		fmt.Printf("  %s %3d %-6s %s %7s\n",
			emoji,
			status,
			method,
			path,
			timeStr,
		)

		// Slow request warning (>500ms)
		if latency > 500*time.Millisecond && clientIP != "" {
			fmt.Printf("           ⚠ SLOW from %s\n", clientIP)
		}
	}
}
