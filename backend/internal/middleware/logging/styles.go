package logging

import (
	"fmt"
	"time"

	"github.com/charmbracelet/lipgloss"
)

// ─── Core palette ───────────────────────────────────────────────────────────
const (
	NeonGreen   = "#39FF14"
	CyberCyan   = "#00FFF7"
	CyberYellow = "#FFD700"
	CyberRed    = "#FF3355"
	CyberOrange = "#FF7700"
	CyberPurple = "#A855F7"
	CyberGray   = "#6B7280"
	CyberDark   = "#1A1A2E"
	CyberDark2  = "#16213E"
	White       = "#FFFFFF"
	Black       = "#000000"
)

// ─── Status badge styles ────────────────────────────────────────────────────
// Each is a rounded box with the status code inside.

func statusBadgeStyle(status int) lipgloss.Style {
	var fg string
	switch {
	case status >= 500:
		fg = CyberRed
	case status >= 400:
		fg = CyberOrange
	case status >= 300:
		fg = CyberCyan
	case status >= 200:
		fg = NeonGreen
	default:
		fg = CyberGray
	}

	return lipgloss.NewStyle().
		Foreground(lipgloss.Color(fg)).
		Bold(true)
}

func StatusBadge(status int) string {
	return statusBadgeStyle(status).Render(fmt.Sprintf("%d", status))
}

// ─── Status indicator (emoji) ───────────────────────────────────────────────

func StatusIndicator(status int) string {
	switch {
	case status >= 500:
		return "🔴"
	case status >= 400:
		return "🟡"
	case status >= 300:
		return "🔵"
	case status >= 200:
		return "🟢"
	default:
		return "⚪"
	}
}

// ─── Method styles ──────────────────────────────────────────────────────────

func methodStyle(method string) lipgloss.Style {
	var color string
	switch method {
	case "POST", "PUT", "PATCH":
		color = CyberYellow
	case "DELETE":
		color = CyberRed
	case "GET":
		color = CyberCyan
	default:
		color = White
	}
	return lipgloss.NewStyle().Foreground(lipgloss.Color(color)).Bold(true)
}

func MethodLabel(method string) string {
	return methodStyle(method).Render(fmt.Sprintf("%-6s", method))
}

// ─── Latency styles ─────────────────────────────────────────────────────────

func latencyStyle(d time.Duration) lipgloss.Style {
	var color string
	switch {
	case d < 50*time.Millisecond:
		color = NeonGreen
	case d < 200*time.Millisecond:
		color = CyberYellow
	default:
		color = CyberRed
	}
	return lipgloss.NewStyle().Foreground(lipgloss.Color(color)).Width(7).Align(lipgloss.Right)
}

// ─── Path style ─────────────────────────────────────────────────────────────

var PathStyle = lipgloss.NewStyle().Foreground(lipgloss.Color(CyberGray))

// ─── Muted text ─────────────────────────────────────────────────────────────

var MutedStyle = lipgloss.NewStyle().Foreground(lipgloss.Color(CyberGray))

// ─── Slow warning ───────────────────────────────────────────────────────────

var SlowStyle = lipgloss.NewStyle().Foreground(lipgloss.Color(CyberYellow)).Bold(true)

// ─── Banner styles ──────────────────────────────────────────────────────────

var (
	BannerCyan  = lipgloss.NewStyle().Foreground(lipgloss.Color(CyberCyan)).Bold(true)
	BannerGreen = lipgloss.NewStyle().Foreground(lipgloss.Color(NeonGreen)).Bold(true)
	BannerGray  = lipgloss.NewStyle().Foreground(lipgloss.Color(CyberGray))
	BannerWhite = lipgloss.NewStyle().Foreground(lipgloss.Color(White)).Bold(true)

	BannerBox = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color(CyberCyan)).
			Padding(0, 2).
			Width(56).
			Align(lipgloss.Center)
)

// ─── Route table styles (for gin debug) ─────────────────────────────────────

var (
	RouteMethodStyle = lipgloss.NewStyle().Bold(true).Width(8).Align(lipgloss.Left)
	RoutePathStyle   = lipgloss.NewStyle().Foreground(lipgloss.Color(White)).Width(50).Align(lipgloss.Left)

	RouteHeaderStyle = lipgloss.NewStyle().
				Foreground(lipgloss.Color(CyberCyan)).
				Bold(true).
				Underline(true)

	RouteSeparator = lipgloss.NewStyle().
			Foreground(lipgloss.Color(CyberGray)).
			Render("│")
)
