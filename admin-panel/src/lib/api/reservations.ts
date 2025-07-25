import { apiClient } from './client'
import {
  Reservation,
  ReservationFilters,
  ReservationStatus,
  PaymentStatus,
  ApiResponse,
  PaginatedResponse,
} from '@/types/api'

export class ReservationService {
  private static readonly BASE_PATH = '/reservations'

  /**
   * Get paginated list of reservations with filters
   */
  static async getReservations(filters: ReservationFilters = {}): Promise<PaginatedResponse<Reservation>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Reservation>>>(
      this.BASE_PATH,
      { params: filters }
    )
    return response.data.data
  }

  /**
   * Get reservation by ID
   */
  static async getReservationById(id: string): Promise<Reservation> {
    const response = await apiClient.get<ApiResponse<Reservation>>(`${this.BASE_PATH}/${id}`)
    return response.data.data
  }

  /**
   * Create new reservation (admin action)
   */
  static async createReservation(data: {
    userId: string
    parkingLotId: string
    parkingSpaceId?: string
    startTime: string
    endTime: string
    vehicleInfo: {
      licensePlate: string
      make?: string
      model?: string
      color?: string
    }
    notes?: string
  }): Promise<Reservation> {
    const response = await apiClient.post<ApiResponse<Reservation>>(this.BASE_PATH, data)
    return response.data.data
  }

  /**
   * Update reservation
   */
  static async updateReservation(
    id: string,
    data: {
      startTime?: string
      endTime?: string
      parkingSpaceId?: string
      vehicleInfo?: {
        licensePlate?: string
        make?: string
        model?: string
        color?: string
      }
      notes?: string
    }
  ): Promise<Reservation> {
    const response = await apiClient.patch<ApiResponse<Reservation>>(
      `${this.BASE_PATH}/${id}`,
      data
    )
    return response.data.data
  }

  /**
   * Cancel reservation
   */
  static async cancelReservation(
    id: string,
    data: {
      reason?: string
      refundAmount?: number
    }
  ): Promise<Reservation> {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      `${this.BASE_PATH}/${id}/cancel`,
      data
    )
    return response.data.data
  }

  /**
   * Confirm reservation
   */
  static async confirmReservation(id: string): Promise<Reservation> {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      `${this.BASE_PATH}/${id}/confirm`
    )
    return response.data.data
  }

  /**
   * Mark reservation as checked in
   */
  static async checkInReservation(
    id: string,
    data?: {
      actualArrivalTime?: string
      notes?: string
    }
  ): Promise<Reservation> {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      `${this.BASE_PATH}/${id}/check-in`,
      data
    )
    return response.data.data
  }

  /**
   * Mark reservation as checked out
   */
  static async checkOutReservation(
    id: string,
    data?: {
      actualDepartureTime?: string
      notes?: string
      additionalCharges?: number
    }
  ): Promise<Reservation> {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      `${this.BASE_PATH}/${id}/check-out`,
      data
    )
    return response.data.data
  }

  /**
   * Mark reservation as no-show
   */
  static async markNoShow(
    id: string,
    data?: {
      reason?: string
      refundAmount?: number
    }
  ): Promise<Reservation> {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      `${this.BASE_PATH}/${id}/no-show`,
      data
    )
    return response.data.data
  }

  /**
   * Extend reservation
   */
  static async extendReservation(
    id: string,
    data: {
      newEndTime: string
      additionalPayment?: number
    }
  ): Promise<Reservation> {
    const response = await apiClient.post<ApiResponse<Reservation>>(
      `${this.BASE_PATH}/${id}/extend`,
      data
    )
    return response.data.data
  }

  /**
   * Get reservation statistics
   */
  static async getReservationStats(
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalReservations: number
    confirmedReservations: number
    cancelledReservations: number
    noShowReservations: number
    completedReservations: number
    activeReservations: number
    totalRevenue: number
    averageReservationDuration: number
    cancellationRate: number
    noShowRate: number
    peakHours: Array<{ hour: number; count: number }>
    reservationsByStatus: Record<ReservationStatus, number>
  }> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.BASE_PATH}/stats`, {
      params: { startDate, endDate },
    })
    return response.data.data
  }

  /**
   * Get revenue analytics
   */
  static async getRevenueAnalytics(
    startDate?: string,
    endDate?: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ): Promise<Array<{
    date: string
    revenue: number
    reservations: number
    averageReservationValue: number
  }>> {
    const response = await apiClient.get<ApiResponse<any>>(`${this.BASE_PATH}/revenue`, {
      params: { startDate, endDate, groupBy },
    })
    return response.data.data
  }

  /**
   * Get upcoming reservations
   */
  static async getUpcomingReservations(
    hours: number = 24
  ): Promise<Reservation[]> {
    const response = await apiClient.get<ApiResponse<Reservation[]>>(
      `${this.BASE_PATH}/upcoming`,
      { params: { hours } }
    )
    return response.data.data
  }

  /**
   * Get overdue reservations (past end time but not checked out)
   */
  static async getOverdueReservations(): Promise<Reservation[]> {
    const response = await apiClient.get<ApiResponse<Reservation[]>>(
      `${this.BASE_PATH}/overdue`
    )
    return response.data.data
  }

  /**
   * Get reservations by parking lot
   */
  static async getReservationsByLot(
    lotId: string,
    date?: string
  ): Promise<Reservation[]> {
    const response = await apiClient.get<ApiResponse<Reservation[]>>(
      `${this.BASE_PATH}/by-lot/${lotId}`,
      { params: { date } }
    )
    return response.data.data
  }

  /**
   * Get reservations by user
   */
  static async getReservationsByUser(
    userId: string,
    filters: ReservationFilters = {}
  ): Promise<PaginatedResponse<Reservation>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Reservation>>>(
      `${this.BASE_PATH}/by-user/${userId}`,
      { params: filters }
    )
    return response.data.data
  }

  /**
   * Process refund for cancelled reservation
   */
  static async processRefund(
    reservationId: string,
    data: {
      amount: number
      reason?: string
      refundMethod?: string
    }
  ): Promise<{
    refundId: string
    amount: number
    status: string
    estimatedArrival: string
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      `${this.BASE_PATH}/${reservationId}/refund`,
      data
    )
    return response.data.data
  }

  /**
   * Send reminder notifications
   */
  static async sendReservationReminders(
    reservationIds: string[],
    type: 'check_in' | 'check_out' | 'expiring'
  ): Promise<{
    sent: number
    failed: number
    errors: string[]
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      `${this.BASE_PATH}/send-reminders`,
      { reservationIds, type }
    )
    return response.data.data
  }

  /**
   * Export reservations to CSV
   */
  static async exportReservations(filters: ReservationFilters = {}): Promise<Blob> {
    const response = await apiClient.get(`${this.BASE_PATH}/export`, {
      params: filters,
      responseType: 'blob',
    })
    return response.data as Blob
  }

  /**
   * Get reservation conflicts for a time slot
   */
  static async getReservationConflicts(
    parkingLotId: string,
    startTime: string,
    endTime: string,
    excludeReservationId?: string
  ): Promise<Reservation[]> {
    const response = await apiClient.get<ApiResponse<Reservation[]>>(
      `${this.BASE_PATH}/conflicts`,
      {
        params: {
          parkingLotId,
          startTime,
          endTime,
          excludeReservationId,
        },
      }
    )
    return response.data.data
  }

  /**
   * Bulk update reservations
   */
  static async bulkUpdateReservations(
    reservationIds: string[],
    updates: {
      status?: ReservationStatus
      notes?: string
    }
  ): Promise<{
    updated: number
    failed: number
    errors: string[]
  }> {
    const response = await apiClient.post<ApiResponse<any>>(
      `${this.BASE_PATH}/bulk-update`,
      { reservationIds, updates }
    )
    return response.data.data
  }
}
