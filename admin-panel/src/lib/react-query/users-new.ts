"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UserService } from '@/lib/api'
import { User, CreateUserRequest, UpdateUserRequest, UserFilters } from '@/types/api'
import { toast } from 'react-hot-toast'

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
}

// Hooks
export function useUsers(filters: UserFilters = {}) {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => UserService.getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => UserService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => UserService.createUser(userData),
    onSuccess: (newUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      
      // Add the new user to the cache
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser)
      
      toast.success('User created successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create user'
      toast.error(message)
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...userData }: UpdateUserRequest & { id: number }) => 
      UserService.updateUser(id, userData),
    onSuccess: (updatedUser, variables) => {
      // Update the user in cache
      queryClient.setQueryData(userKeys.detail(variables.id), updatedUser)
      
      // Invalidate user lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      
      toast.success('User updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update user'
      toast.error(message)
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => UserService.deleteUser(userId),
    onSuccess: (_, deletedUserId) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(deletedUserId) })
      
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      
      toast.success('User deleted successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete user'
      toast.error(message)
    },
  })
}
