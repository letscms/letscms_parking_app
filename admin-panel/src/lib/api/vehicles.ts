import { apiClient } from './client'
import { Vehicle, CreateVehicleRequest, UpdateVehicleRequest, VehicleFilters } from '@/types/api'

export const VehicleService = {
  // Get all vehicles with optional filters
  getVehicles: async (filters?: VehicleFilters): Promise<Vehicle[]> => {
    const params = new URLSearchParams()
    if (filters?.search) params.append('search', filters.search)
    if (filters?.type) params.append('type', filters.type)
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString())
    if (filters?.ownerId) params.append('ownerId', filters.ownerId.toString())

    const response = await apiClient.get(`/vehicles?${params.toString()}`)
    return response.data
  },

  // Get vehicle by ID
  getVehicle: async (id: number): Promise<Vehicle> => {
    const response = await apiClient.get(`/vehicles/${id}`)
    return response.data
  },

  // Create new vehicle
  createVehicle: async (data: CreateVehicleRequest): Promise<Vehicle> => {
    const response = await apiClient.post('/vehicles', data)
    return response.data
  },

  // Update vehicle
  updateVehicle: async (id: number, data: UpdateVehicleRequest): Promise<Vehicle> => {
    const response = await apiClient.put(`/vehicles/${id}`, data)
    return response.data
  },

  // Delete vehicle
  deleteVehicle: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehicles/${id}`)
  },

  // Get vehicles by owner
  getVehiclesByOwner: async (ownerId: number): Promise<Vehicle[]> => {
    const response = await apiClient.get(`/vehicles/owner/${ownerId}`)
    return response.data
  },

  // Verify vehicle license plate
  verifyLicensePlate: async (licensePlate: string): Promise<{ isAvailable: boolean }> => {
    const response = await apiClient.get(`/vehicles/verify-license/${licensePlate}`)
    return response.data
  },
}
