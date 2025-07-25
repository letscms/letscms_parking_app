"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { VehicleService } from '@/lib/api'
import { Vehicle, CreateVehicleRequest, UpdateVehicleRequest, VehicleFilters } from '@/types/api'
import { toast } from 'react-hot-toast'

// Query Keys
export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: VehicleFilters) => [...vehicleKeys.lists(), filters] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: number) => [...vehicleKeys.details(), id] as const,
  byOwner: (ownerId: number) => [...vehicleKeys.all, 'owner', ownerId] as const,
}

// Hooks
export function useVehicles(filters?: VehicleFilters) {
  return useQuery({
    queryKey: vehicleKeys.list(filters || {}),
    queryFn: () => VehicleService.getVehicles(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useVehicle(id: number) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => VehicleService.getVehicle(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export function useVehiclesByOwner(ownerId: number) {
  return useQuery({
    queryKey: vehicleKeys.byOwner(ownerId),
    queryFn: () => VehicleService.getVehiclesByOwner(ownerId),
    enabled: !!ownerId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateVehicleRequest) => VehicleService.createVehicle(data),
    onSuccess: (newVehicle) => {
      // Invalidate and refetch vehicles lists
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
      
      // Add the new vehicle to existing queries
      queryClient.setQueryData(vehicleKeys.detail(newVehicle.id), newVehicle)
      
      toast.success('Vehicle registered successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to register vehicle'
      toast.error(message)
    },
  })
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: UpdateVehicleRequest & { id: number }) => 
      VehicleService.updateVehicle(id, data),
    onSuccess: (updatedVehicle, variables) => {
      // Update specific vehicle
      queryClient.setQueryData(vehicleKeys.detail(variables.id), updatedVehicle)
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
      
      toast.success('Vehicle updated successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update vehicle'
      toast.error(message)
    },
  })
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => VehicleService.deleteVehicle(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: vehicleKeys.detail(deletedId) })
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() })
      
      toast.success('Vehicle deleted successfully!')
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete vehicle'
      toast.error(message)
    },
  })
}

export function useVerifyLicensePlate() {
  return useMutation({
    mutationFn: (licensePlate: string) => VehicleService.verifyLicensePlate(licensePlate),
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to verify license plate'
      toast.error(message)
    },
  })
}
