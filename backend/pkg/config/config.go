package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/spf13/viper"
)

type Config struct {
	App       AppConfig       `mapstructure:"app"`
	Database  DatabaseConfig  `mapstructure:"database"`
	Redis     RedisConfig     `mapstructure:"redis"`
	JWT       JWTConfig       `mapstructure:"jwt"`
	Server    ServerConfig    `mapstructure:"server"`
	CORS      CORSConfig      `mapstructure:"cors"`
	RateLimit RateLimitConfig `mapstructure:"ratelimit"`
}

type AppConfig struct {
	Name        string `mapstructure:"name"`
	Environment string `mapstructure:"environment"`
	Debug       bool   `mapstructure:"debug"`
	Version     string `mapstructure:"version"`
	AdminEmail  string `mapstructure:"admin_email"`
}

type DatabaseConfig struct {
	Host            string        `mapstructure:"host"`
	Port            int           `mapstructure:"port"`
	User            string        `mapstructure:"user"`
	Password        string        `mapstructure:"password"`
	Name            string        `mapstructure:"name"`
	SSLMode         string        `mapstructure:"sslmode"`
	MaxOpenConns    int           `mapstructure:"max_open_conns"`
	MaxIdleConns    int           `mapstructure:"max_idle_conns"`
	ConnMaxLifetime time.Duration `mapstructure:"conn_max_lifetime"`
	ConnMaxIdleTime time.Duration `mapstructure:"conn_max_idle_time"`
}

func (d DatabaseConfig) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		d.Host, d.Port, d.User, d.Password, d.Name, d.SSLMode,
	)
}

type RedisConfig struct {
	Host         string `mapstructure:"host"`
	Port         int    `mapstructure:"port"`
	Password     string `mapstructure:"password"`
	DB           int    `mapstructure:"db"`
	PoolSize     int    `mapstructure:"pool_size"`
	MinIdleConns int    `mapstructure:"min_idle_conns"`
}

func (r RedisConfig) Addr() string {
	return fmt.Sprintf("%s:%d", r.Host, r.Port)
}

type JWTConfig struct {
	AccessSecret       string        `mapstructure:"access_secret"`
	RefreshSecret      string        `mapstructure:"refresh_secret"`
	AccessTokenExpiry  time.Duration `mapstructure:"access_token_expiry"`
	RefreshTokenExpiry time.Duration `mapstructure:"refresh_token_expiry"`
	Issuer             string        `mapstructure:"issuer"`
}

type ServerConfig struct {
	Host         string        `mapstructure:"host"`
	Port         int           `mapstructure:"port"`
	ReadTimeout  time.Duration `mapstructure:"read_timeout"`
	WriteTimeout time.Duration `mapstructure:"write_timeout"`
	IdleTimeout  time.Duration `mapstructure:"idle_timeout"`
}

func (s ServerConfig) Addr() string {
	return fmt.Sprintf("%s:%d", s.Host, s.Port)
}

type CORSConfig struct {
	AllowedOrigins   []string `mapstructure:"allowed_origins"`
	AllowedMethods   []string `mapstructure:"allowed_methods"`
	AllowedHeaders   []string `mapstructure:"allowed_headers"`
	ExposedHeaders   []string `mapstructure:"exposed_headers"`
	AllowCredentials bool     `mapstructure:"allow_credentials"`
	MaxAge           int      `mapstructure:"max_age"`
}

type RateLimitConfig struct {
	Enabled           bool `mapstructure:"enabled"`
	RequestsPerMinute int  `mapstructure:"requests_per_minute"`
	Burst             int  `mapstructure:"burst"`
}

func Load() (*Config, error) {
	v := viper.New()
	v.SetConfigName("config")
	v.SetConfigType("yaml")

	// Search paths for config file
	v.AddConfigPath(".")
	v.AddConfigPath("./config")
	v.AddConfigPath("/etc/spark-chicken-games")

	// Also check for config in project root
	if wd, err := os.Getwd(); err == nil {
		v.AddConfigPath(wd)
		v.AddConfigPath(filepath.Join(wd, "config"))
	}

	// Environment variables
	v.SetEnvPrefix("SCG")
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	v.AutomaticEnv()

	// Set defaults
	setDefaults(v)

	if err := v.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, fmt.Errorf("failed to read config: %w", err)
		}
		// Config file not found, use env vars and defaults
	}

	var cfg Config
	if err := v.Unmarshal(&cfg); err != nil {
		return nil, fmt.Errorf("failed to unmarshal config: %w", err)
	}

	return &cfg, nil
}

func setDefaults(v *viper.Viper) {
	// App
	v.SetDefault("app.name", "spark-chicken-games")
	v.SetDefault("app.environment", "development")
	v.SetDefault("app.debug", true)
	v.SetDefault("app.version", "1.0.0")
	v.SetDefault("app.admin_email", "samuneveslopes@gmail.com")

	// Database
	v.SetDefault("database.host", "localhost")
	v.SetDefault("database.port", 5432)
	v.SetDefault("database.user", "postgres")
	v.SetDefault("database.password", "postgres")
	v.SetDefault("database.name", "spark_chicken_games")
	v.SetDefault("database.sslmode", "disable")
	v.SetDefault("database.max_open_conns", 25)
	v.SetDefault("database.max_idle_conns", 5)
	v.SetDefault("database.conn_max_lifetime", "5m")
	v.SetDefault("database.conn_max_idle_time", "2m")

	// Redis
	v.SetDefault("redis.host", "localhost")
	v.SetDefault("redis.port", 6379)
	v.SetDefault("redis.password", "")
	v.SetDefault("redis.db", 0)
	v.SetDefault("redis.pool_size", 10)
	v.SetDefault("redis.min_idle_conns", 2)

	// JWT
	v.SetDefault("jwt.access_secret", "change-me-in-production-access-secret")
	v.SetDefault("jwt.refresh_secret", "change-me-in-production-refresh-secret")
	v.SetDefault("jwt.access_token_expiry", "15m")
	v.SetDefault("jwt.refresh_token_expiry", "168h") // 7 days
	v.SetDefault("jwt.issuer", "spark-chicken-games")

	// Server
	v.SetDefault("server.host", "0.0.0.0")
	v.SetDefault("server.port", 8080)
	v.SetDefault("server.read_timeout", "10s")
	v.SetDefault("server.write_timeout", "10s")
	v.SetDefault("server.idle_timeout", "60s")

	// CORS
	v.SetDefault("cors.allowed_origins", []string{"http://localhost:3000", "https://spark-chicken-games-jg8o.vercel.app"})
	v.SetDefault("cors.allowed_methods", []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"})
	v.SetDefault("cors.allowed_headers", []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"})
	v.SetDefault("cors.exposed_headers", []string{"Content-Length"})
	v.SetDefault("cors.allow_credentials", true)
	v.SetDefault("cors.max_age", 86400)

	// Rate Limit
	v.SetDefault("ratelimit.enabled", true)
	v.SetDefault("ratelimit.requests_per_minute", 60)
	v.SetDefault("ratelimit.burst", 10)
}

func MustLoad() *Config {
	cfg, err := Load()
	if err != nil {
		panic(fmt.Sprintf("failed to load config: %v", err))
	}
	return cfg
}
