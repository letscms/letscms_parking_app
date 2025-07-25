// Module registry for managing all schemas and their relationships
export const MODULE_SCHEMAS = {
  auth: {
    entities: ['AuthUser'],
    schema: 'auth',
    path: '@auth/schemas',
  },
  users: {
    entities: ['UserActivityLog'],
    schema: 'users', 
    path: '@users/schemas',
  },
  vehicles: {
    entities: ['UserVehicle', 'VehicleUsageStats'],
    schema: 'vehicles',
    path: '@vehicles/schemas',
  },
  parking: {
    entities: ['ParkingLocation', 'ParkingSlot', 'SlotOccupancyLog'],
    schema: 'parking',
    path: '@parking/schemas',
  },
  bookings: {
    entities: ['Booking', 'BookingExtension'],
    schema: 'bookings',
    path: '@bookings/schemas',
  },
  payments: {
    entities: ['Payment', 'WalletTransaction'],
    schema: 'payments',
    path: '@payments/schemas',
  },
};

// Schema relationships mapping
export const SCHEMA_RELATIONSHIPS = {
  'users': {
    oneToMany: [
      'user_activity_logs',
      'user_vehicles',
      'bookings',
      'parking_locations', // For vendors
    ],
  },
  'user_vehicles': {
    manyToOne: ['users'],
    oneToMany: ['bookings'],
  },
  'parking_locations': {
    manyToOne: ['users'], // vendor relationship
    oneToMany: ['parking_slots'],
  },
  'parking_slots': {
    manyToOne: ['parking_locations'],
    oneToMany: ['bookings'],
  },
  'bookings': {
    manyToOne: ['users', 'parking_slots', 'user_vehicles'],
    oneToMany: ['payments'],
  },
  'payments': {
    manyToOne: ['bookings'],
  },
};
