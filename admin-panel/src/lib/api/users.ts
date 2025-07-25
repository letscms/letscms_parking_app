import { apiClient } from './client'
import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserFilters,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api'

export const UserService = {
  // Get all users with optional filters
  getUsers: async (filters?: UserFilters): Promise<User[]> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.role) params.append('role', filters.role)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())

    const response = await apiClient.get(`/users?${params.toString()}`)
    return response.data
  },

  // Get user by ID
  getUser: async (id: number): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`)
    return response.data
  },

  // Create new user
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post('/users', data)
    return response.data
  },

  // Update user
  updateUser: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put(`/users/${id}`, data)
    return response.data
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
  },

  // Bulk update users
  bulkUpdateUsers: async (userIds: number[], updates: Partial<UpdateUserRequest>): Promise<void> => {
    await apiClient.post('/users/bulk-update', { userIds, updates })
  },

  // Bulk delete users
  bulkDeleteUsers: async (userIds: number[]): Promise<void> => {
    await apiClient.post('/users/bulk-delete', { userIds })
  },

  // Get user statistics
  getUserStats: async (): Promise<{
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
    usersByRole: Record<string, number>
  }> => {
    const response = await apiClient.get('/users/stats')
    return response.data
  },

  // Export users
  exportUsers: async (filters?: UserFilters): Promise<Blob> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.role) params.append('role', filters.role)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())

    const response = await apiClient.get(`/users/export?${params.toString()}`, {
      responseType: 'blob',
    })
    return response.data as Blob
  },
}
