import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { toast } from 'react-hot-toast'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const AUTH_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: any) => void
    reject: (error?: any) => void
  }> = []

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Log request for debugging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
            data: config.data,
            params: config.params,
          })
        }

        return config
      },
      (error) => {
        console.error('Request interceptor error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response for debugging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          })
        }

        return response
      },
      async (error) => {
        const originalRequest = error.config

        // Log error for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
          })
        }

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return this.client(originalRequest)
            }).catch((err) => {
              return Promise.reject(err)
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshToken = this.getRefreshToken()
            if (!refreshToken) {
              throw new Error('No refresh token available')
            }

            const response = await this.refreshAccessToken(refreshToken)
            const { access_token } = response.data

            this.setToken(access_token)
            this.processQueue(null, access_token)

            originalRequest.headers.Authorization = `Bearer ${access_token}`
            return this.client(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError, null)
            this.clearTokens()
            this.redirectToLogin()
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        // Handle different error status codes
        this.handleErrorResponse(error)

        return Promise.reject(error)
      }
    )
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve(token)
      }
    })

    this.failedQueue = []
  }

  private handleErrorResponse(error: any) {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    switch (status) {
      case 400:
        toast.error(`Bad Request: ${message}`)
        break
      case 403:
        toast.error('Access forbidden. You don\'t have permission to perform this action.')
        break
      case 404:
        toast.error('Resource not found.')
        break
      case 409:
        toast.error(`Conflict: ${message}`)
        break
      case 422:
        toast.error(`Validation Error: ${message}`)
        break
      case 429:
        toast.error('Too many requests. Please try again later.')
        break
      case 500:
        toast.error('Internal server error. Please try again later.')
        break
      case 502:
        toast.error('Bad gateway. The server is temporarily unavailable.')
        break
      case 503:
        toast.error('Service unavailable. Please try again later.')
        break
      default:
        if (status && status >= 400) {
          toast.error(`Error ${status}: ${message}`)
        } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
          toast.error('Network error. Please check your internet connection.')
        } else {
          toast.error('An unexpected error occurred.')
        }
    }
  }

  private async refreshAccessToken(refreshToken: string) {
    return axios.post(`${API_BASE_URL}/auth/refresh`, {
      refresh_token: refreshToken,
    })
  }

  private redirectToLogin() {
    // Clear any pending toasts
    toast.dismiss()
    
    // Show logout message
    toast.error('Session expired. Please log in again.')
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  // Token management methods
  public setToken(token: string) {
    Cookies.set(AUTH_TOKEN_KEY, token, { 
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  }

  public getToken(): string | null {
    return Cookies.get(AUTH_TOKEN_KEY) || null
  }

  public setRefreshToken(refreshToken: string) {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { 
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  }

  public getRefreshToken(): string | null {
    return Cookies.get(REFRESH_TOKEN_KEY) || null
  }

  public clearTokens() {
    Cookies.remove(AUTH_TOKEN_KEY)
    Cookies.remove(REFRESH_TOKEN_KEY)
  }

  public isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // HTTP methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get(url, config)
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post(url, data, config)
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put(url, data, config)
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch(url, data, config)
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete(url, config)
  }

  // File upload method
  public async uploadFile<T>(
    url: string, 
    file: File, 
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<AxiosResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  }

  // Batch requests
  public async batch<T>(requests: Array<() => Promise<AxiosResponse<any>>>): Promise<AxiosResponse<T>[]> {
    return Promise.all(requests.map(request => request()))
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient()

// Export the class for testing or custom instances
export { ApiClient }
