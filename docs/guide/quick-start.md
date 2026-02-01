# Quick Start

Get up and running with Toolkit House in 5 minutes.

## Step 1: Install and Run

```bash
# Clone and install
git clone https://github.com/your-org/toolkit-house.git
cd toolkit-house
pnpm install

# Start your preferred framework
cd apps/react-demo    # or vue-demo, svelte-demo, solidjs-demo
pnpm run dev
```

Your app is now running at `http://localhost:5173`!

## Step 2: Explore the Code

### Project Structure

Each demo app follows a standard structure:

```
apps/react-demo/
├── src/
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── vite-env.d.ts    # Vite types
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
└── vite.config.ts       # Vite config
```

### Using Shared Packages

Import utilities from shared packages:

```typescript
// Use ts-utils utilities
import { RequestPool } from '@toolkit-house/ts-utils'

// Use validation
import { Schema } from '@toolkit-house/validation'

// Use UI components
import { Button } from '@toolkit-house/react-components'
```

## Step 3: Build Something

### Example: Fetch Data with Request Pool

```typescript
import { RequestPool } from '@toolkit-house/ts-utils'

// Create a pool with max 3 concurrent requests
const pool = new RequestPool(3)

async function fetchUserData() {
  const userId = '123'

  const response = await pool.add(() =>
    fetch(`/api/users/${userId}`)
  )

  return response.json()
}
```

### Example: Validate User Input

```typescript
import { Schema, string, number } from '@toolkit-house/validation'

const userSchema = new Schema({
  name: string().required().minLength(2),
  email: string().required().email(),
  age: number().required().min(18).max(120),
})

const result = userSchema.validate({
  name: 'John',
  email: 'john@example.com',
  age: 25,
})

if (result.valid) {
  console.log('Valid user:', result.data)
} else {
  console.error('Validation errors:', result.errors)
}
```

### Example: Use UI Components

```tsx
import { Button, Input } from '@toolkit-house/react-components'
import { useState } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <Button type="submit">Submit</Button>
    </form>
  )
}
```

## Step 4: Build for Production

```bash
# Build your app
pnpm run build

# Preview production build
pnpm run preview
```

## Common Tasks

### Add a New Component

```bash
# Create component file
touch src/components/MyComponent.tsx

# Import and use
import { MyComponent } from './components/MyComponent'
```

### Add a New Page

```bash
# Create page component
touch src/pages/AboutPage.tsx

# Set up routing (if using React Router)
# Add route configuration
```

### Use Environment Variables

```bash
# Create .env file
echo "VITE_API_URL=http://localhost:4000" > .env

# Use in code
const apiUrl = import.meta.env.VITE_API_URL
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use a different port
pnpm run dev -- --port 3000
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Type Errors

```bash
# Regenerate TypeScript types
pnpm run typecheck
```

## Next Steps

- [Package Documentation](/packages/) - Explore all available packages
- [API Reference](/api/) - Detailed API documentation
- [Development Guide](/development/) - Advanced development topics

## Need Help?

- Check the [troubleshooting guide](/development/troubleshooting)
- Open an issue on [GitHub](https://github.com/your-org/toolkit-house/issues)
- Join our [community discussions](https://github.com/your-org/toolkit-house/discussions)
