# Installation

Get started with Toolkit House by installing the required dependencies and setting up your development environment.

## Prerequisites

Before installing Toolkit House, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher ([installation guide](https://pnpm.io/installation))
- **Git**: For cloning the repository
- **Go**: 1.21+ (optional, for server-go)

### Check Your Versions

```bash
node --version   # Should be v18.0.0+
pnpm --version   # Should be v8.0.0+
git --version    # Should be 2.0+
go version       # Should be 1.21+ (optional)
```

## Installation Methods

### Clone the Repository

```bash
git clone https://github.com/your-org/toolkit-house.git
cd toolkit-house
```

### Install Dependencies

```bash
pnpm install
```

This will install all dependencies for the monorepo, including:
- Core utility packages
- UI component libraries
- Demo applications
- Development tools

## Verification

After installation, verify everything is working:

```bash
# Run type checking
pnpm run typecheck

# Run tests
pnpm run test

# Build all packages
pnpm run build
```

## Next Steps

- Read the [Quick Start](/guide/quick-start) guide
- Explore the [Package System](/guide/packages)
- Set up your [Development Environment](/development/setup)

## Troubleshooting

### pnpm Installation Issues

If you encounter issues with pnpm, try:

```bash
# Install pnpm using npm
npm install -g pnpm

# Or using curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Node.js Version Issues

If you have Node.js version conflicts, consider using [nvm](https://github.com/nvm-sh/nvm):

```bash
# Install Node.js 18
nvm install 18
nvm use 18
```

### Dependency Conflicts

If you encounter dependency conflicts:

```bash
# Clear pnpm cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules
pnpm install
```
