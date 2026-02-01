/**
 * Post Data Source
 * Integrates with server-go REST API for posts
 */

import DataLoader from 'dataloader'

export interface Post {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
}

export interface CreatePostInput {
  title: string
  content: string
  authorId: string
}

/**
 * Post Data Source
 * Caches and batches requests to server-go
 */
export class PostDataSource {
  private baseUrl: string
  private postLoader: DataLoader<string, Post>

  constructor(baseUrl = process.env.SERVER_GO_URL || 'http://localhost:8080') {
    this.baseUrl = baseUrl

    // DataLoader for batching and caching post queries
    this.postLoader = new DataLoader(async (ids: ReadonlyArray<string>) => {
      const posts = await Promise.all(
        ids.map((id) => this.fetchPost(id))
      )
      return posts
    })
  }

  /**
   * Get a post by ID (cached)
   */
  async getPost(id: string): Promise<Post | null> {
    return this.postLoader.load(id)
  }

  /**
   * Get all posts with pagination
   */
  async getPosts(page = 1, limit = 10): Promise<{ data: Post[]; total: number }> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/posts?page=${page}&limit=${limit}`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get posts by user ID
   */
  async getPostsByUserId(authorId: string): Promise<Post[]> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/posts?authorId=${authorId}`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch user posts: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
  }

  /**
   * Create a new post
   */
  async createPost(input: CreatePostInput): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/api/v1/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Update a post
   */
  async updatePost(id: string, input: Partial<Post>): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/api/v1/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error(`Failed to update post: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/v1/posts/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.statusText}`)
    }

    return response.ok
  }

  /**
   * Fetch a single post from server-go
   */
  private async fetchPost(id: string): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/api/v1/posts/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        // Return a placeholder for not found posts
        return null as unknown as Post
      }
      throw new Error(`Failed to fetch post: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Batch load posts by IDs (for DataLoader)
   */
  async batchLoadPosts(ids: readonly string[]): Promise<(Post | Error)[]> {
    const results = await this.postLoader.loadMany(ids)
    // DataLoader.loadMany returns (Post | Error)[]
    return results as (Post | Error)[]
  }

  /**
   * Clear the DataLoader cache
   */
  clearCache(): void {
    this.postLoader.clearAll()
  }
}
