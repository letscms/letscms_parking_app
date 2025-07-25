import { apiClient } from './client'
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  User,
  ApiResponse,
} from '@/types/api'

export class AuthService {
  private static readonly BASE_PATH = '/auth'

  /**
   * Authenticate user with email and password
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      `${this.BASE_PATH}/login`,
      credentials
    )
    
    const { access_token, refresh_token, user } = response.data.data
    
    // Store tokens
    apiClient.setToken(access_token)
    apiClient.setRefreshToken(refresh_token)
    
    return response.data.data
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      `${this.BASE_PATH}/refresh`,
      { refresh_token: refreshToken }
    )
    
    const { access_token, refresh_token: newRefreshToken } = response.data.data
    
    // Update tokens
    apiClient.setToken(access_token)
    apiClient.setRefreshToken(newRefreshToken)
    
    return response.data.data
  }

  /**
   * Logout user and clear tokens
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.BASE_PATH}/logout`)
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.warn('Logout request failed:', error)
    } finally {
      apiClient.clearTokens()
    }
  }

  /**
   * Get current authenticated user profile
   */
  static async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>(`${this.BASE_PATH}/profile`)
    return response.data.data
  }

  /**
   * Update current user profile
   */
  static async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.patch<ApiResponse<User>>(
      `${this.BASE_PATH}/profile`,
      userData
    )
    return response.data.data
  }

  /**
   * Change password for current user
   */
  static async changePassword(data: {
    currentPassword: string
    newPassword: string
  }): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/change-password`, data)
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/forgot-password`, { email })
  }

  /**
   * Reset password with token
   */
  static async resetPassword(data: {
    token: string
    newPassword: string
  }): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/reset-password`, data)
  }

  /**
   * Enable two-factor authentication
   */
  static async enableTwoFactor(): Promise<{ qrCode: string; secret: string }> {
    const response = await apiClient.post<ApiResponse<{ qrCode: string; secret: string }>>(
      `${this.BASE_PATH}/2fa/enable`
    )
    return response.data.data
  }

  /**
   * Verify two-factor authentication setup
   */
  static async verifyTwoFactor(token: string): Promise<{ backupCodes: string[] }> {
    const response = await apiClient.post<ApiResponse<{ backupCodes: string[] }>>(
      `${this.BASE_PATH}/2fa/verify`,
      { token }
    )
    return response.data.data
  }

  /**
   * Disable two-factor authentication
   */
  static async disableTwoFactor(token: string): Promise<void> {
    await apiClient.post(`${this.BASE_PATH}/2fa/disable`, { token })
  }

  /**
   * Verify two-factor authentication token during login
   */
  static async verifyTwoFactorLogin(data: {
    email: string
    token: string
    rememberDevice?: boolean
  }): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      `${this.BASE_PATH}/2fa/login`,
      data
    )
    
    const { access_token, refresh_token } = response.data.data
    
    // Store tokens
    apiClient.setToken(access_token)
    apiClient.setRefreshToken(refresh_token)
    
    return response.data.data
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return apiClient.isAuthenticated()
  }

  /**
   * Get stored access token
   */
  static getToken(): string | null {
    return apiClient.getToken()
  }

  /**
   * Clear all authentication data
   */
  static clearAuth(): void {
    apiClient.clearTokens()
  }
}
