import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { ParkingLocation, ParkingSlot, SlotOccupancyLog } from '@parking/schemas';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ParkingLocation,
      ParkingSlot,
      SlotOccupancyLog,
    ]),
  ],
  controllers: [ParkingController],
  providers: [ParkingService],
  exports: [ParkingService],
})
export class ParkingModule {}
