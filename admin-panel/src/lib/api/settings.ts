import { apiClient } from './client'
import {
  AppSettings,
  Notification,
  NotificationType,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api'

export class SettingsService {
  private static readonly BASE_PATH = '/settings'

  /**
   * Get application settings
   */
  static async getSettings(): Promise<AppSettings> {
    const response = await apiClient.get<ApiResponse<AppSettings>>(this.BASE_PATH)
    return response.data.data
  }

  /**
   * Update application settings
   */
  static async updateSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const response = await apiClient.patch<ApiResponse<AppSettings>>(
      this.BASE_PATH,
      settings
    )
    return response.data.data
  }

  /**
   * Get email templates
   */
  static async getEmailTemplates(): Promise<Array<{
    id: string
    name: string
    subject: string
    content: string
    type: string
    isActive: boolean
    variables: string[]
  }>> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.BASE_PATH}/email-templates`)
    return response.data.data
  }

  /**
   * Update email template
   */
  static async updateEmailTemplate(
    templateId: string,
    data: {
      subject?: string
      content?: string
      isActive?: boolean
    }
  ): Promise<any> {
    const response = await apiClient.patch<ApiResponse<any>>(
      `${this.BASE_PATH}/email-templates/${templateId}`,
      data
    )
    return response.data.data
  }

  /**
   * Get system configuration
   */
  static async getSystemConfig(): Promise<{
    database: {
      connectionStatus: string
      version: string
      size: string
    }
    redis: {
      connectionStatus: string
      memory: string
      version: string
    }
    storage: {
      provider: string
      totalSpace: string
      usedSpace: string
      availableSpace: string
    }
    payment: {
      stripeConnected: boolean
      paypalConnected: boolean
      webhooksConfigured: boolean
    }
    notifications: {
      emailProvider: string
      smsProvider: string
      pushEnabled: boolean
    }
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.BASE_PATH}/system`)
    return response.data.data
  }

  /**
   * Update system configuration
   */
  static async updateSystemConfig(config: {
    payment?: {
      stripePublicKey?: string
      stripeSecretKey?: string
      paypalClientId?: string
      paypalClientSecret?: string
    }
    notifications?: {
      emailProvider?: string
      emailApiKey?: string
      smsProvider?: string
      smsApiKey?: string
      pushEnabled?: boolean
    }
    storage?: {
      provider?: string
      s3AccessKey?: string
      s3SecretKey?: string
      s3Bucket?: string
      s3Region?: string
    }
  }): Promise<any> {
    const response = await apiClient.patch<ApiResponse<any>>(
      `${this.BASE_PATH}/system`,
      config
    )
    return response.data.data
  }

  /**
   * Test email configuration
   */
  static async testEmailConfig(email: string): Promise<{
    success: boolean
    message: string
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      `${this.BASE_PATH}/test-email`,
      { email }
    )
    return response.data.data
  }

  /**
   * Test SMS configuration
   */
  static async testSMSConfig(phoneNumber: string): Promise<{
    success: boolean
    message: string
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      `${this.BASE_PATH}/test-sms`,
      { phoneNumber }
    )
    return response.data.data
  }

  /**
   * Get API rate limits
   */
  static async getRateLimits(): Promise<{
    globalLimit: number
    userLimit: number
    ipLimit: number
    currentUsage: {
      global: number
      user: number
      ip: number
    }
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.BASE_PATH}/rate-limits`)
    return response.data.data
  }

  /**
   * Update API rate limits
   */
  static async updateRateLimits(limits: {
    globalLimit?: number
    userLimit?: number
    ipLimit?: number
  }): Promise<any> {
    const response = await apiClient.patch<ApiResponse<any>>(
      `${this.BASE_PATH}/rate-limits`,
      limits
    )
    return response.data.data
  }

  /**
   * Get security settings
   */
  static async getSecuritySettings(): Promise<{
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSymbols: boolean
      maxAge: number
    }
    sessionSettings: {
      timeout: number
      concurrentSessions: number
      rememberMeDuration: number
    }
    twoFactorAuth: {
      enabled: boolean
      required: boolean
      backupCodes: boolean
    }
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.BASE_PATH}/security`)
    return response.data.data
  }

  /**
   * Update security settings
   */
  static async updateSecuritySettings(settings: any): Promise<any> {
    const response = await apiClient.patch<ApiResponse<any>>(
      `${this.BASE_PATH}/security`,
      settings
    )
    return response.data.data
  }

  /**
   * Get backup settings
   */
  static async getBackupSettings(): Promise<{
    automaticBackup: boolean
    backupFrequency: string
    backupRetention: number
    lastBackup: string
    nextBackup: string
    backupLocation: string
    backupSize: string
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.BASE_PATH}/backup`)
    return response.data.data
  }

  /**
   * Update backup settings
   */
  static async updateBackupSettings(settings: {
    automaticBackup?: boolean
    backupFrequency?: string
    backupRetention?: number
    backupLocation?: string
  }): Promise<any> {
    const response = await apiClient.patch<ApiResponse<any>>(
      `${this.BASE_PATH}/backup`,
      settings
    )
    return response.data.data
  }

  /**
   * Trigger manual backup
   */
  static async triggerBackup(): Promise<{
    backupId: string
    status: string
    estimatedCompletion: string
  }> {
    const response = await apiClient.post<ApiResponse<any>>(`${this.BASE_PATH}/backup/trigger`)
    return response.data.data
  }

  /**
   * Get backup history
   */
  static async getBackupHistory(
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<{
    id: string
    timestamp: string
    size: string
    status: string
    type: string
    location: string
  }>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<any>>>(
      `${this.BASE_PATH}/backup/history`,
      { params: { page, limit } }
    )
    return response.data.data
  }
}

export class NotificationService {
  private static readonly BASE_PATH = '/notifications'

  /**
   * Get notifications for current user
   */
  static async getNotifications(
    page = 1,
    limit = 20,
    unreadOnly = false
  ): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Notification>>>(
      this.BASE_PATH,
      { params: { page, limit, unreadOnly } }
    )
    return response.data.data
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`${this.BASE_PATH}/${notificationId}/read`)
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(): Promise<void> {
    await apiClient.patch(`${this.BASE_PATH}/mark-all-read`)
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${notificationId}`)
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(
      `${this.BASE_PATH}/unread-count`
    )
    return response.data.data.count
  }

  /**
   * Send notification to user(s)
   */
  static async sendNotification(data: {
    userIds?: string[]
    title: string
    message: string
    type: NotificationType
    actionUrl?: string
    sendEmail?: boolean
    sendPush?: boolean
  }): Promise<{
    sent: number
    failed: number
    errors: string[]
  }> {
    const response = await apiClient.post<ApiResponse<any>>(`${this.BASE_PATH}/send`, data)
    return response.data.data
  }

  /**
   * Send broadcast notification
   */
  static async sendBroadcast(data: {
    title: string
    message: string
    type: NotificationType
    actionUrl?: string
    sendEmail?: boolean
    sendPush?: boolean
    targetRoles?: string[]
  }): Promise<{
    sent: number
    failed: number
    errors: string[]
  }> {
    const response = await apiClient.post<ApiResponse<any>>(`${this.BASE_PATH}/broadcast`, data)
    return response.data.data
  }

  /**
   * Get notification templates
   */
  static async getTemplates(): Promise<Array<{
    id: string
    name: string
    title: string
    message: string
    type: NotificationType
    variables: string[]
  }>> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.BASE_PATH}/templates`)
    return response.data.data
  }

  /**
   * Create notification template
   */
  static async createTemplate(data: {
    name: string
    title: string
    message: string
    type: NotificationType
    variables?: string[]
  }): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      `${this.BASE_PATH}/templates`,
      data
    )
    return response.data.data
  }

  /**
   * Update notification template
   */
  static async updateTemplate(
    templateId: string,
    data: {
      name?: string
      title?: string
      message?: string
      type?: NotificationType
      variables?: string[]
    }
  ): Promise<any> {
    const response = await apiClient.patch<ApiResponse<any>>(
      `${this.BASE_PATH}/templates/${templateId}`,
      data
    )
    return response.data.data
  }

  /**
   * Delete notification template
   */
  static async deleteTemplate(templateId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/templates/${templateId}`)
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats(
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalSent: number
    totalRead: number
    readRate: number
    notificationsByType: Record<NotificationType, number>
    engagementByDay: Array<{
      date: string
      sent: number
      read: number
      clicked: number
    }>
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.BASE_PATH}/stats`, {
      params: { startDate, endDate },
    })
    return response.data.data
  }
}
