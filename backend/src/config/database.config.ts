import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
// Import schemas from each module
import { AuthUser } from '@auth/schemas';
import { UserActivityLog } from '@users/schemas';
import { UserVehicle, VehicleUsageStats } from '@vehicles/schemas';
import { ParkingLocation, ParkingSlot, SlotOccupancyLog } from '@parking/schemas';
import { Booking, BookingExtension } from '@bookings/schemas';
import { Payment, WalletTransaction } from '@payments/schemas';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  // Module-based entities with schemas
  entities: [
    // Auth module schemas
    AuthUser,
    // Users module schemas  
    UserActivityLog,
    // Vehicles module schemas
    UserVehicle,
    VehicleUsageStats,
    // Parking module schemas
    ParkingLocation,
    ParkingSlot,
    SlotOccupancyLog,
    // Bookings module schemas
    Booking,
    BookingExtension,
    // Payments module schemas
    Payment,
    WalletTransaction,
  ],
  synchronize: configService.get<string>('NODE_ENV') === 'development',
  logging: configService.get<string>('NODE_ENV') === 'development',
  migrations: ['dist/migrations/*.js'],
  // Connection pooling for better performance
  extra: {
    max: 20, // Maximum number of connections in pool
    min: 5,  // Minimum number of connections in pool
    acquire: 60000, // Maximum time to get connection
    idle: 10000, // Maximum time connection can be idle
  },
  // Performance optimizations
  cache: {
    duration: 30000, // 30 seconds cache
  },
  // Enable detailed logging in development
  maxQueryExecutionTime: configService.get<string>('NODE_ENV') === 'development' ? 1000 : 5000,
});
