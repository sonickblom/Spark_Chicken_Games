package ratelimit

import (
	"context"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kronos/spark-chicken-games/backend/internal/config"
	"github.com/kronos/spark-chicken-games/backend/internal/shared/response"
	"github.com/redis/go-redis/v9"
	"golang.org/x/time/rate"
)

type RateLimiter struct {
	redis    *redis.Client
	limiter  *rate.Limiter
	enabled  bool
	requests int
	burst    int
}

func NewRateLimiter(redisClient *redis.Client, cfg *config.RateLimitConfig) *RateLimiter {
	var limiter *rate.Limiter
	if cfg.Enabled {
		limiter = rate.NewLimiter(rate.Limit(cfg.RequestsPerMinute)/60, cfg.Burst)
	}
	return &RateLimiter{
		redis:    redisClient,
		limiter:  limiter,
		enabled:  cfg.Enabled,
		requests: cfg.RequestsPerMinute,
		burst:    cfg.Burst,
	}
}

func (rl *RateLimiter) Middleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !rl.enabled {
			c.Next()
			return
		}

		key := rl.getKey(c)
		ctx := c.Request.Context()

		// Try Redis-based rate limiting first
		if rl.redis != nil {
			allowed, retryAfter, err := rl.checkRateLimitRedis(ctx, key)
			if err != nil {
				// Fallback to in-memory limiter
				if !rl.limiter.Allow() {
					response.WriteError(c.Writer, "RATE_LIMIT_EXCEEDED", "Rate limit exceeded", http.StatusTooManyRequests)
					c.Abort()
					return
				}
				c.Next()
				return
			}

			if !allowed {
				c.Header("Retry-After", strconv.Itoa(int(retryAfter.Seconds())))
				response.WriteError(c.Writer, "RATE_LIMIT_EXCEEDED", "Rate limit exceeded", http.StatusTooManyRequests)
				c.Abort()
				return
			}
		} else {
			// In-memory rate limiting
			if !rl.limiter.Allow() {
				response.WriteError(c.Writer, "RATE_LIMIT_EXCEEDED", "Rate limit exceeded", http.StatusTooManyRequests)
				c.Abort()
				return
			}
		}

		c.Next()
	}
}

func (rl *RateLimiter) checkRateLimitRedis(ctx context.Context, key string) (bool, time.Duration, error) {
	now := time.Now()
	windowStart := now.Truncate(time.Minute)
	windowKey := key + ":" + windowStart.Format("200601021504")

	pipe := rl.redis.Pipeline()
	incr := pipe.Incr(ctx, windowKey)
	pipe.Expire(ctx, windowKey, time.Minute*2)

	_, err := pipe.Exec(ctx)
	if err != nil {
		return false, 0, err
	}

	count := incr.Val()
	if count > int64(rl.requests) {
		retryAfter := time.Minute - time.Since(windowStart)
		return false, retryAfter, nil
	}

	return true, 0, nil
}

func (rl *RateLimiter) getKey(c *gin.Context) string {
	// Use IP + user ID if authenticated, otherwise just IP
	ip := c.ClientIP()
	userID, exists := c.Get("user_id")
	if exists {
		return "ratelimit:" + userID.(string)
	}
	return "ratelimit:ip:" + ip
}
