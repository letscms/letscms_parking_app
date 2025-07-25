"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AuthService } from '@/lib/api'
import { LoginRequest, User } from '@/types/api'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
}

// Hooks
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: AuthService.getProfile,
    enabled: AuthService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useLogin() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (data) => {
      toast.success('Login successful!')
      queryClient.setQueryData(authKeys.profile(), data.user)
      router.push('/dashboard')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Login failed. Please try again.'
      toast.error(message)
    },
  })
}

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      toast.success('Logged out successfully')
      queryClient.clear()
      router.push('/login')
    },
    onError: (error: any) => {
      console.error('Logout error:', error)
      // Even if logout fails on server, clear local data
      queryClient.clear()
      router.push('/login')
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: Partial<User>) => AuthService.updateProfile(userData),
    onSuccess: (updatedUser) => {
      toast.success('Profile updated successfully!')
      queryClient.setQueryData(authKeys.profile(), updatedUser)
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      AuthService.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to change password'
      toast.error(message)
    },
  })
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => AuthService.requestPasswordReset(email),
    onSuccess: () => {
      toast.success('Password reset email sent! Please check your inbox.')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to send reset email'
      toast.error(message)
    },
  })
}

export function useResetPassword() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      AuthService.resetPassword(data),
    onSuccess: () => {
      toast.success('Password reset successfully! Please log in with your new password.')
      router.push('/login')
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to reset password'
      toast.error(message)
    },
  })
}

export function useEnableTwoFactor() {
  return useMutation({
    mutationFn: AuthService.enableTwoFactor,
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to enable 2FA'
      toast.error(message)
    },
  })
}

export function useVerifyTwoFactor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => AuthService.verifyTwoFactor(token),
    onSuccess: () => {
      toast.success('Two-factor authentication enabled successfully!')
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to verify 2FA'
      toast.error(message)
    },
  })
}

export function useDisableTwoFactor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (token: string) => AuthService.disableTwoFactor(token),
    onSuccess: () => {
      toast.success('Two-factor authentication disabled successfully!')
      queryClient.invalidateQueries({ queryKey: authKeys.profile() })
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to disable 2FA'
      toast.error(message)
    },
  })
}
