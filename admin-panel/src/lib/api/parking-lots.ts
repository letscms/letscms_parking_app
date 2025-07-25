import { apiClient } from './client'
import {
  ParkingLot,
  CreateParkingLotRequest,
  ParkingLotFilters,
  ApiResponse,
  PaginatedResponse,
  ParkingSpace,
  SpaceType,
  SpaceStatus,
} from '@/types/api'

export class ParkingLotService {
  private static readonly BASE_PATH = '/parking-lots'

  /**
   * Get paginated list of parking lots with filters
   */
  static async getParkingLots(filters: ParkingLotFilters = {}): Promise<PaginatedResponse<ParkingLot>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ParkingLot>>>(
      this.BASE_PATH,
      { params: filters }
    )
    return response.data.data
  }

  /**
   * Get parking lot by ID
   */
  static async getParkingLotById(id: string): Promise<ParkingLot> {
    const response = await apiClient.get<ApiResponse<ParkingLot>>(`${this.BASE_PATH}/${id}`)
    return response.data.data
  }

  /**
   * Create new parking lot
   */
  static async createParkingLot(data: CreateParkingLotRequest): Promise<ParkingLot> {
    const response = await apiClient.post<ApiResponse<ParkingLot>>(this.BASE_PATH, data)
    return response.data.data
  }

  /**
   * Update parking lot by ID
   */
  static async updateParkingLot(
    id: string,
    data: Partial<CreateParkingLotRequest>
  ): Promise<ParkingLot> {
    const response = await apiClient.patch<ApiResponse<ParkingLot>>(
      `${this.BASE_PATH}/${id}`,
      data
    )
    return response.data.data
  }

  /**
   * Delete parking lot by ID
   */
  static async deleteParkingLot(id: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${id}`)
  }

  /**
   * Get parking spaces for a specific lot
   */
  static async getParkingSpaces(
    lotId: string,
    filters: {
      type?: SpaceType
      status?: SpaceStatus
      floor?: number
      section?: string
    } = {}
  ): Promise<ParkingSpace[]> {
    const response = await apiClient.get<ApiResponse<ParkingSpace[]>>(
      `${this.BASE_PATH}/${lotId}/spaces`,
      { params: filters }
    )
    return response.data.data
  }

  /**
   * Create parking space in a lot
   */
  static async createParkingSpace(
    lotId: string,
    data: {
      spaceNumber: string
      type: SpaceType
      isHandicapped?: boolean
      floor?: number
      section?: string
    }
  ): Promise<ParkingSpace> {
    const response = await apiClient.post<ApiResponse<ParkingSpace>>(
      `${this.BASE_PATH}/${lotId}/spaces`,
      data
    )
    return response.data.data
  }

  /**
   * Update parking space
   */
  static async updateParkingSpace(
    lotId: string,
    spaceId: string,
    data: {
      spaceNumber?: string
      type?: SpaceType
      status?: SpaceStatus
      isHandicapped?: boolean
      floor?: number
      section?: string
    }
  ): Promise<ParkingSpace> {
    const response = await apiClient.patch<ApiResponse<ParkingSpace>>(
      `${this.BASE_PATH}/${lotId}/spaces/${spaceId}`,
      data
    )
    return response.data.data
  }

  /**
   * Delete parking space
   */
  static async deleteParkingSpace(lotId: string, spaceId: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${lotId}/spaces/${spaceId}`)
  }

  /**
   * Bulk create parking spaces
   */
  static async bulkCreateSpaces(
    lotId: string,
    data: {
      prefix: string
      startNumber: number
      endNumber: number
      type: SpaceType
      floor?: number
      section?: string
    }
  ): Promise<ParkingSpace[]> {
    const response = await apiClient.post<ApiResponse<ParkingSpace[]>>(
      `${this.BASE_PATH}/${lotId}/spaces/bulk`,
      data
    )
    return response.data.data
  }

  /**
   * Get parking lot statistics
   */
  static async getParkingLotStats(lotId: string): Promise<{
    totalSpaces: number
    availableSpaces: number
    occupiedSpaces: number
    reservedSpaces: number
    outOfOrderSpaces: number
    occupancyRate: number
    revenueToday: number
    revenueThisMonth: number
    averageDuration: number
    peakHours: Array<{ hour: number; occupancy: number }>
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/${lotId}/stats`
    )
    return response.data.data
  }

  /**
   * Get real-time occupancy data
   */
  static async getRealTimeOccupancy(lotId: string): Promise<{
    totalSpaces: number
    availableSpaces: number
    occupiedSpaces: number
    lastUpdated: string
    spacesByFloor: Array<{
      floor: number
      totalSpaces: number
      availableSpaces: number
    }>
  }> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/${lotId}/occupancy`
    )
    return response.data.data
  }

  /**
   * Update parking lot status
   */
  static async updateLotStatus(
    lotId: string,
    status: 'active' | 'inactive' | 'maintenance' | 'full'
  ): Promise<ParkingLot> {
    const response = await apiClient.patch<ApiResponse<ParkingLot>>(
      `${this.BASE_PATH}/${lotId}/status`,
      { status }
    )
    return response.data.data
  }

  /**
   * Get nearby parking lots
   */
  static async getNearbyLots(
    latitude: number,
    longitude: number,
    radius: number = 5
  ): Promise<Array<ParkingLot & { distance: number }>> {
    const response = await apiClient.get<ApiResponse<Array<ParkingLot & { distance: number }>>>(
      `${this.BASE_PATH}/nearby`,
      {
        params: {
          latitude,
          longitude,
          radius,
        },
      }
    )
    return response.data.data
  }

  /**
   * Upload parking lot images
   */
  static async uploadLotImages(lotId: string, files: File[]): Promise<string[]> {
    const formData = new FormData()
    files.forEach((file, index) => {
      formData.append(`images`, file)
    })

    const response = await apiClient.post<ApiResponse<string[]>>(
      `${this.BASE_PATH}/${lotId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  }

  /**
   * Delete parking lot image
   */
  static async deleteLotImage(lotId: string, imageUrl: string): Promise<void> {
    await apiClient.delete(`${this.BASE_PATH}/${lotId}/images`, {
      data: { imageUrl },
    })
  }

  /**
   * Get parking lot pricing history
   */
  static async getPricingHistory(
    lotId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Array<{
    date: string
    hourlyRate: number
    dailyRate: number
    dynamicPricing?: {
      peakMultiplier: number
      offPeakMultiplier: number
    }
  }>> {
    const response = await apiClient.get<ApiResponse<any>>(
      `${this.BASE_PATH}/${lotId}/pricing-history`,
      {
        params: {
          startDate,
          endDate,
        },
      }
    )
    return response.data.data
  }

  /**
   * Update parking lot pricing
   */
  static async updatePricing(
    lotId: string,
    data: {
      hourlyRate: number
      dailyRate: number
      dynamicPricing?: {
        enabled: boolean
        peakMultiplier: number
        offPeakMultiplier: number
        peakHours: Array<{ start: string; end: string }>
      }
    }
  ): Promise<ParkingLot> {
    const response = await apiClient.patch<ApiResponse<ParkingLot>>(
      `${this.BASE_PATH}/${lotId}/pricing`,
      data
    )
    return response.data.data
  }

  /**
   * Generate QR code for parking lot
   */
  static async generateQRCode(lotId: string): Promise<string> {
    const response = await apiClient.post<ApiResponse<{ qrCode: string }>>(
      `${this.BASE_PATH}/${lotId}/qr-code`
    )
    return response.data.data.qrCode
  }
}
