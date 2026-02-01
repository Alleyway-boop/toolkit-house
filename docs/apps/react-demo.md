# React Demo

React 19 demo application demonstrating Toolkit House packages and components.

## Overview

The React demo showcases:
- Apollo Client for GraphQL API Gateway communication
- @toolkit-house/react-components UI components
- @toolkit-house/ts-utils utilities (RequestPool)
- JWT authentication
- Real-time subscriptions
- Form handling

## Features

### Health Check

Demonstrates basic GraphQL query:

```tsx
const { data, loading, error } = useQuery<{ health: string }>(GET_HEALTH)

return (
  <Card title="API Gateway Health">
    {loading && <ProgressBar value={50} />}
    {data && <div>✓ API is healthy: {data.health}</div>}
  </Card>
)
```

### Users List

Fetches and displays users from the API:

```tsx
const { data, loading } = useQuery<{ getUsers: User[] }>(GET_USERS)

return (
  <Card title="Users">
    {data?.getUsers.map(user => (
      <li key={user.id}>
        <strong>{user.name}</strong> ({user.email})
      </li>
    ))}
  </Card>
)
```

### Create Post Form

Demonstrates mutation with form:

```tsx
const [createPost, { data, loading }] = useMutation(CREATE_POST, {
  refetchQueries: [{ query: GET_POSTS, variables: { userId: '1' } }],
})

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  createPost({ variables: { input: { title, content, authorId: '1' } } })
}
```

### Posts Feed

Demonstrates data fetching and subscriptions:

```tsx
const { data } = useQuery<{ getPosts: Post[] }>(GET_POSTS)
const { data: subData } = useSubscription<{ postCreated: Post }>(
  POST_CREATED_SUBSCRIPTION
)
```

### Login Form

Demonstrates authentication:

```tsx
const [login, { data }] = useMutation(LOGIN)

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  login({ variables: { email, password } }).then((result) => {
    if (result.data?.login) {
      localStorage.setItem('accessToken', result.data.login.accessToken)
    }
  })
}
```

### RequestPool Demo

Demonstrates ts-utils RequestPool:

```tsx
const pool = new RequestPool(3) // Max 3 concurrent requests

const responses = await Promise.all(
  urls.map(url => pool.add(() => fetch(url)))
)
```

## Installation

```bash
cd apps/react-demo
pnpm install
```

## Development

```bash
pnpm run dev
```

Runs at `http://localhost:5173`

## Build

```bash
pnpm run build
pnpm run preview
```

## Environment Variables

```bash
# .env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
VITE_GRAPHQL_WS_URL=ws://localhost:4000/graphql
```

## Technologies

- React 19
- Vite
- Apollo Client
- Tailwind CSS
- @toolkit-house/react-components
- @toolkit-house/ts-utils

## Source Code

Located at: `/root/toolkit-house/apps/react-demo/src/`

**Key Files:**
- `App.tsx` - Main application component
- `apollo.ts` - Apollo Client setup and GraphQL queries
- `App.css` - Application styles

## License

MIT
