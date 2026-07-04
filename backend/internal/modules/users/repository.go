package users

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID           uuid.UUID  `json:"id" db:"id"`
	RoleID       uuid.UUID  `json:"role_id" db:"role_id"`
	Name         string     `json:"name" db:"name"`
	Username     string     `json:"username" db:"username"`
	Email        string     `json:"email" db:"email"`
	PasswordHash string     `json:"-" db:"password_hash"`
	AvatarURL    *string    `json:"avatar_url,omitempty" db:"avatar_url"`
	Bio          *string    `json:"bio,omitempty" db:"bio"`
	IsActive     bool       `json:"is_active" db:"is_active"`
	LastLoginAt  *time.Time `json:"last_login_at,omitempty" db:"last_login_at"`
	CreatedAt    time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at" db:"updated_at"`
}

type UserProfile struct {
	ID        uuid.UUID  `json:"id" db:"id"`
	Name      string     `json:"name" db:"name"`
	Username  string     `json:"username" db:"username"`
	Email     string     `json:"email" db:"email"`
	AvatarURL *string    `json:"avatar_url,omitempty" db:"avatar_url"`
	Bio       *string    `json:"bio,omitempty" db:"bio"`
	RoleName  string     `json:"role_name" db:"role_name"`
	CreatedAt time.Time  `json:"created_at" db:"created_at"`
}

type CreateUserInput struct {
	RoleID   uuid.UUID `json:"role_id" validate:"required"`
	Name     string    `json:"name" validate:"required,min=2,max=100"`
	Username string    `json:"username" validate:"required,min=3,max=50,alphanum"`
	Email    string    `json:"email" validate:"required,email"`
	Password string    `json:"password" validate:"required,min=8"`
}

type UpdateUserInput struct {
	Name     *string    `json:"name,omitempty" validate:"omitempty,min=2,max=100"`
	Username *string    `json:"username,omitempty" validate:"omitempty,min=3,max=50,alphanum"`
	Email    *string    `json:"email,omitempty" validate:"omitempty,email"`
	AvatarURL *string   `json:"avatar_url,omitempty" validate:"omitempty,url"`
	Bio      *string    `json:"bio,omitempty" validate:"omitempty,max=500"`
	IsActive *bool      `json:"is_active,omitempty"`
}

type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByID(ctx context.Context, id uuid.UUID) (*User, error)
	GetByEmail(ctx context.Context, email string) (*User, error)
	GetByUsername(ctx context.Context, username string) (*User, error)
	GetProfileByID(ctx context.Context, id uuid.UUID) (*UserProfile, error)
	Update(ctx context.Context, user *User) error
	UpdateLastLogin(ctx context.Context, id uuid.UUID) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, offset, limit int) ([]*User, int64, error)
	ExistsByEmail(ctx context.Context, email string) (bool, error)
	ExistsByUsername(ctx context.Context, username string) (bool, error)
}

type userRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, user *User) error {
	query := `
		INSERT INTO users (role_id, name, username, email, password_hash, avatar_url, bio, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(ctx, query,
		user.RoleID, user.Name, user.Username, user.Email,
		user.PasswordHash, user.AvatarURL, user.Bio, user.IsActive,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt)
}

func (r *userRepository) GetByID(ctx context.Context, id uuid.UUID) (*User, error) {
	query := `SELECT id, role_id, name, username, email, password_hash, avatar_url, bio, is_active, last_login_at, created_at, updated_at FROM users WHERE id = $1`
	user := &User{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&user.ID, &user.RoleID, &user.Name, &user.Username, &user.Email,
		&user.PasswordHash, &user.AvatarURL, &user.Bio, &user.IsActive,
		&user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*User, error) {
	query := `SELECT id, role_id, name, username, email, password_hash, avatar_url, bio, is_active, last_login_at, created_at, updated_at FROM users WHERE email = $1`
	user := &User{}
	err := r.db.QueryRow(ctx, query, email).Scan(
		&user.ID, &user.RoleID, &user.Name, &user.Username, &user.Email,
		&user.PasswordHash, &user.AvatarURL, &user.Bio, &user.IsActive,
		&user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *userRepository) GetByUsername(ctx context.Context, username string) (*User, error) {
	query := `SELECT id, role_id, name, username, email, password_hash, avatar_url, bio, is_active, last_login_at, created_at, updated_at FROM users WHERE username = $1`
	user := &User{}
	err := r.db.QueryRow(ctx, query, username).Scan(
		&user.ID, &user.RoleID, &user.Name, &user.Username, &user.Email,
		&user.PasswordHash, &user.AvatarURL, &user.Bio, &user.IsActive,
		&user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *userRepository) GetProfileByID(ctx context.Context, id uuid.UUID) (*UserProfile, error) {
	query := `
		SELECT u.id, u.name, u.username, u.email, u.avatar_url, u.bio, r.name as role_name, u.created_at
		FROM users u
		JOIN roles r ON u.role_id = r.id
		WHERE u.id = $1
	`
	profile := &UserProfile{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&profile.ID, &profile.Name, &profile.Username, &profile.Email,
		&profile.AvatarURL, &profile.Bio, &profile.RoleName, &profile.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return profile, nil
}

func (r *userRepository) Update(ctx context.Context, user *User) error {
	query := `
		UPDATE users SET name = $2, username = $3, email = $4, avatar_url = $5, bio = $6, is_active = $7, updated_at = NOW()
		WHERE id = $1
		RETURNING updated_at
	`
	return r.db.QueryRow(ctx, query,
		user.ID, user.Name, user.Username, user.Email,
		user.AvatarURL, user.Bio, user.IsActive,
	).Scan(&user.UpdatedAt)
}

func (r *userRepository) UpdateLastLogin(ctx context.Context, id uuid.UUID) error {
	query := `UPDATE users SET last_login_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *userRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `DELETE FROM users WHERE id = $1`
	_, err := r.db.Exec(ctx, query, id)
	return err
}

func (r *userRepository) List(ctx context.Context, offset, limit int) ([]*User, int64, error) {
	countQuery := `SELECT COUNT(*) FROM users`
	var total int64
	err := r.db.QueryRow(ctx, countQuery).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	query := `SELECT id, role_id, name, username, email, password_hash, avatar_url, bio, is_active, last_login_at, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		user := &User{}
		err := rows.Scan(
			&user.ID, &user.RoleID, &user.Name, &user.Username, &user.Email,
			&user.PasswordHash, &user.AvatarURL, &user.Bio, &user.IsActive,
			&user.LastLoginAt, &user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			return nil, 0, err
		}
		users = append(users, user)
	}
	return users, total, nil
}

func (r *userRepository) ExistsByEmail(ctx context.Context, email string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
	var exists bool
	err := r.db.QueryRow(ctx, query, email).Scan(&exists)
	return exists, err
}

func (r *userRepository) ExistsByUsername(ctx context.Context, username string) (bool, error) {
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`
	var exists bool
	err := r.db.QueryRow(ctx, query, username).Scan(&exists)
	return exists, err
}
