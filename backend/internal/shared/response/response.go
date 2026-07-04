package response

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
)

type Response struct {
	Success   bool        `json:"success"`
	Data      interface{} `json:"data,omitempty"`
	Error     *ErrorInfo  `json:"error,omitempty"`
	Meta      *Meta       `json:"meta,omitempty"`
	Timestamp string      `json:"timestamp"`
	RequestID string      `json:"request_id"`
}

type ErrorInfo struct {
	Code    string      `json:"code"`
	Message string      `json:"message"`
	Details interface{} `json:"details,omitempty"`
}

type Meta struct {
	Page       int         `json:"page,omitempty"`
	PageSize   int         `json:"page_size,omitempty"`
	TotalItems int64       `json:"total_items,omitempty"`
	TotalPages int         `json:"total_pages,omitempty"`
	Extra      interface{} `json:"extra,omitempty"`
}

func Success(data interface{}) *Response {
	return &Response{
		Success:   true,
		Data:      data,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		RequestID: uuid.New().String(),
	}
}

func SuccessWithMeta(data interface{}, meta *Meta) *Response {
	return &Response{
		Success:   true,
		Data:      data,
		Meta:      meta,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		RequestID: uuid.New().String(),
	}
}

func Error(code, message string, details interface{}) *Response {
	return &Response{
		Success: false,
		Error: &ErrorInfo{
			Code:    code,
			Message: message,
			Details: details,
		},
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		RequestID: uuid.New().String(),
	}
}

func (r *Response) WriteJSON(w http.ResponseWriter, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(r)
}

func WriteSuccess(w http.ResponseWriter, data interface{}, status ...int) {
	statusCode := http.StatusOK
	if len(status) > 0 {
		statusCode = status[0]
	}
	Success(data).WriteJSON(w, statusCode)
}

func WriteSuccessWithMeta(w http.ResponseWriter, data interface{}, meta *Meta, status ...int) {
	statusCode := http.StatusOK
	if len(status) > 0 {
		statusCode = status[0]
	}
	SuccessWithMeta(data, meta).WriteJSON(w, statusCode)
}

func WriteError(w http.ResponseWriter, code, message string, status int, details ...interface{}) {
	var detailsInterface interface{}
	if len(details) > 0 {
		detailsInterface = details[0]
	}
	Error(code, message, detailsInterface).WriteJSON(w, status)
}
