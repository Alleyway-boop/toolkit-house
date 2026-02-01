# Go Server

Go backend server for the Toolkit House monorepo.

## Overview

The Go server provides REST API endpoints and can be extended with:

- Gin framework for routing
- Middleware (CORS, Request ID, Logging, Recovery)
- Health check endpoints
- WebSocket support
- Database integration

## Current Status

Basic implementation (~128 lines) with standard HTTP server.

**Needs Enhancement:**
- Gin framework integration
- Middleware setup
- Proper project structure
- WebSocket support
- Database integration

## Installation

```bash
cd apps/server-go
go mod download
```

## Development

```bash
go run main.go
```

## Build

```bash
go build -o bin/server
./bin/server
```

## Module

**Module Path:** `github.com/seci/server-go`

**Go Version:** 1.21+

## Planned Structure

```
server-go/
├── main.go           # Entry point
├── handlers/         # HTTP handlers
├── middleware/       # Gin middleware
├── models/           # Data models
├── services/         # Business logic
├── database/         # Database setup
└── config/           # Configuration
```

## Technologies

- Go 1.21+
- Gin (planned)
- GORM (planned)

## License

MIT
