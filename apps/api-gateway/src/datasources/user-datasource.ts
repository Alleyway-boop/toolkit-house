/**
 * User Data Source
 * Integrates with server-go REST API for users
 */

import DataLoader from 'dataloader'

export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface CreateUserInput {
  name: string
  email: string
}

/**
 * User Data Source
 * Caches and batches requests to server-go
 */
export class UserDataSource {
  private baseUrl: string
  private userLoader: DataLoader<string, User>

  constructor(baseUrl = process.env.SERVER_GO_URL || 'http://localhost:8080') {
    this.baseUrl = baseUrl

    // DataLoader for batching and caching user queries
    this.userLoader = new DataLoader(async (ids: ReadonlyArray<string>) => {
      const users = await Promise.all(
        ids.map((id) => this.fetchUser(id))
      )
      return users
    })
  }

  /**
   * Get a user by ID (cached)
   */
  async getUser(id: string): Promise<User | null> {
    return this.userLoader.load(id)
  }

  /**
   * Get all users with pagination
   */
  async getUsers(page = 1, limit = 10): Promise<{ data: User[]; total: number }> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/users?page=${page}&limit=${limit}`
    )

    if (!response.ok) {
      // Users endpoint might not exist yet, return mock data
      return { data: [], total: 0 }
    }

    return response.json()
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/users?email=${encodeURIComponent(email)}`
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data?.[0] || null
  }

  /**
   * Create a new user
   */
  async createUser(input: CreateUserInput): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Update a user
   */
  async updateUser(id: string, input: Partial<User>): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/v1/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/v1/users/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.statusText}`)
    }

    return response.ok
  }

  /**
   * Fetch a single user from server-go
   */
  private async fetchUser(id: string): Promise<User> {
    const response = await fetch(`${this.baseUrl}/api/v1/users/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        // Return a placeholder for not found users
        return null as unknown as User
      }
      throw new Error(`Failed to fetch user: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Batch load users by IDs (for DataLoader)
   */
  async batchLoadUsers(ids: readonly string[]): Promise<(User | Error)[]> {
    const results = await this.userLoader.loadMany(ids)
    // DataLoader.loadMany returns (User | Error)[]
    return results as (User | Error)[]
  }

  /**
   * Clear the DataLoader cache
   */
  clearCache(): void {
    this.userLoader.clearAll()
  }
}
