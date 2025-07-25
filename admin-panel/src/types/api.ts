// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RefreshTokenRequest {
  refresh_token: string
}

// User Types
export interface User {
  id: number
  email: string
  name: string
  phone?: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  OPERATOR = 'operator',
  USER = 'user'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended'
}

export interface CreateUserRequest {
  email: string
  name: string
  password: string
  role: 'user' | 'admin'
  phone?: string
}

export interface UpdateUserRequest {
  name?: string
  role?: 'user' | 'admin'
  isActive?: boolean
  phone?: string
}

// Parking Lot Types
export interface ParkingLot {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  totalSpaces: number
  availableSpaces: number
  hourlyRate: number
  dailyRate: number
  status: ParkingLotStatus
  features: string[]
  coordinates: {
    latitude: number
    longitude: number
  }
  operatingHours: {
    open: string
    close: string
  }
  createdAt: string
  updatedAt: string
}

export enum ParkingLotStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  FULL = 'full'
}

export interface CreateParkingLotRequest {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  totalSpaces: number
  hourlyRate: number
  dailyRate: number
  features?: string[]
  coordinates: {
    latitude: number
    longitude: number
  }
  operatingHours: {
    open: string
    close: string
  }
}

// Parking Space Types
export interface ParkingSpace {
  id: string
  parkingLotId: string
  spaceNumber: string
  type: SpaceType
  status: SpaceStatus
  isReserved: boolean
  isHandicapped: boolean
  floor?: number
  section?: string
  createdAt: string
  updatedAt: string
}

export enum SpaceType {
  REGULAR = 'regular',
  COMPACT = 'compact',
  HANDICAPPED = 'handicapped',
  ELECTRIC = 'electric',
  MOTORCYCLE = 'motorcycle'
}

export enum SpaceStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  RESERVED = 'reserved',
  OUT_OF_ORDER = 'out_of_order'
}

// Reservation Types
export interface Reservation {
  id: string
  userId: string
  parkingLotId: string
  parkingSpaceId: string
  startTime: string
  endTime: string
  status: ReservationStatus
  totalAmount: number
  paymentStatus: PaymentStatus
  vehicleInfo: {
    licensePlate: string
    make?: string
    model?: string
    color?: string
  }
  user: User
  parkingLot: ParkingLot
  parkingSpace: ParkingSpace
  createdAt: string
  updatedAt: string
}

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

// Payment Types
export interface Payment {
  id: string
  reservationId: string
  amount: number
  currency: string
  status: PaymentStatus
  paymentMethod: PaymentMethod
  transactionId?: string
  stripePaymentIntentId?: string
  createdAt: string
  updatedAt: string
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay'
}

// Analytics Types
export interface DashboardStats {
  totalUsers: number
  totalParkingLots: number
  totalReservations: number
  totalRevenue: number
  activeReservations: number
  availableSpaces: number
  occupancyRate: number
  revenueGrowth: number
  userGrowth: number
  reservationGrowth: number
}

export interface RevenueData {
  date: string
  revenue: number
  reservations: number
}

export interface OccupancyData {
  parkingLotId: string
  parkingLotName: string
  totalSpaces: number
  occupiedSpaces: number
  occupancyRate: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Filter Types
export interface UserFilters extends PaginationParams {
  role?: 'user' | 'admin'
  status?: string
  isActive?: boolean
}

export interface ReservationFilters extends PaginationParams {
  status?: ReservationStatus
  paymentStatus?: PaymentStatus
  parkingLotId?: string
  userId?: string
  startDate?: string
  endDate?: string
}

export interface ParkingLotFilters extends PaginationParams {
  status?: ParkingLotStatus
  city?: string
  state?: string
}

// Settings Types
export interface AppSettings {
  siteName: string
  supportEmail: string
  maxReservationDuration: number
  cancellationPolicy: number
  defaultHourlyRate: number
  defaultDailyRate: number
  currency: string
  timezone: string
  maintenanceMode: boolean
  features: {
    enableNotifications: boolean
    enablePayments: boolean
    enableReservations: boolean
    enableRealTimeUpdates: boolean
  }
}

// Notification Types
export interface Notification {
  id: string
  userId?: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  RESERVATION = 'reservation',
  PAYMENT = 'payment',
  SYSTEM = 'system'
}

// Vehicle Types
export interface Vehicle {
  id: number
  licensePlate: string
  make: string
  model: string
  year: number
  color: string
  vehicleType: VehicleType
  ownerId: number
  ownerName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export enum VehicleType {
  CAR = 'car',
  TRUCK = 'truck',
  MOTORCYCLE = 'motorcycle',
  VAN = 'van',
  SUV = 'suv'
}

export interface CreateVehicleRequest {
  licensePlate: string
  make: string
  model: string
  year: number
  color: string
  vehicleType: VehicleType
  ownerId: number
}

export interface UpdateVehicleRequest {
  licensePlate?: string
  make?: string
  model?: string
  year?: number
  color?: string
  vehicleType?: VehicleType
  isActive?: boolean
}

export interface VehicleFilters extends PaginationParams {
  type?: VehicleType
  isActive?: boolean
  ownerId?: number
}
