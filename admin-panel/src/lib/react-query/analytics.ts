"use client"

import { useQuery } from '@tanstack/react-query'
import { AnalyticsService } from '@/lib/api'

// Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  revenue: (startDate?: string, endDate?: string, groupBy?: string) => 
    [...analyticsKeys.all, 'revenue', startDate, endDate, groupBy] as const,
  occupancy: () => [...analyticsKeys.all, 'occupancy'] as const,
  userGrowth: (startDate?: string, endDate?: string, groupBy?: string) => 
    [...analyticsKeys.all, 'userGrowth', startDate, endDate, groupBy] as const,
  reservationTrends: (startDate?: string, endDate?: string, groupBy?: string) => 
    [...analyticsKeys.all, 'reservationTrends', startDate, endDate, groupBy] as const,
  peakHours: (startDate?: string, endDate?: string) => 
    [...analyticsKeys.all, 'peakHours', startDate, endDate] as const,
  parkingLotPerformance: (startDate?: string, endDate?: string) => 
    [...analyticsKeys.all, 'parkingLotPerformance', startDate, endDate] as const,
  customerBehavior: (startDate?: string, endDate?: string) => 
    [...analyticsKeys.all, 'customerBehavior', startDate, endDate] as const,
  financialSummary: (startDate?: string, endDate?: string) => 
    [...analyticsKeys.all, 'financialSummary', startDate, endDate] as const,
  operationalMetrics: (startDate?: string, endDate?: string) => 
    [...analyticsKeys.all, 'operationalMetrics', startDate, endDate] as const,
  realTime: () => [...analyticsKeys.all, 'realTime'] as const,
  geographic: (startDate?: string, endDate?: string) => 
    [...analyticsKeys.all, 'geographic', startDate, endDate] as const,
  predictive: (type: string, period?: string) => 
    [...analyticsKeys.all, 'predictive', type, period] as const,
}

// Hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: AnalyticsService.getDashboardStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  })
}

export function useRevenueData(
  startDate?: string,
  endDate?: string,
  groupBy: 'day' | 'week' | 'month' = 'day'
) {
  return useQuery({
    queryKey: analyticsKeys.revenue(startDate, endDate, groupBy),
    queryFn: () => AnalyticsService.getRevenueData(startDate, endDate, groupBy),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useOccupancyData() {
  return useQuery({
    queryKey: analyticsKeys.occupancy(),
    queryFn: AnalyticsService.getOccupancyData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 3 * 60 * 1000, // Refetch every 3 minutes
  })
}

export function useUserGrowthData(
  startDate?: string,
  endDate?: string,
  groupBy: 'day' | 'week' | 'month' = 'day'
) {
  return useQuery({
    queryKey: analyticsKeys.userGrowth(startDate, endDate, groupBy),
    queryFn: () => AnalyticsService.getUserGrowthData(startDate, endDate, groupBy),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useReservationTrends(
  startDate?: string,
  endDate?: string,
  groupBy: 'day' | 'week' | 'month' = 'day'
) {
  return useQuery({
    queryKey: analyticsKeys.reservationTrends(startDate, endDate, groupBy),
    queryFn: () => AnalyticsService.getReservationTrends(startDate, endDate, groupBy),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function usePeakHoursAnalysis(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: analyticsKeys.peakHours(startDate, endDate),
    queryFn: () => AnalyticsService.getPeakHoursAnalysis(startDate, endDate),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export function useParkingLotPerformance(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: analyticsKeys.parkingLotPerformance(startDate, endDate),
    queryFn: () => AnalyticsService.getParkingLotPerformance(startDate, endDate),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCustomerBehavior(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: analyticsKeys.customerBehavior(startDate, endDate),
    queryFn: () => AnalyticsService.getCustomerBehavior(startDate, endDate),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export function useFinancialSummary(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: analyticsKeys.financialSummary(startDate, endDate),
    queryFn: () => AnalyticsService.getFinancialSummary(startDate, endDate),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useOperationalMetrics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: analyticsKeys.operationalMetrics(startDate, endDate),
    queryFn: () => AnalyticsService.getOperationalMetrics(startDate, endDate),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useRealTimeAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.realTime(),
    queryFn: AnalyticsService.getRealTimeAnalytics,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export function useGeographicAnalytics(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: analyticsKeys.geographic(startDate, endDate),
    queryFn: () => AnalyticsService.getGeographicAnalytics(startDate, endDate),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export function usePredictiveAnalytics(
  type: 'demand' | 'revenue' | 'occupancy',
  period: 'day' | 'week' | 'month' = 'week'
) {
  return useQuery({
    queryKey: analyticsKeys.predictive(type, period),
    queryFn: () => AnalyticsService.getPredictiveAnalytics(type, period),
    staleTime: 60 * 60 * 1000, // 1 hour
  })
}
