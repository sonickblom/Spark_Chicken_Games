FROM golang:1.22-alpine AS build

WORKDIR /src

COPY backend/go.mod backend/go.sum ./
RUN go mod download

COPY backend/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/api ./cmd/api
RUN CGO_ENABLED=0 GOOS=linux go build -o /out/migrate ./cmd/migrate

FROM alpine:3.20

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --from=build /out/api /usr/local/bin/spark-chicken-api
COPY --from=build /out/migrate /usr/local/bin/spark-chicken-migrate
COPY backend/config.example.yaml /app/config.yaml
COPY backend/migrations /app/migrations

USER app
EXPOSE 8080

CMD ["spark-chicken-api"]
