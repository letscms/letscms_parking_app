import { apiClient } from './client'
import {
  DashboardStats,
  RevenueData,
  OccupancyData,
  ApiResponse,
} from '@/types/api'

export class AnalyticsService {
  private static readonly BASE_PATH = '/analytics'

  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      `${this.BASE_PATH}/dashboard`
    )
    return response.data.data
  }

  /**
   * Get revenue data for charts
   */
  static async getRevenueData(
    startDate?: string,
    endDate?: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<RevenueData[]> {
    const response = await apiClient.get<ApiResponse<RevenueData[]>>(
      `${this.BASE_PATH}/revenue`,
      {
        params: { startDate, endDate, groupBy },
      }
    )
    return response.data.data
  }

  /**
   * Get occupancy data for all parking lots
   */
  static async getOccupancyData(): Promise<OccupancyData[]> {
    const response = await apiClient.get<ApiResponse<OccupancyData[]>>(
      `${this.BASE_PATH}/occupancy`
    )
    return response.data.data
  }

  /**
   * Get user growth analytics
   */
  static async getUserGrowthData(
    startDate?: string,
    endDate?: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<Array<{
    date: string
    newUsers: number
    totalUsers: number
    activeUsers: number
  }>> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/user-growth`,
      {
        params: { startDate, endDate, groupBy },
      }
    )
    return response.data.data
  }

  /**
   * Get reservation trends
   */
  static async getReservationTrends(
    startDate?: string,
    endDate?: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<Array<{
    date: string
    reservations: number
    confirmed: number
    cancelled: number
    noShow: number
    completed: number
  }>> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/reservation-trends`,
      {
        params: { startDate, endDate, groupBy },
      }
    )
    return response.data.data
  }

  /**
   * Get peak hours analysis
   */
  static async getPeakHoursAnalysis(
    startDate?: string,
    endDate?: string
  ): Promise<Array<{
    hour: number
    averageOccupancy: number
    averageReservations: number
    averageRevenue: number
  }>> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/peak-hours`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data.data
  }

  /**
   * Get parking lot performance metrics
   */
  static async getParkingLotPerformance(
    startDate?: string,
    endDate?: string
  ): Promise<Array<{
    parkingLotId: string
    parkingLotName: string
    totalReservations: number
    totalRevenue: number
    averageOccupancy: number
    averageReservationDuration: number
    cancellationRate: number
    noShowRate: number
    rating: number
  }>> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/parking-lot-performance`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data.data
  }

  /**
   * Get customer behavior analytics
   */
  static async getCustomerBehavior(
    startDate?: string,
    endDate?: string
  ): Promise<{
    averageReservationDuration: number
    averageAdvanceBooking: number
    repeatCustomerRate: number
    preferredParkingTypes: Record<string, number>
    peakUsageHours: Array<{ hour: number; percentage: number }>
    cancellationReasons: Record<string, number>
    paymentMethodDistribution: Record<string, number>
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/customer-behavior`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data.data
  }

  /**
   * Get financial summary
   */
  static async getFinancialSummary(
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalRevenue: number
    totalReservations: number
    averageReservationValue: number
    refundedAmount: number
    netRevenue: number
    revenueByPaymentMethod: Record<string, number>
    revenueByParkingLot: Array<{
      parkingLotId: string
      parkingLotName: string
      revenue: number
      percentage: number
    }>
    monthlyGrowth: number
    yearlyGrowth: number
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/financial-summary`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data.data
  }

  /**
   * Get operational metrics
   */
  static async getOperationalMetrics(
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalParkingSpaces: number
    averageOccupancyRate: number
    turnoverRate: number
    spaceUtilization: Record<string, number>
    maintenanceIncidents: number
    systemUptime: number
    averageResponseTime: number
    customerSatisfactionScore: number
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/operational-metrics`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data.data
  }

  /**
   * Get real-time analytics
   */
  static async getRealTimeAnalytics(): Promise<{
    currentActiveUsers: number
    currentReservations: number
    currentOccupancyRate: number
    todayRevenue: number
    todayReservations: number
    systemStatus: 'healthy' | 'warning' | 'critical'
    alerts: Array<{
      id: string
      type: 'warning' | 'error' | 'info'
      message: string
      timestamp: string
    }>
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/real-time`
    )
    return response.data.data
  }

  /**
   * Get geographic analytics
   */
  static async getGeographicAnalytics(
    startDate?: string,
    endDate?: string
  ): Promise<{
    reservationsByCity: Record<string, number>
    reservationsByState: Record<string, number>
    heatmapData: Array<{
      latitude: number
      longitude: number
      intensity: number
    }>
    popularRoutes: Array<{
      from: string
      to: string
      count: number
    }>
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/geographic`,
      {
        params: { startDate, endDate },
      }
    )
    return response.data.data
  }

  /**
   * Get predictive analytics
   */
  static async getPredictiveAnalytics(
    type: 'demand' | 'revenue' | 'occupancy',
    period: 'day' | 'week' | 'month' = 'week'
  ): Promise<Array<{
    date: string
    predicted: number
    confidence: number
    factors: string[]
  }>> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/predictive`,
      {
        params: { type, period },
      }
    )
    return response.data.data
  }

  /**
   * Generate custom report
   */
  static async generateCustomReport(
    config: {
      metrics: string[]
      startDate: string
      endDate: string
      groupBy: 'day' | 'week' | 'month'
      filters?: {
        parkingLotIds?: string[]
        userTypes?: string[]
        paymentMethods?: string[]
      }
      format: 'json' | 'csv' | 'pdf'
    }
  ): Promise<any> {
    const response = await apiClient.post<ApiResponse<any>>(
      `${this.BASE_PATH}/custom-report`,
      config
    )
    return response.data.data
  }

  /**
   * Export analytics data
   */
  static async exportAnalyticsData(
    type: 'revenue' | 'occupancy' | 'reservations' | 'users',
    startDate?: string,
    endDate?: string,
    format: 'csv' | 'xlsx' = 'csv'
  ): Promise<Blob> {
    const response = await apiClient.get(`${this.BASE_PATH}/export`, {
      params: { type, startDate, endDate, format },
      responseType: 'blob',
    })
    return response.data as Blob
  }
}
