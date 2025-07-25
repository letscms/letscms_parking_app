import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, BookingExtension } from '@bookings/schemas';
import { ParkingSlot } from '@parking/schemas';
import { UserVehicle } from '@vehicles/schemas';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingExtension, ParkingSlot, UserVehicle])
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
